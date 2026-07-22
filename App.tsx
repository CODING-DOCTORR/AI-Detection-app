// App.tsx
import "./global.css";
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Platform } from 'react-native';
import { Provider } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import * as NavigationBar from 'expo-navigation-bar';

// Store
import { store } from './store';

// Ad providers (order matters!)
import { ConsentProvider } from './contexts/ConsentContext';
import { AppInitializationProvider } from './contexts/AppInitializationContext';
import { InterstitialTrackingProvider } from './contexts/InterstitialTrackingContext';
import { AdManagerProvider } from './contexts/AdManagerContext';

// 🆕 Custom consent modal (shown to all new users, not just EU/UK)
import CustomConsentModal from './components/CustomConsentModal';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        NavigationBar.setVisibilityAsync('hidden');
        NavigationBar.setBehaviorAsync('overlay-swipe');
      } catch (error) {
        console.log('Nav bar setting warning suppressed');
      }
    }
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <ConsentProvider>
          <AppInitializationProvider>
            <InterstitialTrackingProvider>
              <AdManagerProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
                {/* 🆕 Rendered on top of everything, controlled by ConsentContext */}
                <CustomConsentModal />
              </AdManagerProvider>
            </InterstitialTrackingProvider>
          </AppInitializationProvider>
        </ConsentProvider>
      </SafeAreaProvider>
    </Provider>
  );
}