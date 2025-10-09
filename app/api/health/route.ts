import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const healthCheck = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    message: "API routes are working!",
    services: {
      api: "healthy",
      database: "unknown",
    },
  };

  // Check database connectivity
  try {
    if (prisma) {
      // Simple query to test database connection
      await prisma.$queryRaw`SELECT 1`;
      healthCheck.services.database = "healthy";
    } else {
      healthCheck.services.database = "unavailable";
      healthCheck.status = "degraded";
      healthCheck.message = "API routes are working but database is not available";
    }
  } catch (error) {
    healthCheck.services.database = "unhealthy";
    healthCheck.status = "degraded";
    healthCheck.message = "API routes are working but database connection failed";
    console.error("Database health check failed:", error);
  }

  return NextResponse.json(healthCheck, {
    status: healthCheck.status === "healthy" ? 200 : 503,
  });
}
