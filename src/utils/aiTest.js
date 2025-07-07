// AI API Test Utility
import aiService from '../services/aiService';
import { API_CONFIG } from '../config/api';

// Test AI APIs
export const testAIAPIs = async () => {
  console.log('🧪 Testing AI APIs...');
  
  try {
    // Test 1: Google Cloud Vision API
    console.log('📸 Testing Google Cloud Vision API...');
    await testVisionAPI();
    
    // Test 2: OpenAI GPT API
    console.log('🤖 Testing OpenAI GPT API...');
    await testGPTAPI();
    
    console.log('✅ All AI APIs are working correctly!');
    return true;
  } catch (error) {
    console.error('❌ AI API test failed:', error);
    return false;
  }
};

// Test Vision API
const testVisionAPI = async () => {
  // Create a simple test image (1x1 pixel, base64 encoded)
  const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  
  try {
    const visionResult = await aiService.callGoogleVisionAPI(testImage);
    console.log('✅ Vision API Response:', visionResult);
    return visionResult;
  } catch (error) {
    console.error('❌ Vision API Error:', error.message);
    throw error;
  }
};

// Test GPT API
const testGPTAPI = async () => {
  const testAnalysis = {
    bodyType: '보통',
    height: '보통',
    shoulderWidth: '보통'
  };
  
  try {
    const gptResult = await aiService.callOpenAIRecommendationAPI(testAnalysis);
    console.log('✅ GPT API Response:', gptResult);
    return gptResult;
  } catch (error) {
    console.error('❌ GPT API Error:', error.message);
    throw error;
  }
};

// Test image processing
export const testImageProcessing = async (imageUri) => {
  console.log('🖼️ Testing image processing...');
  
  try {
    // Convert image to base64
    const base64Image = await aiService.convertImageToBase64(imageUri);
    console.log('✅ Image converted to base64');
    
    // Process with Vision API
    const visionResult = await aiService.callGoogleVisionAPI(base64Image);
    console.log('✅ Vision API processed image');
    
    // Process results
    const analysisResult = aiService.processVisionResults(visionResult, 'google');
    console.log('✅ Analysis result:', analysisResult);
    
    return analysisResult;
  } catch (error) {
    console.error('❌ Image processing failed:', error);
    throw error;
  }
};

// Test recommendation generation
export const testRecommendationGeneration = async (analysisResult) => {
  console.log('👕 Testing recommendation generation...');
  
  try {
    const recommendations = await aiService.callOpenAIRecommendationAPI(analysisResult);
    console.log('✅ Recommendations generated:', recommendations);
    
    const transformedRecommendations = aiService.transformRecommendations(recommendations);
    console.log('✅ Transformed recommendations:', transformedRecommendations);
    
    return transformedRecommendations;
  } catch (error) {
    console.error('❌ Recommendation generation failed:', error);
    throw error;
  }
};

// Test retry mechanism
export const testRetryMechanism = async () => {
  console.log('🔄 Testing retry mechanism...');
  
  let attemptCount = 0;
  const failingFunction = async () => {
    attemptCount++;
    if (attemptCount < 3) {
      throw new Error(`Simulated failure attempt ${attemptCount}`);
    }
    return 'Success after retries';
  };
  
  try {
    const result = await aiService.retryRequest(failingFunction, 3);
    console.log('✅ Retry mechanism working:', result);
    return result;
  } catch (error) {
    console.error('❌ Retry mechanism failed:', error);
    throw error;
  }
};

// Test configuration
export const testConfiguration = () => {
  console.log('⚙️ Testing configuration...');
  
  const requiredKeys = [
    'GOOGLE_CLOUD.API_KEY',
    'OPENAI.API_KEY'
  ];
  
  const missingKeys = [];
  
  for (const key of requiredKeys) {
    const [section, field] = key.split('.');
    if (!API_CONFIG[section] || !API_CONFIG[section][field]) {
      missingKeys.push(key);
    }
  }
  
  if (missingKeys.length > 0) {
    console.error('❌ Missing API keys:', missingKeys);
    return false;
  }
  
  console.log('✅ All required API keys are configured');
  return true;
};

// Run all tests
export const runAllTests = async () => {
  console.log('🚀 Running all AI tests...');
  
  const results = {
    configuration: testConfiguration(),
    visionAPI: false,
    gptAPI: false,
    retryMechanism: false
  };
  
  if (!results.configuration) {
    console.error('❌ Configuration test failed. Please check your API keys.');
    return results;
  }
  
  try {
    results.visionAPI = await testVisionAPI();
  } catch (error) {
    console.error('❌ Vision API test failed');
  }
  
  try {
    results.gptAPI = await testGPTAPI();
  } catch (error) {
    console.error('❌ GPT API test failed');
  }
  
  try {
    results.retryMechanism = await testRetryMechanism();
  } catch (error) {
    console.error('❌ Retry mechanism test failed');
  }
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('🎉 All tests passed! Your AI setup is ready.');
  } else {
    console.log('⚠️ Some tests failed. Check the errors above.');
  }
  
  return results;
};

// Usage example:
// import { runAllTests } from '../utils/aiTest';
// 
// // In your component or test file
// useEffect(() => {
//   runAllTests().then(results => {
//     console.log('Test results:', results);
//   });
// }, []); 