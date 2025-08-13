# AWS Deployment Configuration

## Overview
This application has been migrated from Netlify to AWS infrastructure using:
- **AWS Lambda** for serverless functions
- **AWS API Gateway** for API endpoints
- **AWS S3** for static hosting
- **AWS CloudFront** for CDN

## API Configuration

### Base URL
```
https://cmlc2yk69j.execute-api.ap-southeast-2.amazonaws.com/prod
```

### Available Endpoints
- `/openai-chat` - AI chat functionality
- `/openai-vision` - Image translation
- `/openai-generate` - Trip itinerary generation
- `/tripadvisor` - Tourist attraction data
- `/google-maps` - Maps and directions
- `/google-places` - Place search
- `/esim` - eSIM management
- `/amadeus` - Flight and hotel booking
- `/currency-convert` - Currency conversion
- `/create-checkout-session` - Stripe payment
- `/verify-payment` - Payment verification

## Environment Variables

### Required for Production
```bash
# AWS API Gateway
VITE_API_URL=https://cmlc2yk69j.execute-api.ap-southeast-2.amazonaws.com/prod

# Auth0
VITE_AUTH0_DOMAIN=dev-qwtb2dn1ancbggzf.us.auth0.com
VITE_AUTH0_CLIENT_ID=NT9RvKLSFd2mFm1smBHjAA0XHwy0d8pI

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RZ6JJ04z3oMa6p2jezeePg39hs0ByNMw3oNOac7MsqPcOhrkNdSsZufMGFcSPE0h9Y300FxWmajcTxqCHmkCKBU00ES1RmeMw

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAKDLAgDDchaar94PLf8Yfdn0UWusPj3pI

# Amadeus
VITE_AMADEUS_API_KEY=sGeiXUCtEMP0tdPGo9TnErqxH6e6n0ev

# TripAdvisor
VITE_TRIPADVISOR_API_KEY=6AD89F8564A140E0B44756148359553C
```

## Deployment Steps

### 1. Build Application
```bash
npm run build
```

### 2. Deploy to S3
Upload `dist/` contents to S3 bucket

### 3. CloudFront Invalidation
```bash
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Removed Netlify Dependencies

### Files Deleted
- `netlify.toml`
- `_redirects`
- `netlify/` folder
- `.netlify/` folder

### Package.json Changes
- Removed `netlify-cli` dependency
- Removed Netlify build scripts
- Simplified build process

### Code Changes
- All API calls now use centralized `apiCall` helper
- Environment variable based API URL configuration
- Proper error handling for AWS API Gateway responses

## Testing
Verify all API endpoints work correctly:
1. Chat functionality
2. Image translation
3. Trip generation
4. Payment processing
5. eSIM management