import { clerkMiddleware } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "hi", "gu", "mr"],
  defaultLocale: "hi", // Hindi as primary for Simhastha
  localeDetection: true,
  pathnames: {
    "/": "/",
    "/chat": "/chat",
    "/leaderboard": "/leaderboard",
    "/map": "/map",
    "/dashboard": "/dashboard",
  },
});

export default clerkMiddleware((auth, req) => {
  // Apply Clerk auth to API routes (except SSE endpoints)
  if (
    req.nextUrl.pathname.startsWith("/api/") &&
    !req.nextUrl.pathname.startsWith("/api/map-updates")
  ) {
    auth.protect();
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
     * - Any path containing a dot (e.g., .mp4, .png, .svg). This is the key fix.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
