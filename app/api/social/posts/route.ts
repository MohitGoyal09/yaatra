import { NextRequest, NextResponse } from "next/server";

// GET - Fetch social media posts
export async function GET(req: NextRequest) {
  try {
    console.log("API route hit: /api/social/posts");

    // Return mock data for testing to isolate the issue
    const mockPosts = [
      {
        id: "1",
        content:
          "🎉 Just completed my first seva at the local temple! Every small act of seva makes a difference. #Seva #Temple #Community",
        post_type: "seva",
        created_at: new Date().toISOString(),
        hashtags: ["Seva", "Temple", "Community"],
        user: {
          id: "1",
          name: "Priya Sharma",
          totalPunyaPoints: 150,
        },
        _count: {
          likes: 12,
          comments: 3,
          shares: 2,
        },
      },
      {
        id: "2",
        content:
          "🏆 Reached 100 hours of seva service! This milestone means so much to me. Thank you to everyone who has been part of this journey! #Milestone #Seva #Community",
        post_type: "achievement",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        hashtags: ["Milestone", "Seva", "Community"],
        user: {
          id: "2",
          name: "Rajesh Kumar",
          totalPunyaPoints: 200,
        },
        _count: {
          likes: 25,
          comments: 8,
          shares: 5,
        },
      },
    ];

    const { searchParams } = new URL(req.url);
    const postType = searchParams.get("type");

    // Filter by type if specified
    let filteredPosts = mockPosts;
    if (postType && postType !== "all") {
      filteredPosts = mockPosts.filter((post) => post.post_type === postType);
    }

    return NextResponse.json({
      success: true,
      posts: filteredPosts,
      pagination: {
        page: 1,
        limit: 20,
        total: filteredPosts.length,
        totalPages: 1,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST - Create a new social media post
export async function POST(req: NextRequest) {
  try {
    console.log("POST API route hit: /api/social/posts");

    const { content, imageUrl, postType, hashtags, location } =
      await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a mock post for testing
    const newPost = {
      id: Date.now().toString(),
      content: content.trim(),
      image_url: imageUrl,
      post_type: postType || "general",
      hashtags: hashtags || [],
      created_at: new Date().toISOString(),
      user: {
        id: "demo-user",
        name: "Demo User",
        totalPunyaPoints: 100,
      },
      _count: {
        likes: 0,
        comments: 0,
        shares: 0,
      },
    };

    return NextResponse.json({
      success: true,
      post: newPost,
      pointsAwarded: 5,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
