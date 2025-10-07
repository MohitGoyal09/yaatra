"use client";

import React, { useState, useEffect } from "react";
import { SocialFeed } from "@/components/social/social-feed";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, TrendingUp, Users, Award, Hash, Filter } from "lucide-react";

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "all", label: "All Posts", icon: Home },
    { id: "seva", label: "Seva", icon: Users },
    { id: "achievement", label: "Achievements", icon: Award },
    { id: "event", label: "Events", icon: TrendingUp },
  ];

  useEffect(() => {
    loadInitialPosts();
  }, [activeTab]);

  const loadInitialPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/social/posts?page=1&limit=20&type=${activeTab}`
      );
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Yaat Social Feed</h1>
          <p className="text-muted-foreground">
            Connect with the community, share your seva, and celebrate
            achievements together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Filter Tabs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Trending Hashtags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Trending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { tag: "Seva", count: 156 },
                    { tag: "Community", count: 89 },
                    { tag: "Ujjain", count: 67 },
                    { tag: "Dharma", count: 45 },
                    { tag: "Achievement", count: 34 },
                  ].map((item) => (
                    <div
                      key={item.tag}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">#{item.tag}</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Posts</span>
                  <Badge variant="outline">1,234</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Users</span>
                  <Badge variant="outline">567</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Seva Hours</span>
                  <Badge variant="outline">12,345</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Points Earned</span>
                  <Badge variant="outline">98,765</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <SocialFeed initialPosts={posts} postType={activeTab} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
