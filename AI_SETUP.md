# AI API Setup Guide for Fashion App

## Overview
This guide explains how to implement real AI APIs for body type analysis and fashion recommendations in your React Native fashion app.

## Current Implementation vs Real AI

### Before (Mock Data)
```javascript
// Lines 115-132: Mock analysis
await new Promise(resolve => setTimeout(resolve, 3000)); // Fake delay
const randomBodyType = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
const mockAnalysisResult = {
  bodyType: randomBodyType,
  height: randomHeight,
  shoulderWidth: randomShoulder,
  confidence: Math.floor(Math.random() * 20) + 80,
};
```

### After (Real AI)
```javascript
// Real AI analysis using Google Cloud Vision API
const analysisResult = await aiService.retryRequest(async () => {
  const base64Image = await aiService.convertImageToBase64(selectedImage.uri);
  const visionResult = await aiService.callGoogleVisionAPI(base64Image);
  return aiService.processVisionResults(visionResult, 'google');
});
```

## Required AI Services

### 1. Computer Vision API (Body Type Analysis)
Choose one of the following:

#### Option A: Google Cloud Vision API (Recommended)
- **Cost**: $1.50 per 1,000 requests
- **Features**: Label detection, face detection, object localization
- **Setup**: 
  1. Create Google Cloud account
  2. Enable Vision API
  3. Create API key
  4. Set environment variable: `GOOGLE_CLOUD_API_KEY`

#### Option B: Azure Computer Vision
- **Cost**: $1.00 per 1,000 transactions
- **Features**: Face detection, image tagging, object detection
- **Setup**:
  1. Create Azure account
  2. Create Computer Vision resource
  3. Get API key and endpoint
  4. Set environment variables: `AZURE_VISION_API_KEY`, `AZURE_VISION_ENDPOINT`

#### Option C: Clarifai
- **Cost**: Free tier available, then $5/month
- **Features**: General image recognition
- **Setup**:
  1. Create Clarifai account
  2. Get API key
  3. Set environment variable: `CLARIFAI_API_KEY`

### 2. Language Model API (Fashion Recommendations)
Choose one of the following:

#### Option A: OpenAI GPT (Recommended)
- **Cost**: $0.002 per 1K tokens
- **Features**: Natural language generation, structured output
- **Setup**:
  1. Create OpenAI account
  2. Get API key
  3. Set environment variable: `OPENAI_API_KEY`

#### Option B: Azure OpenAI
- **Cost**: Similar to OpenAI
- **Features**: Same as OpenAI but Azure-hosted
- **Setup**:
  1. Create Azure OpenAI resource
  2. Deploy GPT model
  3. Get API key and endpoint

## Setup Instructions

### Step 1: Environment Variables
Create a `.env` file in your project root:

```env
# Google Cloud Vision API
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here

# OpenAI GPT API
OPENAI_API_KEY=your_openai_api_key_here

# Alternative APIs (optional)
AZURE_VISION_API_KEY=your_azure_vision_api_key_here
AZURE_VISION_ENDPOINT=your_azure_vision_endpoint_here
CLARIFAI_API_KEY=your_clarifai_api_key_here
```

### Step 2: Install Dependencies
```bash
npm install react-native-dotenv
```

### Step 3: Configure Babel
Update `babel.config.js`:
```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true,
    }],
  ],
};
```

### Step 4: Update API Configuration
The app automatically uses environment variables. If you want to use different APIs, update `src/config/api.js`:

```javascript
export const API_CONFIG = {
  // Change provider here
  VISION_PROVIDER: 'google', // 'google', 'azure', 'clarifai'
  RECOMMENDATION_PROVIDER: 'openai', // 'openai', 'azure-openai'
  
  GOOGLE_CLOUD: {
    API_KEY: process.env.GOOGLE_CLOUD_API_KEY,
    VISION_ENDPOINT: 'https://vision.googleapis.com/v1/images:annotate',
  },
  // ... other configs
};
```

## API Usage Examples

