'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function usePostSignupVerification() {
  const { user, isLoaded } = useUser();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [hasCheckedUser, setHasCheckedUser] = useState(false);

  useEffect(() => {
    if (isLoaded && user && !hasCheckedUser) {
      setHasCheckedUser(true);
      
      console.log('Checking user for verification modal:', user.id);
      console.log('User created at:', user.createdAt);
      
      // Check if this is a new user (created within last 30 minutes for testing)
      const createdAt = user.createdAt;
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
      
      const isNewUser = createdAt && new Date(createdAt) > thirtyMinutesAgo;
      
      console.log('Is new user?', isNewUser);
      
      // For testing, let's also check all users (remove this condition in production)
      if (isNewUser || true) { // Remove "|| true" in production
        console.log('Checking verification status...');
        checkVerificationStatus(user.id);
      }
    }
  }, [isLoaded, user, hasCheckedUser]);

  const checkVerificationStatus = async (userId: string) => {
    try {
      console.log('Fetching verification status for user:', userId);
      const response = await fetch(`/api/verify-aadhaar?userId=${userId}`);
      console.log('Verification status response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Verification data:', data);
        
        if (!data.isVerified) {
          console.log('User not verified, showing modal in 2 seconds...');
          // Show modal after a small delay to ensure UI is ready
          setTimeout(() => {
            console.log('Showing verification modal');
            setShowVerificationModal(true);
          }, 2000);
        } else {
          console.log('User already verified, not showing modal');
        }
      } else {
        console.log('API response not ok, showing modal anyway...');
        // Show modal anyway for new users
        setTimeout(() => {
          setShowVerificationModal(true);
        }, 2000);
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      // Show modal anyway for new users
      setTimeout(() => {
        console.log('Error occurred, showing modal anyway');
        setShowVerificationModal(true);
      }, 2000);
    }
  };

  const hideVerificationModal = () => {
    console.log('Hiding verification modal');
    setShowVerificationModal(false);
  };

  return {
    showVerificationModal,
    hideVerificationModal,
    userId: user?.id,
  };
}