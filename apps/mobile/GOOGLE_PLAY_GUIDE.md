# Google Play Store Upload Guide for PotLuckHub

## ⚠️ Important: Folder Access Required

**Please share this folder with the service account:**
- Folder: Paw (Coding) - https://drive.google.com/drive/folders/1ZdzYJdDTJBOgg0rxmzQjkIips16pKjpT
- Share with: `pawbot@pawbot-488002.iam.gserviceaccount.com`
- Permission: Editor

---

## Current Status

### ✅ Already Done
- iOS Build #19 submitted to App Store (waiting for review)
- App icons and screenshots prepared (1024x1024 icons, 3 phone screenshots)

### ⏳ Needed for Google Play
- Android APK or AAB file (need to build)
- Google Play Console setup (needs your JSON key)

---

## Option 1: Build APK Locally on Your Mac

### Step 1: Install Dependencies
```bash
# Install Node.js (if not installed)
brew install node

# Install Expo CLI
npm install -g expo-cli

# Install EAS CLI
npm install -g eas-cli
```

### Step 2: Build Android APK
```bash
cd potluck/apps/mobile

# Login to Expo
eas login

# Build APK (this includes JS bundle - works standalone)
eas build --platform android --profile preview
```

### Step 3: Download & Upload
- Download the APK from https://expo.dev/artifacts
- Upload to Google Drive

---

## Option 2: Upload via Google Play Console (Recommended)

### Step 1: Access Google Play Console
1. Go to: https://play.google.com/console
2. Login with: angch@tertiaryinfotech.com
3. Create app: PotLuckHub

### Step 2: App Information

| Field | Value |
|-------|-------|
| **App Name** | PotLuckHub |
| **Default Language** | English (Singapore) |
| **App Type** | Android App |
| **Category** | Food & Drink |

### Step 3: Store Listing

**Screenshots** (use files in google-play-assets.zip):
- 2-3 phone screenshots required
- Recommended: 1080x1920 or 1440x2560

**Graphics**:
- App icon: 512x512 PNG (we have 1024x1024)
- Feature graphic: 1024x500

**Description**:
```
PotLuck connects you with home cooks in Singapore. Discover delicious homemade meals from local chefs, order your favorites, and enjoy restaurant-quality food made with love.

Features:
- Browse home cooks near you
- Order delicious homemade meals
- Support local food artisans
- Easy ordering and payment
```

### Step 4: Pricing & Distribution
- **Price**: Free
- **Countries**: Singapore (expand later)
- **Target**: Android 8.0+ (API 26+)

### Step 5: Upload APK/AAB

**Option A**: Upload directly via browser
- Go to "Releases" → "App releases"
- Upload your .aab or .apk file

**Option B**: Use EAS Submit
```bash
eas submit --platform android
```

---

## Step 6: App Review Info

| Field | Value |
|-------|-------|
| **Contact Email** | hello@potluckhub.io |
| **Phone** | +65 9048 0277 |
| **Privacy Policy** | https://potluck.tertiaryinfo.tech/privacy |

---

## What's Ready to Upload

I've prepared these assets (stored locally, need to upload to Drive):

```
google-play-assets/
├── icons/
│   ├── icon.png (1024x1024)
│   └── adaptive-icon.png (1024x1024)
└── screenshots/
    ├── phone-1-home.png
    ├── phone-2-chefs.png
    └── phone-3-meals.png
```

---

## Need from You

1. **Share Google Drive folder** with pawbot service account
2. **Google Play JSON key** - Need you to:
   - Go to Google Play Console → Settings → API Access
   - Create new Google Play Android Developer service account
   - Download JSON key file
   - Send me the JSON file or share it

3. **Or build locally** on your Mac with `eas build --platform android`

---

## Quick Start (If Building Locally)

```bash
# Clone repo
git clone https://github.com/potluckhub/potluck.git
cd potluck/apps/mobile

# Install
npm install

# Build
eas build --platform android --profile production

# Submit
eas submit --platform android
```

---

## Questions?

Let me know if you need help with any step!
