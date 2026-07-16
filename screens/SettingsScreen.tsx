import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Alert, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogIn, LogOut } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileCard from '../components/settings/ProfileCard';
import SettingsSection from '../components/settings/SettingsSection';
import AppVersionFooter from '../components/settings/AppVersionFooter';
import { getSettingsSections } from '../config/settingsConfig';
import { UserProfile } from '../types/settings.types';
import { auth } from '../config/firebase';
import { logoutUser } from '../config/authService';

const APP_VERSION = '2.4.12';
const ENGINE_NAME = 'Enterprise Precision Engine';

const SettingsScreen: React.FC = () => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(auth.currentUser);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return unsubscribe;
  }, []);

  const profile: UserProfile = {
    name: firebaseUser?.displayName || 'Anonymous User',
    email: firebaseUser?.email || 'No email',
    avatarUri: firebaseUser?.photoURL || undefined,
  };

  const stub = useCallback((label: string) => () => Alert.alert(label, 'Coming soon'), []);

  const handleLogOut = useCallback(() => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            try { await GoogleSignin.signOut(); } catch { }
            await logoutUser();
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not log out.');
          }
        },
      },
    ]);
  }, []);

  const sections = getSettingsSections({
    onProfileInfo: stub('Profile Information'),
    on2FA: stub('Two-Factor Authentication'),
    onPrivacy: stub('Privacy & Permissions'),
    onNotifications: stub('Notifications'),
    onAppearance: stub('Appearance'),
    onLanguage: stub('Language'),
    onAbout: stub('About Deepfake Analysis'),
    onTerms: stub('Terms of Service'),
  });

  return (
    <SafeAreaView className="flex-1 pb-10 bg-app-bg" edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0B14" />

      {/* Header */}
      <View className="w-full h-16 rounded-2xl mx- mb-4  items-center justify-center border">
        <Text className="text-app-light text-2xl font-bold">Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Profile card */}
        <ProfileCard profile={profile} onPress={stub('Profile')} />

        <View className="h-4" />

        {/* Dynamic sections */}
        {sections.map((section) => (
          <SettingsSection key={section.id} section={section} />
        ))}

        {/* Auth Button */}
        {firebaseUser ? (
          <TouchableOpacity
            style={styles.signOutBtn}
            activeOpacity={0.8}
            onPress={handleLogOut}
          >
            <LogOut size={20} color="#fff" strokeWidth={2} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.signInBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
          >
            <LogIn size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        )}

        <AppVersionFooter version={APP_VERSION} engineName={ENGINE_NAME} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: '#A69EFF', borderRadius: 16, // Using app-card color
    paddingVertical: 16, marginHorizontal: 16, marginTop: 8, marginBottom: 20,
    borderWidth: 1.5, borderColor: '#450a0a', // Dark red border
  },
  signOutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  signInBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: '#4F46E5', borderRadius: 16, // Using app-accent color
    paddingVertical: 16, marginHorizontal: 16, marginTop: 8, marginBottom: 20,
  },
  signInText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default SettingsScreen;