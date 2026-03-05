# Building PotLuck Android App (AAB) on Windows

## Prerequisites - Install These First

### 1. Install Node.js
- Download: https://nodejs.org (LTS version)
- Install with default settings

### 2. Install Java JDK 17
- Download: https://adoptium.net/temurin/releases/?version=17
- Choose: **Windows x64 JDK** (.msi)
- Install to: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x`

### 3. Set JAVA_HOME (Important!)
1. Press **Windows key + R**
2. Type: `sysdm.cpl` → Enter
3. Go to **Advanced** → **Environment Variables**
4. Under "System variables", click **New**
5. Variable name: `JAVA_HOME`
6. Variable value: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x` (check exact path)
7. Click OK

### 4. Install Android Studio (Required)
- Download: https://developer.android.com/studio
- Install with default settings
- Start Android Studio → Follow setup wizard
- Install SDK components when prompted

---

## Build Steps

### Step 1: Open Command Prompt
Press Windows key + R, type `cmd`, press Enter

### Step 2: Clone the Project
```cmd
cd C:\
git clone https://github.com/alfredang/potluck.git
cd potluck\apps\mobile
```

### Step 3: Install Dependencies
```cmd
npm install
```

### Step 4: Login to Expo
```cmd
npm install -g eas-cli

eas login
# When asked:
# Username: potluckhub
# Password: PotLuck2026!Expo
```

### Step 5: Build the AAB
```cmd
eas build --platform android --profile production
```

Wait for build to complete (5-15 minutes)

### Step 6: Download the AAB
1. Go to: https://expo.dev/accounts/potluckhub/projects/potluck/builds
2. Find your completed build
3. Click **Download** → Download **.aab** file

---

## Upload to Google Play

### Option 1: Upload via Browser
1. Go to: https://play.google.com/console
2. Select your app (PotLuckHub)
3. Go to **Release** → **App releases**
4. Click **Create Release**
5. Upload the .aab file
6. Click **Review** → **Start Rollout**

### Option 2: Let Me Submit (After You Share Credentials)
Once you have the AAB file, share it with me and I can help upload!

---

## Troubleshooting

### "JAVA_HOME not found"
- Make sure JAVA_HOME is set correctly (see Step 3 above)
- Restart Command Prompt after setting

### "npm not found"
- Install Node.js properly
- Restart computer after installing

### Build fails
- Make sure Android Studio is installed
- Make sure Java JDK 17 is installed
- Try: `npm cache clean --force` then rebuild

---

## Need Help?
Contact me (Paw) if you encounter issues!
