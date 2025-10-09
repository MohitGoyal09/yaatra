import { AadhaarVerification } from '@/components/verification/aadhaar-verification';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function VerificationPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get user data from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      isAadhaarVerified: true,
      aadhaarNumber: true,
      name: true,
    },
  });

  if (!user) {
    // Create user if not exists
    await prisma.user.create({
      data: {
        id: userId,
        phone_number: '', // You might want to get this from Clerk
        name: '',
      },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Identity Verification</h1>
          <p className="text-gray-600">
            Secure your account and earn trust points by verifying your identity
          </p>
        </div>
        
        <AadhaarVerification
          userId={userId}
          isVerified={user?.isAadhaarVerified || false}
          aadhaarNumber={user?.aadhaarNumber || undefined}
        />
        
        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}