'use client';

import { AadhaarVerificationModal } from '@/components/verification/aadhaar-verification-modal';
import { usePostSignupVerification } from '@/lib/hooks/use-post-signup-verification';

interface PostSignupVerificationProviderProps {
  children: React.ReactNode;
}

export function PostSignupVerificationProvider({ children }: PostSignupVerificationProviderProps) {
  const { showVerificationModal, hideVerificationModal, userId } = usePostSignupVerification();

  console.log('PostSignupVerificationProvider render:', {
    showVerificationModal,
    userId,
  });

  return (
    <>
      {children}
      {showVerificationModal && userId && (
        <AadhaarVerificationModal
          isOpen={showVerificationModal}
          onClose={hideVerificationModal}
          userId={userId}
          onVerificationComplete={() => {
            console.log('Verification completed, reloading page...');
            // Optionally refresh the page or update UI
            window.location.reload();
          }}
        />
      )}
    </>
  );
}