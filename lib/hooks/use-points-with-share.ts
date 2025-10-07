"use client";

import { useState } from 'react';
import { useSocialShareContext } from '@/components/social/social-share-provider';
import { shouldTriggerSharePrompt, getShareAchievement, getSharePromptDelay } from '@/lib/social-share-utils';

interface UsePointsWithShareReturn {
  updatePoints: (actionName: string, location?: any, imageUrl?: string) => Promise<any>;
  isUpdating: boolean;
}

export function usePointsWithShare(): UsePointsWithShareReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const { showSharePrompt } = useSocialShareContext();

  const updatePoints = async (actionName: string, location?: any, imageUrl?: string) => {
    setIsUpdating(true);
    
    try {
      // Update points via existing API
      const response = await fetch('/api/points/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionName,
          location,
          imageUrl,
        }),
      });

      const result = await response.json();

      if (result.success && shouldTriggerSharePrompt(actionName)) {
        // Get user info for the share prompt
        const userResponse = await fetch('/api/points/fetch');
        const userData = await userResponse.json();
        
        const achievement = getShareAchievement(actionName, userData.userName);
        
        if (achievement) {
          // Show share prompt after a delay
          const delay = getSharePromptDelay(actionName);
          setTimeout(() => {
            showSharePrompt(achievement);
          }, delay);
        }
      }

      return result;
    } catch (error) {
      console.error('Error updating points:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updatePoints,
    isUpdating,
  };
}
