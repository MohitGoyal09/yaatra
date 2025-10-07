"use client";

import { useState, useCallback } from 'react';
import { Achievement } from '@/components/social/share-prompt';

interface UseSocialShareReturn {
  showSharePrompt: (achievement: Achievement) => void;
  hideSharePrompt: () => void;
  isVisible: boolean;
  currentAchievement: Achievement | null;
  handleShare: (platform: string) => Promise<void>;
  isSharing: boolean;
}

export function useSocialShare(): UseSocialShareReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const showSharePrompt = useCallback((achievement: Achievement) => {
    setCurrentAchievement(achievement);
    setIsVisible(true);
  }, []);

  const hideSharePrompt = useCallback(() => {
    setIsVisible(false);
    setCurrentAchievement(null);
  }, []);

  const handleShare = useCallback(async (platform: string) => {
    if (!currentAchievement) return;
    
    setIsSharing(true);
    try {
      // The actual sharing logic is handled in ShareButton component
      // This is just for managing the prompt state
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate share delay
    } catch (error) {
      console.error('Share error:', error);
      throw error;
    } finally {
      setIsSharing(false);
    }
  }, [currentAchievement]);

  return {
    showSharePrompt,
    hideSharePrompt,
    isVisible,
    currentAchievement,
    handleShare,
    isSharing,
  };
}
