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
import { launchImageLibrary } from 'react-native-image-picker';

function BodyTypeScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // 이미지 선택 함수
  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.error) {
        console.log('Image selection cancelled or error');
        return;
      }

      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
        // 새 이미지 선택 시 기존 분석 결과 초기화
        setAnalysisResult(null);
        setRecommendations([]);
      }
    });
  };

  // Google Vision API + AI 분석 함수
  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('알림', '먼저 사진을 업로드해주세요.');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Google Vision API 호출 (실제 구현 시)
      // const visionResult = await callGoogleVisionAPI(selectedImage.base64);
      
      // 임시 분석 결과 (실제로는 API 응답)
      const mockAnalysisResult = {
        bodyType: '슬림',
        height: '보통',
        shoulderWidth: '좁음',
        confidence: 85,
      };

      // 임시 추천 상품들 (실제로는 AI가 분석 후 추천)
      const mockRecommendations = [
        {
          id: 1,
          name: '슬림핏 셔츠',
          reason: '좁은 어깨라인에 맞는 슬림핏',
          image: 'https://via.placeholder.com/150x200/4A90E2/ffffff?text=Slim+Shirt',
          price: '45,000원'
        },
        {
          id: 2,
          name: '스트레이트 팬츠',
          reason: '슬림 체형에 어울리는 직선 라인',
          image: 'https://via.placeholder.com/150x200/50C878/ffffff?text=Straight+Pants',
          price: '89,000원'
        },
        {
          id: 3,
          name: '오버핏 니트',
          reason: '상체 볼륨감을 주는 오버핏',
          image: 'https://via.placeholder.com/150x200/FF6B6B/ffffff?text=Overfit+Knit',
          price: '65,000원'
        },
      ];

      // 2초 후 결과 표시 (실제 API 호출 시뮬레이션)
      setTimeout(() => {
        setAnalysisResult(mockAnalysisResult);
        setRecommendations(mockRecommendations);
        setIsAnalyzing(false);
      }, 2000);

    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('오류', '분석 중 오류가 발생했습니다.');
      setIsAnalyzing(false);
    }
  };

  const renderRecommendation = (item) => (
    <View key={item.id} style={styles.recommendationCard}>
      <Image source={{ uri: item.image }} style={styles.recommendationImage} />
      <View style={styles.recommendationInfo}>
        <Text style={styles.recommendationName}>{item.name}</Text>
        <Text style={styles.recommendationReason}>{item.reason}</Text>
        <Text style={styles.recommendationPrice}>{item.price}</Text>
      </View>
    </View>
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
        <Text style={styles.headerTitle}>체형 맞춤</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 사진 업로드 섹션 */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>체형 분석을 위한 사진 업로드</Text>
          
          <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
            <Text style={styles.uploadButtonText}>📷 사진 선택하기</Text>
          </TouchableOpacity>

          {/* 선택된 이미지 미리보기 */}
          {selectedImage && (
            <View style={styles.imagePreviewContainer}>
              <Text style={styles.previewLabel}>선택된 사진:</Text>
              <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
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
                  <Text style={styles.analyzeButtonText}>분석 중...</Text>
                </View>
              ) : (
                <Text style={styles.analyzeButtonText}>🤖 AI 체형 분석 시작</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* 분석 결과 */}
        {analysisResult && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>분석 결과</Text>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>체형 분석</Text>
              <Text style={styles.resultItem}>• 체형: {analysisResult.bodyType}</Text>
              <Text style={styles.resultItem}>• 키: {analysisResult.height}</Text>
              <Text style={styles.resultItem}>• 어깨: {analysisResult.shoulderWidth}</Text>
              <Text style={styles.confidenceText}>신뢰도: {analysisResult.confidence}%</Text>
            </View>
          </View>
        )}

        {/* 추천 상품 */}
        {recommendations.length > 0 && (
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>맞춤 추천 상품</Text>
            {recommendations.map(renderRecommendation)}
          </View>
        )}
      </ScrollView>

      {/* 하단 네비게이션 버튼들 */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity 
          style={styles.bottomButton}
          onPress={() => navigation.navigate('Codi')}
        >
          <Text style={styles.bottomButtonText}>코디</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, styles.activeBottomButton]}>
          <Text style={[styles.bottomButtonText, styles.activeBottomButtonText]}>체형 맞춤</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bottomButton}
          onPress={() => navigation.navigate('Question')}
        >
          <Text style={styles.bottomButtonText}>취향 분석</Text>
        </TouchableOpacity>
      </View>
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
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
  imagePreview: {
    width: 200,
    height: 300,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  analyzeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  analyzeButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
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
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  resultItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  confidenceText: {
    fontSize: 12,
    color: '#4A90E2',
    marginTop: 10,
    fontWeight: 'bold',
  },
  recommendationsSection: {
    padding: 20,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  recommendationPrice: {
    fontSize: 14,
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