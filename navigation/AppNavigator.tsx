import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Clock3, Settings } from 'lucide-react-native';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { OnboardingScreen } from '../screens/Onboardingscreen';
import UploadScreen from '../screens/UploadScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SplashScreen from '../screens/SplashScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/Profilescreen';
import ResultScreen from '../screens/ResultScreen';
import ProAccessScreen from 'screens/ProAccessScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Custom Floating TabBar like reference image ──────────────────────────────
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute left-0 right-0 items-center"
      style={{ bottom: insets.bottom ? insets.bottom + 6 : 22, paddingHorizontal: 16 }}
      pointerEvents="box-none"
    >
      <View
        className="flex-row items-center bg-[#1E1B2E] border border-app-border rounded-full p-1.5"
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.4,
          shadowOffset: { width: 0, height: 8 },
          shadowRadius: 20,
          elevation: 12,
          minWidth: '95%',
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = (options.tabBarLabel as string) || (options.title as string) || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name as never);
          };
          const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

          let Icon = Home;
          if (route.name === 'HomeTab') Icon = Home;
          if (route.name === 'HistoryTab') Icon = Clock3;
          if (route.name === 'SettingsTab') Icon = Settings;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.85}
              className="flex-1"
            >
              {isFocused ? (
                <LinearGradient
                  colors={['#A69EFF', '#8377FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="items-center justify-center rounded-full py-2.5 px-2"
                  style={{ borderRadius: 999, gap: 3 }}
                >
                  <Icon size={22} color="#FFFFFF" fill={route.name === 'HomeTab' ? '#FFFFFF' : 'transparent'} strokeWidth={route.name === 'HomeTab' ? 2.5 : 2} />
                  <Text className="text-white text-[12px] font-bold tracking-wide">{label}</Text>
                </LinearGradient>
              ) : (
                <View className="items-center justify-center py-2.5 px-2" style={{ gap: 3, borderRadius: 999 }}>
                  <Icon size={22} color="#9CA3AF" strokeWidth={2} />
                  <Text className="text-app-muted text-[12px] font-semibold">{label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Bottom Tab Navigator ─────────────────────────────────────────────────────
function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={UploadScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="HistoryTab" component={HistoryScreen} options={{ title: 'History' }} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

// ─── Auth Stack ───────────────────────────────────────────────────────────────
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen
            onLoginSuccess={() => {}}
            onClose={() => props.navigation.goBack()}
            onForgotPassword={() => props.navigation.navigate('ForgotPassword')}
            onRegister={() => props.navigation.navigate('Register')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword">
        {(props) => <ForgotPasswordScreen onBack={() => props.navigation.goBack()} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => (
          <RegisterScreen
            onBack={() => props.navigation.goBack()}
            onLoginPress={() => props.navigation.navigate('Login')}
            onRegisterSuccess={() => {}}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// ─── App Stack ────────────────────────────────────────────────────────────────
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
       <Stack.Screen name="ProAccess" component={ProAccessScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Profile">
        {(props) => (
          <ProfileScreen onBack={() => props.navigation.goBack()} onEditProfile={() => props.navigation.navigate('EditProfile')} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-app-bg">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!onboardingDone && !isLoggedIn) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash">
          {(props) => <SplashScreen onFinish={() => props.navigation.navigate('Onboarding')} />}
        </Stack.Screen>
        <Stack.Screen name="Onboarding">{() => <OnboardingScreen onComplete={() => setOnboardingDone(true)} />}</Stack.Screen>
      </Stack.Navigator>
    );
  }

  return isLoggedIn ? <AppStack key="app" /> : <AuthStack key="auth" />;
}