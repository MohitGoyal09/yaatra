"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePointsWithShare } from "@/lib/hooks/use-points-with-share";
import {
  Users,
  Trash2,
  Trophy,
  Calendar,
  Heart,
  Target,
  MapPin,
} from "lucide-react";

export default function DemoActionsPage() {
  const { updatePoints, isUpdating } = usePointsWithShare();
  const [lastResult, setLastResult] = useState<any>(null);

  const demoActions = [
    {
      id: "found_person",
      name: "Found Missing Person",
      description: "Help locate a missing community member",
      points: 50,
      icon: <Users className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      id: "cleaning_task",
      name: "Cleaning Task",
      description: "Complete a community cleaning task",
      points: 25,
      icon: <Trash2 className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      id: "top_10_leaderboard",
      name: "Top 10 Leaderboard",
      description: "Reach top 10 in seva leaderboard",
      points: 100,
      icon: <Trophy className="h-5 w-5" />,
      color: "bg-yellow-500",
    },
    {
      id: "event_attended",
      name: "Event Attended",
      description: "Attend a community service event",
      points: 30,
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      id: "donation_made",
      name: "Donation Made",
      description: "Make a donation to support community",
      points: 40,
      icon: <Heart className="h-5 w-5" />,
      color: "bg-red-500",
    },
    {
      id: "milestone_100_hours",
      name: "100 Hours Milestone",
      description: "Reach 100 hours of seva service",
      points: 200,
      icon: <Target className="h-5 w-5" />,
      color: "bg-indigo-500",
    },
  ];

  const handleAction = async (actionId: string) => {
    try {
      const result = await updatePoints(
        actionId,
        { lat: 23.1765, lng: 75.7849 },
    
      );
      setLastResult(result);
      console.log("Action completed:", result);
    } catch (error) {
      console.error("Action failed:", error);
      setLastResult({ error: "Action failed" });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Demo Actions with Social Sharing</h1>
        <p className="text-muted-foreground">
          Test the integrated social sharing feature with real actions
        </p>
      </div>

      {/* Last Result */}
      {lastResult && (
        <Card
          className={`${
            lastResult.error
              ? "border-red-200 bg-red-50"
              : "border-green-200 bg-green-50"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={lastResult.error ? "text-red-800" : "text-green-800"}
            >
              {lastResult.error ? "Action Failed" : "Action Completed!"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(lastResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Demo Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoActions.map((action) => (
          <Card key={action.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${action.color} text-white`}>
                  {action.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{action.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {action.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">+{action.points} points</Badge>
                <Badge variant="outline" className="text-xs">
                  {action.id}
                </Badge>
              </div>

              <Button
                onClick={() => handleAction(action.id)}
                disabled={isUpdating}
                className="w-full"
                variant="default"
              >
                {isUpdating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Complete Action"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p>
            • Click any "Complete Action" button to simulate completing a seva
            task
          </p>
          <p>• Points will be awarded and recorded in the database</p>
          <p>• After a short delay, a social share prompt will appear</p>
          <p>• Share on social media to earn bonus points (+10)</p>
          <p>• All shares are tracked and recorded for analytics</p>
          <p>• Check the console for detailed logs of the process</p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" asChild>
          <a href="/social-test">View Social Test Page</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/dashboard">View Dashboard</a>
        </Button>
      </div>
    </div>
  );
}
