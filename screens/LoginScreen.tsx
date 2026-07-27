import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import { User, X } from 'lucide-react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AppLogo from '../components/auth/AppLogo';
import AuthTitle from '../components/auth/AuthTitle';
import AppTextInput from '../components/auth/AppTextInput';
import PasswordInput from '../components/auth/PasswordInput';
import RememberMeRow from '../components/auth/RememberMeRow';
import PrimaryButton from '../components/auth/PrimaryButton';
import ErrorMessage from '../components/auth/ErrorMessage';
import { LoginFormValues } from '../types/auth.types';
import { getAuthToken, loginUser } from '../config/authService';

// 🎨 SHARED THEME (match onboarding gradient)
const GRADIENT_COLORS = ['#2a2550', '#1a1730', '#12101f', '#0a0815'] as const;
const GRADIENT_LOCATIONS = [0, 0.4, 0.75, 1] as const;
const ACCENT_COLOR = '#818cf8';       // indigo-400 (buttons, links)
const ACCENT_ICON = '#a5b4fc';        // indigo-300 (input icons)

interface LoginScreenProps {
  onLoginSuccess?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  onClose?: () => void;
}

function validate(values: LoginFormValues): Partial<Record<keyof LoginFormValues, string>> {
  const errors: Partial<Record<keyof LoginFormValues, string>> = {};
  if (!values.username.trim()) errors.username = 'Username is required';
  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 6) errors.password = 'Minimum 6 characters';
  return errors;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onForgotPassword,
  onRegister,
  onClose,
}) => {
  const [form, setForm] = useState<LoginFormValues>({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '876045078740-v3vlmbtfkc593h4o1gr6gghn2ne0med2.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const set = useCallback(
    (key: keyof LoginFormValues) => (value: string | boolean) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const handleLogin = useCallback(async () => {
    setGlobalError('');
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await loginUser(form.username, form.password);

      // TEMP — testing k liye, backend team ko token dene k baad hata dena
      const token = await getAuthToken();
      console.log('TEST TOKEN:', token);

      onLoginSuccess?.();
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') setGlobalError('This account does not exist.');
      else if (error.code === 'auth/wrong-password') setGlobalError('Incorrect password.');
      else if (error.code === 'auth/invalid-email') setGlobalError('Invalid email format.');
      else if (error.code === 'auth/invalid-credential') setGlobalError('Incorrect email or password.');
      else setGlobalError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [form, onLoginSuccess]);

  const handleGoogleSignIn = async () => {
    setGlobalError('');
    setGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const googleCredential = GoogleAuthProvider.credential(tokens.idToken);
      await signInWithCredential(auth, googleCredential);
      onLoginSuccess?.();
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // silent
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setGlobalError('Sign in is already in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setGlobalError('Google Play Services is not available on this device.');
      } else {
        console.log('Google Sign-In Error:', error);
        setGlobalError('Google sign in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    // 🎯 ROOT: fallback dark color so no white flash
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 🌈 Full-screen gradient (lighter top → darker bottom) */}
      <LinearGradient
        colors={GRADIENT_COLORS as any}
        locations={GRADIENT_LOCATIONS as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: 'transparent' }}
          >
            {/* Optional close button */}
            {/* {onClose && (
              <View style={styles.closeRow}>
                <TouchableOpacity activeOpacity={0.7} onPress={onClose} style={styles.closeBtn}>
                  <X size={24} color="#fff" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            )} */}

            <View style={styles.content}>
              {/* Logo */}
              <View style={styles.logoWrap}>
                <AppLogo size={120} />
              </View>

              {/* Title */}
              {/* <AuthTitle text="Sign In" /> */}

              <View style={{ height: 24 }} />

              {/* Global error */}
              <ErrorMessage message={globalError} />

              {/* Username */}
              <AppTextInput
                placeholder="Username"
                value={form.username}
                onChangeText={set('username') as (t: string) => void}
                icon={<User size={18} color={ACCENT_ICON} strokeWidth={1.8} />}
                autoCapitalize="none"
                error={errors.username}
              />

              {/* Password */}
              <PasswordInput
                value={form.password}
                onChangeText={set('password') as (t: string) => void}
                error={errors.password}
              />

              {/* Remember me + Forgot */}
              <RememberMeRow
                checked={form.rememberMe}
                onToggle={() => set('rememberMe')(!form.rememberMe)}
                onForgotPassword={() => onForgotPassword?.()}
              />

              {/* Login button */}
              <PrimaryButton label="Login" onPress={handleLogin} loading={loading} />

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Sign In Button */}
              <TouchableOpacity
                style={[styles.googleBtn, googleLoading && { opacity: 0.6 }]}
                activeOpacity={0.8}
                onPress={handleGoogleSignIn}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <Text style={styles.googleBtnText}>Signing in...</Text>
                ) : (
                  <>
                    <Image
                      source={{ uri: 'https://www.google.com/favicon.ico' }}
                      style={styles.googleIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.googleBtnText}>Continue with Google</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Register link */}
              <View style={styles.registerRow}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => onRegister?.()}>
                  <Text style={styles.registerLink}>Register now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0815' },
  safe: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1, backgroundColor: 'transparent' },
  scroll: { flexGrow: 1, backgroundColor: 'transparent' },
  closeRow: { paddingHorizontal: 16, paddingTop: 8 },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    backgroundColor: 'transparent',
  },
  logoWrap: { alignItems: 'center', marginTop: 16, marginBottom: 8 },

  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  registerText: { color: 'rgba(255,255,255,0.65)', fontSize: 14 },
  registerLink: { color: ACCENT_COLOR, fontWeight: 'bold', fontSize: 14 },

  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginVertical: 20, gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  dividerText: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },

  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  googleIcon: { width: 22, height: 22 },
  googleBtnText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
});

export default LoginScreen;