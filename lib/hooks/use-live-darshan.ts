"use client";

import { useState, useEffect, useCallback } from "react";

interface LiveDarshanStats {
  totalDarshanPoints: number;
  totalWatchTime: number;
  totalDarshanActions: number;
  actionBreakdown: Record<string, number>;
  rankTitle: string;
  recentActions: Array<{
    action: string;
    points: number;
    timestamp: string;
    temple: string | null;
  }>;
}

interface UseLiveDarshanReturn {
  stats: LiveDarshanStats | null;
  loading: boolean;
  error: string | null;
  earnPoints: (
    action: string,
    temple: string,
    duration?: number,
    metadata?: any
  ) => Promise<boolean>;
  refreshStats: () => Promise<void>;
}

export function useLiveDarshan(): UseLiveDarshanReturn {
  const [stats, setStats] = useState<LiveDarshanStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/live-darshan/points");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      } else {
        setError(data.error || "Failed to fetch stats");
      }
    } catch (err) {
      setError("Network error while fetching Live Darshan stats");
      console.error("Error fetching Live Darshan stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const earnPoints = useCallback(
    async (
      action: string,
      temple: string,
      duration?: number,
      metadata?: any
    ): Promise<boolean> => {
      try {
        const response = await fetch("/api/live-darshan/points", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            temple,
            duration,
            metadata,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          // Refresh stats after earning points
          await fetchStats();
          return true;
        } else {
          setError(data.error || "Failed to earn points");
          return false;
        }
      } catch (err) {
        setError("Network error while earning points");
        console.error("Error earning points:", err);
        return false;
      }
    },
    [fetchStats]
  );

  const refreshStats = useCallback(async () => {
    setLoading(true);
    await fetchStats();
  }, [fetchStats]);

  // Initial load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    earnPoints,
    refreshStats,
  };
}

// Hook for real-time Live Darshan features
export function useLiveDarshanRealtime() {
  const [liveViewers, setLiveViewers] = useState<Record<string, number>>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate real-time viewer count updates
    const interval = setInterval(() => {
      setLiveViewers((prev) => ({
        mahakal: Math.floor(Math.random() * 2000) + 1000,
        harsiddhi: Math.floor(Math.random() * 1500) + 500,
        chintaman: Math.floor(Math.random() * 1000) + 300,
        kalbhairav: Math.floor(Math.random() * 800) + 200,
      }));
    }, 5000);

    setIsConnected(true);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  return {
    liveViewers,
    isConnected,
  };
}

// Hook for community features
export function useCommunityAarti() {
  const [nextAartiTime, setNextAartiTime] = useState<Date | null>(null);
  const [isAartiActive, setIsAartiActive] = useState(false);
  const [communityPoints, setCommunityPoints] = useState(0);

  useEffect(() => {
    // Set next aarti time (example: 6:00 PM today)
    const today = new Date();
    const nextAarti = new Date(today);
    nextAarti.setHours(18, 0, 0, 0); // 6:00 PM

    // If it's already past 6 PM, set for tomorrow
    if (today > nextAarti) {
      nextAarti.setDate(nextAarti.getDate() + 1);
    }

    setNextAartiTime(nextAarti);

    // Check if aarti is currently active (6:00 PM - 6:30 PM)
    const checkAartiStatus = () => {
      const now = new Date();
      const aartiStart = new Date(now);
      aartiStart.setHours(18, 0, 0, 0);
      const aartiEnd = new Date(now);
      aartiEnd.setHours(18, 30, 0, 0);

      setIsAartiActive(now >= aartiStart && now <= aartiEnd);
    };

    checkAartiStatus();
    const interval = setInterval(checkAartiStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const joinCommunityAarti = useCallback(async () => {
    if (!isAartiActive) return false;

    try {
      const response = await fetch("/api/live-darshan/points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "community_aarti",
          temple: "community",
          metadata: {
            aartiTime: new Date().toISOString(),
            communitySize: Math.floor(Math.random() * 1000) + 500,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCommunityPoints((prev) => prev + data.points);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error joining community aarti:", error);
      return false;
    }
  }, [isAartiActive]);

  return {
    nextAartiTime,
    isAartiActive,
    communityPoints,
    joinCommunityAarti,
  };
}
