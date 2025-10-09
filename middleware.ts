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
    console.log(
      "✅ [MIDDLEWARE] Allowing chat API without auth:",
      req.nextUrl.pathname
    );
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
