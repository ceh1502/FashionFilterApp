# 🔧 API Setup Guide - Fix 400 Error

## **Quick Fix Steps**

### **1. Set Up Google Cloud Vision API**

#### **Step 1: Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing for your project

#### **Step 2: Enable Vision API**
1. Go to [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Search for "Cloud Vision API"
3. Click "Enable"

#### **Step 3: Create API Key**
1. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

#### **Step 4: Configure API Key in Your App**

**Option A: Environment Variables (Recommended)**
```bash
# Create .env file in your project root
GOOGLE_CLOUD_API_KEY=your_actual_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

**Option B: Direct Configuration**
Edit `src/config/api.js`:
```javascript
export const API_CONFIG = {
  GOOGLE_CLOUD: {
    API_KEY: 'your_actual_api_key_here', // Replace this
    VISION_ENDPOINT: 'https://vision.googleapis.com/v1/images:annotate',
  },
  // ... rest of config
};
```

### **2. Test Your Setup**

#### **Step 1: Run Debug**
1. Open your app
2. Go to Body Type Analysis screen
3. Try to analyze an image
4. If you get an error, tap "디버그 실행" (Debug)
5. Check the console output

#### **Step 2: Check Console Output**
Look for these messages:
- ✅ `API Keys: Valid` - Your keys are configured
- ✅ `Vision API: Working` - API is working correctly
- ❌ `API Keys: Invalid` - Check your API key configuration
- ❌ `Vision API: Failed` - Check API key and billing

### **3. Common 400 Error Solutions**

#### **Error: "Invalid API key"**
**Solution:**
- Make sure you copied the entire API key
- Check for extra spaces or characters
- Verify the key is from the correct Google Cloud project

#### **Error: "API quota exceeded"**
**Solution:**
- Check your Google Cloud billing
- Vision API has free tier: 1,000 requests/month
- Upgrade billing plan if needed

#### **Error: "Invalid image format"**
**Solution:**
- Try a different image
- Make sure image is JPEG, PNG, or GIF
- Check image file size (should be < 10MB)

#### **Error: "Image too large"**
**Solution:**
- Use a smaller image
- Compress the image before uploading
- Maximum size: 10MB

### **4. Environment Variables Setup**

#### **React Native with Expo**
```bash
# Install expo-constants
npm install expo-constants

# Create app.config.js
export default {
  expo: {
    // ... other config
    extra: {
      googleCloudApiKey: process.env.GOOGLE_CLOUD_API_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY,
    },
  },
};
```

#### **React Native CLI**
```bash
# Install react-native-dotenv
npm install react-native-dotenv

# Add to babel.config.js
module.exports = {
  plugins: [
    ["module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env",
    }]
  ]
};
```

### **5. Security Best Practices**

#### **Never Commit API Keys**
```bash
# Add to .gitignore
.env
*.env
```

#### **Use Environment Variables**
```javascript
// Good
API_KEY: process.env.GOOGLE_CLOUD_API_KEY

// Bad - Never do this
API_KEY: 'AIzaSyC...'
```

### **6. Testing Checklist**

- [ ] Google Cloud project created
- [ ] Billing enabled
- [ ] Vision API enabled
- [ ] API key created
- [ ] API key configured in app
- [ ] App restarted after configuration
- [ ] Debug test passed
- [ ] Image analysis working

### **7. Still Getting 400 Error?**

#### **Run Full Debug**
```javascript
import { runFullDebug } from '../utils/debugAI';

// In your component
useEffect(() => {
  runFullDebug().then(results => {
    console.log('Debug results:', results);
  });
}, []);
```

#### **Check Console Output**
Look for specific error messages:
- `API key is not configured` → Set your API key
- `Invalid API key` → Check key format
- `Quota exceeded` → Check billing
- `Bad request` → Check image format

#### **Common Issues**
1. **API Key Format**: Should be ~39 characters, starts with "AIza"
2. **Project Mismatch**: Make sure API key is from correct project
3. **Billing**: Vision API requires billing to be enabled
4. **Image Format**: Use JPEG, PNG, or GIF only
5. **Network**: Check internet connection

### **8. Support**

If you're still having issues:
1. Check the console output from debug
2. Verify your Google Cloud setup
3. Test with a simple 1x1 pixel image
4. Check your billing status

---

**Need Help?** The debug utility will show you exactly what's wrong and how to fix it! 