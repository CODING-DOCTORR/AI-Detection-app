// screens/Profilescreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {
  ArrowLeft,
  Settings,
  Pencil,
  BadgeCheck,
  Calendar,
  HelpCircle,
  LogOut,
  LogIn,
  ChevronRight,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../config/firebase';
import { logoutUser } from '../config/authService';
import AppModal from '../components/AppModal';
import { useModal } from '../hooks/ui/useModal';

interface ProfileScreenProps {
  onBack?: () => void;
  onEditProfile?: () => void;
  onPrivacySettings?: () => void;
  onSecurityAuditLogs?: () => void;
}

interface InfoRowProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  badge?: string;
  badgeColor?: string;
  rightContent?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  showDivider?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({
  icon, iconBg, label, value, badge,
  badgeColor = '#2dd4bf', rightContent,
  onPress, showChevron = false, showDivider = true,
}) => (
  <>
    <TouchableOpacity
      className="flex-row items-center px-4 py-3.5 gap-3"
      activeOpacity={onPress ? 0.6 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={{ backgroundColor: iconBg }} className="w-9 h-9 rounded-full items-center justify-center">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-xs text-app-muted mb-0.5">{label}</Text>
        <Text className="text-[15px] font-semibold text-app-light">{value}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        {badge && (
          <View style={{ backgroundColor: badgeColor + '22' }} className="px-2.5 py-1 rounded-full">
            <Text style={{ color: badgeColor }} className="text-[11px] font-bold tracking-wide">{badge}</Text>
          </View>
        )}
        {rightContent}
        {showChevron && <ChevronRight size={18} color="#6B7280" strokeWidth={1.8} />}
      </View>
    </TouchableOpacity>
    {showDivider && <View className="h-px bg-app-border mx-4" />}
  </>
);

interface SectionRowProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  showDivider?: boolean;
}

