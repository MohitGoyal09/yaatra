"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialFeed } from '@/components/social/social-feed';

export default function DebugPage() {
  const [showFeed, setShowFeed] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Status & Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This page helps debug the social media API. The error you're seeing 
              ("Unexpected token '<', "<!DOCTYPE "... is not valid JSON") typically 
              means the API is returning an HTML error page instead of JSON.
            </p>
            
            <div className="space-y-2 mb-4">
              <p><strong>Common causes:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>API route not found (404 error) - Most likely cause</li>
                <li>Authentication issues (user not logged in)</li>
                <li>Server error (500 error)</li>
                <li>Middleware blocking the request</li>
                <li>Prisma/database connection issues</li>
              </ul>
            </div>
            
            <div className="space-y-2 mb-4">
              <p><strong>What I've fixed:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>✅ Removed authentication requirements for testing</li>
                <li>✅ Added mock data to avoid database issues</li>
                <li>✅ Added console logging to track API calls</li>
                <li>✅ Created test endpoints for debugging</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <p><strong>Test these endpoints:</strong></p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="/api/health" target="_blank">Health Check</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/api/test" target="_blank">Basic Test</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/api/social/posts" target="_blank">Social Posts</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/test-api" target="_blank">API Test Page</a>
                </Button>
              </div>
            </div>
            
            <div className="mt-4">
              <Button onClick={() => setShowFeed(!showFeed)}>
                {showFeed ? 'Hide' : 'Show'} Social Feed
              </Button>
            </div>
          </CardContent>
        </Card>

        {showFeed && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Social Feed Test</h2>
            <SocialFeed postType="all" />
          </div>
        )}
      </div>
    </div>
  );
}
