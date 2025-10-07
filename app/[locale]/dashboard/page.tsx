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

  return {
    totalCommunityPoints: sumPoints._sum.totalPunyaPoints ?? 0,
    wasteLogs,
    hygieneReports,
    lostHelp,
  };
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
    
  const ensuredUser = await prisma.user.upsert({
    where: { phone_number: identityKey },
    update: {},
    create: {
      phone_number: identityKey,
      name: clerk?.fullName || clerk?.username || undefined,
      language_preference: "English",
      totalPunyaPoints: 0,
    },
  });

  const [profileRes, achievementsRes, fullUser, communityImpact] = await Promise.all([
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

  if (!profileRes.success || !profileRes.user || !fullUser) {
    return (
      <div className="p-6 bg-slate-50">
        <p className="text-sm text-destructive">Failed to load profile.</p>
      </div>
    );
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
  
  const getNextRankInfo = (points: number) => {
    if (points < 100) return { nextRank: "Seva Seeker", needed: 100, progress: (points / 100) * 100 };
    if (points < 500) return { nextRank: "Dharma Steward", needed: 500, progress: ((points - 100) / 400) * 100 };
    if (points < 1000) return { nextRank: "Spiritual Master", needed: 1000, progress: ((points - 500) / 500) * 100 };
    return { nextRank: "Enlightened Soul", needed: 2000, progress: ((points - 1000) / 1000) * 100 };
  };

  const nextRankInfo = getNextRankInfo(totalPoints);

  const chartData = [
    { category: "Hygiene & Health", value: categoryToPoints.hygiene, fill: "hsl(var(--chart-1))" },
    { category: "Eco-Friendliness", value: categoryToPoints.eco, fill: "hsl(var(--chart-2))" },
    { category: "Cultural & Community", value: categoryToPoints.cultural, fill: "hsl(var(--chart-3))" },
    { category: "Other", value: categoryToPoints.other, fill: "hsl(var(--chart-4))" },
  ].filter(item => item.value > 0);

  const serviceCategories = [
    { title: 'Hygiene & Health', count: categoryToCount.hygiene, color: 'text-blue-500' },
    { title: 'Eco-Friendliness', count: categoryToCount.eco, color: 'text-green-500' },
    { title: 'Cultural & Community', count: categoryToCount.cultural, color: 'text-purple-500' },
  ];

  const statsCards = [
    { title: 'Your Total Points', value: totalPoints.toLocaleString(), color: 'bg-purple-500' },
    { title: 'Total Community Points', value: communityImpact.totalCommunityPoints.toLocaleString(), color: 'bg-red-500' },
    { title: 'Your Actions', value: user.totalActions.toLocaleString(), color: 'bg-cyan-500' },
    { title: 'Lost Items Found', value: communityImpact.lostHelp.toLocaleString(), color: 'bg-orange-500' },
    { title: 'Hygiene Reports', value: communityImpact.hygieneReports.toLocaleString(), color: 'bg-green-500' }
  ];

  const recentActivities = user.recentActions.map(a => ({
    action: a.actionName,
    points: a.points,
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
  };

  return <DashboardClient {...dashboardProps} />;
}