const SectionRow: React.FC<SectionRowProps> = ({ icon, label, onPress, showDivider = true }) => (
  <>
    <TouchableOpacity className="flex-row items-center px-4 py-4 gap-3.5" activeOpacity={0.6} onPress={onPress}>
      <View className="w-7 items-center">{icon}</View>
      <Text className="flex-1 text-[15px] font-medium text-app-light">{label}</Text>
      <ChevronRight size={18} color="#6B7280" strokeWidth={1.8} />
    </TouchableOpacity>
    {showDivider && <View className="h-px bg-app-border mx-4" />}
  </>
);

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onEditProfile,
  onPrivacySettings,
  onSecurityAuditLogs,
}) => {
  const navigation = useNavigation<any>();
  const [signingOut, setSigningOut] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(auth.currentUser);

  // 🆕 Modal hook
  const { modal, hideModal, showError, showConfirm } = useModal();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setFirebaseUser(user));
    return unsubscribe;
  }, []);

  const isLoggedIn = !!firebaseUser;

  const user = {
    name: firebaseUser?.displayName || 'Anonymous User',
    email: firebaseUser?.email || 'No email',
    accountType: 'Pro Subscriber',
    memberSince: firebaseUser?.metadata?.creationTime
      ? new Date(firebaseUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'Unknown',
    appVersion: 'v2.4.1 Build 2023.10.12',
    avatarUrl: firebaseUser?.photoURL || null,
  };

  // 🆕 Log out with themed modal + navigate to Login
 // Log out — Firebase auth listener will auto-switch to Login screen
const handleSignOut = () => {
  showConfirm(
    'Sign Out',
    'Are you sure you want to sign out?',
    async () => {
      setSigningOut(true);
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
        showError('Sign Out Failed', error.message || 'Could not sign out. Please try again.');
      } finally {
        setSigningOut(false);
      }
    },
    undefined,
    'Sign Out',
    'Cancel'
  );
};

  return (
    <View className="flex-1 bg-app-bg">
      <StatusBar barStyle="light-content" backgroundColor="#0D0B14" />
      <SafeAreaView className="flex-1 bg-app-bg" edges={['top']}>
        {/* Top Bar */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-app-bg">
          <TouchableOpacity className="w-9 h-9 items-center justify-center" activeOpacity={0.7} onPress={onBack}>
            <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
          <Text className="text-[17px] font-semibold text-app-light tracking-wide">Profile</Text>
          <TouchableOpacity
            className="w-9 h-9 items-center justify-center"
            activeOpacity={0.7}
            onPress={() => navigation.navigate('MainTabs', { screen: 'SettingsTab' })}
          >
            <Settings size={22} color="#FFFFFF" strokeWidth={1.8} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Avatar + Name */}
          <View className="items-center pt-2 pb-6">
            <View className="relative mb-3">
              {user.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} className="w-[110px] h-[110px] rounded-full border-2 border-app-border" />
              ) : (
                <View className="w-[110px] h-[110px] rounded-full bg-app-accentSoft items-center justify-center border-2 border-app-border">
                  <Text className="text-4xl font-bold text-white tracking-wider">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </Text>
                </View>
              )}
              {isLoggedIn && (
                <TouchableOpacity
                  className="absolute bottom-1 right-1 w-[30px] h-[30px] rounded-full bg-app-accentSoft items-center justify-center border-2 border-app-bg"
                  activeOpacity={0.8}
                  onPress={onEditProfile}
                >
                  <Pencil size={14} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-[22px] font-bold text-app-light mb-1">{user.name}</Text>
            <Text className="text-sm text-app-muted mb-4">{user.email}</Text>
          </View>

          {isLoggedIn && (
            <>
              <Text className="text-[11px] font-bold text-app-muted tracking-widest mb-2 mt-1">
                ACCOUNT INFORMATION
              </Text>
              <View className="bg-app-card rounded-2xl mb-5 overflow-hidden border border-app-border">
                <InfoRow
                  icon={<BadgeCheck size={18} color="#2dd4bf" strokeWidth={1.8} />}
                  iconBg="rgba(20,184,166,0.15)"
                  label="Account Type"
                  value={user.accountType}
                  badge="ACTIVE"
                  badgeColor="#2dd4bf"
                />
                <InfoRow
                  icon={<Calendar size={18} color="#818cf8" strokeWidth={1.8} />}
                  iconBg="rgba(79,70,229,0.18)"
                  label="Member since"
                  value={user.memberSince}
                  showDivider={false}
                />
              </View>
            </>
          )}

          <Text className="text-[11px] font-bold text-app-muted tracking-widest mb-2 mt-1">
            SECURITY & PRIVACY
          </Text>
          <View className="bg-app-card rounded-2xl mb-5 overflow-hidden border border-app-border">
            <SectionRow
              icon={<HelpCircle size={18} color="#9CA3AF" strokeWidth={1.8} />}
              label="Security Audit Logs"
              onPress={onSecurityAuditLogs}
              showDivider={false}
            />
          </View>

          {isLoggedIn ? (
            <TouchableOpacity
              className={`flex-row items-center justify-center gap-2.5 bg-app-accentSoft border border-app-danger/30 rounded-2xl py-4 mb-5 ${signingOut ? 'opacity-60' : ''}`}
              activeOpacity={0.8}
              onPress={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <LogOut size={18} color="#fff" strokeWidth={2} />
                  <Text className="text-white text-[16px] font-bold">Sign Out</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2.5 bg-app-accentSoft rounded-2xl py-4 mb-5"
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Login')}
            >
              <LogIn size={18} color="#FFFFFF" strokeWidth={2} />
              <Text className="text-white text-[16px] font-bold">Sign In</Text>
            </TouchableOpacity>
          )}

          <Text className="text-center text-xs text-app-muted mt-1">
            Deepfake Detector {user.appVersion}
          </Text>
        </ScrollView>
      </SafeAreaView>

      {/* 🆕 GLOBAL MODAL */}
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
    </View>
  );
};

export default ProfileScreen;