import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    // For now, allow unauthenticated access for testing
    // const { userId } = await auth();
    const { achievementType, platform, templateUsed, contentPreview } =
      await req.json();

    if (!achievementType || !platform) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For testing, use demo user
    const appUser = await prisma.user.upsert({
      where: { phone_number: "demo@yaat.com" },
      update: {},
      create: {
        phone_number: "demo@yaat.com",
        name: "Demo User",
        language_preference: "English",
        totalPunyaPoints: 0,
      },
    });

    // Award points for social sharing
    const SOCIAL_SHARE_POINTS = 10;
    const updatedUser = await prisma.user.update({
      where: { id: appUser.id },
      data: {
        totalPunyaPoints: {
          increment: SOCIAL_SHARE_POINTS,
        },
      },
    });

    // Record the social share
    const socialShare = await prisma.socialShare.create({
      data: {
        userId: appUser.id,
        achievement_type: achievementType,
        platform: platform,
        points_awarded: SOCIAL_SHARE_POINTS,
        template_used: templateUsed,
        content_preview: contentPreview,
      },
    });

    return NextResponse.json({
      success: true,
      newTotalPoints: updatedUser.totalPunyaPoints,
      pointsAwarded: SOCIAL_SHARE_POINTS,
      shareId: socialShare.id,
    });
  } catch (error) {
    console.error("Error recording social share:", error);
    return NextResponse.json(
      { error: "Failed to record social share" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // For now, allow unauthenticated access for testing
    // const { userId } = await auth();
    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // For testing, use demo user
    const user = await prisma.user.findFirst({
      where: { phone_number: "demo@yaat.com" },
      include: {
        socialShares: {
          orderBy: { shared_at: "desc" },
          take: 50, // Last 50 shares
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      shares: user.socialShares,
      totalShares: user.socialShares.length,
    });
  } catch (error) {
    console.error("Error fetching social shares:", error);
    return NextResponse.json(
      { error: "Failed to fetch social shares" },
      { status: 500 }
    );
  }
}
