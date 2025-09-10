import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { databaseTool } from "@/lib/database-tool";
import { Progress } from "@/components/ui/progress";
import { DonutChart } from "@/components/ui/donut-chart";
import { LeaderboardSnapshot } from "@/components/leaderboard/snapshot";

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

function formatLocation(loc: unknown): string | null {
  if (!loc) return null;
  try {
    if (typeof loc === "string") {
      const parsed = JSON.parse(loc as string);
      if (
        parsed &&
        typeof parsed.lat === "number" &&
        typeof parsed.lng === "number"
      ) {
        return `${parsed.lat.toFixed(4)}, ${parsed.lng.toFixed(4)}`;
      }
      return typeof parsed === "string" ? parsed : null;
    }
    if (typeof loc === "object" && loc !== null) {
      const anyLoc = loc as { lat?: number; lng?: number };
      if (typeof anyLoc.lat === "number" && typeof anyLoc.lng === "number") {
        return `${anyLoc.lat.toFixed(4)}, ${anyLoc.lng.toFixed(4)}`;
      }
    }
  } catch {}
  return null;
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Please sign in to view your dashboard.
        </p>
      </div>
    );
  }

  // Ensure an app user exists keyed by stable identity (email/phone)
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

  const [profileRes, achievementsRes, fullUser] = await Promise.all([
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
  ]);

  if (!profileRes.success || !profileRes.user || !fullUser) {
    return (
      <div className="p-6">
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
  const categories: {
    key: CategoryKey;
    label: string;
    points: number;
    count: number;
  }[] = [
    {
      key: "hygiene",
      label: "Hygiene & Health",
      points: categoryToPoints.hygiene,
      count: categoryToCount.hygiene,
    },
    {
      key: "eco",
      label: "Eco-Friendliness",
      points: categoryToPoints.eco,
      count: categoryToCount.eco,
    },
    {
      key: "cultural",
      label: "Cultural & Community",
      points: categoryToPoints.cultural,
      count: categoryToCount.cultural,
    },
  ];

  const milestones = [
    { name: "Free Blessed Meal (Prasad) 🍲", threshold: 100 },
    { name: "Priority Darshan Slot 🎟️", threshold: 500 },
    { name: "Festival VIP Pass 🏅", threshold: 1000 },
  ];
  const nextMilestone =
    milestones.find((m) => totalPoints < m.threshold) ||
    milestones[milestones.length - 1];
  const prevMilestonePoints = milestones.reduce(
    (acc, m) => (m.threshold < nextMilestone.threshold ? m.threshold : acc),
    0
  );
  const progressDenominator = Math.max(
    nextMilestone.threshold - prevMilestonePoints,
    1
  );
  const progressNumerator = Math.max(totalPoints - prevMilestonePoints, 0);
  const progressPercent = Math.min(
    100,
    Math.round((progressNumerator / progressDenominator) * 100)
  );
  const pointsToGo = Math.max(nextMilestone.threshold - totalPoints, 0);

  return (
    <div className="p-6 space-y-8">
      <section>
        <h2 className="text-2xl font-semibold">
          Welcome{user.name ? `, ${user.name}` : ""}
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Total Points</div>
            <div className="text-2xl font-bold">{totalPoints}</div>
            <div className="text-xs text-muted-foreground">
              Title: {rankTitle}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Total Actions</div>
            <div className="text-2xl font-bold">{user.totalActions}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Unique Actions</div>
            <div className="text-2xl font-bold">{user.uniqueActions}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Next Reward</div>
            <div className="text-lg font-semibold">{nextMilestone.name}</div>
            <div className="text-xs text-muted-foreground">
              {pointsToGo} points to go
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold">
          Progress towards freebies/passes
        </h3>
        <div className="mt-2">
          <Progress value={progressPercent} />
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          {progressPercent}% towards {nextMilestone.name}
        </div>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {milestones.map((m) => (
            <div key={m.name} className="flex items-center gap-2">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  totalPoints >= m.threshold
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                }`}
              />
              <span>
                {m.name} ({m.threshold})
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Point distribution</h3>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <div className="mb-2 font-medium">By category</div>
            <DonutChart
              slices={[
                {
                  label: "Hygiene",
                  value: categories[0].points,
                  color: "#22c55e",
                },
                { label: "Eco", value: categories[1].points, color: "#3b82f6" },
                {
                  label: "Cultural",
                  value: categories[2].points,
                  color: "#f59e0b",
                },
              ]}
            />
          </div>
          <LeaderboardSnapshot />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Recent activities</h3>
        <div className="mt-2 overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Action</th>
                <th className="px-3 py-2 text-left font-medium">Points</th>
                <th className="px-3 py-2 text-left font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {user.recentActions.length === 0 ? (
                <tr>
                  <td className="px-3 py-3" colSpan={3}>
                    No recent actions
                  </td>
                </tr>
              ) : (
                user.recentActions.map((a, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-3 py-3">
                      {a.actionName}
                      {(() => {
                        const locText = formatLocation(a.location);
                        return locText ? (
                          <span className="text-muted-foreground">
                            {" "}
                            — {locText}
                          </span>
                        ) : null;
                      })()}
                    </td>
                    <td className="px-3 py-3">{a.points}</td>
                    <td className="px-3 py-3">
                      {new Date(a.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Achievements</h3>
        {achievements.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No achievements yet
          </p>
        ) : (
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {achievements.map((ach, idx) => (
              <li key={idx} className="rounded-lg border p-4">
                <div className="text-2xl">{ach.icon}</div>
                <div className="font-semibold">{ach.name}</div>
                <div className="text-sm text-muted-foreground">
                  {ach.description}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Community Impact */}
      <CommunityImpact />

      {/* Seva Opportunities */}
      <section>
        <h3 className="text-lg font-semibold">Your Next Mission</h3>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="/chat" className="rounded-lg border p-4 hover:bg-muted">
            <div className="text-2xl">📷</div>
            <div className="font-semibold">Report a Hygiene Issue</div>
            <div className="text-sm text-muted-foreground">
              Use camera to report and earn
            </div>
          </a>
          <a href="/chat" className="rounded-lg border p-4 hover:bg-muted">
            <div className="text-2xl">🔳</div>
            <div className="font-semibold">Scan & Earn</div>
            <div className="text-sm text-muted-foreground">
              Scan smart bins and water stations
            </div>
          </a>
          <div className="rounded-lg border p-4">
            <div className="text-2xl">📍</div>
            <div className="font-semibold">Nearby Opportunity</div>
            <div className="text-sm text-muted-foreground">
              Cultural lecture starts in 15 mins at Ram Ghat (+10)
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

async function CommunityImpact() {
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

  const totalCommunityPoints = sumPoints._sum.totalPunyaPoints ?? 0;

  return (
    <section>
      <h3 className="text-lg font-semibold">Our Collective Impact</h3>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">
            Waste Disposals Logged
          </div>
          <div className="text-2xl font-bold">{wasteLogs}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">
            Hygiene Reports Filed
          </div>
          <div className="text-2xl font-bold">{hygieneReports}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">
            Lost Pilgrims Reconnected
          </div>
          <div className="text-2xl font-bold">{lostHelp}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">
            Total Punya Points (All)
          </div>
          <div className="text-2xl font-bold">
            {totalCommunityPoints.toLocaleString()}
          </div>
        </div>
      </div>
    </section>
  );
}