### 1. Google Cloud Vision API
```javascript
// Request
{
  "requests": [
    {
      "image": {
        "content": "base64_encoded_image"
      },
      "features": [
        {
          "type": "LABEL_DETECTION",
          "maxResults": 20
        },
        {
          "type": "FACE_DETECTION",
          "maxResults": 1
        },
        {
          "type": "OBJECT_LOCALIZATION",
          "maxResults": 10
        }
      ]
    }
  ]
}

// Response
{
  "responses": [
    {
      "labelAnnotations": [
        {
          "description": "person",
          "score": 0.98
        },
        {
          "description": "clothing",
          "score": 0.95
        }
      ],
      "faceAnnotations": [...],
      "localizedObjectAnnotations": [...]
    }
  ]
}
```

### 2. OpenAI GPT API
```javascript
// Request
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "다음 체형 분석 결과를 바탕으로 패션 추천을 해주세요: 체형: 슬림, 키: 보통, 어깨 너비: 작음"
    }
  ],
  "max_tokens": 500
}

// Response
{
  "choices": [
    {
      "message": {
        "content": "{\"recommendations\": [{\"name\": \"오버핏 후드\", \"reason\": \"볼륨감을 주어 균형잡힌 실루엣\", \"category\": \"상의\"}]}"
      }
    }
  ]
}
```

## Cost Estimation

### Monthly Usage (1,000 users)
- **Google Cloud Vision**: ~$15/month
- **OpenAI GPT**: ~$10/month
- **Total**: ~$25/month

### Cost Optimization
1. **Caching**: Cache analysis results for similar images
2. **Batch Processing**: Process multiple images together
3. **Fallback System**: Use mock data when APIs are unavailable
4. **Rate Limiting**: Implement user request limits

## Error Handling

The app includes comprehensive error handling:

```javascript
try {
  const analysisResult = await aiService.retryRequest(async () => {
    // AI analysis
  });
} catch (error) {
  // Fallback to mock data
  const fallbackResult = getMockAnalysis();
  setAnalysisResult(fallbackResult);
}
```

## Security Considerations

1. **API Key Protection**: Never commit API keys to version control
2. **Environment Variables**: Use `.env` files for local development
3. **Backend Proxy**: For production, proxy API calls through your backend
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Input Validation**: Validate images before sending to APIs

## Testing

### Mock Mode
For development/testing, you can enable mock mode:

```javascript
// In src/config/api.js
export const MOCK_MODE = process.env.NODE_ENV === 'development';

// In aiService.js
if (MOCK_MODE) {
  return getMockAnalysis();
}
```

### API Testing
Test your API setup:

```javascript
// Test function
const testAIAPIs = async () => {
  try {
    // Test Vision API
    const testImage = 'base64_test_image';
    const visionResult = await aiService.callGoogleVisionAPI(testImage);
    console.log('Vision API working:', visionResult);
    
    // Test GPT API
    const testAnalysis = { bodyType: '보통', height: '보통', shoulderWidth: '보통' };
    const gptResult = await aiService.callOpenAIRecommendationAPI(testAnalysis);
    console.log('GPT API working:', gptResult);
  } catch (error) {
    console.error('API test failed:', error);
  }
};
```

## Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Check environment variables
   - Verify API key format
   - Ensure API is enabled

2. **Network Errors**
   - Check internet connection
   - Verify API endpoints
   - Check firewall settings

3. **Rate Limiting**
   - Implement exponential backoff
   - Add request queuing
   - Monitor API usage

4. **Image Format Issues**
   - Ensure images are base64 encoded
   - Check image size limits
   - Validate image format

### Debug Mode
Enable debug logging:

```javascript
// In src/config/api.js
export const DEBUG_MODE = true;

// In aiService.js
if (DEBUG_MODE) {
  console.log('API Request:', requestBody);
  console.log('API Response:', response);
}
```

## Next Steps

1. **Set up API keys** following the instructions above
2. **Test the APIs** using the provided test functions
3. **Monitor costs** and implement optimization strategies
4. **Add more AI features** like style preference learning
5. **Implement caching** for better performance
6. **Add offline support** with local AI models

## Support

For issues with:
- **Google Cloud Vision**: [Google Cloud Support](https://cloud.google.com/support)
- **OpenAI**: [OpenAI Help Center](https://help.openai.com)
- **Azure**: [Azure Support](https://azure.microsoft.com/support)
- **App Implementation**: Check the code comments and error messages 