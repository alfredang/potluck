---
layout: default
title: Android Deployment Guide
---

# Android Deployment Guide

This guide walks you through deploying the Potluck mobile app to the Google Play Store.

## Prerequisites

- **Google Play Developer Account** ($25 one-time fee) - [play.google.com/console](https://play.google.com/console)
- **Node.js 20+**
- **EAS CLI**: `npm install -g eas-cli`

---

## Step 1: Google Play Console Setup

### 1.1 Create Developer Account

1. Go to [play.google.com/console](https://play.google.com/console)
2. Sign in with your Google account
3. Accept the Developer Agreement
4. Pay the $25 registration fee
5. Complete identity verification

### 1.2 Create Your App

1. Click **"Create app"**
2. Fill in:
   - **App name**: Potluck
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
3. Accept declarations
4. Click **"Create app"**

---

## Step 2: Configure Your Project

### 2.1 Update app.json

Edit `apps/mobile/app.json`:

```json
{
  "expo": {
    "name": "Potluck",
    "slug": "potluck",
    "version": "1.0.0",
    "android": {
      "package": "com.yourcompany.potluck",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./src/assets/adaptive-icon.png",
        "backgroundColor": "#F97316"
      },
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

### 2.2 Create Service Account for Automated Uploads

#### Step A: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **Google Play Android Developer API**:
   - Go to APIs & Services → Library
   - Search for "Google Play Android Developer API"
   - Click **Enable**

#### Step B: Create Service Account

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **"Create Service Account"**
3. Fill in:
   - **Name**: EAS Submit
   - **ID**: eas-submit
4. Click **"Create and Continue"**
5. Skip role assignment (Done in Play Console)
6. Click **"Done"**

#### Step C: Create Key

1. Click on your new service account
2. Go to **Keys** tab
3. Click **"Add Key"** → **"Create new key"**
4. Select **JSON** format
5. Click **"Create"**
6. Save the downloaded file as `google-service-account.json` in `apps/mobile/`

#### Step D: Link to Play Console

1. Go to [Play Console](https://play.google.com/console)
2. Navigate to **Settings** → **API access**
3. Click **"Link"** to connect your Google Cloud project
4. Find your service account and click **"Grant access"**
5. Set permissions:
   - App access: **All apps**
   - Account permissions:
     - ✅ View app information and download bulk reports
     - ✅ Release to production, exclude devices, and use Play App Signing
     - ✅ Manage testing tracks and edit tester lists
6. Click **"Invite user"** → **"Send invite"**

### 2.3 Configure EAS

Edit `apps/mobile/eas.json`:

```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

**Track Options:**
- `internal` - Internal testing (fastest, up to 100 testers)
- `alpha` - Closed testing
- `beta` - Open testing
- `production` - Production release

---

## Step 3: Build for Android

```bash
cd apps/mobile

# Login to EAS
eas login

# Build for Play Store (AAB format)
eas build --platform android --profile production
```

This will:
1. ✅ Generate a signing keystore (stored securely by EAS)
2. ✅ Build your app in the EAS cloud
3. ✅ Generate an .aab file (Android App Bundle)
4. ⏱️ Takes approximately 10-20 minutes

---

## Step 4: Complete Store Listing

Go to your app in [Play Console](https://play.google.com/console):

### 4.1 Store Presence → Main Store Listing

**App Details:**
- **App name**: Potluck
- **Short description** (80 chars):
  ```
  Discover authentic home-cooked meals from local chefs in Singapore
  ```
- **Full description** (4000 chars):
  ```
  Discover authentic home-cooked meals in Singapore with Potluck!

  🍜 EXPLORE LOCAL CUISINES
  Browse talented home chefs specializing in Peranakan, Malay, Indian, Japanese, Korean, and more authentic cuisines.

  📅 EASY BOOKING
  Select from chef's available dates and times that work for your schedule. No more back-and-forth messaging.

  ⭐ VERIFIED CHEFS
  All our chefs are verified. Read reviews and ratings from other diners before making your booking.

  🏠 UNIQUE DINING EXPERIENCES
  Enjoy dining in the comfort of a chef's home for an authentic, intimate experience you won't find at restaurants.

  💰 TRANSPARENT PRICING
  See prices upfront with no hidden fees. Pay securely through our platform.

  FEATURES:
  • Browse chefs by cuisine, location, and price
  • View detailed menus with photos
  • Real-time availability booking
  • Secure in-app payments
  • Rate and review your experiences
  • Save favorite chefs

  Download Potluck today and discover your next favorite home-cooked meal!
  ```

**Graphics:**
- **App icon**: 512 x 512 px (PNG, 32-bit, no alpha)
- **Feature graphic**: 1024 x 500 px
- **Phone screenshots**: Min 2, max 8 (16:9 or 9:16 ratio)
- **7-inch tablet screenshots**: Optional but recommended
- **10-inch tablet screenshots**: Optional but recommended

### 4.2 Store Presence → Store Settings

- **App category**: Food & Drink
- **Contact email**: support@potluck.sg
- **Privacy policy URL**: https://potluck.sg/privacy

### 4.3 Policy → App Content

Complete all required sections:

1. **Privacy policy** - Add your privacy policy URL
2. **Ads** - Select "No ads"
3. **App access** - Select appropriate option
4. **Content ratings** - Complete questionnaire
5. **Target audience** - Select 18+ (for food service)
6. **News apps** - Select "No"
7. **Data safety** - Complete the data safety form:
   - Data collected: Name, email, payment info, photos
   - Data shared: Payment info with payment processor
   - Security practices: Data encrypted in transit

---

## Step 5: Submit to Play Store

### Option A: Automatic Submission with EAS

```bash
# Submit to internal testing track
eas submit --platform android --latest
```

### Option B: Manual Upload

1. Download the .aab file from your EAS dashboard
2. Go to Play Console → Your App → Production (or Testing track)
3. Click **"Create new release"**
4. Upload the .aab file
5. Add release notes
6. Click **"Review release"** → **"Start rollout"**

---

## Step 6: Testing Tracks

### Internal Testing (Recommended First)

1. Go to **Testing** → **Internal testing**
2. Click **"Create new release"**
3. Upload your .aab or use EAS submit
4. Add testers (up to 100 email addresses)
5. Start rollout

### Closed Testing (Alpha)

1. Go to **Testing** → **Closed testing**
2. Create a track
3. Add testers via email list or Google Groups
4. Upload and release

### Open Testing (Beta)

1. Go to **Testing** → **Open testing**
2. Set a maximum number of testers
3. Upload and release
4. Anyone can join via Play Store

---

## Step 7: Production Release

1. Go to **Production**
2. Click **"Create new release"**
3. Add your .aab file (or promote from testing)
4. Add release notes:
   ```
   Initial release of Potluck!
   
   • Browse home chefs by cuisine
   • View menus and book dining experiences
   • Secure payment processing
   • Rate and review chefs
   ```
5. Click **"Review release"**
6. Click **"Start rollout to Production"**

---

## Step 8: Review Process

**Timeline:** Usually 1-7 days (longer for first submission)

**Review Status:**
- **Pending publication**: Being reviewed
- **Published**: Live on Play Store
- **Rejected**: See rejection reason and fix issues

**Common Rejection Reasons:**
- Policy violations
- Misleading content
- Broken functionality
- Privacy policy issues
- Incomplete store listing

---

## Updating Your App

### Increment Version Numbers

```json
{
  "expo": {
    "version": "1.1.0",
    "android": {
      "versionCode": 2
    }
  }
}
```

> **Important:** `versionCode` must always increase for each upload

### Build and Submit

```bash
eas build --platform android --profile production
eas submit --platform android --latest
```

---

## Troubleshooting

### Keystore Issues
```bash
# View/manage credentials
eas credentials --platform android
```

### Build Failures
```bash
# View build logs
eas build:list
eas build:view BUILD_ID
```

### Service Account Issues
- Ensure API is enabled in Google Cloud
- Verify service account has correct permissions in Play Console
- Check the JSON key file path is correct

### Version Code Error
"Version code already used" - Increment `versionCode` in app.json

---

## Useful Links

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit for Android](https://docs.expo.dev/submit/android/)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android App Bundle](https://developer.android.com/guide/app-bundle)

---

[← Back to Documentation](index)
