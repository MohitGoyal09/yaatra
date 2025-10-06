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
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/dashboard",
  ],
};
