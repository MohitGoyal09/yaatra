"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Image, Hash, MapPin, Send, X, Camera, Smile } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface PostCreationProps {
  onPostCreated: (post: any) => void;
}

export function PostCreation({ onPostCreated }: PostCreationProps) {
  const { user } = useUser();

  // For testing without authentication
  const displayUser = user || { fullName: "Demo User" };
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [postType, setPostType] = useState("general");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const postTypes = [
    { id: "general", label: "General", color: "bg-gray-500" },
    { id: "seva", label: "Seva", color: "bg-green-500" },
    { id: "achievement", label: "Achievement", color: "bg-yellow-500" },
    { id: "event", label: "Event", color: "bg-blue-500" },
  ];

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    // Extract hashtags
    const hashtagMatches = value.match(/#\w+/g);
    if (hashtagMatches) {
      setHashtags(hashtagMatches.map((tag) => tag.substring(1)));
    } else {
      setHashtags([]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/social/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          imageUrl,
          postType,
          hashtags,
          location: { lat: 23.1765, lng: 75.7849 }, // Ujjain coordinates
        }),
      });

      const data = await response.json();

      if (data.success) {
        onPostCreated(data.post);
        // Reset form
        setContent("");
        setImageUrl(null);
        setPostType("general");
        setHashtags([]);
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      } else {
        console.error("Failed to create post:", data.error);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const characterCount = content.length;
  const maxCharacters = 500;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Share Your Seva</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {displayUser?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {displayUser?.fullName || "Anonymous"}
              </p>
              <p className="text-sm text-muted-foreground">
                Share your seva with the community
              </p>
            </div>
          </div>

          {/* Post Type Selection */}
          <div className="flex flex-wrap gap-2">
            {postTypes.map((type) => (
              <Button
                key={type.id}
                type="button"
                variant={postType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setPostType(type.id)}
                className={`${postType === type.id ? type.color : ""}`}
              >
                {type.label}
              </Button>
            ))}
          </div>

          {/* Content Input */}
          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              placeholder="What's on your mind? Share your seva, achievements, or thoughts..."
              value={content}
              onChange={handleContentChange}
              className="min-h-[100px] resize-none"
              maxLength={maxCharacters}
            />
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Use #hashtags to categorize your post</span>
              <span
                className={
                  characterCount > maxCharacters * 0.9 ? "text-orange-500" : ""
                }
              >
                {characterCount}/{maxCharacters}
              </span>
            </div>
          </div>

          {/* Hashtags Preview */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-sm text-muted-foreground">Hashtags:</span>
              {hashtags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Image Preview */}
          {imageUrl && (
            <div className="relative">
              <img
                src={imageUrl}
                alt="Post preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-4 w-4 mr-2" />
                Photo
              </Button>

              <Button type="button" variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </Button>

              <Button type="button" variant="outline" size="sm">
                <Smile className="h-4 w-4 mr-2" />
                Feeling
              </Button>
            </div>

            <Button
              type="submit"
              disabled={
                !content.trim() || isCreating || characterCount > maxCharacters
              }
              className="flex items-center gap-2"
            >
              {isCreating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isCreating ? "Posting..." : "Post"}
            </Button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            aria-label="Upload image"
          />
        </form>
      </CardContent>
    </Card>
  );
}
