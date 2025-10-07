import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { JsonValue } from "@prisma/client/runtime/library";

// Live Darshan specific actions and their point values
const DARSHAN_ACTIONS = {
  watching: { points: 2, description: "Watching Live Darshan" },
  prayer: { points: 5, description: "Virtual Prayer" },
  offering: { points: 10, description: "Virtual Offering" },
  bell: { points: 15, description: "Temple Bell Ring" },
  share: { points: 20, description: "Share Darshan" },
  community_aarti: { points: 50, description: "Community Aarti" },
  temple_visit: { points: 25, description: "Virtual Temple Visit" },
  spiritual_meditation: { points: 30, description: "Spiritual Meditation" },
} as const;

type DarshanAction = keyof typeof DARSHAN_ACTIONS;

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, temple, duration, metadata } = body;

    // Validate action
    if (!action || !(action in DARSHAN_ACTIONS)) {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }

    const actionConfig = DARSHAN_ACTIONS[action as DarshanAction];
    let pointsToAward = actionConfig.points;

    // Special handling for watching duration
    if (action === "watching" && duration) {
      const minutesWatched = Math.floor(duration / 60);
      pointsToAward = minutesWatched * actionConfig.points;
    }

    // Get user
    const clerk = await currentUser();
    const identityKey =
      clerk?.primaryEmailAddress?.emailAddress ||
      clerk?.phoneNumbers?.[0]?.phoneNumber ||
      userId;

    let user;
    try {
      user = await prisma.user.upsert({
        where: { phone_number: identityKey },
        update: {},
        create: {
          phone_number: identityKey,
          name: clerk?.fullName || clerk?.username || undefined,
          language_preference: "English",
          totalPunyaPoints: 0,
        },
      });
    } catch (error) {
      console.error("Error upserting user:", error);
      return NextResponse.json(
        { success: false, error: "Database error" },
        { status: 500 }
      );
    }

    // Create or find the Live Darshan action
    const darshanAction = await prisma.action.upsert({
      where: { action_name: `live_darshan_${action}` },
      update: {},
      create: {
        action_name: `live_darshan_${action}`,
        point_value: pointsToAward,
      },
    });

    // Record the user action
    const userAction = await prisma.userAction.create({
      data: {
        userId: user.id,
        actionId: darshanAction.id,
        timestamp: new Date(),
        location_geopoint: {
          temple: temple || null,
          duration: duration || null,
          ...metadata,
        },
      },
    });

    // Update user's total points
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        totalPunyaPoints: {
          increment: pointsToAward,
        },
      },
    });

    // Get user's current rank
    const rankTitle = getRankTitle(updatedUser.totalPunyaPoints);

    return NextResponse.json({
      success: true,
      points: pointsToAward,
      totalPoints: updatedUser.totalPunyaPoints,
      rankTitle,
      action: actionConfig.description,
      userAction: {
        id: userAction.id,
        timestamp: userAction.timestamp,
        points: pointsToAward,
      },
    });
  } catch (error) {
    console.error("Error in live darshan points API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get Live Darshan statistics
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const clerk = await currentUser();
    const identityKey =
      clerk?.primaryEmailAddress?.emailAddress ||
      clerk?.phoneNumbers?.[0]?.phoneNumber ||
      userId;

    const user = await prisma.user.findUnique({
      where: { phone_number: identityKey },
      include: {
        userActions: {
          where: {
            action: {
              action_name: {
                startsWith: "live_darshan_",
              },
            },
          },
          include: {
            action: true,
          },
          orderBy: {
            timestamp: "desc",
          },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate Live Darshan specific stats
    const darshanActions = user.userActions;
    const totalDarshanPoints = darshanActions.reduce(
      (sum, action) => sum + action.action.point_value,
      0
    );

    const actionBreakdown = darshanActions.reduce((acc, action) => {
      const actionName = action.action.action_name.replace("live_darshan_", "");
      acc[actionName] = (acc[actionName] || 0) + action.action.point_value;
      return acc;
    }, {} as Record<string, number>);

    const totalWatchTime = darshanActions
      .filter((action) => action.action.action_name === "live_darshan_watching")
      .reduce((sum, action) => {
        const duration = (action.location_geopoint as any)?.duration || 0;
        return sum + duration;
      }, 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalDarshanPoints,
        totalWatchTime,
        totalDarshanActions: darshanActions.length,
        actionBreakdown,
        rankTitle: getRankTitle(user.totalPunyaPoints),
        recentActions: darshanActions.map((action) => ({
          action: action.action.action_name.replace("live_darshan_", ""),
          points: action.action.point_value,
          timestamp: action.timestamp,
          temple: (action.location_geopoint as any)?.temple || null,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching live darshan stats:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getRankTitle(points: number): string {
  if (points >= 1000) return "Spiritual Master";
  if (points >= 500) return "Dharma Steward";
  if (points >= 100) return "Seva Seeker";
  return "Seva Starter";
}
