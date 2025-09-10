import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const { actionName, location, imageUrl } = await req.json();

    if (!userId || !actionName) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure app user exists keyed by stable identity
    const clerk = await currentUser();
    const identityKey =
      clerk?.primaryEmailAddress?.emailAddress ||
      clerk?.phoneNumbers?.[0]?.phoneNumber ||
      userId;
    const appUser = await prisma.user.upsert({
      where: { phone_number: identityKey },
      update: {},
      create: {
        phone_number: identityKey,
        name: clerk?.fullName || clerk?.username || undefined,
        language_preference: "English",
        totalPunyaPoints: 0,
      },
    });

    const action = await prisma.action.findUnique({
      where: { action_name: actionName },
    });

    if (!action) {
      return NextResponse.json({ error: "Action not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: appUser.id },
      data: {
        totalPunyaPoints: {
          increment: action.point_value,
        },
      },
    });

    await prisma.userAction.create({
      data: {
        userId: appUser.id,
        actionId: action.id,
        location_geopoint: location
          ? JSON.parse(JSON.stringify(location))
          : undefined,
        image_url: imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      newTotalPoints: updatedUser.totalPunyaPoints,
      pointsAwarded: action.point_value,
      actionName: action.action_name,
    });
  } catch (error) {
    console.error("Error updating points:", error);
    return NextResponse.json(
      { error: "Failed to update points" },
      { status: 500 }
    );
  }
}
