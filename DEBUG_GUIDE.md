# Lost-Found API Debugging Guide

## 🔍 Debugging Features Added

I've added comprehensive debugging statements throughout the lost-found API system to help you identify and resolve issues.

### 📱 Frontend Debugging (`app/[locale]/lost-found/page.tsx`)

#### API Call Debugging

- **Load Items**: Logs search filters, request URL, response status, and parsed data
- **Form Submission**: Logs form data, user authentication status, request body, and response details
- **Delete Items**: Logs item ID, user authentication, request details, and response data

#### Debug Output Examples

```javascript
// Load items debugging
🔄 [DEBUG] loadItems() started
🔍 [DEBUG] Current search filters: {search: "", type: "all", category: "all", location: ""}
🌐 [DEBUG] Making GET request to: /api/lost-found?type=lost
📋 [DEBUG] Request params: {type: "lost"}
📥 [DEBUG] Response received:
  - Status: 200 OK
  - Headers: {content-type: "application/json", ...}
  - OK: true
  - URL: http://localhost:3000/api/lost-found?type=lost
📊 [DEBUG] Parsed JSON response: {success: true, items: [...], pagination: {...}}
✅ [DEBUG] Success - Setting items: 5 items
🏁 [DEBUG] loadItems() finished

// Form submission debugging
🚀 [DEBUG] Form submission started
📝 [DEBUG] Form data received: {type: "lost", category: "item", ...}
📤 [DEBUG] Request body being sent: {type: "lost", category: "item", ...}
🌐 [DEBUG] Making POST API call to: /api/lost-found
🔑 [DEBUG] User authentication status: Authenticated
👤 [DEBUG] User ID: user_123456789
📥 [DEBUG] Response received:
  - Status: 200 OK
  - Headers: {content-type: "application/json", ...}
📊 [DEBUG] Parsed JSON response: {success: true, item: {...}, pointsAwarded: 10}
✅ [DEBUG] Item created successfully: {id: "item_123", ...}
🎯 [DEBUG] Points awarded: 10
🏁 [DEBUG] Form submission finished
```

### 🔧 Backend Debugging

#### Main API Route (`app/api/lost-found/route.ts`)

##### GET Method Debugging

```javascript
🔥 [DEBUG] API GET /api/lost-found called
🌐 [DEBUG] Request URL: http://localhost:3000/api/lost-found?type=lost
📋 [DEBUG] Request headers: {accept: "application/json", ...}
✅ [DEBUG] Prisma client is available
🔍 [DEBUG] Query parameters: {page: 1, limit: 20, type: "lost", ...}
🔍 [DEBUG] All search params: {type: "lost", category: "item"}
🔍 [DEBUG] Final where clause: {"status": {"in": ["pending", "active"]}, "type": "lost"}
🔍 [DEBUG] Starting database queries...
⏱️ [DEBUG] Query timeout set to 10 seconds
✅ [DEBUG] Database queries completed successfully
📊 [DEBUG] Query results: {itemsCount: 5, totalCount: 5, page: 1, limit: 20, totalPages: 1}
📤 [DEBUG] Sending response: {"success": true, "items": [...], ...}
```

##### POST Method Debugging

```javascript
🔥 [DEBUG] API POST /api/lost-found called
🌐 [DEBUG] Request URL: http://localhost:3000/api/lost-found
📋 [DEBUG] Request headers: {content-type: "application/json", ...}
✅ [DEBUG] Prisma client is available
👤 [DEBUG] User ID from auth: user_123456789
📨 [DEBUG] Request body received: {type: "lost", category: "item", ...}
📨 [DEBUG] Request body keys: ["type", "category", "name", "description", ...]
```

#### Dynamic Route (`app/api/lost-found/[id]/route.ts`)

##### DELETE Method Debugging

```javascript
🔥 [DEBUG] API DELETE /api/lost-found/[id] called
🌐 [DEBUG] Request URL: http://localhost:3000/api/lost-found/item_123
📋 [DEBUG] Request headers: {authorization: "Bearer ...", ...}
📋 [DEBUG] Item ID: item_123
👤 [DEBUG] User ID from auth: user_123456789
```

### 🛠️ Debug Utilities (`lib/debug-utils.ts`)

I've created utility functions for consistent debugging:

```typescript
import { 
  logApiCall, 
  logApiResponse, 
  logApiError, 
  logUserAuth,
  logEnvironmentCheck,
  logResponseData 
} from '@/lib/debug-utils';

// Usage examples
logApiCall('GET', '/api/lost-found', { type: 'lost' });
logUserAuth(userId);
logEnvironmentCheck();
logResponseData(responseData, 'API Response');
```

### 📊 Health Check Enhanced (`app/api/health/route.ts`)

The health check now includes database connectivity testing:

```javascript
GET /api/health
{
  "status": "healthy",
  "timestamp": "2025-01-27T10:30:00.000Z",
  "message": "API routes are working!",
  "services": {
    "api": "healthy",
    "database": "healthy"
  }
}
```

## 🚨 Common Issues and Debugging Steps

### 1. JSON Parsing Error: "Unexpected token '<'"

**Symptoms**: Frontend shows error about invalid JSON
**Debug Steps**:

1. Check browser console for detailed error logs
2. Look for `📥 [DEBUG] Response received:` logs
3. Check if response status is 200 and content-type is `application/json`
4. If status is not 200, check for HTML error pages

