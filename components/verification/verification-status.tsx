'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface VerificationStatusProps {
  userId: string;
}

interface VerificationData {
  isVerified: boolean;
  aadhaarNumber?: string;
}

export function VerificationStatus({ userId }: VerificationStatusProps) {
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const response = await fetch(`/api/verify-aadhaar?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setVerificationData(data);
        }
      } catch (error) {
        console.error('Error fetching verification status:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchVerificationStatus();
    }
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Identity Verification</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isVerified = verificationData?.isVerified ?? false;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Identity Verification</CardTitle>
          </div>
          <Badge variant={isVerified ? "default" : "secondary"} className={isVerified ? "bg-green-500" : ""}>
            {isVerified ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Pending
              </>
            )}
          </Badge>
        </div>
        <CardDescription>
          {isVerified
            ? "Your identity has been verified with Aadhaar"
            : "Complete your identity verification to unlock all features"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isVerified ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Aadhaar: {verificationData?.aadhaarNumber?.replace(/(\d{4})(\d{4})(\d{4})/, '****-****-$3')}
            </p>
            <p className="text-sm text-green-600 font-medium">
              ✓ Enhanced security enabled
            </p>
            <p className="text-sm text-green-600 font-medium">
              ✓ Trust score increased
            </p>
            <p className="text-sm text-green-600 font-medium">
              ✓ 100 Punya Points earned
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              <p>Benefits of verification:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Earn 100 Punya Points</li>
                <li>Increase account security</li>
                <li>Build trust with other users</li>
                <li>Access premium features</li>
              </ul>
            </div>
            <Link href="/verification">
              <Button className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Verify Now
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}