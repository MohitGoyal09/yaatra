import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    message: "API routes are working!",
  });
}
