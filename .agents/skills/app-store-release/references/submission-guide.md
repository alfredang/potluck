# PotLuckHub App Store Submission Guide

> Moved from the former root `APP_STORE_GUIDE.md`. URLs updated to the canonical domain
> **potluckhub.io**.

## Status
- ✅ iOS build uploaded to the App Store
- ⏳ Complete the listing metadata (screenshots + description)

---

## Step 1: Get Screenshots

Easiest path — screenshot the live website on your phone:

1. On your phone, open **https://potluckhub.io**
2. Take 3 screenshots:
   - Screenshot 1: Home page
   - Screenshot 2: Any chef page (tap a chef, e.g. `/chef/sarah-tan`)
   - Screenshot 3: The Explore / meals listing
3. Save the 3 screenshots to your phone

---

## Step 2: Upload to App Store Connect

1. Go to **https://appstoreconnect.apple.com**
2. Log in with the Apple account that owns the app
3. **My Apps** → **PotLuckHub** → **App Store** (top menu)

---

## Step 3: Fill in Metadata

### 3.1 Screenshots
- Scroll to **Screenshots**, drag in your 3 phone screenshots
- Select "iPhone 6.5-inch" or "iPhone 6.7-inch" device size

### 3.2 App Information

| Field | What to Write |
|-------|--------------|
| **Name** | PotLuckHub |
| **Subtitle** | Home Cooked Meals |
| **Description** | Potluck connects you with home cooks in Singapore. Discover delicious homemade meals from local home chefs, book a private home-dining experience, and enjoy authentic food made with love. |
| **Keywords** | food, home chef, meals, singapore, homemade, private dining, cooking, halal, dinner |
| **Support URL** | https://potluckhub.io |
| **Privacy Policy URL** | https://potluckhub.io/privacy |

### 3.3 Pricing
- Set **Price Tier** to **Free**

### 3.4 App Review Information
- **Contact Email:** hello@potluckhub.io
- **Demo Account:** Not needed (app browses without login)

---

## Step 4: Submit
1. Top right → **Add for Review**
2. **Submit to App Review**

Apple review usually takes 1–24 hours. 🎉

---

## Notes
- For the full build/signing pipeline see [ios-deployment.md](ios-deployment.md) and
  [android-deployment.md](android-deployment.md).
- App-Store account credentials are **not** stored in the repo — keep them in your password
  manager / the native app repo's secrets.
