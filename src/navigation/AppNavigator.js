import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 스크린 import
import LandingScreen from '../screens/LandingScreen';
import CodiScreen from '../screens/CodiScreen';
import BodyTypeScreen from '../screens/BodyTypeScreen';
import QuestionScreen from '../screens/QuestionScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false, // 상단 헤더 숨기기
          gestureEnabled: true, // 스와이프로 뒤로가기 가능
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen 
          name="Landing" 
          component={LandingScreen}
          options={{ title: '홈' }}
        />
        <Stack.Screen 
          name="Codi" 
          component={CodiScreen}
          options={{ title: '코디' }}
        />
        <Stack.Screen 
          name="BodyType" 
          component={BodyTypeScreen}
          options={{ title: '체형 맞춤' }}
        />
        <Stack.Screen 
          name="Question" 
          component={QuestionScreen}
          options={{ title: '취향 분석' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;