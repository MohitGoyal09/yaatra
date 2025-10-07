"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  MapPin,
  Hash,
  Clock,
  RefreshCw,
} from "lucide-react";
import { PostCreation } from "./post-creation";
import { PostComments } from "./post-comments";
import { formatDistanceToNow } from "@/lib/date-utils";
import { useRealtimePosts } from "@/lib/hooks/use-realtime-posts";

interface Post {
  id: string;
  content: string;
  image_url?: string;
  post_type: string;
  created_at: string;
  hashtags: string[];
  location?: string;
  user: {
    id: string;
    name: string;
    totalPunyaPoints: number;
  };
  likes: Array<{
    id: string;
    user: {
      id: string;
      name: string;
    };
  }>;
  comments: Array<{
    id: string;
    content: string;
    created_at: string;
    user: {
      id: string;
      name: string;
    };
  }>;
  shares: Array<{
    id: string;
    platform: string;
    user: {
      id: string;
      name: string;
    };
  }>;
  _count: {
    likes: number;
    comments: number;
    shares: number;
  };
}

interface SocialFeedProps {
  initialPosts?: Post[];
  postType?: string;
}

export function SocialFeed({
  initialPosts = [],
  postType = "all",
}: SocialFeedProps) {
  const { posts, loading, error, refreshPosts, addNewPost, updatePost } =
    useRealtimePosts(postType);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const observerRef = useRef<IntersectionObserver>(null);

  const handleRefreshPosts = async () => {
    setRefreshing(true);
    await refreshPosts();
    setRefreshing(false);
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/like`, {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        updatePost(postId, {
          _count: {
            likes: data.likeCount,
            comments: posts.find((p) => p.id === postId)?._count.comments || 0,
            shares: posts.find((p) => p.id === postId)?._count.shares || 0,
          },
        });

        // Update liked posts set
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          if (data.action === "liked") {
            newSet.add(postId);
          } else {
            newSet.delete(postId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleNewPost = (newPost: Post) => {
    addNewPost(newPost);
  };

  const toggleComments = (postId: string) => {
    setShowComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "achievement":
        return "bg-yellow-500";
      case "seva":
        return "bg-green-500";
      case "event":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case "achievement":
        return "Achievement";
      case "seva":
        return "Seva";
      case "event":
        return "Event";
      default:
        return "General";
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Post Creation */}
      <PostCreation onPostCreated={handleNewPost} />

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshPosts}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh Feed
        </Button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {post.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {post.user.name || "Anonymous"}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {post.user.totalPunyaPoints} pts
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                      })}
                      {/* Removed post.location check because 'location' does not exist on type 'Post' */}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getPostTypeColor(
                      post.post_type
                    )} text-white`}
                  >
                    {getPostTypeLabel(post.post_type)}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Post Content */}
              <div className="space-y-2">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Hashtags */}
                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.hashtags.map((hashtag, index) => (
                      <span
                        key={index}
                        className="text-blue-600 text-sm font-medium"
                      >
                        #{hashtag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Image */}
                {post.image_url && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={post.image_url}
                      alt="Post image"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Post Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{post._count.likes} likes</span>
                <span>{post._count.comments} comments</span>
                <span>{post._count.shares} shares</span>
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 ${
                    likedPosts.has(post.id) ? "text-red-500" : ""
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      likedPosts.has(post.id) ? "fill-current" : ""
                    }`}
                  />
                  Like
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Comment
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              {/* Comments Section */}
              {showComments.has(post.id) && <PostComments postId={post.id} />}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-4 text-red-500">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Empty State */}
      {posts.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No posts yet. Be the first to share something!</p>
        </div>
      )}
    </div>
  );
}
