# Mobile App Deployment Guide

This guide covers deploying the Potluck mobile app to the Apple App Store and Google Play Store using Expo Application Services (EAS).

## Prerequisites

### General Requirements
- Node.js >= 20.0.0
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Expo account: Sign up at [expo.dev](https://expo.dev)

### For iOS (App Store)
- Apple Developer Account ($99/year): [developer.apple.com](https://developer.apple.com)
- macOS computer (for local builds)
- Xcode 15+ (for local builds)
- App Store Connect access

### For Android (Play Store)
- Google Play Developer Account ($25 one-time): [play.google.com/console](https://play.google.com/console)
- Google Play Console access

---

## Initial Setup

### 1. Install Dependencies

```bash
cd apps/mobile
pnpm install
```

### 2. Login to Expo & EAS

```bash
# Login to your Expo account
eas login

# Verify login
eas whoami
```

### 3. Configure EAS Project

```bash
# Initialize EAS for your project
eas build:configure
```

This will create/update the `eas.json` configuration file.

### 4. Update app.json

Edit `app.json` with your app details:

```json
{
  "expo": {
    "name": "Potluck",
    "slug": "potluck",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.potluck",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourcompany.potluck",
      "versionCode": 1
    }
  }
}
```

---

## iOS Deployment (App Store)

### Step 1: Apple Developer Setup

1. **Create App ID**
   - Go to [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers)
   - Click "+" to add a new identifier
   - Select "App IDs" → "App"
   - Enter description: "Potluck"
   - Bundle ID: `com.yourcompany.potluck`
   - Enable capabilities: Push Notifications, Sign in with Apple (if needed)

2. **Create App Store Connect Listing**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Click "+" → "New App"
   - Select iOS platform
   - Enter app name: "Potluck"
   - Select your Bundle ID
   - SKU: `potluck-ios-001`

### Step 2: Configure EAS for iOS

Update `eas.json`:

```json
{
  "build": {
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

**Finding your IDs:**
- **Apple Team ID**: [developer.apple.com/account](https://developer.apple.com/account) → Membership
- **ASC App ID**: App Store Connect → Your App → General → App Information → Apple ID

### Step 3: Build for iOS

```bash
# Build for App Store
eas build --platform ios --profile production

# This will:
# 1. Create necessary certificates automatically
# 2. Build your app in the cloud
# 3. Generate an .ipa file
```

### Step 4: Submit to App Store

```bash
# Submit the latest build
eas submit --platform ios --latest

# Or submit a specific build
eas submit --platform ios --id BUILD_ID
```

### Step 5: App Store Review

1. Go to App Store Connect
2. Fill in app metadata:
   - Screenshots (6.5" and 5.5" iPhones required)
   - App description
   - Keywords
   - Support URL
   - Privacy Policy URL
3. Submit for Review
4. Wait 24-48 hours for review

---

## Android Deployment (Play Store)

### Step 1: Google Play Console Setup

1. **Create App**
   - Go to [Google Play Console](https://play.google.com/console)
   - Click "Create app"
   - App name: "Potluck"
   - Default language: English
   - App or game: App
   - Free or paid: Free

2. **Complete Store Listing**
   - Short description (80 chars max)
   - Full description (4000 chars max)
   - Screenshots (phone, 7" tablet, 10" tablet)
   - Feature graphic (1024x500)
   - App icon (512x512)

### Step 2: Create Service Account for Automated Uploads

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable "Google Play Android Developer API"
4. Create Service Account:
   - IAM & Admin → Service Accounts → Create
   - Name: "EAS Submit"
   - Grant role: None (will add in Play Console)
   - Create key → JSON → Download

5. Link to Play Console:
   - Play Console → Settings → API access
   - Link to your Google Cloud project
   - Grant access to the service account
   - Add permission: "Release to production"

6. Save the JSON file as `google-service-account.json` in `apps/mobile/`

### Step 3: Configure EAS for Android

Update `eas.json`:

```json
{
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

Track options:
- `internal`: Internal testing (fastest)
- `alpha`: Closed testing
- `beta`: Open testing  
- `production`: Production release

### Step 4: Build for Android

```bash
# Build for Play Store (AAB format)
eas build --platform android --profile production

# This will:
# 1. Generate/use upload keystore automatically
# 2. Build your app in the cloud
# 3. Generate an .aab file
```

### Step 5: Submit to Play Store

```bash
# Submit the latest build
eas submit --platform android --latest

# Or submit a specific build
eas submit --platform android --id BUILD_ID
```

### Step 6: Play Store Review

1. Go to Play Console → Your App → Production
2. Complete all required sections:
   - Content rating questionnaire
   - Target audience and content
   - News apps (if applicable)
   - Data safety form
   - Advertising ID declaration
3. Submit for Review
4. Wait 1-7 days for review

---

## Automated CI/CD with GitHub Actions

Create `.github/workflows/mobile-deploy.yml`:

```yaml
name: Mobile App Deploy

on:
  push:
    tags:
      - 'mobile-v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          
      - uses: pnpm/action-setup@v2
        with:
          version: 9
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Build iOS
        run: cd apps/mobile && eas build --platform ios --profile production --non-interactive
        
      - name: Build Android
        run: cd apps/mobile && eas build --platform android --profile production --non-interactive
        
      - name: Submit iOS
        run: cd apps/mobile && eas submit --platform ios --latest --non-interactive
        
      - name: Submit Android
        run: cd apps/mobile && eas submit --platform android --latest --non-interactive
```

Add these secrets to GitHub:
- `EXPO_TOKEN`: Get from [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)

---

## Environment Variables

For production builds, configure secrets in EAS:

```bash
# Set secret
eas secret:create --name API_URL --value https://api.potluck.sg

# List secrets
eas secret:list
```

Access in code:
```javascript
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```

---

## Updating Your App

### Incrementing Versions

**iOS:**
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

**Android:**
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

### Over-the-Air Updates (OTA)

For JS-only changes, use EAS Update:

```bash
# Publish an update
eas update --branch production --message "Bug fixes"
```

---

## Troubleshooting

### iOS Issues

**"Missing compliance" warning:**
Add to `app.json`:
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

**Certificate issues:**
```bash
# Clear credentials and regenerate
eas credentials --platform ios
```

### Android Issues

**Keystore issues:**
```bash
# View/manage credentials
eas credentials --platform android
```

**Build failures:**
```bash
# Check build logs
eas build:list
eas build:view BUILD_ID
```

---

## Useful Commands Reference

```bash
# Development
pnpm start                    # Start Expo dev server
pnpm ios                      # Run on iOS simulator
pnpm android                  # Run on Android emulator

# Building
eas build --platform ios      # Build iOS app
eas build --platform android  # Build Android app
eas build --platform all      # Build both platforms

# Submitting
eas submit --platform ios     # Submit to App Store
eas submit --platform android # Submit to Play Store

# Updates
eas update                    # Push OTA update

# Credentials
eas credentials               # Manage signing credentials
```

---

## App Store Assets Checklist

### iOS (App Store Connect)
- [ ] App icon (1024x1024, no alpha)
- [ ] Screenshots 6.5" (1284x2778 or 1290x2796)
- [ ] Screenshots 5.5" (1242x2208)
- [ ] App description
- [ ] Keywords (100 chars)
- [ ] Support URL
- [ ] Privacy Policy URL
- [ ] App category

### Android (Play Console)
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Phone screenshots (min 2)
- [ ] 7" tablet screenshots (if supported)
- [ ] 10" tablet screenshots (if supported)
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Privacy Policy URL
- [ ] App category

---

## Support

For issues with:
- **EAS Build**: [docs.expo.dev/build](https://docs.expo.dev/build/introduction/)
- **EAS Submit**: [docs.expo.dev/submit](https://docs.expo.dev/submit/introduction/)
- **App Store**: [developer.apple.com/support](https://developer.apple.com/support/)
- **Play Store**: [support.google.com/googleplay/android-developer](https://support.google.com/googleplay/android-developer)
