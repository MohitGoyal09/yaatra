# YaatraSarthi - Your Spiritual Journey Companion

> **Transform your pilgrimage to Ujjain into an engaging, eco-friendly, and culturally enriching experience through gamification.**

## 🎯 One-Page Summary

### The Core Problem

Traditional tourism in spiritual destinations like Ujjain often lacks engagement, environmental consciousness, and community connection. Visitors miss opportunities to:

- Contribute meaningfully to the local environment
- Engage deeply with cultural heritage
- Connect with fellow pilgrims and the community
- Track and celebrate their positive impact

### The Solution: YaatraSarthi

YaatraSarthi is a **gamified tourism platform** that transforms your spiritual journey into an interactive, rewarding experience. Through our **Punya Points system**, visitors earn points for eco-friendly actions, cultural engagement, and community service while exploring the sacred city of Ujjain.

### Key Features & Functionalities

#### 🏆 **Punya Points Gamification System**

- **Hygiene & Health Actions** (20-50 points)
  - Smart waste disposal with QR code verification
  - Hygiene issue reporting with AI image recognition
  - Crowdsourced cleaning validation

- **Eco-Friendly Behavior** (15-25 points)
  - Water bottle refilling at designated stations
  - Public transport and e-rickshaw usage
  - Sustainable tourism practices

- **Cultural & Community Engagement** (10-40 points)
  - Attending cultural lectures and performances
  - Helping lost pilgrims via SOS feature
  - Sharing culturally relevant stories and photos

#### 🤖 **AI-Powered Chat Assistant**

- **Multimodal Support**: Text and image input processing
- **Real-time Information**: Web search integration for current data
- **Smart Point Assignment**: Automatic recognition and point awarding
- **Cultural Guidance**: Tourism information, temple details, and itinerary suggestions
- **Image Analysis**: Google Cloud Vision API for hygiene issue verification

#### 📊 **Personal Dashboard**

- **Progress Tracking**: Total points, recent activities, and achievements
- **Visual Analytics**: Donut charts for point distribution
- **Reward System**: Progress towards free goodies and passes
- **Community Impact**: Aggregate metrics and social contribution
- **Mission Suggestions**: Personalized "Your Next Mission" recommendations

#### 🏅 **Leaderboard & Social Features**

- **Competitive Rankings**: Top performers by Punya Points
- **Community Wall**: Featured cultural stories and photos
- **Achievement System**: Badges and milestones recognition
- **Social Proof**: Community impact visualization

#### 🔐 **User Authentication & Management**

- **Clerk Integration**: Secure user authentication
- **Guest Mode**: Anonymous usage with session-based tracking
- **Profile Management**: User preferences and language settings
- **Data Persistence**: Consistent user identity across sessions

#### 🎨 **Modern UI/UX**

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme switching with next-themes
- **Component Library**: Shadcn/ui components for consistency
- **Animations**: Framer Motion for smooth interactions
- **Accessibility**: WCAG compliant design patterns

## 🛠️ Technical Architecture

### **Frontend Stack**

- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Framer Motion** for animations
- **next-themes** for theme management

### **Backend & Database**

- **Prisma ORM** with PostgreSQL
- **Next.js API Routes** for backend logic
- **Clerk** for authentication
- **Google Cloud Vision API** for image analysis

### **AI Integration**

- **Google Generative AI** (Gemini) via AI SDK
- **Multimodal capabilities** for text and image processing
- **Custom tools** for database operations
- **Web search integration** for real-time data

### **Key Components**

```
📁 app/
├── 📁 api/           # Backend API routes
├── 📁 chat/          # AI chat interface
├── 📁 dashboard/     # User dashboard
├── 📁 leaderboard/   # Community rankings
└── 📄 page.tsx       # Landing page

📁 components/
├── 📁 ai-elements/   # Chat UI components
├── 📁 ui/            # Reusable UI components
├── 📁 landing/       # Landing page sections
└── 📁 leaderboard/   # Leaderboard components

📁 lib/
├── database-tool.ts  # Database operations
├── vision-tool.ts    # Image analysis
└── utils.ts          # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Cloud Vision API key
- Clerk authentication setup

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MohitGoyal09/yaatra
   cd yaat
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create `.env.local` with:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/yaat"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   
   # Google AI
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
   
   # Google Cloud Vision
   GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account.json
   ```

4. **Database Setup**

   ```bash
   pnpm db:push
   pnpm db:seed
   ```

5. **Start Development Server**

   ```bash
   pnpm dev
   ```

6. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### For Pilgrims/Tourists

1. **Sign Up/Login** via Clerk authentication
2. **Explore Dashboard** to see your current points and progress
3. **Chat with Sarthi** (AI assistant) for guidance and point reporting
4. **Report Actions** by describing what you did (e.g., "I used an e-rickshaw")
5. **Upload Images** for hygiene issue reporting
6. **Check Leaderboard** to see community rankings
7. **Complete Missions** suggested in your dashboard

### For Administrators

1. **Monitor Community Impact** through dashboard analytics
2. **Manage Point Values** via database seed file
3. **Review Reported Issues** through the chat system
4. **Track User Engagement** via leaderboard and activity logs

## 🎮 Gamification Mechanics

### Point Categories

| Category | Action | Points | Verification |
|----------|--------|--------|--------------|
| **Hygiene** | Smart waste disposal | 20 | QR code scan |
| **Hygiene** | Report hygiene issue | 30 | AI image analysis |
| **Hygiene** | Verify issue resolved | 50 | Crowdsourced validation |
| **Eco-Friendly** | Water refill station | 25 | QR code scan |
| **Eco-Friendly** | Public transport/e-rickshaw | 15 | Geo-fencing/ticket |
| **Cultural** | Attend cultural event | 10 | Location check-in |
| **Community** | Help lost pilgrim | 40 | SOS feature usage |
| **Community** | Share cultural story | 15 | Community wall feature |

### Reward Tiers

- **100 points**: Welcome badge
- **500 points**: Eco-warrior status
- **1000 points**: Cultural ambassador
- **2000 points**: Community leader
- **5000+ points**: Spiritual guide

## 🔧 Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm db:push      # Push database schema changes
pnpm db:seed      # Seed database with initial data
pnpm db:generate  # Generate Prisma client
```

### Project Structure

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Tailwind CSS** for styling
- **Prisma** for database management

## 🌟 Future Enhancements

### Phase 2 Features

- **AR Temple Tours**: Augmented reality temple exploration
- **Local Guide Integration**: Connect with certified local guides
- **Offline Mode**: Functionality without internet connection
- **Multi-language Support**: Hindi, Sanskrit, and regional languages
- **Push Notifications**: Real-time updates and mission alerts

### Phase 3 Vision

- **Blockchain Integration**: NFT rewards and digital certificates
- **IoT Integration**: Smart city infrastructure connectivity
- **Community Marketplace**: Local artisan and vendor platform
- **Advanced Analytics**: Predictive insights and recommendations

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:

- Code style and standards
- Pull request process
- Issue reporting
- Feature requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Ujjain Tourism Board** for cultural insights
- **Local Community** for feedback and testing
- **Open Source Contributors** for amazing tools and libraries
- **Spiritual Leaders** for guidance on respectful tourism

---

**YaatraSarthi** - Making every pilgrimage a meaningful journey. 🕉️✨

*Built with ❤️ for the spiritual community of Ujjain*
