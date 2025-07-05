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

const images = {
  Overfit: require('../assets/images/AI_Overfit_Hood.jpeg'),
  Slim1: require('../assets/images/AI_slim1.jpeg'),
  AI_V: require('../assets/images/AI_V.jpeg'),
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

  // AI 분석 함수 (개선된 버전)
  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('알림', '먼저 사진을 업로드해주세요.');
      return;
    }

    setIsAnalyzing(true);

    try {
      // 실제 분석 시뮬레이션 (3초)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 랜덤 분석 결과 생성 (더 현실적)
      const bodyTypes = ['슬림', '보통', '통통', '운동체형'];
      const heights = ['작음', '보통', '큼'];
      const shoulders = ['작음', '보통', '큼'];
      
      const randomBodyType = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
      const randomHeight = heights[Math.floor(Math.random() * heights.length)];
      const randomShoulder = shoulders[Math.floor(Math.random() * shoulders.length)];
      
      const mockAnalysisResult = {
        bodyType: randomBodyType,
        height: randomHeight,
        shoulderWidth: randomShoulder,
        confidence: Math.floor(Math.random() * 20) + 80, // 80-99%
      };

      // 체형별 맞춤 추천
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
              image: 'https://via.placeholder.com/150x200/4A90E2/ffffff?text=Wide+Cargo',
              price: '129,000원',
              brand: 'ADLV'
            },
            {
              id: 3,
              name: '청키 스니커즈',
              reason: '발목 볼륨으로 하체 보완',
              image: 'https://via.placeholder.com/150x200/50C878/ffffff?text=Chunky+Sneakers',
              price: '159,000원',
              brand: 'NIKE'
            }
          ],
          '보통': [
            {
              id: 1,
              name: '슬림핏 니트',
              reason: '표준 체형에 가장 잘 어울리는 핏',
              image: images.slim1,
              price: '79,000원',
              brand: 'UNIQLO'
            },
            {
              id: 2,
              name: '스트레이트 진',
              reason: '깔끔하고 세련된 하체 라인',
              image: 'https://via.placeholder.com/150x200/34495E/ffffff?text=Straight+Jeans',
              price: '98,000원',
              brand: 'LEVI\'S'
            },
            {
              id: 3,
              name: '클래식 로퍼',
              reason: '어떤 스타일에도 매치 가능',
              image: 'https://via.placeholder.com/150x200/8B4513/ffffff?text=Classic+Loafer',
              price: '189,000원',
              brand: 'CLARKS'
            }
          ],
          '통통': [
            {
              id: 1,
              name: 'V넥 가디건',
              reason: 'V라인으로 상체를 슬림하게',
              image: images.AI_V,
              price: '119,000원',
              brand: 'COS'
            },
            {
              id: 2,
              name: '다크 스키니진',
              reason: '어두운 색상으로 하체 슬림 효과',
              image: 'https://via.placeholder.com/150x200/1A1A1A/ffffff?text=Dark+Skinny',
              price: '89,000원',
              brand: 'ZARA'
            },
            {
              id: 3,
              name: '슬림 첼시부츠',
              reason: '발목 라인을 깔끔하게',
              image: 'https://via.placeholder.com/150x200/654321/ffffff?text=Chelsea+Boots',
              price: '229,000원',
              brand: 'DR.MARTENS'
            }
          ],
          '운동체형': [
            {
              id: 1,
              name: '피팅 티셔츠',
              reason: '운동으로 다져진 체형을 살리는 핏',
              image: 'https://via.placeholder.com/150x200/E74C3C/ffffff?text=Fitted+Tee',
              price: '45,000원',
              brand: 'UNDER ARMOUR'
            },
            {
              id: 2,
              name: '테이퍼드 팬츠',
              reason: '상체와 하체의 균형을 맞추는 실루엣',
              image: 'https://via.placeholder.com/150x200/27AE60/ffffff?text=Tapered+Pants',
              price: '139,000원',
              brand: 'STONE ISLAND'
            },
            {
              id: 3,
              name: '러닝 스니커즈',
              reason: '활동적인 이미지와 잘 어울림',
              image: 'https://via.placeholder.com/150x200/F39C12/ffffff?text=Running+Shoes',
              price: '179,000원',
              brand: 'ADIDAS'
            }
          ]
        };
        
        return recommendations[bodyType] || recommendations['보통'];
      };

      const mockRecommendations = getRecommendationsByBodyType(randomBodyType);

      setAnalysisResult(mockAnalysisResult);
      setRecommendations(mockRecommendations);
      setIsAnalyzing(false);

      // 분석 완료 알림
      Alert.alert(
        '분석 완료! 🎉',
        `${randomBodyType} 체형으로 분석되었습니다.\n맞춤 상품을 확인해보세요!`,
        [{ text: '확인' }]
      );

    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('오류', '분석 중 오류가 발생했습니다.');
      setIsAnalyzing(false);
    }
  };

  const renderRecommendation = (item) => (
    <TouchableOpacity key={item.id} style={styles.recommendationCard}>
     <Image source={item.image} style={styles.recommendationImage}/>
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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
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