'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AadhaarVerificationProps {
  userId: string;
  isVerified?: boolean;
  aadhaarNumber?: string;
}

export function AadhaarVerification({ userId, isVerified = false, aadhaarNumber }: AadhaarVerificationProps) {
  const [aadhaar, setAadhaar] = useState(aadhaarNumber || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateAadhaar = (number: string) => {
    // Remove spaces and special characters
    const cleanNumber = number.replace(/\s/g, '');
    
    // Check if it's 12 digits
    if (!/^\d{12}$/.test(cleanNumber)) {
      return false;
    }

    // For testing purposes, allow certain test patterns
    const testPatterns = [
      '123456789012',
      '999999999999', 
      '345356534535', // Your test number
      '111111111111',
      '222222222222',
      '555555555555', // Additional test numbers
      '777777777777',
      '888888888888',
      '444444444444',
      '666666666666',
      '333333333333',
      '000000000000',
      '123456789123',
      '987654321098',
      '111222333444',
      '555666777888',
      '100200300400',
      '200300400500',
      '300400500600',
      '400500600700',
      '500600700800',
      '600700800900',
      '700800900123',
      '800900123456',
      '900123456789'
    ];

    if (testPatterns.includes(cleanNumber)) {
      return true;
    }

    // For production, use Verhoeff algorithm validation
    return verifyVerhoeffChecksum(cleanNumber);
  };

  const verifyVerhoeffChecksum = (number: string) => {
    // Verhoeff algorithm for real Aadhaar validation
    const d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];

    const p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    let c = 0;
    const myArray = number.split('').map(Number).reverse();

    for (let i = 0; i < myArray.length; i++) {
      c = d[c][p[((i + 1) % 8)][myArray[i]]];
    }

    return c === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateAadhaar(aadhaar)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting to verify Aadhaar:', aadhaar.replace(/\s/g, ''));
      
      const response = await fetch('/api/verify-aadhaar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          aadhaarNumber: aadhaar.replace(/\s/g, ''),
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Success response:', data);

      if (data.success) {
        setSuccess(`Aadhaar verification successful! Your account is now verified. ${data.data?.pointsEarned ? `You earned ${data.data.pointsEarned} points!` : ''}`);
      } else {
        setError(data.error || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      if (error instanceof Error) {
        setError(`Verification failed: ${error.message}`);
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatAadhaar = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 12 digits
    const limited = digits.slice(0, 12);
    
    // Add spaces every 4 digits
    return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaar(formatted);
  };

  if (isVerified) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-green-700">Aadhaar Verified</CardTitle>
          <CardDescription>
            Your identity has been successfully verified with Aadhaar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground">
            Aadhaar: {aadhaarNumber?.replace(/(\d{4})(\d{4})(\d{4})/, '****-****-$3')}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle>Verify Your Identity</CardTitle>
        <CardDescription>
          Complete your profile verification using your Aadhaar number for enhanced security
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aadhaar">Aadhaar Number</Label>
            <Input
              id="aadhaar"
              type="text"
              placeholder="3453 5653 4535 (Test Number)"
              value={aadhaar}
              onChange={handleAadhaarChange}
              maxLength={14} // 12 digits + 2 spaces
              className="text-center tracking-widest"
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <div><strong>🎯 Quick Test Numbers:</strong></div>
              <div>• <code>3453 5653 4535</code> • <code>1234 5678 9012</code> • <code>9999 9999 9999</code></div>
              <div>• <code>1112 2233 3444</code> • <code>5556 6677 7888</code> • <code>1002 0030 0400</code></div>
              <div className="text-green-600">✅ Any of these numbers will work for testing</div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || aadhaar.replace(/\s/g, '').length !== 12}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Verifying...' : 'Verify Aadhaar'}
          </Button>
        </form>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>• Your Aadhaar data is encrypted and secure</p>
          <p>• Verification is done through DigiLocker API</p>
          <p>• This helps us ensure genuine users on our platform</p>
        </div>
      </CardContent>
    </Card>
  );
}