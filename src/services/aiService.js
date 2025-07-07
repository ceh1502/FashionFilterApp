import { API_CONFIG, API_SETTINGS, ERROR_MESSAGES, BODY_ANALYSIS_CONFIG, RECOMMENDATION_CONFIG } from '../config/api';

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

      // if (!response.ok) {
      //   const errorText = await response.text();
      //   let errorMessage = `Vision API error: ${response.status}`;
        
      //   // 400 에러에 대한 구체적인 메시지
      //   if (response.status === 400) {
      //     if (errorText.includes('API key')) {
      //       errorMessage = 'Invalid API key. Please check your Google Cloud API key.';
      //     } else if (errorText.includes('quota')) {
      //       errorMessage = 'API quota exceeded. Please try again later.';
      //     } else if (errorText.includes('image')) {
      //       errorMessage = 'Invalid image format. Please select a different image.';
      //     } else if (errorText.includes('size')) {
      //       errorMessage = 'Image is too large. Please select a smaller image.';
      //     } else {
      //       errorMessage = 'Bad request. Please check your image and try again.';
      //     }
      //   } else if (response.status === 403) {
      //     errorMessage = 'API access denied. Please check your API key and billing.';
      //   } else if (response.status === 429) {
      //     errorMessage = 'Too many requests. Please wait and try again.';
      //   }
        
      //   throw new Error(errorMessage);
      // }

      return await response.json();
    } catch (error) {
      if (error.message.includes('Vision API error')) {
        throw error; // 이미 처리된 에러는 그대로 전달
      }
      throw new Error(`Network error: ${error.message}`);
    }
  }

  // Azure Computer Vision API 호출 (대안)
  async callAzureVisionAPI(imageUri) {
    const endpoint = `${API_CONFIG.AZURE.ENDPOINT}/vision/v3.2/analyze`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': API_CONFIG.AZURE.API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: imageUri,
        visualFeatures: ['Faces', 'Tags', 'Description'],
        details: ['Celebrities', 'Landmarks'],
      })
    });

    if (!response.ok) {
      throw new Error(`Azure Vision API error: ${response.status}`);
    }

    return await response.json();
  }

  // Vision API 결과를 체형 분석으로 처리
  processVisionResults(visionResult, provider = 'google') {
    if (provider === 'google') {
      return this.processGoogleVisionResults(visionResult);
    } else if (provider === 'azure') {
      return this.processAzureVisionResults(visionResult);
    }
    throw new Error('Unsupported vision provider');
  }

  // Google Vision 결과 처리
  processGoogleVisionResults(visionResult) {
    const labels = visionResult.responses[0].labelAnnotations || [];
    const faces = visionResult.responses[0].faceAnnotations || [];
    const objects = visionResult.responses[0].localizedObjectAnnotations || [];

    const bodyType = this.analyzeBodyTypeFromLabels(labels);
    const height = this.analyzeHeightFromObjects(objects);
    const shoulderWidth = this.analyzeShoulderWidthFromObjects(objects);
    const confidence = this.calculateConfidence(labels, faces, objects);

    return {
      bodyType,
      height,
      shoulderWidth,
      confidence,
      rawData: { labels, faces, objects }
    };
  }

  // // Azure Vision 결과 처리
  // processAzureVisionResults(visionResult) {
  //   const tags = visionResult.tags || [];
  //   const faces = visionResult.faces || [];
  //   const description = visionResult.description || {};

  //   const bodyType = this.analyzeBodyTypeFromAzureTags(tags);
  //   const height = this.analyzeHeightFromAzureFaces(faces);
  //   const shoulderWidth = this.analyzeShoulderWidthFromAzureFaces(faces);
  //   const confidence = this.calculateAzureConfidence(tags, faces, description);

  //   return {
  //     bodyType,
  //     height,
  //     shoulderWidth,
  //     confidence,
  //     rawData: { tags, faces, description }
  //   };
  // }

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

  // Azure 태그에서 체형 분석
  // analyzeBodyTypeFromAzureTags(tags) {
  //   const tagNames = tags.map(tag => tag.name.toLowerCase());
    
  //   for (const [bodyType, keywords] of Object.entries(BODY_ANALYSIS_CONFIG.BODY_TYPE_KEYWORDS)) {
  //     for (const keyword of keywords) {
  //       if (tagNames.some(name => name.includes(keyword))) {
  //         return bodyType;
  //       }
  //     }
  //   }

  //   return '보통';
  // }

  // 객체 위치에서 키 분석
  analyzeHeightFromObjects(objects) {
    const personObjects = (objects || []).filter(obj => obj.name === 'Person');
    
    if (personObjects.length > 0) {
      const person = personObjects[0];
      if (
        person.boundingPoly &&
        Array.isArray(person.boundingPoly.vertices) &&
        person.boundingPoly.vertices.length >= 4 &&
        person.boundingPoly.vertices[0] &&
        person.boundingPoly.vertices[3] &&
        typeof person.boundingPoly.vertices[0].y === 'number' &&
        typeof person.boundingPoly.vertices[3].y === 'number'
      ) {
        const height = person.boundingPoly.vertices[3].y - person.boundingPoly.vertices[0].y;
        if (height > BODY_ANALYSIS_CONFIG.SIZE_THRESHOLDS.HEIGHT.LARGE) return '큼';
        if (height < BODY_ANALYSIS_CONFIG.SIZE_THRESHOLDS.HEIGHT.SMALL) return '작음';
        return '보통';
      }
    }
    return '보통';
  }

  // // Azure 얼굴에서 키 분석
  // analyzeHeightFromAzureFaces(faces) {
  //   if (faces.length > 0) {
  //     const face = faces[0];
  //     const height = face.faceRectangle.height;
      
  //     if (height > 150) return '큼';
  //     if (height < 100) return '작음';
  //     return '보통';
  //   }
    
  //   return '보통';
  // }

  // 객체 위치에서 어깨 너비 분석
  analyzeShoulderWidthFromObjects(objects) {
    const personObjects = (objects || []).filter(obj => obj.name === 'Person');
    if (personObjects.length > 0) {
      const person = personObjects[0];
      if (
        person.boundingPoly &&
        Array.isArray(person.boundingPoly.vertices) &&
        person.boundingPoly.vertices.length >= 2 &&
        person.boundingPoly.vertices[0] &&
        person.boundingPoly.vertices[1] &&
        typeof person.boundingPoly.vertices[0].x === 'number' &&
        typeof person.boundingPoly.vertices[1].x === 'number'
      ) {
        const width = person.boundingPoly.vertices[1].x - person.boundingPoly.vertices[0].x;
        if (width > BODY_ANALYSIS_CONFIG.SIZE_THRESHOLDS.WIDTH.LARGE) return '큼';
        if (width < BODY_ANALYSIS_CONFIG.SIZE_THRESHOLDS.WIDTH.SMALL) return '작음';
        return '보통';
      }
    }
    return '보통';
  }

  // Azure 얼굴에서 어깨 너비 분석
  // analyzeShoulderWidthFromAzureFaces(faces) {
  //   if (faces.length > 0) {
  //     const face = faces[0];
  //     const width = face.faceRectangle.width;
      
  //     if (width > 120) return '큼';
  //     if (width < 80) return '작음';
  //     return '보통';
  //   }
    
  //   return '보통';
  // }

  // 신뢰도 계산 (Google)
  calculateConfidence(labels, faces, objects) {
    let confidence = 50; // 기본값
    
    // 라벨 신뢰도
    if (labels.length > 0) {
      const avgLabelConfidence = labels.reduce((sum, label) => sum + label.score, 0) / labels.length;
      confidence += avgLabelConfidence * BODY_ANALYSIS_CONFIG.CONFIDENCE_WEIGHTS.LABEL_DETECTION * 100;
    }
    
    // 얼굴 감지 신뢰도
    if (faces.length > 0) {
      confidence += BODY_ANALYSIS_CONFIG.CONFIDENCE_WEIGHTS.FACE_DETECTION * 100;
    }
    
    // 사람 객체 감지 신뢰도
    const personObjects = objects.filter(obj => obj.name === 'Person');
    if (personObjects.length > 0) {
      confidence += BODY_ANALYSIS_CONFIG.CONFIDENCE_WEIGHTS.OBJECT_LOCALIZATION * 100;
    }
    
    return Math.min(Math.round(confidence), 99);
  }

  // 신뢰도 계산 (Azure)
  // calculateAzureConfidence(tags, faces, description) {
  //   let confidence = 50;
    
  //   // 태그 신뢰도
  //   if (tags.length > 0) {
  //     const avgTagConfidence = tags.reduce((sum, tag) => sum + tag.confidence, 0) / tags.length;
  //     confidence += avgTagConfidence * BODY_ANALYSIS_CONFIG.CONFIDENCE_WEIGHTS.LABEL_DETECTION * 100;
  //   }
    
  //   // 얼굴 감지 신뢰도
  //   if (faces.length > 0) {
  //     confidence += BODY_ANALYSIS_CONFIG.CONFIDENCE_WEIGHTS.FACE_DETECTION * 100;
  //   }
    
  //   // 설명 신뢰도
  //   if (description.captions && description.captions.length > 0) {
  //     confidence += BODY_ANALYSIS_CONFIG.CONFIDENCE_WEIGHTS.OBJECT_LOCALIZATION * 100;
  //   }
    
  //   return Math.min(Math.round(confidence), 99);
  // }

  // OpenAI GPT API 호출
  async callOpenAIRecommendationAPI(analysisResult) {
    const prompt = RECOMMENDATION_CONFIG.PROMPT_TEMPLATE
      .replace('{bodyType}', analysisResult.bodyType)
      .replace('{height}', analysisResult.height)
      .replace('{shoulderWidth}', analysisResult.shoulderWidth);

    const response = await fetch(API_CONFIG.OPENAI.ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.OPENAI.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: API_CONFIG.OPENAI.MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    return JSON.parse(result.choices[0].message.content);
  }

  // 추천 결과를 앱 형식으로 변환
  transformRecommendations(aiRecommendations) {
    return aiRecommendations.recommendations.map((rec, index) => ({
      id: index + 1,
      name: rec.name,
      reason: rec.reason,
      image: this.getImageByCategory(rec.category),
      price: this.generatePrice(rec.category),
      brand: this.generateBrand(rec.category)
    }));
  }

  // 카테고리별 이미지 매핑
  getImageByCategory(category) {
    // 실제 구현에서는 이미지 매핑 로직을 추가
    const imageMap = {
      '상의': 'Fit_T',
      '하의': 'S_Jeans',
      '신발': 'Sneakers',
      '액세서리': 'Slim1'
    };
    return imageMap[category] || 'Slim1';
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