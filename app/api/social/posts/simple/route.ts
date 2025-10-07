import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Return mock data for testing
    const mockPosts = [
      {
        id: "1",
        content: "This is a test post! 🎉",
        post_type: "general",
        created_at: new Date().toISOString(),
        hashtags: ["test", "social"],
        user: {
          id: "1",
          name: "Test User",
          totalPunyaPoints: 100,
        },
        _count: {
          likes: 5,
          comments: 2,
          shares: 1,
        },
      },
    ];

    return NextResponse.json({
      success: true,
      posts: mockPosts,
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    });
  } catch (error) {
    console.error("Error in simple posts API:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
