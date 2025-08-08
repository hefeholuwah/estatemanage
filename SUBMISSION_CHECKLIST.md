# Google Play Console Submission Checklist

## ✅ Pre-Submission Requirements

### 1. Google Play Console Account
- [ ] Create Google Play Console account
- [ ] Pay $25 registration fee
- [ ] Complete account verification

### 2. App Assets
- [ ] Replace placeholder icons with actual images
- [ ] Create feature graphic (1024x500 PNG)
- [ ] Prepare app screenshots (1080x1920 for phones)

### 3. Google Service Account
- [ ] Create Google Cloud project
- [ ] Enable Google Play Android Developer API
- [ ] Create service account with Editor role
- [ ] Download JSON key file as `google-service-account.json`

## ✅ App Creation in Google Play Console

### 1. Create New App
- [ ] Go to https://play.google.com/console
- [ ] Click "Create app"
- [ ] Fill in app details:
  - App name: "Estate Manage"
  - Default language: English
  - App or game: App
  - Free or paid: Free
  - Category: Business
  - Tags: Productivity, Management

### 2. App Content
- [ ] Upload app bundle (.aab file)
- [ ] Add app description (from GOOGLE_PLAY_CONTENT.md)
- [ ] Add short description
- [ ] Upload screenshots (minimum 2)
- [ ] Upload feature graphic
- [ ] Complete content rating questionnaire

### 3. Store Listing
- [ ] Add privacy policy URL
- [ ] Add app icon
- [ ] Add promotional text
- [ ] Add release notes

## ✅ First Manual Submission

### 1. Production Release
- [ ] Go to "Production" in left sidebar
- [ ] Click "Create new release"
- [ ] Upload app bundle from: https://expo.dev/artifacts/eas/f8waN6nEGVUyf7MxfCMRVT.aab
- [ ] Add release notes
- [ ] Save release

### 2. Complete Store Listing
- [ ] Fill in all required app details
- [ ] Upload all required images
- [ ] Add privacy policy
- [ ] Complete content rating

### 3. Submit for Review
- [ ] Review all information
- [ ] Click "Review release"
- [ ] Submit for Google's review

## ✅ Post-Submission

### 1. Monitor Review Status
- [ ] Check review status in Google Play Console
- [ ] Address any issues if app is rejected
- [ ] Wait for approval (typically 1-7 days)

### 2. After Approval
- [ ] App will be live on Google Play Store
- [ ] Future updates can use automated submission:
  ```bash
  npx eas submit --platform android --profile production
  ```

## 📋 Required Content Summary

### App Details
- **Name**: Estate Manage
- **Package**: com.estatemanage.estateone
- **Category**: Business
- **Description**: See GOOGLE_PLAY_CONTENT.md

### Required Images
- App icon (1024x1024)
- Feature graphic (1024x500)
- Screenshots (minimum 2, 1080x1920)

### Privacy Policy
- Host privacy policy at public URL
- Include URL in store listing

### App Bundle
- Download from: https://expo.dev/artifacts/eas/f8waN6nEGVUyf7MxfCMRVT.aab
- Upload to Google Play Console

## 🚨 Common Issues to Avoid

1. **Missing Privacy Policy**: Must have public privacy policy URL
2. **Incomplete Screenshots**: Need at least 2 phone screenshots
3. **Wrong Package Name**: Ensure matches app.json configuration
4. **Missing Content Rating**: Complete questionnaire before submission
5. **Incorrect App Bundle**: Use .aab file, not .apk

## 📞 Support Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/) 