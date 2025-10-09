'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AadhaarVerificationModal } from '@/components/verification/aadhaar-verification-modal';
import { useUser } from '@clerk/nextjs';
import { Shield } from 'lucide-react';

export function TestVerificationModal() {
  const [showModal, setShowModal] = useState(false);
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="p-4">
      <Button onClick={() => setShowModal(true)} className="gap-2">
        <Shield className="h-4 w-4" />
        Test Verification Modal
      </Button>
      
      <AadhaarVerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userId={user.id}
        onVerificationComplete={() => {
          console.log('Verification completed!');
          setShowModal(false);
        }}
      />
    </div>
  );
}