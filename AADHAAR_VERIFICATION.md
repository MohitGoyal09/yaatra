# Aadhaar Verification System

This document explains the Aadhaar verification system implementation using DigiLocker API for double verification of users.

## Overview

The system provides:

- Double verification using Aadhaar number and DigiLocker API
- Secure storage of Aadhaar numbers (encrypted)
- Points reward system for verification completion
- User verification status tracking

## Components

### 1. Database Schema

- Added `aadhaarNumber` (String, unique, optional) to User model
- Added `isAadhaarVerified` (Boolean, default: false) to User model

### 2. Frontend Components

#### AadhaarVerification Component

Location: `components/verification/aadhaar-verification.tsx`

- Collects and validates Aadhaar number from user
- Formats input with proper spacing (XXXX XXXX XXXX)
- Validates using Verhoeff checksum algorithm
- Displays verification status and progress

#### VerificationStatus Component

Location: `components/verification/verification-status.tsx`

- Shows current verification status in dashboard
- Displays benefits of verification
- Provides link to verification page

### 3. API Endpoints

#### POST /api/verify-aadhaar

- Validates Aadhaar number format and checksum
- Calls DigiLocker API for verification
- Updates user record with verification status
- Awards points for successful verification

#### GET /api/verify-aadhaar

- Returns current verification status for a user
- Used by frontend components to display status

### 4. Pages

#### /verification

Location: `app/[locale]/verification/page.tsx`

- Dedicated verification page
- Displays verification form or success status
- Handles authentication and user management

## Setup Instructions

### 1. Environment Variables

Add to your `.env` file:

```env
DIGILOCKER_CLIENT_ID=your_digilocker_client_id_here
DIGILOCKER_CLIENT_SECRET=your_digilocker_client_secret_here
```

### 2. DigiLocker API Setup

1. Register on DigiLocker Developer Portal
2. Create an application
3. Get Client ID and Client Secret
4. Configure OAuth2 settings

### 3. Database Migration

```bash
npx prisma migrate dev --name add-aadhaar-verification
```

### 4. Seed Database

```bash
npm run db:seed
```

## Security Features

### 1. Aadhaar Number Validation

- Format validation (12 digits)
- Verhoeff checksum algorithm validation
- Uniqueness constraint in database

### 2. API Security

- User authentication required
- Input sanitization
- Rate limiting (recommended)
- Error handling without exposing sensitive data

### 3. Data Protection

- Aadhaar numbers stored with unique constraint
- No duplicate registrations allowed
- Secure API communication with DigiLocker

## DigiLocker Integration

### Authentication Flow

1. Get access token using client credentials
2. Call verification API with Aadhaar number
3. Process response and update user status

### API Endpoints Used

- `POST /oauth2/1/token` - Get access token
- `POST /aadhaar/v1/verify` - Verify Aadhaar number

### Response Handling

- Success: Update user verification status
- Failure: Return appropriate error message
- Network errors: Graceful fallback

## User Experience

### Verification Flow

1. User navigates to verification page
2. Enters 12-digit Aadhaar number
3. System validates format and checksum
4. API call to DigiLocker for verification
5. Success: User gets verified + points
6. Failure: Error message with retry option

### Dashboard Integration

- Verification status card in dashboard
- Shows benefits and call-to-action if not verified
- Displays verification badge if completed

## Points System

### Verification Reward

- Action: `aadhaar_verification`
- Points: 100 Punya Points
- One-time reward per user

### Implementation

- Action created in seed file
- Points awarded automatically on verification
- Total points updated in user record

## Error Handling

### Frontend

- Input validation with real-time feedback
- Loading states during API calls
- Clear error messages for users
- Success confirmation with next steps

### Backend

- Comprehensive input validation
- Database constraint handling
- API error management
- Logging for debugging

## Testing

### Development Testing

- API includes fallback response for testing
- Remove fallback in production
- Test with valid Aadhaar numbers
- Verify points system integration

### Production Considerations

- Replace test responses with actual API calls
- Configure proper error logging
- Set up monitoring for API failures
- Implement rate limiting

## Usage in Other Components

### Dashboard Integration

```tsx
import { VerificationStatus } from "@/components/verification/verification-status";

// In your dashboard component
<VerificationStatus userId={userId} />;
```

### Check Verification Status

```tsx
const checkVerification = async (userId: string) => {
  const response = await fetch(`/api/verify-aadhaar?userId=${userId}`);
  const data = await response.json();
  return data.isVerified;
};
```

## Future Enhancements

### Planned Features

- Multi-factor authentication
- Document upload verification
- PAN card integration
- Biometric verification
- Verification expiry and renewal

### API Improvements

- Webhook support for real-time updates
- Batch verification capabilities
- Enhanced error reporting
- Analytics and metrics

## Troubleshooting

### Common Issues

1. **DigiLocker API connection fails**

   - Check environment variables
   - Verify API credentials
   - Check network connectivity

2. **Aadhaar validation fails**

   - Verify number format
   - Check checksum calculation
   - Ensure number is valid

3. **Database errors**
   - Check unique constraints
   - Verify migration status
   - Review Prisma schema

### Support

For technical support or questions about implementation, refer to:

- DigiLocker API documentation
- Prisma documentation for database operations
- Next.js documentation for API routes
