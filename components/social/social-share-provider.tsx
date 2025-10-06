"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { SharePrompt, Achievement } from './share-prompt';
import { useSocialShare } from '@/lib/hooks/use-social-share';

interface SocialShareContextType {
  showSharePrompt: (achievement: Achievement) => void;
  hideSharePrompt: () => void;
  isVisible: boolean;
  currentAchievement: Achievement | null;
  handleShare: (platform: string) => Promise<void>;
  isSharing: boolean;
}

const SocialShareContext = createContext<SocialShareContextType | undefined>(undefined);

export function useSocialShareContext() {
  const context = useContext(SocialShareContext);
  if (context === undefined) {
    throw new Error('useSocialShareContext must be used within a SocialShareProvider');
  }
  return context;
}

interface SocialShareProviderProps {
  children: ReactNode;
}

export function SocialShareProvider({ children }: SocialShareProviderProps) {
  const socialShare = useSocialShare();

  return (
    <SocialShareContext.Provider value={socialShare}>
      {children}
      
      {/* Global Share Prompt */}
      {socialShare.currentAchievement && (
        <SharePrompt
          achievement={socialShare.currentAchievement}
          onShare={socialShare.handleShare}
          onDismiss={socialShare.hideSharePrompt}
          isVisible={socialShare.isVisible}
        />
      )}
    </SocialShareContext.Provider>
  );
}
