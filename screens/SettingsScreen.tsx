// screens/SettingsScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogIn, LogOut } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileCard from '../components/settings/ProfileCard';
import SettingsSection from '../components/settings/SettingsSection';
import AppVersionFooter from '../components/settings/AppVersionFooter';
import AppModal from '../components/AppModal';
import { useModal } from '../hooks/ui/useModal';
import { getSettingsSections } from '../config/settingsConfig';
import { UserProfile } from '../types/settings.types';
import { auth } from '../config/firebase';
import { logoutUser } from '../config/authService';

const APP_VERSION = '2.4.12';
const ENGINE_NAME = 'Enterprise Precision Engine';

const SettingsScreen: React.FC = () => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(auth.currentUser);
  const navigation = useNavigation<any>();

  const { modal, hideModal, showInfo, showError, showConfirm } = useModal();

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

  const navigateTo = useCallback(
    (screen: string) => () => {
      const parentNav = navigation.getParent();
      const nav = parentNav || navigation;
      nav.navigate(screen);
    },
    [navigation]
  );

  const stub = useCallback(
    (label: string) => () => showInfo(label, 'This feature is coming soon!'),
    [showInfo]
  );

  const handleProfilePress = useCallback(() => {
    const parentNav = navigation.getParent();
    if (parentNav) {
      parentNav.navigate('Profile');
    } else {
      navigation.navigate('Profile');
    }
  }, [navigation]);

  // 🆕 Log out and navigate to Login screen
 // Log out — Firebase auth listener will auto-switch to Login screen
const handleLogOut = useCallback(() => {
  showConfirm(
    'Log Out',
    'Are you sure you want to log out?',
    async () => {
      try {
        // Sign out from Google (if signed in with Google)
        try {
          await GoogleSignin.signOut();
        } catch {
          // Silently ignore
        }

        // Sign out from Firebase — AppNavigator will auto-switch to Login
        await logoutUser();
      } catch (error: any) {
        showError('Log Out Failed', error.message || 'Could not log out. Please try again.');
      }
    },
    undefined,
    'Log Out',
    'Cancel'
  );
}, [showConfirm, showError]);

  const sections = getSettingsSections({
    onProfileInfo: handleProfilePress,
    on2FA: stub('Two-Factor Authentication'),
    onPrivacy: navigateTo('PrivacyPermissions'),
    onNotifications: stub('Notifications'),
    onAppearance: navigateTo('Appearance'),
    onLanguage: navigateTo('Language'),
    onAbout: navigateTo('About'),
    onTerms: navigateTo('TermsOfService'),
  });

  return (
    <SafeAreaView className="flex-1 pb-10 bg-app-bg" edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0B14" />

      {/* Header */}
      <View className="w-full h-16 rounded-2xl mx- mb-4  items-center justify-center border">
        <Text className="text-app-light text-2xl font-bold">Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <ProfileCard profile={profile} onPress={handleProfilePress} />

        <View className="h-4" />

        {sections.map((section) => (
          <SettingsSection key={section.id} section={section} />
        ))}

        <TouchableOpacity
          onPress={navigateTo('PrivacyPolicy')}
          activeOpacity={0.7}
          style={{
            marginHorizontal: 16,
            marginBottom: 8,
            padding: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#818cf8', fontSize: 13, fontWeight: '600' }}>
            View Privacy Policy
          </Text>
        </TouchableOpacity>

        {firebaseUser ? (
          <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.8} onPress={handleLogOut}>
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

      <AppModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        buttons={modal.buttons}
        loading={modal.loading}
        showCloseIcon={modal.showCloseIcon !== false}
        onClose={hideModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#A69EFF',
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#450a0a',
  },
  signOutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  signInText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default SettingsScreen;