import { API_CONFIG, API_SETTINGS, ERROR_MESSAGES, BODY_ANALYSIS_CONFIG, RECOMMENDATION_CONFIG } from '../config/api';
import products from '../data/products.json';

// AI 서비스 클래스
class AIService {
  constructor() {
    this.retryAttempts = API_SETTINGS.RETRY_ATTEMPTS;
    this.retryDelay = API_SETTINGS.RETRY_DELAY;
  }

  // 재시도 로직
  async retryRequest(requestFn, attempts = this.retryAttempts) {
    for (let i = 0; i < attempts; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === attempts - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (i + 1)));
      }
    }
  }

  // 이미지를 base64로 변환
  async convertImageToBase64(imageUri) {
    return new Promise((resolve, reject) => {
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
  }

  // Google Cloud Vision API 호출
  async callGoogleVisionAPI(base64Image) {
    const endpoint = `${API_CONFIG.GOOGLE_CLOUD.VISION_ENDPOINT}?key=${API_CONFIG.GOOGLE_CLOUD.API_KEY}`;
    
    // API 키 유효성 검사
    if (!API_CONFIG.GOOGLE_CLOUD.API_KEY || API_CONFIG.GOOGLE_CLOUD.API_KEY === 'YOUR_GOOGLE_CLOUD_API_KEY') {
      throw new Error('Google Cloud API key is not configured. Please set GOOGLE_CLOUD_API_KEY in your environment variables.');
    }
    
    // base64 이미지 유효성 검사
    if (!base64Image || base64Image.length < 100) {
      throw new Error('Invalid image data. Image is too small or corrupted.');
    }
    
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 20
            },
            {
              type: 'FACE_DETECTION',
              maxResults: 1
            },
            {
              type: 'OBJECT_LOCALIZATION',
              maxResults: 10
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });


      return await response.json();
    } catch (error) {
      if (error.message.includes('Vision API error')) {
        throw error; // 이미 처리된 에러는 그대로 전달
      }
      throw new Error(`Network error: ${error.message}`);
    }
  }

  // Vision API 결과를 체형 분석으로 처리
  processVisionResults(visionResult, provider = 'google') {
    return this.processGoogleVisionResults(visionResult);
  }

  // Google Vision 결과 처리
  processGoogleVisionResults(visionResult) {
    const labels = visionResult.responses[0].labelAnnotations || [];
    console.log('Vision API Labels:', labels.map(label => label.description));
    const bodyType = this.analyzeBodyTypeFromLabels(labels);
    return { bodyType };
  }


  // 라벨에서 체형 분석
  analyzeBodyTypeFromLabels(labels) {
    const labelTexts = labels.map(label => label.description.toLowerCase());
    
    for (const [bodyType, keywords] of Object.entries(BODY_ANALYSIS_CONFIG.BODY_TYPE_KEYWORDS)) {
      for (const keyword of keywords) {
        if (labelTexts.some(text => text.includes(keyword))) {
          return bodyType;
        }
      }
    }
    return '보통'; // 기본값
  }


  // 카테고리별 이미지 매핑
  getImageByCategory(category) {
    // Return filename string matching imageMap keys
    const imageMap = {
      '상의': 'AI_Fit_T.jpeg',
      '하의': 'AI_Straight_Jeans.jpeg',
      '신발': 'AI_Sneakers.jpeg',
      '액세서리': 'AI_slim1.jpeg'
    };
    return imageMap[category] || 'AI_slim1.jpeg';
  }

  // 가격 생성
  generatePrice(category) {
    const [min, max] = RECOMMENDATION_CONFIG.PRICE_RANGES[category] || [50000, 100000];
    const price = Math.floor(Math.random() * (max - min + 1)) + min;
    return `${price.toLocaleString()}원`;
  }

  // 브랜드 생성
  generateBrand(category) {
    const categoryBrands = RECOMMENDATION_CONFIG.BRANDS[category] || ['UNIQLO'];
    return categoryBrands[Math.floor(Math.random() * categoryBrands.length)];
  }
}

// 싱글톤 인스턴스 생성
const aiService = new AIService();

export default aiService; 