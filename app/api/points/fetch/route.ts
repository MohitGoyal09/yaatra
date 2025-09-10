import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Ensure app user exists keyed by stable identity (email/phone)
    const clerk = await currentUser();
    const identityKey =
      clerk?.primaryEmailAddress?.emailAddress ||
      clerk?.phoneNumbers?.[0]?.phoneNumber ||
      userId;
    await prisma.user.upsert({
      where: { phone_number: identityKey },
      update: {},
      create: {
        phone_number: identityKey,
        name: clerk?.fullName || clerk?.username || undefined,
        language_preference: "English",
        totalPunyaPoints: 0,
      },
    });

    const user = await prisma.user.findFirst({
      where: { phone_number: identityKey },
      select: { totalPunyaPoints: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      totalPoints: user.totalPunyaPoints,
      userName: user.name || "Tourist",
    });
  } catch (error) {
    console.error("Error fetching points:", error);
    return NextResponse.json(
      { error: "Failed to fetch points" },
      { status: 500 }
    );
  }
}
