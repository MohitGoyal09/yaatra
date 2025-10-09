// API Debug Middleware for Next.js API routes
import { NextRequest, NextResponse } from "next/server";

export function withDebugLogging<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    const [req] = args;

    // Log incoming request
    console.log(`\n🔥 [API-DEBUG] ${req.method} ${req.url} - START`);
    console.log(
      `📋 [API-DEBUG] Headers:`,
      Object.fromEntries(req.headers.entries())
    );
    console.log(`🌐 [API-DEBUG] URL:`, req.url);
    console.log(`⏰ [API-DEBUG] Timestamp:`, new Date().toISOString());

    const startTime = Date.now();

    try {
      const response = await handler(...args);

      const duration = Date.now() - startTime;
      console.log(
        `✅ [API-DEBUG] ${req.method} ${req.url} - SUCCESS (${duration}ms)`
      );
      console.log(`📊 [API-DEBUG] Response status:`, response.status);
      console.log(
        `📊 [API-DEBUG] Response headers:`,
        Object.fromEntries(response.headers.entries())
      );

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        `💥 [API-DEBUG] ${req.method} ${req.url} - ERROR (${duration}ms)`
      );
      console.error(`💥 [API-DEBUG] Error:`, error);

      throw error;
    }
  };
}

// Example usage:
// export const GET = withDebugLogging(originalGETHandler);
// export const POST = withDebugLogging(originalPOSTHandler);

