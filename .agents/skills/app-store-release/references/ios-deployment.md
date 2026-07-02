---
layout: default
title: iOS Deployment Guide
---

# iOS Deployment Guide

This guide walks you through deploying the Potluck mobile app to the Apple App Store.

## Prerequisites

- **Apple Developer Account** ($99/year) - [developer.apple.com](https://developer.apple.com)
- **macOS computer** (for local builds, optional with EAS)
- **Xcode 15+** (for local builds)
- **Node.js 20+**
- **EAS CLI**: `npm install -g eas-cli`

---

## Step 1: Apple Developer Setup

### 1.1 Enroll in Apple Developer Program

1. Go to [developer.apple.com/programs](https://developer.apple.com/programs)
2. Click "Enroll"
3. Sign in with your Apple ID
4. Complete enrollment ($99/year)
5. Wait for approval (usually 24-48 hours)

### 1.2 Create an App ID

1. Go to [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers)
2. Click **"+"** to add a new identifier
3. Select **"App IDs"** → **"App"**
4. Enter:
   - **Description**: Potluck
   - **Bundle ID**: `com.yourcompany.potluck` (Explicit)
5. Enable capabilities as needed:
   - ✅ Push Notifications (if using)
   - ✅ Sign in with Apple (if using)
6. Click **"Continue"** → **"Register"**

### 1.3 Create App Store Connect Listing

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **"My Apps"** → **"+"** → **"New App"**
3. Fill in:
   - **Platforms**: iOS
   - **Name**: Potluck
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: Select the one you created
   - **SKU**: `potluck-ios-001`
   - **User Access**: Full Access
4. Click **"Create"**

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
    "ios": {
      "bundleIdentifier": "com.yourcompany.potluck",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false,
        "NSCameraUsageDescription": "Used to take photos of dishes",
        "NSPhotoLibraryUsageDescription": "Used to select photos of dishes"
      }
    }
  }
}
```

### 2.2 Configure EAS

Edit `apps/mobile/eas.json`:

```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "YOUR_ASC_APP_ID",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

**Finding Your IDs:**
- **Apple Team ID**: [developer.apple.com/account](https://developer.apple.com/account) → Membership → Team ID
- **ASC App ID**: App Store Connect → Your App → App Information → Apple ID (numeric)

---

## Step 3: Login to EAS

```bash
# Login to Expo
eas login

# Verify you're logged in
eas whoami
```

---

## Step 4: Build for iOS

```bash
cd apps/mobile

# Build for App Store
eas build --platform ios --profile production
```

This will:
1. ✅ Automatically create/manage certificates and provisioning profiles
2. ✅ Build your app in the EAS cloud
3. ✅ Generate an .ipa file
4. ⏱️ Takes approximately 15-30 minutes

You can monitor the build at [expo.dev](https://expo.dev) in your dashboard.

---

## Step 5: Submit to App Store

### Option A: Automatic Submission with EAS

```bash
# Submit the latest build
eas submit --platform ios --latest
```

### Option B: Manual Submission

1. Download the .ipa from your EAS dashboard
2. Open **Transporter** app on macOS
3. Drag and drop the .ipa file
4. Click **"Deliver"**

---

## Step 6: Complete App Store Listing

Go to [App Store Connect](https://appstoreconnect.apple.com) and complete:

### 6.1 App Information
- **Category**: Food & Drink
- **Content Rights**: Does not contain third-party content
- **Age Rating**: Complete the questionnaire

### 6.2 Pricing and Availability
- **Price**: Free
- **Availability**: All territories (or select specific countries)

### 6.3 App Privacy
Complete the privacy questionnaire:
- Data collected: Email, name, payment info, photos
- Data linked to user: Yes
- Tracking: No (unless using analytics)

### 6.4 Screenshots

**Required Sizes:**
- 6.7" Display (iPhone 15 Pro Max): 1290 x 2796 px
- 6.5" Display (iPhone 14 Plus): 1284 x 2778 px
- 5.5" Display (iPhone 8 Plus): 1242 x 2208 px

**Screenshot Tips:**
- Minimum 3 screenshots per size
- Show key features: home, explore, booking, profile
- Use actual app content

### 6.5 App Description

```
Discover authentic home-cooked meals in Singapore with Potluck!

🍜 EXPLORE LOCAL CUISINES
Browse talented home chefs specializing in Peranakan, Malay, Indian, Japanese, Korean, and more.

📅 EASY BOOKING
Select from available dates and times that work for your schedule.

⭐ VERIFIED CHEFS
Read reviews and ratings from other diners before booking.

🏠 UNIQUE EXPERIENCES
Enjoy dining in the comfort of a chef's home for an authentic experience.

Download Potluck and discover your next favorite meal!
```

### 6.6 Keywords (100 characters max)
```
home chef,food,dining,singapore,peranakan,malay,booking,homemade,local cuisine,private dining
```

---

## Step 7: Submit for Review

1. Go to your app in App Store Connect
2. Click the **"+"** next to iOS App
3. Enter version number (e.g., 1.0.0)
4. Select your build
5. Fill in "What's New" (for updates)
6. Click **"Add for Review"**
7. Click **"Submit to App Review"**

---

## Step 8: App Review

**Timeline:** Usually 24-48 hours

**Common Rejection Reasons:**
- Incomplete metadata or screenshots
- Bugs or crashes
- Misleading app description
- Privacy policy issues
- Missing required permissions explanations

**If Rejected:**
1. Read the rejection reason carefully
2. Fix the issues
3. Reply in Resolution Center or submit new build
4. Resubmit for review

---

## Updating Your App

### Increment Version Numbers

```json
{
  "expo": {
    "version": "1.1.0",
    "ios": {
      "buildNumber": "2"
    }
  }
}
```

### Build and Submit Update

```bash
eas build --platform ios --profile production
eas submit --platform ios --latest
```

---

## Troubleshooting

### Certificate Issues
```bash
eas credentials --platform ios
# Select "Manage credentials" to view/reset
```

### Build Failures
```bash
# View build logs
eas build:list
eas build:view BUILD_ID
```

### Missing Compliance
Add to app.json:
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    }
  }
}
```

---

## Useful Links

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

---

[← Back to Documentation](index)
