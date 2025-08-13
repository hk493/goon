# AWS Deployment Configuration

## Overview
This application has been migrated from Netlify to AWS infrastructure using:
- **AWS Lambda** for serverless functions
- **AWS API Gateway** for API endpoints
- **AWS S3** for static hosting
- **AWS CloudFront** for CDN

## API Configuration

### Base URL
https://cmlc2yk69j.execute-api.ap-southeast-2.amazonaws.com/prod

markdown
コピーする
編集する

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
> **Note:** Production API keys and sensitive values are **not stored in this file**.  
> They are managed as environment variables in AWS Amplify with the `VITE_` prefix.

```bash
# AWS API Gateway
VITE_API_URL=<Set in Amplify>

# Auth0
VITE_AUTH0_DOMAIN=<Set in Amplify>
VITE_AUTH0_CLIENT_ID=<Set in Amplify>

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=<Set in Amplify>

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=<Set in Amplify>

# Amadeus
VITE_AMADEUS_API_KEY=<Set in Amplify>

# TripAdvisor
VITE_TRIPADVISOR_API_KEY=<Set in Amplify>
Deployment Steps
1. Build Application
bash
コピーする
編集する
npm run build
2. Deploy to S3
Upload dist/ contents to S3 bucket

3. CloudFront Invalidation
bash
コピーする
編集する
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
Removed Netlify Dependencies
Files Deleted
netlify.toml

_redirects

netlify/ folder

.netlify/ folder

Package.json Changes
Removed netlify-cli dependency

Removed Netlify build scripts

Simplified build process

Code Changes
All API calls now use centralized apiCall helper

Environment variable based API URL configuration

Proper error handling for AWS API Gateway responses

Testing
Verify all API endpoints work correctly:

Chat functionality

Image translation

Trip generation

Payment processing

eSIM management
