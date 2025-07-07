// AI Debugging Utility
import { API_CONFIG, validateAPIKeys } from '../config/api';

// 디버깅 정보 출력
export const debugAISetup = () => {
  console.log('🔍 AI Setup Debug Information:');
  console.log('================================');
  
  // 1. API 키 상태 확인
  const apiValidation = validateAPIKeys();
  console.log('1. API Key Status:');
  if (apiValidation.isValid) {
    console.log('   ✅ All API keys are configured');
  } else {
    console.log('   ❌ API key issues found:');
    apiValidation.errors.forEach(error => console.log(`      - ${error}`));
  }
  
  // 2. 환경 변수 확인
  console.log('\n2. Environment Variables:');
  console.log(`   GOOGLE_CLOUD_API_KEY: ${API_CONFIG.GOOGLE_CLOUD.API_KEY ? 'Set' : 'Not set'}`);
  console.log(`   OPENAI_API_KEY: ${API_CONFIG.OPENAI.API_KEY ? 'Set' : 'Not set'}`);
  
  // 3. API 키 형식 확인
  console.log('\n3. API Key Format Check:');
  if (API_CONFIG.GOOGLE_CLOUD.API_KEY && API_CONFIG.GOOGLE_CLOUD.API_KEY !== 'YOUR_GOOGLE_CLOUD_API_KEY') {
    const keyLength = API_CONFIG.GOOGLE_CLOUD.API_KEY.length;
    const keyPrefix = API_CONFIG.GOOGLE_CLOUD.API_KEY.substring(0, 10);
    console.log(`   Google Cloud API Key: ${keyLength} characters, starts with: ${keyPrefix}...`);
  } else {
    console.log('   Google Cloud API Key: Not properly configured');
  }
  
  return apiValidation;
};

// Google Cloud Vision API 테스트 (상세)
export const testGoogleVisionAPIDetailed = async () => {
  console.log('\n🔍 Testing Google Cloud Vision API (Detailed):');
  console.log('==============================================');
  
  // 1. API 키 확인
  if (!API_CONFIG.GOOGLE_CLOUD.API_KEY || API_CONFIG.GOOGLE_CLOUD.API_KEY === 'YOUR_GOOGLE_CLOUD_API_KEY') {
    console.log('❌ Google Cloud API key is not configured');
    return false;
  }
  
  // 2. 테스트 이미지 생성 (1x1 픽셀, 유효한 base64)
  const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  console.log('✅ Test image created (1x1 pixel)');
  
  // 3. API 요청 구성
  const endpoint = `${API_CONFIG.GOOGLE_CLOUD.VISION_ENDPOINT}?key=${API_CONFIG.GOOGLE_CLOUD.API_KEY}`;
  const requestBody = {
    requests: [
      {
        image: {
          content: testImage
        },
        features: [
          {
            type: 'LABEL_DETECTION',
            maxResults: 5
          }
        ]
      }
    ]
  };
  
  console.log('📡 Sending request to Google Cloud Vision API...');
  console.log(`   Endpoint: ${API_CONFIG.GOOGLE_CLOUD.VISION_ENDPOINT}`);
  console.log(`   API Key length: ${API_CONFIG.GOOGLE_CLOUD.API_KEY.length} characters`);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API Error Response:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Status Text: ${response.statusText}`);
      console.log(`   Error Body: ${errorText}`);
      
      // 400 에러 분석
      if (response.status === 400) {
        console.log('\n🔍 400 Error Analysis:');
        if (errorText.includes('API key')) {
          console.log('   ❌ Invalid API key');
          console.log('   💡 Solution: Check your Google Cloud API key');
        } else if (errorText.includes('quota')) {
          console.log('   ❌ Quota exceeded');
          console.log('   💡 Solution: Check your billing or wait for quota reset');
        } else if (errorText.includes('image')) {
          console.log('   ❌ Invalid image format');
          console.log('   💡 Solution: Check image encoding');
        } else if (errorText.includes('size')) {
          console.log('   ❌ Image too large');
          console.log('   💡 Solution: Use smaller image');
        } else {
          console.log('   ❌ Bad request');
          console.log('   💡 Solution: Check request format');
        }
      }
      
      return false;
    }
    
    const result = await response.json();
    console.log('✅ API Response Success:');
    console.log(`   Labels found: ${result.responses[0].labelAnnotations?.length || 0}`);
    console.log('   API is working correctly!');
    
    return true;
    
  } catch (error) {
    console.log('❌ Network Error:');
    console.log(`   Error: ${error.message}`);
    console.log('   💡 Solution: Check internet connection and API endpoint');
    return false;
  }
};

// 이미지 변환 테스트
export const testImageConversion = async (imageUri) => {
  console.log('\n🖼️ Testing Image Conversion:');
  console.log('============================');
  
  try {
    // XMLHttpRequest를 사용한 이미지 변환
    const base64Image = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
          const base64data = reader.result.split(',')[1];
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open('GET', imageUri);
      xhr.responseType = 'blob';
      xhr.send();
    });
    
    console.log('✅ Image converted to base64');
    console.log(`   Base64 length: ${base64Image.length} characters`);
    console.log(`   Base64 preview: ${base64Image.substring(0, 50)}...`);
    
    // base64 유효성 검사
    if (base64Image.length < 100) {
      console.log('❌ Base64 data too short - image may be corrupted');
      return false;
    }
    
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Image)) {
      console.log('❌ Invalid base64 format');
      return false;
    }
    
    console.log('✅ Base64 format is valid');
    return base64Image;
    
  } catch (error) {
    console.log('❌ Image conversion failed:');
    console.log(`   Error: ${error.message}`);
    return false;
  }
};

// 전체 디버깅 실행
export const runFullDebug = async () => {
  console.log('🚀 Running Full AI Debug...');
  console.log('==========================');
  
  // 1. 기본 설정 확인
  const apiValidation = debugAISetup();
  
  // 2. Google Cloud Vision API 테스트
  const visionTest = await testGoogleVisionAPIDetailed();
  
  // 3. 결과 요약
  console.log('\n📋 Debug Summary:');
  console.log('=================');
  console.log(`   API Keys: ${apiValidation.isValid ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`   Vision API: ${visionTest ? '✅ Working' : '❌ Failed'}`);
  
  if (!apiValidation.isValid) {
    console.log('\n🔧 Next Steps:');
    console.log('   1. Set up your API keys in .env file');
    console.log('   2. Restart your development server');
    console.log('   3. Run this debug again');
  }
  
  if (!visionTest) {
    console.log('\n🔧 Vision API Issues:');
    console.log('   1. Check your Google Cloud API key');
    console.log('   2. Enable Vision API in Google Cloud Console');
    console.log('   3. Check billing and quotas');
  }
  
  return {
    apiKeysValid: apiValidation.isValid,
    visionAPIWorking: visionTest
  };
};

// 사용법:
// import { runFullDebug } from '../utils/debugAI';
// 
// // 컴포넌트에서 실행
// useEffect(() => {
//   runFullDebug().then(results => {
//     console.log('Debug results:', results);
//   });
// }, []); 