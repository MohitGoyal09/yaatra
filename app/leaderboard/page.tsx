import { databaseTool } from "@/lib/database-tool";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function LeaderboardPage() {
  const res = await databaseTool.getLeaderboard.execute({ limit: 20 });
  if (!res.success) {
    return (
      <div>
        <p>Failed to load leaderboard.</p>
      </div>
    );
  }

  const rows = res.leaderboard ?? [];
  const rankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const initial = (name?: string) => name?.trim()[0]?.toUpperCase() ?? "?";

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Leaderboard</h2>
          <p className="text-sm text-muted-foreground">
            Top pilgrims by total Punya Points
          </p>
        </div>
        <div className="text-sm text-muted-foreground">Updated just now</div>
      </div>
      <div className="rounded-lg border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Total Points</TableHead>
              <TableHead>Total Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.rank}
                className={row.rank <= 3 ? "bg-muted/30" : undefined}
              >
                <TableCell className="font-medium">
                  {rankBadge(row.rank)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs">
                      {initial(row.name)}
                    </span>
                    <span>{row.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  {row.totalPoints.toLocaleString()}
                </TableCell>
                <TableCell>{row.totalActions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
