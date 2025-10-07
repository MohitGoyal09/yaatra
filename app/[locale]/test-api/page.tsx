"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async (endpoint: string) => {
    setLoading(true);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setResult({ endpoint, data, status: response.status });
    } catch (error) {
      setResult({ endpoint, error: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const testEndpoints = [
    { name: "Test API", endpoint: "/api/test" },
    { name: "Get Posts", endpoint: "/api/social/posts" },
    { name: "Get Simple Posts", endpoint: "/api/social/posts/simple" },
    { name: "Get Templates", endpoint: "/api/social/templates" },
    { name: "Get Social Shares", endpoint: "/api/social/share" },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {testEndpoints.map((test) => (
            <Button
              key={test.name}
              onClick={() => testApi(test.endpoint)}
              disabled={loading}
              variant="outline"
            >
              {loading ? "Testing..." : test.name}
            </Button>
          ))}
        </div>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>API Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>Endpoint:</strong> {result.endpoint}
                </div>
                <div>
                  <strong>Status:</strong> {result.status}
                </div>
                {result.error ? (
                  <div>
                    <strong>Error:</strong> {result.error}
                  </div>
                ) : (
                  <div>
                    <strong>Response:</strong>
                    <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-sm">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
