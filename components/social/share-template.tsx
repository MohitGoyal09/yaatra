"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ShareTemplateProps {
  type: 'found_person' | 'leaderboard' | 'event' | 'task' | 'donation' | 'milestone';
  userName?: string;
  hours?: string;
}

export function ShareTemplate({ type, userName = 'Friend', hours = '100' }: ShareTemplateProps) {
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/social/templates?type=${type}&userName=${userName}&hours=${hours}`);
        const data = await response.json();
        if (data.success) {
          setTemplate(data.template);
        }
      } catch (error) {
        console.error('Error fetching template:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [type, userName, hours]);

  if (loading) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!template) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Preview not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed bg-gray-50">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Preview
            </Badge>
            <h4 className="font-semibold text-sm">{template.title}</h4>
          </div>
          
          {/* Content */}
          <div className="text-sm whitespace-pre-line leading-relaxed">
            {template.content}
          </div>
          
          {/* Hashtags */}
          <div className="flex flex-wrap gap-1">
            {template.hashtags.map((hashtag: string, index: number) => (
              <span key={index} className="text-xs text-blue-600 font-medium">
                {hashtag}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
