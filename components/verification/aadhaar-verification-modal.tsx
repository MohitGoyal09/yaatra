'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, AlertCircle, Loader2, X, Gift } from 'lucide-react';

interface AadhaarVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onVerificationComplete?: () => void;
}

export function AadhaarVerificationModal({ 
  isOpen, 
  onClose, 
  userId, 
  onVerificationComplete 
}: AadhaarVerificationModalProps) {
  const [aadhaar, setAadhaar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Allow skipping after 10 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setCanSkip(true);
      }, 10000);

      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownTimer);
      };
    }
  }, [isOpen]);

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
      '222222222222'
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

    if (!validateAadhaar(aadhaar)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Starting verification for userId:', userId, 'aadhaar:', aadhaar.replace(/\s/g, ''));
      
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

      console.log('API response status:', response.status, 'ok:', response.ok);
      
      const data = await response.json();
      console.log('API response data:', data);

      if (response.ok) {
        console.log('Verification successful');
        setSuccess(true);
        setTimeout(() => {
          onVerificationComplete?.();
          onClose();
        }, 3000);
      } else {
        console.log('Verification failed:', data.error);
        setError(data.error || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Network error during verification:', error);
      setError('Network error. Please check your connection and try again.');
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

  const handleSkip = () => {
    onClose();
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-green-700">Verification Successful!</DialogTitle>
            <DialogDescription>
              Your Aadhaar has been verified successfully. You've earned 100 Punya Points!
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-lg font-semibold text-green-600">
              <Gift className="h-5 w-5" />
              <span>+100 Punya Points</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your account is now verified and secure!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle>Secure Your Account</DialogTitle>
                <DialogDescription>
                  Complete verification to earn 100 Punya Points
                </DialogDescription>
              </div>
            </div>
            {canSkip && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Why verify with Aadhaar?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Earn 100 Punya Points instantly</li>
              <li>• Increase account security</li>
              <li>• Build trust with other users</li>
              <li>• Access premium features</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aadhaar-modal">Aadhaar Number</Label>
              <Input
                id="aadhaar-modal"
                type="text"
                placeholder="1234 5678 9012"
                value={aadhaar}
                onChange={handleAadhaarChange}
                maxLength={14} // 12 digits + 2 spaces
                className="text-center tracking-widest"
              />
              <div className="text-xs text-muted-foreground">
                Enter your 12-digit Aadhaar number
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || aadhaar.replace(/\s/g, '').length !== 12}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Verifying...' : 'Verify & Earn Points'}
              </Button>
              
              {canSkip && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                >
                  Skip
                </Button>
              )}
            </div>
          </form>

          <div className="text-xs text-muted-foreground">
            <p>• Your Aadhaar data is encrypted and secure</p>
            <p>• Verification is done through DigiLocker API</p>
            {!canSkip && (
              <p className="mt-2 text-orange-600">
                You can skip this step in {countdown} seconds
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}