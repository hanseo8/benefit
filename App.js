import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import IntroScreen from './src/screens/IntroScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isIntroActive, setIsIntroActive] = useState(true);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            contentStyle: { backgroundColor: '#FFFFFF' },
          }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>

      {/* ── Cinematic Intro Overlay ── */}
      {isIntroActive && (
        <IntroScreen onIntroComplete={() => setIsIntroActive(false)} />
      )}
    </>
  );
}
