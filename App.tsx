import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import GetStartedScreen from './screens/GetStartedScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import MainTabScreen from './screens/MainTabScreen';
import AuthScreen from './screens/AuthScreen';
import { toastConfig } from './utils/toastConfig';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={styles.container}>
    <SafeAreaProvider>
      <View style={styles.container}>
        {children}
        <Toast config={toastConfig} />
      </View>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [hasSeenGetStarted, setHasSeenGetStarted] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsGuest(false);
  };

  if (isAuthenticated) {
    return (
      <AppLayout>
        <MainTabScreen onLogout={handleLogout} isAuthenticated isGuest={false} />
      </AppLayout>
    );
  }

  if (isGuest) {
    return (
      <AppLayout>
        <MainTabScreen onLogout={handleLogout} isAuthenticated={false} isGuest />
      </AppLayout>
    );
  }

  if (!hasSeenGetStarted) {
    return (
      <AppLayout>
        <GetStartedScreen onGetStarted={() => setHasSeenGetStarted(true)} />
      </AppLayout>
    );
  }

  if (!hasSeenOnboarding) {
    return (
      <AppLayout>
        <OnboardingScreen onComplete={() => setHasSeenOnboarding(true)} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AuthScreen
        onSuccess={() => setIsAuthenticated(true)}
        onSkip={() => setIsGuest(true)}
      />
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
