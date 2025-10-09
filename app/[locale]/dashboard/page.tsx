import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { databaseTool } from "@/lib/database-tool";
import DashboardClient from "./dashboard-client";

type CategoryKey = "hygiene" | "eco" | "cultural" | "other";

function categorizeAction(actionName: string): CategoryKey {
  if (
    actionName.includes("dispose_waste") ||
    actionName.includes("report_hygiene") ||
    actionName.includes("verify_hygiene")
  )
    return "hygiene";
  if (
    actionName.includes("refill_water") ||
    actionName.includes("public_transport") ||
    actionName.includes("erickshaw")
  )
    return "eco";
  if (
    actionName.includes("attend_cultural") ||
    actionName.includes("help_lost_pilgrim") ||
    actionName.includes("share_cultural_story")
  )
    return "cultural";
  return "other";
}

async function getCommunityImpact() {
  try {
    // Add timeout to prevent hanging connections
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database query timeout")), 5000);
    });

    const [sumPoints, hygieneReports, lostHelp, wasteLogs] =
      (await Promise.race([
        Promise.all([
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
        ]),
        timeoutPromise,
      ])) as any;

    return {
      totalCommunityPoints: sumPoints._sum.totalPunyaPoints ?? 0,
      wasteLogs,
      hygieneReports,
      lostHelp,
    };
  } catch (error) {
    console.error("Error fetching community impact:", error);
    // Return default values if database query fails
    return {
      totalCommunityPoints: 0,
      wasteLogs: 0,
      hygieneReports: 0,
      lostHelp: 0,
    };
  }
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="p-6 bg-slate-50">
        <p className="text-sm text-muted-foreground">
          Please sign in to view your dashboard.
        </p>
      </div>
    );
  }

  const clerk = await currentUser();
  const identityKey =
    clerk?.primaryEmailAddress?.emailAddress ||
    clerk?.phoneNumbers?.[0]?.phoneNumber ||
    userId;

  // Create a mock user object for when database is unavailable
  const mockUser = {
    id: userId,
    phone_number: identityKey,
    name: clerk?.fullName || clerk?.username || "User",
    language_preference: "English",
    totalPunyaPoints: 0,
    totalActions: 0,
    recentActions: [],
  };

  let ensuredUser;
  try {
    ensuredUser = await prisma.user.upsert({
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
    // Use mock user when database is unavailable
    ensuredUser = mockUser;
  }

  let profileRes, achievementsRes, fullUser, communityImpact;

  // Check if we're using mock data (database unavailable)
  const isUsingMockData = ensuredUser === mockUser;

  if (isUsingMockData) {
    // Skip database queries entirely when using mock data
    profileRes = { success: true, user: mockUser };
    achievementsRes = { success: true, achievements: [] };
    fullUser = { ...mockUser, userActions: [] };
    communityImpact = {
      totalCommunityPoints: 0,
      wasteLogs: 0,
      hygieneReports: 0,
      lostHelp: 0,
    };
  } else {
    try {
      [profileRes, achievementsRes, fullUser, communityImpact] =
        await Promise.all([
          databaseTool.getUserProfile.execute({ userId: ensuredUser.id }),
          databaseTool.getUserAchievements.execute({ userId: ensuredUser.id }),
          prisma.user.findUnique({
            where: { id: ensuredUser.id },
            include: {
              userActions: {
                include: { action: true },
                orderBy: { timestamp: "desc" },
              },
            },
          }),
          getCommunityImpact(),
        ]);
    } catch (error) {
      console.error("Database connection error:", error);
      // Use fallback data when database is unavailable
      profileRes = { success: true, user: mockUser };
      achievementsRes = { success: true, achievements: [] };
      fullUser = { ...mockUser, userActions: [] };
      communityImpact = {
        totalCommunityPoints: 0,
        wasteLogs: 0,
        hygieneReports: 0,
        lostHelp: 0,
      };
    }
  }

  if (!profileRes.success || !profileRes.user || !fullUser) {
    // If we have fallback data, continue with it
    if (profileRes.user && fullUser) {
      // Continue with fallback data
    } else {
      return (
        <div className="p-6 bg-slate-50">
          <p className="text-sm text-destructive">Failed to load profile.</p>
        </div>
      );
    }
  }

  const user = profileRes.user;
  const achievements =
    achievementsRes.success && achievementsRes.achievements
      ? achievementsRes.achievements
      : [];

  const categoryToPoints: Record<CategoryKey, number> = {
    hygiene: 0,
    eco: 0,
    cultural: 0,
    other: 0,
  };
  const categoryToCount: Record<CategoryKey, number> = {
    hygiene: 0,
    eco: 0,
    cultural: 0,
    other: 0,
  };

  for (const ua of fullUser.userActions) {
    const key = categorizeAction(ua.action.action_name);
    categoryToPoints[key] += ua.action.point_value;
    categoryToCount[key] += 1;
  }

  const totalPoints = user.totalPunyaPoints;
  const rankTitle =
    totalPoints >= 1000
      ? "Spiritual Master"
      : totalPoints >= 500
      ? "Dharma Steward"
      : totalPoints >= 100
      ? "Seva Seeker"
      : "Seva Starter";

  const serviceCategories = [
    {
      title: "Hygiene & Health",
      count: categoryToCount.hygiene,
      color: "text-blue-500",
    },
    {
      title: "Eco-Friendliness",
      count: categoryToCount.eco,
      color: "text-green-500",
    },
    {
      title: "Cultural & Community",
      count: categoryToCount.cultural,
      color: "text-purple-500",
    },
  ];

  const statsCards = [
    {
      title: "Your Total Points",
      value: totalPoints.toLocaleString(),
      color: "bg-purple-500",
    },
    {
      title: "Total Community Points",
      value: communityImpact.totalCommunityPoints.toLocaleString(),
      color: "bg-red-500",
    },
    {
      title: "Your Actions",
      value: user.totalActions.toLocaleString(),
      color: "bg-cyan-500",
    },
    {
      title: "Lost Items Found",
      value: communityImpact.lostHelp.toLocaleString(),
      color: "bg-orange-500",
    },
    {
      title: "Hygiene Reports",
      value: communityImpact.hygieneReports.toLocaleString(),
      color: "bg-green-500",
    },
  ];

  const recentActivities = user.recentActions.map((a) => ({
    action: a.actionName,
    points: a.points,
  }));

  // Calculate next rank info
  const nextRankInfo = {
    nextRank:
      totalPoints >= 1000
        ? "Spiritual Guide"
        : totalPoints >= 500
        ? "Devotee"
        : "Seeker",
    needed:
      totalPoints >= 1000
        ? 0
        : totalPoints >= 500
        ? 1000 - totalPoints
        : 500 - totalPoints,
    progress:
      totalPoints >= 1000
        ? 100
        : totalPoints >= 500
        ? ((totalPoints - 500) / 500) * 100
        : (totalPoints / 500) * 100,
  };

  // Chart data for service categories
  const chartData = serviceCategories.map((category, index) => ({
    category: category.title,
    value: category.count,
    fill: category.color.replace("bg-", "hsl(").replace("-500", " 70% 50%)"),
  }));

  const dashboardProps = {
    user,
    achievements,
    serviceCategories,
    statsCards,
    recentActivities,
    rankTitle,
    nextRankInfo,
    chartData,
    totalPoints,
    isDatabaseAvailable: profileRes.success && profileRes.user !== mockUser,
  };

  return (
    <DashboardClient
      user={user}
      achievements={achievements}
      serviceCategories={serviceCategories}
      statsCards={statsCards}
      recentActivities={recentActivities}
      rankTitle={rankTitle}
      nextRankInfo={nextRankInfo}
      chartData={chartData}
      totalPoints={totalPoints}
      isDatabaseAvailable={profileRes.success && profileRes.user !== mockUser}
    />
  );
}
