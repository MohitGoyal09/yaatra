import { TestVerificationModal } from '@/components/verification/test-verification-modal';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Test Aadhaar Verification</h1>
        <p className="text-gray-600 mb-6 text-center">
          Click the button below to test the Aadhaar verification modal
        </p>
        <TestVerificationModal />
        
        <div className="mt-8 text-sm text-gray-500">
          <p><strong>Test Instructions:</strong></p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Click "Test Verification Modal"</li>
            <li>Enter a test Aadhaar number (e.g. 123456789012)</li>
            <li>Click "Verify & Earn Points"</li>
            <li>Check console for debugging info</li>
          </ol>
        </div>
      </div>
    </div>
  );
}