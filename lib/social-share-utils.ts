import { Achievement } from '@/components/social/share-prompt';

// Define which actions should trigger social share prompts
export const SHARE_TRIGGER_ACTIONS = {
  'found_person': {
    type: 'found_person' as const,
    title: 'Found Missing Person',
    description: 'helped locate a missing community member',
    pointsEarned: 50,
  },
  'cleaning_task': {
    type: 'task' as const,
    title: 'Cleaning Task Completed',
    description: 'completed a community cleaning task',
    pointsEarned: 25,
  },
  'top_10_leaderboard': {
    type: 'leaderboard' as const,
    title: 'Top 10 Leaderboard',
    description: 'reached top 10 in seva leaderboard',
    pointsEarned: 100,
  },
  'event_attended': {
    type: 'event' as const,
    title: 'Event Attended',
    description: 'attended a community service event',
    pointsEarned: 30,
  },
  'donation_made': {
    type: 'donation' as const,
    title: 'Donation Made',
    description: 'made a donation to support the community',
    pointsEarned: 40,
  },
  'milestone_100_hours': {
    type: 'milestone' as const,
    title: '100 Hours Milestone',
    description: 'reached 100 hours of seva service',
    pointsEarned: 200,
    hours: 100,
  },
};

export function shouldTriggerSharePrompt(actionName: string): boolean {
  return Object.keys(SHARE_TRIGGER_ACTIONS).includes(actionName);
}

export function getShareAchievement(actionName: string, userName?: string): Achievement | null {
  const triggerAction = SHARE_TRIGGER_ACTIONS[actionName as keyof typeof SHARE_TRIGGER_ACTIONS];
  
  if (!triggerAction) {
    return null;
  }

  return {
    ...triggerAction,
    userName: userName || 'Friend',
  };
}

export function getSharePromptDelay(actionName: string): number {
  // Different delays for different actions to feel natural
  const delays: Record<string, number> = {
    'found_person': 2000, // 2 seconds - high impact action
    'cleaning_task': 1500, // 1.5 seconds - regular task
    'top_10_leaderboard': 3000, // 3 seconds - major achievement
    'event_attended': 1000, // 1 second - quick acknowledgment
    'donation_made': 2000, // 2 seconds - meaningful action
    'milestone_100_hours': 2500, // 2.5 seconds - significant milestone
  };

  return delays[actionName] || 1500; // Default 1.5 seconds
}
