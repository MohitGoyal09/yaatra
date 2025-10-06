"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Share2, Copy, MessageCircle, Twitter, Facebook } from 'lucide-react';
import { ShareTemplate } from './share-template';
import { ShareButton } from './share-button';

export interface Achievement {
  type: 'found_person' | 'leaderboard' | 'event' | 'task' | 'donation' | 'milestone';
  title: string;
  description: string;
  pointsEarned?: number;
  hours?: number;
  userName?: string;
}

interface SharePromptProps {
  achievement: Achievement;
  onShare: (platform: string) => void;
  onDismiss: () => void;
  isVisible: boolean;
}

export function SharePrompt({ achievement, onShare, onDismiss, isVisible }: SharePromptProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!isVisible) return null;

  const handleShare = async (platform: string) => {
    setIsSharing(true);
    try {
      await onShare(platform);
      setShareSuccess(true);
      setTimeout(() => {
        setShareSuccess(false);
        onDismiss();
      }, 2000);
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const platforms = [
    { id: 'web_share', name: 'Share', icon: Share2, color: 'bg-blue-500' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'clipboard', name: 'Copy Link', icon: Copy, color: 'bg-gray-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl font-bold text-center">
            🎉 Achievement Unlocked!
          </CardTitle>
          <CardDescription className="text-center">
            Share your seva and earn bonus points!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Achievement Details */}
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="text-sm">
              {achievement.title}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {achievement.description}
            </p>
            {achievement.pointsEarned && (
              <p className="text-lg font-semibold text-green-600">
                +{achievement.pointsEarned} Punya Points
              </p>
            )}
          </div>

          {/* Share Preview */}
          <ShareTemplate 
            type={achievement.type}
            userName={achievement.userName || 'Friend'}
            hours={achievement.hours?.toString() || '100'}
          />

          {/* Share Success Message */}
          {shareSuccess && (
            <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">✅ Shared successfully!</p>
              <p className="text-green-600 text-sm">+10 bonus points awarded</p>
            </div>
          )}

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <ShareButton
                  key={platform.id}
                  platform={platform.id}
                  content={{
                    title: achievement.title,
                    text: `🎉 I just ${achievement.description.toLowerCase()} through Yaat! #Seva #Community #YaatApp`,
                    url: window.location.origin,
                  }}
                  onSuccess={() => handleShare(platform.id)}
                  disabled={isSharing}
                  className={`${platform.color} hover:opacity-90 text-white`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {platform.name}
                </ShareButton>
              );
            })}
          </div>

          {/* Skip Button */}
          <Button
            variant="outline"
            onClick={onDismiss}
            className="w-full"
            disabled={isSharing}
          >
            Maybe Later
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
