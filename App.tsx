import "./global.css";
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Platform } from 'react-native';
import { Provider } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import * as NavigationBar from 'expo-navigation-bar';
import { store } from './store';
import { ConsentProvider } from './contexts/ConsentContext';
import { AppInitializationProvider } from './contexts/AppInitializationContext';
import { InterstitialTrackingProvider } from './contexts/InterstitialTrackingContext';
import { AdManagerProvider } from './contexts/AdManagerContext';

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
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        <ConsentProvider>
          <AppInitializationProvider>
            <InterstitialTrackingProvider>
              <AdManagerProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </AdManagerProvider>
            </InterstitialTrackingProvider>
          </AppInitializationProvider>
        </ConsentProvider>
      </SafeAreaProvider>
    </Provider>
  );
}