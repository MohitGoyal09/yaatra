import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// POST - Like or unlike a post
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // For now, allow unauthenticated access for testing
    // const { userId } = await auth();
    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // For testing, use demo user
    const appUser = await prisma.user.findFirst({
      where: { phone_number: "demo@yaat.com" },
    });

    if (!appUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if post exists
    const post = await prisma.socialPost.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user already liked the post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: appUser.id,
        },
      },
    });

    let action: "liked" | "unliked";
    let pointsAwarded = 0;

    if (existingLike) {
      // Unlike the post
      await prisma.postLike.delete({
        where: {
          postId_userId: {
            postId: id,
            userId: appUser.id,
          },
        },
      });
      action = "unliked";
    } else {
      // Like the post
      await prisma.postLike.create({
        data: {
          postId: id,
          userId: appUser.id,
        },
      });
      action = "liked";

      // Award points for liking (only if not liking your own post)
      if (post.userId !== appUser.id) {
        const LIKE_POINTS = 1;
        await prisma.user.update({
          where: { id: appUser.id },
          data: {
            totalPunyaPoints: {
              increment: LIKE_POINTS,
            },
          },
        });
        pointsAwarded = LIKE_POINTS;
      }
    }

    // Get updated like count
    const likeCount = await prisma.postLike.count({
      where: { postId: id },
    });

    return NextResponse.json({
      success: true,
      action,
      likeCount,
      pointsAwarded,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
