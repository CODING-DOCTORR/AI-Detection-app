import "./global.css"; 
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Platform } from 'react-native';  
import AppNavigator from './navigation/AppNavigator'; 
import * as NavigationBar from 'expo-navigation-bar';

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
    <SafeAreaProvider>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true} 
      /> 
      
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}