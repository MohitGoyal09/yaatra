"use client";

import { useState, useEffect, useCallback } from "react";

interface Post {
  id: string;
  content: string;
  image_url?: string;
  post_type: string;
  created_at: string;
  hashtags: string[];
  user: {
    id: string;
    name: string;
    totalPunyaPoints: number;
  };
  _count: {
    likes: number;
    comments: number;
    shares: number;
  };
}

interface UseRealtimePostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  addNewPost: (post: Post) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
}

export function useRealtimePosts(
  postType: string = "all",
  pollInterval: number = 30000 // 30 seconds
): UseRealtimePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(
        `/api/social/posts?page=1&limit=50&type=${postType}`
      );

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        setError(
          `Server returned HTML instead of JSON. Status: ${response.status}`
        );
        return;
      }

      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
        setLastUpdate(new Date());
      } else {
        setError(data.error || "Failed to fetch posts");
      }
    } catch (err) {
      setError("Network error while fetching posts");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, [postType]);

  const refreshPosts = useCallback(async () => {
    setLoading(true);
    await fetchPosts();
  }, [fetchPosts]);

  const addNewPost = useCallback((post: Post) => {
    setPosts((prev) => {
      // Check if post already exists to prevent duplicates
      const exists = prev.some((p) => p.id === post.id);
      if (exists) {
        return prev;
      }
      return [post, ...prev];
    });
  }, []);

  const updatePost = useCallback((postId: string, updates: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, ...updates } : post))
    );
  }, []);

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Set up polling for real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/social/posts?page=1&limit=50&type=${postType}&since=${lastUpdate.toISOString()}`
        );
        const data = await response.json();

        if (data.success && data.posts.length > 0) {
          // Only add new posts that are newer than our last update
          const newPosts = data.posts.filter(
            (post: Post) => new Date(post.created_at) > lastUpdate
          );

          if (newPosts.length > 0) {
            setPosts((prev) => {
              // Filter out any posts that already exist to prevent duplicates
              const existingIds = new Set(prev.map((post: Post) => post.id));
              const uniqueNewPosts = newPosts.filter(
                (post: Post) => !existingIds.has(post.id)
              );

              if (uniqueNewPosts.length > 0) {
                return [...uniqueNewPosts, ...prev];
              }
              return prev;
            });
            setLastUpdate(new Date());
          }
        }
      } catch (err) {
        console.error("Error polling for new posts:", err);
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [postType, lastUpdate, pollInterval]);

  return {
    posts,
    loading,
    error,
    refreshPosts,
    addNewPost,
    updatePost,
  };
}
