import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("🧪 Test API POST /api/test-lost-found called");
  return NextResponse.json({
    success: true,
    message: "Test API is working",
    timestamp: new Date().toISOString(),
  });
}

export async function GET(req: NextRequest) {
  console.log("🧪 Test API GET /api/test-lost-found called");
  return NextResponse.json({
    success: true,
    message: "Test API GET is working",
    timestamp: new Date().toISOString(),
  });
}
