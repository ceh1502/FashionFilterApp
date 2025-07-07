import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import aiService from '../services/aiService';
import { ERROR_MESSAGES, validateAPIKeys } from '../config/api';
import { runFullDebug } from '../utils/debugAI';

const images = {
  Overfit: require('../assets/images/AI_Overfit_Hood.jpeg'),
  Slim1: require('../assets/images/AI_slim1.jpeg'),
  V: require('../assets/images/AI_V.jpeg'),
  Wide_Kago: require('../assets/images/AI_Wide_Kago.jpeg'),
  Sneakers: require('../assets/images/AI_Sneakers.jpeg'),
  S_Jeans: require('../assets/images/AI_Straight_Jeans.jpeg'),
  C_Rop: require('../assets/images/AI_Classic_Rop.jpeg'),
  Dark_Jeans: require('../assets/images/AI_Dark_Jeans.jpeg'),
  Slim_Boots: require('../assets/images/AI_Slim_Boots.jpeg'),
  Fit_T: require('../assets/images/AI_Fit_T.jpeg'),
  Tai_Pants: require('../assets/images/AI_Tai_Pants.jpeg'),
  Running_Sneakers: require('../assets/images/AI_Running_Sneakers2.jpeg'),
  Sneakers: require('../assets/images/AI_Sneakers.jpeg'),
  Sneakers: require('../assets/images/AI_Sneakers.jpeg'),
};

console.log('Images 로드 확인:', images); //디버깅


function BodyTypeScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // 실제 갤러리에서 사진 선택
  const selectImage = () => {
    Alert.alert(
      '사진 선택',
      '어떤 방식으로 사진을 가져올까요?',
      [
        {
          text: '갤러리',
          onPress: openGallery
        },
        {
          text: '취소',
          style: 'cancel'
        }
      ]
    );
  };

  // 갤러리 열기 (Image Picker 사용)
  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        console.log('갤러리 선택 취소 또는 에러');
        return;
      }

      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
        setAnalysisResult(null);
        setRecommendations([]);
        Alert.alert('성공', '사진이 업로드되었습니다!');
      }
    });
  };

  // 카메라 열기
  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };

    launchCamera(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        console.log('카메라 촬영 취소 또는 에러');
        return;
      }

      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
        setAnalysisResult(null);
        setRecommendations([]);
        Alert.alert('성공', '사진이 촬영되었습니다!');
      }
    });
  };

  // 디버깅 함수 추가
  const debugAI = async () => {
    console.log('🔍 Starting AI Debug...');
    const results = await runFullDebug();
    
    Alert.alert(
      'AI Debug Results',
      `API Keys: ${results.apiKeysValid ? '✅ Valid' : '❌ Invalid'}\nVision API: ${results.visionAPIWorking ? '✅ Working' : '❌ Failed'}\n\nCheck console for detailed information.`,
      [{ text: 'OK' }]
    );
  };

  // AI 분석 함수 (실제 AI API 사용)
  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('알림', '먼저 사진을 업로드해주세요.');
      return;
    }

    // API 키 유효성 검사
    const apiValidation = validateAPIKeys();
    if (!apiValidation.isValid) {
      Alert.alert(
        'API 설정 오류',
        'API 키가 설정되지 않았습니다.\n\n' + apiValidation.errors.join('\n'),
        [
          { text: '디버그 실행', onPress: debugAI },
          { text: '취소', style: 'cancel' }
        ]
      );
      return;
    }

    setIsAnalyzing(true);

    try {
      // AI 서비스를 사용한 실제 분석
      const analysisResult = await aiService.retryRequest(async () => {
        const base64Image = await aiService.convertImageToBase64(selectedImage.uri);
        const visionResult = await aiService.callGoogleVisionAPI(base64Image);
        return aiService.processVisionResults(visionResult, 'google');
      });

      // AI 추천 시스템
      const recommendations = await aiService.retryRequest(async () => {
        try {
          const aiRecommendations = await aiService.callOpenAIRecommendationAPI(analysisResult);
          return aiService.transformRecommendations(aiRecommendations);
        } catch (error) {
          console.warn('AI 추천 실패, 기본 추천 사용:', error);
          return getRecommendationsByBodyType(analysisResult.bodyType);
        }
      });

      setAnalysisResult(analysisResult);
      setRecommendations(recommendations);
      setIsAnalyzing(false);

      // 분석 완료 알림
      Alert.alert(
        '분석 완료! 🎉',
        `${analysisResult.bodyType} 체형으로 분석되었습니다.\n맞춤 상품을 확인해보세요!`,
        [{ text: '확인' }]
      );

    } catch (error) {
      console.error('Analysis error:', error);
      
      // 에러 타입에 따른 구체적인 메시지
      let errorMessage = ERROR_MESSAGES.ANALYSIS_FAILED;
      
      if (error.message.includes('API key')) {
        errorMessage = ERROR_MESSAGES.INVALID_API_KEY;
      } else if (error.message.includes('quota')) {
        errorMessage = ERROR_MESSAGES.QUOTA_EXCEEDED;
      } else if (error.message.includes('image')) {
        errorMessage = ERROR_MESSAGES.INVALID_IMAGE;
      } else if (error.message.includes('Bad request')) {
        errorMessage = ERROR_MESSAGES.INVALID_REQUEST;
      }
      
      Alert.alert(
        '분석 실패',
        errorMessage + '\n\n' + error.message,
        [
          { text: '디버그 실행', onPress: debugAI },
          { text: '확인' }
        ]
      );
      setIsAnalyzing(false);
    }
  };

  // 기본 추천 시스템 (AI 실패시 사용)
  const getRecommendationsByBodyType = (bodyType) => {
    const recommendations = {
      '슬림': [
        {
          id: 1,
          name: '오버핏 후드',
          reason: '볼륨감을 주어 균형잡힌 실루엣',
          image: images.Overfit,
          price: '89,000원',
          brand: 'MUSINSA'
        },
        {
          id: 2,
          name: '와이드 카고팬츠',
          reason: '하체 볼륨으로 전체적인 균형',
          image: images.Wide_Kago,
          price: '129,000원',
          brand: 'ADLV'
        },
        {
          id: 3,
          name: '청키 스니커즈',
          reason: '발목 볼륨으로 하체 보완',
          image: images.Sneakers,
          price: '159,000원',
          brand: 'NIKE'
        }
      ],
      '보통': [
        {
          id: 1,
          name: '슬림핏 니트',
          reason: '표준 체형에 가장 잘 어울리는 핏',
          image: images.Slim1,
          price: '79,000원',
          brand: 'UNIQLO'
        },
        {
          id: 2,
          name: '스트레이트 진',
          reason: '깔끔하고 세련된 하체 라인',
          image: images.S_Jeans,
          price: '98,000원',
          brand: 'LEVI\'S'
        },
        {
          id: 3,
          name: '클래식 로퍼',
          reason: '어떤 스타일에도 매치 가능',
          image: images.C_Rop,
          price: '189,000원',
          brand: 'CLARKS'
        }
      ],
      '통통': [
        {
          id: 1,
          name: 'V넥 가디건',
          reason: 'V라인으로 상체를 슬림하게',
          image: images.V,
          price: '119,000원',
          brand: 'COS'
        },
        {
          id: 2,
          name: '다크 스키니진',
          reason: '어두운 색상으로 하체 슬림 효과',
          image: images.Dark_Jeans,
          price: '89,000원',
          brand: 'ZARA'
        },
        {
          id: 3,
          name: '슬림 첼시부츠',
          reason: '발목 라인을 깔끔하게',
          image: images.Slim_Boots,
          price: '229,000원',
          brand: 'DR.MARTENS'
        }
      ],
      '운동체형': [
        {
          id: 1,
          name: '피팅 티셔츠',
          reason: '운동으로 다져진 체형을 살리는 핏',
          image: images.Fit_T,
          price: '45,000원',
          brand: 'UNDER ARMOUR'
        },
        {
          id: 2,
          name: '테이퍼드 팬츠',
          reason: '상체와 하체의 균형을 맞추는 실루엣',
          image: images.Tai_Pants,
          price: '139,000원',
          brand: 'STONE ISLAND'
        },
        {
          id: 3,
          name: '러닝 스니커즈',
          reason: '활동적인 이미지와 잘 어울림',
          image: images.Running_Sneakers,
          price: '179,000원',
          brand: 'ADIDAS'
        }
      ]
    };
    
    return recommendations[bodyType] || recommendations['보통'];
  };

  const renderRecommendation = (item) => (
    <TouchableOpacity key={item.id} style={styles.recommendationCard}>
      <Image 
        source={typeof item.image === 'string' ? {uri: item.image} : item.image}
        style={styles.recommendationImage}
        onError={(error) => console.log('이미지 에러:', item.name)}
      />
      <View style={styles.recommendationInfo}>
        <Text style={styles.brandText}>{item.brand}</Text>
        <Text style={styles.recommendationName}>{item.name}</Text>
        <Text style={styles.recommendationReason}>{item.reason}</Text>
        <Text style={styles.recommendationPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI 체형 분석</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 사진 업로드 섹션 */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>📸 전신 사진을 업로드하세요</Text>
          <Text style={styles.sectionSubtitle}>AI가 당신의 체형을 분석하여 맞춤 옷을 추천해드립니다</Text>
          
          <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
            <Text style={styles.uploadButtonText}>
              {selectedImage ? '📷 다른 사진 선택하기' : '📷 사진 업로드하기'}
            </Text>
          </TouchableOpacity>

          {/* 선택된 이미지 미리보기 */}
          {selectedImage && (
            <View style={styles.imagePreviewContainer}>
              <Text style={styles.previewLabel}>업로드된 사진:</Text>
              <View style={styles.imageFrame}>
                <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
              </View>
            </View>
          )}
        </View>

        {/* 분석 버튼 */}
        {selectedImage && (
          <View style={styles.analyzeSection}>
            <TouchableOpacity 
              style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
              onPress={analyzeImage}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.analyzeButtonText}>AI 분석 중...</Text>
                </View>
              ) : (
                <Text style={styles.analyzeButtonText}>🤖 AI 체형 분석 시작</Text>
              )}
            </TouchableOpacity>
            
            {isAnalyzing && (
              <Text style={styles.analysisInfo}>
                사진을 분석하여 체형을 파악하고 있습니다...
              </Text>
            )}
          </View>
        )}

        {/* 분석 결과 */}
        {analysisResult && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>📊 분석 결과</Text>
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>체형 분석 완료</Text>
                <Text style={styles.confidenceText}>신뢰도 {analysisResult.confidence}%</Text>
              </View>
              <View style={styles.resultGrid}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>체형</Text>
                  <Text style={styles.resultValue}>{analysisResult.bodyType}</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>상체</Text>
                  <Text style={styles.resultValue}>{analysisResult.height}</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>하체</Text>
                  <Text style={styles.resultValue}>{analysisResult.shoulderWidth}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 추천 상품 */}
        {recommendations.length > 0 && (
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>✨ {analysisResult.bodyType} 체형 맞춤 추천</Text>
            <Text style={styles.recommendationSubtitle}>
              AI가 분석한 당신의 체형에 가장 잘 어울리는 상품들입니다
            </Text>
            {recommendations.map(renderRecommendation)}
          </View>
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#000000',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 5,
  },
  backButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  uploadSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    margin: 15,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  uploadButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  imageFrame: {
    padding: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagePreview: {
    width: 200,
    height: 300,
    borderRadius: 10,
  },
  analyzeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  analyzeButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  analysisInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  resultSection: {
    padding: 20,
  },
  resultCard: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  confidenceText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: 'bold',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  resultGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultItem: {
    alignItems: 'center',
    flex: 1,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recommendationsSection: {
    padding: 20,
  },
  recommendationSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recommendationImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  recommendationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
    fontWeight: '500',
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recommendationReason: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  recommendationPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  bottomButtons: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingVertical: 10,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeBottomButton: {
    backgroundColor: '#F8F9FA',
  },
  bottomButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeBottomButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default BodyTypeScreen;