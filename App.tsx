import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import GetStartedScreen from './screens/GetStartedScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import MainTabScreen from './screens/MainTabScreen';
import AuthScreen from './screens/AuthScreen';

import { toastConfig } from './utils/toastConfig';

export default function App() {
  const [hasSeenGetStarted, setHasSeenGetStarted] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);


  // If logged in, go straight to app
  if (isAuthenticated) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <MainTabScreen />
          <Toast config={toastConfig} />
        </View>
      </SafeAreaProvider>
    );
  }

  // If guest mode (skipped auth), go to app
  if (isGuest) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <MainTabScreen />
    <Toast config={toastConfig} />
        </View>
      </SafeAreaProvider>
    );
  }

  // If hasn't seen get started, show it
  if (!hasSeenGetStarted) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <GetStartedScreen onGetStarted={() => setHasSeenGetStarted(true)} />
          <Toast config={toastConfig} />
        </View>
      </SafeAreaProvider>
    );
  }

  // If hasn't seen onboarding, show it
  if (!hasSeenOnboarding) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <OnboardingScreen onComplete={() => setHasSeenOnboarding(true)} />
          <Toast config={toastConfig} />
        </View>
      </SafeAreaProvider>
    );
  }

  // Otherwise show auth screen
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <AuthScreen 
          onSuccess={() => setIsAuthenticated(true)} 
          onSkip={() => setIsGuest(true)}
        />
        <Toast config={toastConfig} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
