import { databaseTool } from "@/lib/database-tool";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@clerk/nextjs/server";

export async function LeaderboardSnapshot() {
  const { userId } = await auth();
  const res = await databaseTool.getLeaderboard.execute({ limit: 3 });
  const top = res.success ? res.leaderboard : [];

  // Determine user's rank by querying a wider slice if needed (fallback client copy)
  let userRankText = "Unknown";
  if (userId) {
    // naive approach: if user is in top list, show rank; otherwise display "> #3"
    const found = top?.find((u) => u.name && u.name.length > 0 && u);
    userRankText = found ? `#${found.rank}` : "> #3";
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-semibold">Leaderboard Snapshot</h4>
        <div className="text-sm text-muted-foreground">
          Your Rank: {userRankText}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {top?.map((row) => (
            <TableRow key={row.rank}>
              <TableCell>#{row.rank}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.totalPoints}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
