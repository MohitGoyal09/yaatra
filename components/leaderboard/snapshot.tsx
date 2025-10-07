"use client"
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaderboardUser {
  id: string;
  name: string;
  totalPunyaPoints: number;
  rank: number;
}

interface LeaderboardSnapshotProps {
  limit?: number;
}

export function LeaderboardSnapshot({ limit = 5 }: LeaderboardSnapshotProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/leaderboard?limit=${limit}`);
        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [limit]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <div className="h-5 w-5 bg-muted rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground">{rank}</span>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 rounded-lg animate-pulse">
            <div className="h-8 w-8 bg-muted rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-muted rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">No leaderboard data</p>
        <p className="text-sm">Be the first to earn points!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {leaderboardData.map((user, index) => (
        <div
          key={user.id}
          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            index < 3 ? 'bg-muted/50' : 'hover:bg-muted/30'
          }`}
        >
          <div className="flex-shrink-0">
            {getRankIcon(user.rank)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.name || `Pilgrim ${user.id.slice(-4)}`}
            </p>
            <p className="text-xs text-muted-foreground">
              Rank #{user.rank}
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="text-sm font-bold text-primary">
              {user.totalPunyaPoints.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground ml-1">pts</span>
          </div>
        </div>
      ))}
    </div>
  );
}
