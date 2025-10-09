import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  console.log("🧪 Test API POST /api/test-lost-found called");

  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const itemCount = await prisma.lostFoundItem.count();

    return NextResponse.json({
      success: true,
      message: "Test API is working",
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        userCount,
        itemCount,
      },
    });
  } catch (error) {
    console.error("❌ Test API database error:", error);
    return NextResponse.json({
      success: false,
      message: "Test API database error",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      database: {
        connected: false,
      },
    });
  }
}

export async function GET(req: NextRequest) {
  console.log("🧪 Test API GET /api/test-lost-found called");

  try {
    // Test database connection and fetch some sample data
    const users = await prisma.user.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        phone_number: true,
        totalPunyaPoints: true,
      },
    });

    const items = await prisma.lostFoundItem.findMany({
      take: 3,
      select: {
        id: true,
        type: true,
        category: true,
        name: true,
        status: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Test API GET is working",
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        sampleUsers: users,
        sampleItems: items,
      },
    });
  } catch (error) {
    console.error("❌ Test API database error:", error);
    return NextResponse.json({
      success: false,
      message: "Test API database error",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      database: {
        connected: false,
      },
    });
  }
}
