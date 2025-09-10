import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ensure app user
    const clerk = await currentUser();
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        phone_number:
          clerk?.phoneNumbers?.[0]?.phoneNumber || `clerk:${userId}`,
        name: clerk?.fullName || clerk?.username || undefined,
        language_preference: "English",
        totalPunyaPoints: 0,
      },
    });

    // User profile with recent actions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userActions: {
          include: { action: true },
          orderBy: { timestamp: "desc" },
          take: 20,
        },
      },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Community aggregates
    const [sumPoints, hygieneReports, lostHelp, wasteLogs] = await Promise.all([
      prisma.user.aggregate({ _sum: { totalPunyaPoints: true } }),
      prisma.userAction.count({
        where: { action: { action_name: "report_hygiene_issue_photo" } },
      }),
      prisma.userAction.count({
        where: { action: { action_name: "help_lost_pilgrim_sos" } },
      }),
      prisma.userAction.count({
        where: { action: { action_name: "dispose_waste_qr" } },
      }),
    ]);

    // Milestones
    const milestones = [
      { name: "Free Blessed Meal (Prasad) 🍲", threshold: 100 },
      { name: "Priority Darshan Slot 🎟️", threshold: 500 },
      { name: "Festival VIP Pass 🏅", threshold: 1000 },
    ];
    const totalPoints = user.totalPunyaPoints;
    const next =
      milestones.find((m) => totalPoints < m.threshold) ||
      milestones[milestones.length - 1];
    const prev = milestones.reduce(
      (acc, m) => (m.threshold < next.threshold ? m.threshold : acc),
      0
    );
    const progressDenominator = Math.max(next.threshold - prev, 1);
    const progressNumerator = Math.max(totalPoints - prev, 0);
    const progressPercent = Math.min(
      100,
      Math.round((progressNumerator / progressDenominator) * 100)
    );

    // Point distribution
    const distribution = { hygiene: 0, eco: 0, cultural: 0 } as Record<
      string,
      number
    >;
    for (const ua of user.userActions) {
      const n = ua.action.action_name;
      if (
        n.includes("dispose_waste") ||
        n.includes("report_hygiene") ||
        n.includes("verify_hygiene")
      )
        distribution.hygiene += ua.action.point_value;
      else if (
        n.includes("refill_water") ||
        n.includes("public_transport") ||
        n.includes("erickshaw")
      )
        distribution.eco += ua.action.point_value;
      else if (
        n.includes("attend_cultural") ||
        n.includes("help_lost_pilgrim") ||
        n.includes("share_cultural_story")
      )
        distribution.cultural += ua.action.point_value;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        totalPoints: user.totalPunyaPoints,
        recentActions: user.userActions.map((ua) => ({
          actionName: ua.action.action_name,
          points: ua.action.point_value,
          timestamp: ua.timestamp,
          location: ua.location_geopoint,
        })),
      },
      milestones,
      nextMilestone: next,
      progressPercent,
      distribution,
      community: {
        totalCommunityPoints: sumPoints._sum.totalPunyaPoints ?? 0,
        hygieneReports,
        lostHelp,
        wasteLogs,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
