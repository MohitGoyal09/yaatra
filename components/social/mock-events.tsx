"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SharePrompt, Achievement } from './share-prompt';
import { useSocialShare } from '@/lib/hooks/use-social-share';
import { 
  Users, 
  MapPin, 
  Trash2, 
  Heart, 
  Trophy, 
  Calendar,
  Target
} from 'lucide-react';

export function MockEvents() {
  const { 
    showSharePrompt, 
    hideSharePrompt, 
    isVisible, 
    currentAchievement, 
    handleShare 
  } = useSocialShare();

  const mockAchievements: Achievement[] = [
    {
      type: 'found_person',
      title: 'Found Missing Person',
      description: 'helped locate a missing community member',
      pointsEarned: 50,
      userName: 'Demo User',
    },
    {
      type: 'task',
      title: 'Cleaning Task Completed',
      description: 'completed a community cleaning task',
      pointsEarned: 25,
      userName: 'Demo User',
    },
    {
      type: 'leaderboard',
      title: 'Top 10 Leaderboard',
      description: 'reached top 10 in seva leaderboard',
      pointsEarned: 100,
      userName: 'Demo User',
    },
    {
      type: 'event',
      title: 'Event Attended',
      description: 'attended a community service event',
      pointsEarned: 30,
      userName: 'Demo User',
    },
    {
      type: 'donation',
      title: 'Donation Made',
      description: 'made a donation to support the community',
      pointsEarned: 40,
      userName: 'Demo User',
    },
    {
      type: 'milestone',
      title: '100 Hours Milestone',
      description: 'reached 100 hours of seva service',
      pointsEarned: 200,
      userName: 'Demo User',
      hours: 100,
    },
  ];

  const getAchievementIcon = (type: Achievement['type']) => {
    switch (type) {
      case 'found_person':
        return <Users className="h-5 w-5" />;
      case 'task':
        return <Trash2 className="h-5 w-5" />;
      case 'leaderboard':
        return <Trophy className="h-5 w-5" />;
      case 'event':
        return <Calendar className="h-5 w-5" />;
      case 'donation':
        return <Heart className="h-5 w-5" />;
      case 'milestone':
        return <Target className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const getAchievementColor = (type: Achievement['type']) => {
    switch (type) {
      case 'found_person':
        return 'bg-green-500';
      case 'task':
        return 'bg-blue-500';
      case 'leaderboard':
        return 'bg-yellow-500';
      case 'event':
        return 'bg-purple-500';
      case 'donation':
        return 'bg-red-500';
      case 'milestone':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Social Share Testing</h2>
        <p className="text-muted-foreground">
          Test the social sharing feature with these mock achievements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAchievements.map((achievement, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getAchievementColor(achievement.type)} text-white`}>
                  {getAchievementIcon(achievement.type)}
                </div>
                <div>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {achievement.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  +{achievement.pointsEarned} points
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {achievement.type}
                </Badge>
              </div>
              
              <Button 
                onClick={() => showSharePrompt(achievement)}
                className="w-full"
                variant="default"
              >
                Test Share Prompt
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Share Prompt */}
      {currentAchievement && (
        <SharePrompt
          achievement={currentAchievement}
          onShare={handleShare}
          onDismiss={hideSharePrompt}
          isVisible={isVisible}
        />
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p>• Click any "Test Share Prompt" button to trigger the social share modal</p>
          <p>• Try different sharing platforms (Web Share, WhatsApp, Twitter, etc.)</p>
          <p>• Check that points are awarded after successful sharing</p>
          <p>• Test the copy-to-clipboard fallback on unsupported browsers</p>
          <p>• Verify that share history is recorded in the backend</p>
        </CardContent>
      </Card>
    </div>
  );
}