### 2. Database Connection Issues

**Symptoms**: API returns 503 status or "Database not available"
**Debug Steps**:

1. Check `🔧 [DEBUG] DATABASE_URL exists:` in logs
2. Verify `.env.local` file exists with correct DATABASE_URL
3. Run `npm run db:push` to ensure database schema is up to date
4. Check health endpoint: `GET /api/health`

### 3. Authentication Issues

**Symptoms**: API returns 401 Unauthorized
**Debug Steps**:

1. Check `👤 [DEBUG] User ID from auth:` in logs
2. Verify user is signed in to Clerk
3. Check if Clerk environment variables are set

### 4. Missing API Routes

**Symptoms**: 404 errors or HTML responses
**Debug Steps**:

1. Check browser network tab for actual response
2. Verify API route files exist in correct locations
3. Check Next.js server logs for route registration

## 🔍 How to Use the Debugging

### 1. Open Browser Developer Tools

- Press F12 or right-click → Inspect
- Go to Console tab

### 2. Monitor API Calls

- Look for `[DEBUG]` prefixed messages
- Check both frontend and backend logs

### 3. Check Network Tab

- Go to Network tab in DevTools
- Make API calls and check response details
- Look for non-200 status codes

### 4. Check Server Logs

- If running locally: Check terminal where `npm run dev` is running
- Look for `[DEBUG]` messages from API routes

## 🎯 Quick Debugging Checklist

- [ ] Check browser console for `[DEBUG]` messages
- [ ] Verify API response status codes (should be 200)
- [ ] Check response content-type (should be `application/json`)
- [ ] Verify user authentication status
- [ ] Check database connection via `/api/health`
- [ ] Verify environment variables are set
- [ ] Check if API routes exist in correct file structure

## 📝 Environment Variables Required

Make sure these are set in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/yaat_db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

# Google AI (optional for lost-found)
GOOGLE_GENERATIVE_AI_API_KEY="your_google_ai_api_key"
```

The debugging statements will help you identify exactly where issues occur and provide detailed information about the API request/response cycle.

## 🔧 Chat API Debugging (`app/api/chat/route.ts`)

### Debug Features Added

- **Request logging** with URL, headers, and method
- **Authentication status** tracking (guest vs authenticated users)
- **User identity** resolution and database upsert logging
- **AI model initialization** tracking
- **Request data parsing** and validation logging
- **Error handling** with detailed error information

### Debug Output Examples

```javascript
🔥 [DEBUG] Chat API POST /api/chat called
🌐 [DEBUG] Request URL: http://localhost:3000/api/chat
📋 [DEBUG] Request headers: {content-type: "application/json", ...}
🔐 [DEBUG] Attempting authentication...
✅ [DEBUG] Authentication successful: {authUserId: "user_123", clerkName: "John Doe"}
🔑 [DEBUG] Identity key: user@example.com
👤 [DEBUG] Upserting user with identity: user@example.com
✅ [DEBUG] User upserted with ID: db_user_456
📨 [DEBUG] Parsing request body...
📊 [DEBUG] Request data: {messagesCount: 1, model: "google/gemini-2.5-flash", webSearch: false, requestUserId: null}
🤖 [DEBUG] Initializing AI model...
🤖 [DEBUG] Selected model: google/gemini-2.5-flash (fallback)
✅ [DEBUG] AI model initialized, returning stream response
```

## 🛡️ Middleware Configuration Fix

### Issue: Chat API 404 Error

**Problem**: The middleware was applying Clerk authentication to all API routes AND the internationalization middleware was adding locale prefixes to API routes, causing the chat API to return 404 errors.

**Solutions**:

1. Updated `middleware.ts` to exclude public endpoints from authentication
2. Updated the middleware matcher to exclude API routes from internationalization

```typescript
export default clerkMiddleware((auth, req) => {
  console.log("🔍 [MIDDLEWARE] Processing request:", req.nextUrl.pathname);
  
  // Apply Clerk auth to API routes (except public endpoints)
  if (
    req.nextUrl.pathname.startsWith("/api/") &&
    !req.nextUrl.pathname.startsWith("/api/map-updates") &&
    !req.nextUrl.pathname.startsWith("/api/chat") &&
    !req.nextUrl.pathname.startsWith("/api/health") &&
    !req.nextUrl.pathname.startsWith("/api/test")
  ) {
    console.log("🔐 [MIDDLEWARE] Protecting API route:", req.nextUrl.pathname);
    auth.protect();
  } else if (req.nextUrl.pathname.startsWith("/api/chat")) {
    console.log("✅ [MIDDLEWARE] Allowing chat API without auth:", req.nextUrl.pathname);
  }
  
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes should not be internationalized)
     * - Any path containing a dot (e.g., .mp4, .png, .svg)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).*)",
  ],
};
```

### Public API Endpoints (No Authentication Required)

- `/api/chat` - Chat API for guest and authenticated users
- `/api/health` - Health check endpoint
- `/api/test` - Test endpoint
- `/api/map-updates` - Server-sent events for map updates

### Protected API Endpoints (Authentication Required)

- `/api/lost-found/*` - Lost and found functionality
- `/api/crime-reports/*` - Crime reporting
- `/api/admin/*` - Admin functionality
- `/api/social/*` - Social features
- All other API routes
