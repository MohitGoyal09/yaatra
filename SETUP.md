# Ujjain Yaat - Gamified Tourist System Setup

## Overview
This is a gamified system for tourists visiting Ujjain, India. The AI agent awards "Punya Points" based on tourist actions and updates the database accordingly.

## Features
- 🤖 AI-powered tourist guide using Google Gemini
- 🎯 Point-based gamification system
- 🏛️ Temple and cultural site tracking
- 📱 Modern chat interface
- 📊 Real-time point tracking

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory with:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/yaat_db"

# Google AI API Key
GOOGLE_GENERATIVE_AI_API_KEY="your_google_ai_api_key_here"
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed the database with tourist actions
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Access the Application
- Main page: http://localhost:3000
- Chat interface: http://localhost:3000/chat

## Getting Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env.local` file

## Database Schema

### User Model
- `id`: Unique user identifier
- `phone_number`: User's phone number (unique)
- `name`: User's name
- `language_preference`: Preferred language
- `totalPunyaPoints`: Total points earned

### Action Model
- `id`: Unique action identifier
- `action_name`: Name of the action (e.g., "visit_mahakaleshwar_temple")
- `point_value`: Points awarded for this action

### UserAction Model
- `id`: Unique record identifier
- `userId`: Reference to user
- `actionId`: Reference to action
- `timestamp`: When the action was performed
- `location_geopoint`: GPS coordinates (optional)
- `status`: Verification status
- `image_url`: Photo evidence (optional)

## Point System

### High-Value Actions (50+ points)
- Visit Mahakaleshwar Temple (100 points)
- Attend Kumbh Mela (150 points)
- Complete temple circuit (200 points)
- Visit all Jyotirlingas (500 points)

### Medium-Value Actions (20-49 points)
- Visit other major temples (25-80 points)
- Perform rituals (15-50 points)
- Take photos (15-30 points)
- Learn about history (20-30 points)

### Low-Value Actions (10-19 points)
- Explore old city (25 points)
- Try local food (15 points)
- Visit markets (10 points)

## Usage

1. **Start a conversation**: Visit `/chat` and begin chatting with the AI guide
2. **Share experiences**: Tell the AI about places you've visited or activities you've done
3. **Earn points**: The AI will automatically award points based on your actions
4. **Check progress**: Ask "What's my current point total?" to see your progress
5. **Get recommendations**: Ask for suggestions on places to visit or activities to do

## Example Interactions

- "I visited Mahakaleshwar Temple today!" → Awards 100 points
- "I took photos at the temple" → Awards 20 points
- "What's my current point total?" → Shows total points
- "What places should I visit in Ujjain?" → Provides recommendations

## Development

### Adding New Actions
1. Add the action to `prisma/seed.ts`
2. Run `npm run db:seed` to update the database
3. The AI will automatically recognize and award points for the new action

### Customizing the AI
Edit the system prompt in `app/api/chat/route.ts` to modify the AI's behavior and knowledge about Ujjain.

## Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Google Gemini via Vercel AI SDK
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel (recommended)
