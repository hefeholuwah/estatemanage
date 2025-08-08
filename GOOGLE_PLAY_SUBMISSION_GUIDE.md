# Google Play Store Submission Guide

## Prerequisites

### 1. Google Play Console Account
- Create a Google Play Console account at https://play.google.com/console
- Pay the one-time $25 registration fee
- Complete account verification

### 2. App Assets Required
Replace the placeholder files in `assets/` with actual images:
- `assets/icon.png` - 1024x1024 PNG app icon
- `assets/adaptive-icon.png` - 1024x1024 PNG adaptive icon
- `assets/favicon.png` - 48x48 PNG favicon

### 3. Google Service Account
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable Google Play Android Developer API
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Download the JSON key file
   - Save it as `google-service-account.json` in your project root

### 4. Google Play Console Setup
1. Create a new app in Google Play Console
2. Set up app details:
   - App name: "Estate Manage"
   - Package name: "com.estatemanage.estateone"
   - Category: "Business" or "Productivity"

## Build and Submit Process

### Step 1: Build Production APK/AAB
```bash
# Build for production
eas build --platform android --profile production
```

### Step 2: Submit to Google Play Store
```bash
# Submit to production track
eas submit --platform android --profile production
```

## Required App Store Information

### App Details
- **App Name**: Estate Manage
- **Short Description**: Estate management system for property administrators
- **Full Description**: A comprehensive estate management application that helps property administrators manage visitors, maintenance requests, emergency alerts, and access logs efficiently.

### App Category
- **Primary Category**: Business
- **Secondary Category**: Productivity

### Content Rating
- Complete the content rating questionnaire in Google Play Console
- Your app will likely be rated "Everyone" or "Everyone 10+"

### Privacy Policy
- Create a privacy policy for your app
- Host it on a public URL
- Include it in the app listing

### App Screenshots
Prepare screenshots for different device sizes:
- Phone: 1080x1920 (minimum 2, maximum 8)
- 7-inch tablet: 1200x1920 (optional)
- 10-inch tablet: 1920x1200 (optional)

### Feature Graphic
- 1024x500 PNG image
- Represents your app's main features

## Common Issues and Solutions

### 1. Version Code Conflicts
If you get version code conflicts:
```bash
# Update version code in app.json
"versionCode": 2  # Increment this number
```

### 2. Package Name Issues
Ensure your package name is unique and follows the format:
`com.yourcompany.yourappname`

### 3. Permissions
The app currently requests these permissions:
- Camera (for QR code scanning)
- Internet (for API calls)
- Network State (for connectivity checks)

### 4. App Bundle vs APK
- Google Play Store prefers App Bundles (.aab files)
- The configuration is already set to build App Bundles

## Testing Before Submission

### 1. Internal Testing
```bash
# Build for internal testing
eas build --platform android --profile preview
```

### 2. Test on Real Devices
- Test on different Android versions
- Test on different screen sizes
- Test all app features thoroughly

### 3. Beta Testing
- Use Google Play Console's internal testing track
- Add testers via email addresses
- Test the app thoroughly before production release

## Final Checklist

- [ ] Google Play Console account created and verified
- [ ] App assets (icons, screenshots) prepared
- [ ] Service account JSON file downloaded
- [ ] App details and descriptions written
- [ ] Privacy policy created and hosted
- [ ] App thoroughly tested
- [ ] Production build created
- [ ] App submitted to Google Play Store

## Support Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/) 