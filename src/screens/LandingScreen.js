import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// 배경 이미지들 (동적으로 변경될 이미지들)
const backgroundImages = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=800&fit=crop',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=800&fit=crop',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=800&fit=crop',
];

function LandingScreen({navigation}){
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  // 배경 이미지 자동 전환
  useEffect(() => {

    const interval = setInterval(() => {
      // 페이드 아웃
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // 이미지 변경
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % backgroundImages.length
        );
        // 페이드 인
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 3000); // 3초마다 변경

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const handleButtonPress = (buttonType) => {
  console.log(`${buttonType} 버튼 클릭됨`); // ← 이게 나오나요?
  console.log('navigation:', navigation); // ← navigation 객체 확인
  
  if (navigation && navigation.navigate) {
    console.log('navigate 함수 호출!'); // ← 이것도 추가
    if (buttonType === '코디') {
      navigation.navigate('Codi');
    }
  } else {
    console.log('navigation이 없거나 navigate 함수가 없음'); // ← 이것도 추가
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 배경 이미지 */}
      <Animated.View style={[styles.backgroundContainer, { opacity: fadeAnim }]}>
        <ImageBackground
          source={{ uri: backgroundImages[currentImageIndex] }}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* 어두운 오버레이 */}
          <View style={styles.overlay} />
        </ImageBackground>
      </Animated.View>

      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        {/* 앱 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>뮤신샤</Text>
          <Text style={styles.subtitle}>당신만의 완벽한 스타일을 찾아보세요</Text>
        </View>

        

        {/* 하단 버튼들 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => handleButtonPress('코디')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>코디</Text>
            <Text style={styles.buttonSubText}>스타일링 추천</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => handleButtonPress('체형 맞춤')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>체형 맞춤</Text>
            <Text style={styles.buttonSubText}>AI 분석</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.tertiaryButton]}
            onPress={() => handleButtonPress('취향 분석')}
            activeOpacity={0.8}
          >
            <Text style={styles.tertiaryButtonText}>취향 분석</Text>
            <Text style={styles.buttonSubText}>맞춤 추천</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 페이지 인디케이터 */}
      <View style={styles.pageIndicator}>
        {backgroundImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentImageIndex && styles.activeDot
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
    opacity: 0.9,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  mainMessage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  messageIndicator: {
    backgroundColor: '#FF6B6B',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  indicatorText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
  flex: 1,
  borderRadius: 20,
  paddingVertical: 22,
  paddingHorizontal: 12,
  alignItems: 'center',
  shadowColor: '#FF6B6B',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.4,
  shadowRadius: 15,
  elevation: 10,
  borderWidth: 0.5,
  borderColor: 'rgba(255, 255, 255, 0.3)',
},
primaryButton: {
  backgroundColor: '#FFFFFF',
  borderTopColor: 'rgba(0, 0, 0, 0.1)',
  borderTopWidth: 1,
  borderBottomColor: 'rgba(0, 0, 0, 0.15)',
  borderBottomWidth: 1,
},
secondaryButton: {
  backgroundColor: '#F8F9FA',
  borderTopColor: 'rgba(0, 0, 0, 0.1)',
  borderTopWidth: 1,
  borderBottomColor: 'rgba(0, 0, 0, 0.15)',
  borderBottomWidth: 1,
},
tertiaryButton: {
  backgroundColor: '#E9ECEF',
  borderTopColor: 'rgba(0, 0, 0, 0.1)',
  borderTopWidth: 1,
  borderBottomColor: 'rgba(0, 0, 0, 0.15)',
  borderBottomWidth: 1,
},
  primaryButtonText: {
  color: '#333333',
  fontSize: 17,
  fontWeight: '700',
  marginBottom: 4,
},
secondaryButtonText: {
  color: '#333333',
  fontSize: 17,
  fontWeight: '700',
  marginBottom: 4,
},
tertiaryButtonText: {
  color: '#333333',
  fontSize: 17,
  fontWeight: '700',
  marginBottom: 4,
},
buttonSubText: {
  fontSize: 12,
  color: 'rgba(51, 51, 51, 0.7)',
  textAlign: 'center',
  fontWeight: '500',
},
  pageIndicator: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
});

export default LandingScreen;