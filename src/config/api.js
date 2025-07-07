// API Configuration
// 실제 배포시에는 환경변수나 보안 저장소를 사용하세요

export const API_CONFIG = {
  // Google Cloud Vision API
  GOOGLE_CLOUD: {
    API_KEY: process.env.GOOGLE_CLOUD_API_KEY || 'YOUR_GOOGLE_CLOUD_API_KEY',
    VISION_ENDPOINT: 'https://vision.googleapis.com/v1/images:annotate',
  },
  
  // OpenAI GPT API
  OPENAI: {
    API_KEY: process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY',
    ENDPOINT: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-3.5-turbo',
  },
  
  // Azure Computer Vision (대안)
  AZURE: {
    API_KEY: process.env.AZURE_VISION_API_KEY || 'YOUR_AZURE_API_KEY',
    ENDPOINT: process.env.AZURE_VISION_ENDPOINT || 'YOUR_AZURE_ENDPOINT',
  },
  
  // Clarifai (대안)
  CLARIFAI: {
    API_KEY: process.env.CLARIFAI_API_KEY || 'YOUR_CLARIFAI_API_KEY',
  },
};

// API 키 유효성 검사
export const validateAPIKeys = () => {
  const errors = [];
  
  if (!API_CONFIG.GOOGLE_CLOUD.API_KEY || API_CONFIG.GOOGLE_CLOUD.API_KEY === 'YOUR_GOOGLE_CLOUD_API_KEY') {
    errors.push('Google Cloud API key is missing or invalid');
  }
  
  if (!API_CONFIG.OPENAI.API_KEY || API_CONFIG.OPENAI.API_KEY === 'YOUR_OPENAI_API_KEY') {
    errors.push('OpenAI API key is missing or invalid');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// API 요청 설정
export const API_SETTINGS = {
  TIMEOUT: 30000, // 30초
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1초
};

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  API_ERROR: 'AI 서비스에 일시적인 문제가 있습니다.',
  INVALID_IMAGE: '이미지 형식이 올바르지 않습니다.',
  ANALYSIS_FAILED: '이미지 분석에 실패했습니다.',
  RECOMMENDATION_FAILED: '추천 생성에 실패했습니다.',
  INVALID_API_KEY: 'API 키가 올바르지 않습니다. 설정을 확인해주세요.',
  QUOTA_EXCEEDED: 'API 사용량 한도를 초과했습니다.',
  INVALID_REQUEST: '잘못된 요청입니다. 이미지를 다시 선택해주세요.',
};

// 체형 분석 설정
export const BODY_ANALYSIS_CONFIG = {
  // 체형 키워드 매핑
  BODY_TYPE_KEYWORDS: {
    '슬림': ['slim', 'thin', 'slender', 'lean', 'skinny', 'petite'],
    '보통': ['average', 'normal', 'medium', 'regular', 'standard'],
    '통통': ['full', 'curvy', 'plus size', 'round', 'chubby', 'full-figured'],
    '운동체형': ['athletic', 'muscular', 'fit', 'toned', 'sporty', 'athletic build']
  },
  
  // 신뢰도 계산 가중치
  CONFIDENCE_WEIGHTS: {
    LABEL_DETECTION: 0.4,
    FACE_DETECTION: 0.3,
    OBJECT_LOCALIZATION: 0.3,
  },
  
  // 객체 크기 임계값
  SIZE_THRESHOLDS: {
    HEIGHT: {
      SMALL: 200,
      LARGE: 300,
    },
    WIDTH: {
      SMALL: 100,
      LARGE: 150,
    }
  }
};

// 추천 시스템 설정
export const RECOMMENDATION_CONFIG = {
  // 카테고리별 가격 범위 (원)
  PRICE_RANGES: {
    '상의': [30000, 80000],
    '하의': [50000, 120000],
    '신발': [80000, 200000],
    '액세서리': [10000, 50000],
  },
  
  // 브랜드 매핑
  BRANDS: {
    '상의': ['UNIQLO', 'ZARA', 'COS', 'MUSINSA', 'H&M', 'SPAO'],
    '하의': ['LEVI\'S', 'ZARA', 'ADLV', 'STONE ISLAND', 'UNIQLO'],
    '신발': ['NIKE', 'ADIDAS', 'CLARKS', 'DR.MARTENS', 'CONVERSE'],
    '액세서리': ['CASIO', 'SWATCH', 'FOSSIL', 'SEIKO'],
  },
  
  // 추천 개수
  MAX_RECOMMENDATIONS: 3,
  
  // 추천 프롬프트 템플릿
  PROMPT_TEMPLATE: `
    다음 체형 분석 결과를 바탕으로 패션 추천을 해주세요:
    - 체형: {bodyType}
    - 키: {height}
    - 어깨 너비: {shoulderWidth}
    
    다음 형식으로 3개의 상품을 추천해주세요:
    {
      "recommendations": [
        {
          "name": "상품명",
          "reason": "추천 이유",
          "category": "상의/하의/신발/액세서리",
          "style": "스타일 키워드"
        }
      ]
    }
  `
}; 