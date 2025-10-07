# Social Media Post Points: "Dharma-Prachar" Feature

## Overview

A gamification feature that rewards users for sharing their seva (service) achievements on social media, creating a positive feedback loop and boosting app virality.

## Impact

- **Boosts app virality** and positive user feedback loop
- **Lets users show-off their actions**, encourages more Seva
- **Increases user engagement** through social proof
- **Builds community** around shared values and achievements

## Technical Architecture

### 1. Trigger Points

Share prompts should appear after high-value actions:

- ✅ Found a missing person
- 🏆 Top 10 leaderboard achievement
- 📅 Event attended/completed
- 🧹 Cleaning task completed
- 💝 Donation made
- 🎯 Milestone reached (e.g., 100 hours of seva)

### 2. Share Content Generation

**Template System:**

- Pre-formatted templates for different achievement types
- Dynamic content injection (user name, achievement details, points earned)
- Branded visual elements (app logo, colors, fonts)
- Relevant hashtags (#Seva, #Dharma, #Community, #YaatApp)

**Content Formats:**

- **Screenshot generation** for visual posts
- **Styled HTML/CSS** for PWA sharing
- **Text templates** with emojis and formatting
- **Image overlays** with achievement badges

### 3. Sharing Mechanisms

**Primary:** Web Share API (native sharing)
**Fallback:** Copy-to-clipboard with formatted text
**Platform-specific:** Direct links to major platforms (WhatsApp, Twitter, Facebook)

### 4. Backend Integration

**API Endpoints:**

- `POST /api/social/share` - Record share event
- `GET /api/social/templates` - Fetch share templates
- `POST /api/points/award` - Award points for sharing

**Database Schema:**

```sql
social_shares (
  id, user_id, achievement_type, platform, 
  shared_at, points_awarded, template_used
)
```

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)

- [ ] Create share prompt component
- [ ] Implement Web Share API integration
- [ ] Build copy-to-clipboard fallback
- [ ] Design basic share templates
- [ ] Set up backend API endpoints

### Phase 2: Content Generation (Week 2)

- [ ] Build template engine for dynamic content
- [ ] Implement screenshot generation
- [ ] Create achievement-specific templates
- [ ] Add branded visual elements
- [ ] Implement hashtag system

### Phase 3: Points & Analytics (Week 3)

- [ ] Integrate points awarding system
- [ ] Add share tracking and analytics
- [ ] Implement share success/failure handling
- [ ] Create admin dashboard for share metrics
- [ ] Add user share history

### Phase 4: Enhancement & Testing (Week 4)

- [ ] A/B test different share prompts
- [ ] Optimize share templates for engagement
- [ ] Add social platform detection
- [ ] Implement share rate limiting
- [ ] Performance optimization

## Technical Components

### Frontend Components

```typescript
// SharePrompt.tsx
interface SharePromptProps {
  achievement: Achievement;
  onShare: (platform: string) => void;
  onDismiss: () => void;
}

// ShareTemplate.tsx
interface ShareTemplateProps {
  type: 'found_person' | 'leaderboard' | 'event' | 'task';
  user: User;
  achievement: Achievement;
}

// ShareButton.tsx
interface ShareButtonProps {
  content: ShareContent;
  platforms: string[];
  onSuccess: (platform: string) => void;
}
```

### Backend Services

```typescript
// ShareService.ts
class ShareService {
  generateTemplate(type: string, data: any): ShareTemplate;
  awardPoints(userId: string, shareData: ShareData): Promise<void>;
  trackShare(userId: string, platform: string): Promise<void>;
}

// PointsService.ts
class PointsService {
  awardSocialSharePoints(userId: string): Promise<number>;
  getShareHistory(userId: string): Promise<ShareRecord[]>;
}
```

## Share Templates

### Template 1: Found Person

```
🎉 I just helped find a missing person through Yaat! 

Every small act of seva makes a difference. 
Together we can build a stronger community.

#Seva #Dharma #Community #YaatApp #FoundSomeone
```

### Template 2: Leaderboard Achievement

```
🏆 Made it to the top 10 in Yaat's seva leaderboard!

Grateful for the opportunity to serve our community.
Let's keep spreading kindness together.

#Seva #Leaderboard #Community #YaatApp #Top10
```

### Template 3: Event Participation

```
📅 Just completed a community cleaning event through Yaat!

Small actions, big impact. 
Join me in making our community better.

#Seva #CommunityService #YaatApp #CleaningDrive
```

## Prototype Implementation

### Mock Events for Testing

1. **Cleaning Task Completion**
   - Trigger: User completes a mock cleaning task
   - Show: Share prompt with cleaning achievement template
   - Test: Web Share API and clipboard fallback

2. **Find Member Simulation**
   - Trigger: User "finds" a mock missing person
   - Show: Share prompt with found person template
   - Test: Points awarding and backend integration

### Demo Flow

1. User completes an action
2. Share prompt appears with achievement details
3. User selects sharing method
4. Share content is generated and shared
5. Points are awarded (10 points)
6. Success confirmation is shown
7. User can view updated points in profile

## Success Metrics

- **Share Rate:** % of users who share after achievements
- **Viral Coefficient:** New users acquired through shares
- **Engagement:** Increased app usage after sharing
- **Points Redemption:** Usage of earned social share points
- **Community Growth:** New members joining through social shares

## Future Enhancements

- **Share Streaks:** Bonus points for consecutive days of sharing
- **Referral System:** Extra points for bringing new users
- **Social Challenges:** Community-wide sharing campaigns
- **Platform Analytics:** Track which platforms drive most engagement
- **Custom Templates:** User-generated share templates
- **Share Scheduling:** Allow users to schedule shares for optimal timing

## Risk Mitigation

- **Spam Prevention:** Rate limiting and share validation
- **Content Moderation:** Template approval process
- **Privacy Protection:** User consent for social sharing
- **Platform Compliance:** Adhere to social media platform guidelines
- **Performance Impact:** Lazy loading and caching for share content
