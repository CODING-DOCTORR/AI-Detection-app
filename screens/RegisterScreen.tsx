// screens/RegisterScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { registerUser } from '../config/authService';
import { updateProfile, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AppModal from '../components/AppModal';                    // 🆕 Modal component
import { useModal } from '../hooks/ui/useModal';                  // 🆕 Modal hook

// --- Theme Constants ---
const THEME = {
  bg: '#0D0B14',
  card: '#1A1826',
  card2: '#1E1B2E',
  border: '#2A2740',
  accent: '#4F46E5',
  accentSoft: '#818cf8',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',
  danger: '#f87171',
};

// ─── Types ────────────────────────────────────────────────
interface RegisterScreenProps {
  onBack?: () => void;
  onLoginPress?: () => void;
  onRegisterSuccess?: () => void;
}

interface FormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// ─── Validation ───────────────────────────────────────────
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.fullName.trim()) errors.fullName = 'Full name is required';
  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email';
  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 6) errors.password = 'Minimum 6 characters';
  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
}

// ─── Reusable Field ───────────────────────────────────────
interface FieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  error?: string;
}

const Field: React.FC<FieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  error,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <View className="mb-4">
      <Text className="text-[11px] font-bold text-app-muted tracking-widest mb-2 ml-1">{label}</Text>
      <TextInput
        className={`bg-app-card2 rounded-full px-5 py-4 text-[15px] text-app-light border-2 ${
          focused ? 'border-app-accent' : error ? 'border-red-500' : 'border-transparent'
        }`}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {!!error && <Text className="text-red-400 text-xs mt-1 ml-4">{error}</Text>}
    </View>
  );
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onBack, onLoginPress, onRegisterSuccess }) => {
  const [form, setForm] = useState<FormValues>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);       // 🆕 Google loading state

  // 🆕 Modal hook
  const { modal, hideModal, showError, showSuccess } = useModal();

  // 🆕 Configure Google Sign-In on mount
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '150605444180-2bpbqt1fl1lddu8nun3k8s6anrmp44oe.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const set = useCallback(
    (key: keyof FormValues) => (value: string) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    []
  );

  // 🆕 Email/Password Register (with modal error)
  const handleRegister = useCallback(async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const userCredential = await registerUser(form.email, form.password);
      await updateProfile(userCredential.user, { displayName: form.fullName });
      await userCredential.user.reload();
      onRegisterSuccess?.();
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'This email is already registered.' });
      } else if (error.code === 'auth/invalid-email') {
        setErrors({ email: 'Invalid email format.' });
      } else if (error.code === 'auth/weak-password') {
        setErrors({ password: 'Password is too weak.' });
      } else {
        // 🆕 Themed modal instead of Alert.alert
        showError('Registration Failed', error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [form, onRegisterSuccess, showError]);

  // 🆕 Google Sign-Up handler
  const handleGoogleSignUp = useCallback(async () => {
    setGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Clear previous Google session so account picker always shows
      await GoogleSignin.signOut();

      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const googleCredential = GoogleAuthProvider.credential(tokens.idToken);
      await signInWithCredential(auth, googleCredential);

      // Firebase auto-creates the user if new, or signs in if existing
      onRegisterSuccess?.();
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled — no message needed
      } else if (error.code === statusCodes.IN_PROGRESS) {
        showError('In Progress', 'Sign up is already in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        showError('Not Available', 'Google Play Services is not available on this device.');
      } else {
        console.log('Google Sign-Up Error:', error);
        showError('Google Sign-Up Failed', 'Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  }, [onRegisterSuccess, showError]);

  return (
    <View className="flex-1 bg-app-bg">
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center px-4">
          <TouchableOpacity onPress={onBack} className="p-2" activeOpacity={0.7}>
            <ChevronLeft size={24} color="#FFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text className="text-app-light text-xl font-bold ml-2">Register</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
            {/* Card */}
            <View className="pY-6 rounded-3xl">
              <Text className="text-app-light text-3xl font-extrabold text-center mb-2">
                Create Account
              </Text>
              <Text className="text-app-muted text-center mb-8 leading-5">
                Join Deepfake to start securing your{'\n'}digital identity.
              </Text>

              <Field
                label="FULL NAME"
                placeholder="Enter your full name"
                value={form.fullName}
                onChangeText={set('fullName')}
                error={errors.fullName}
              />
              <Field
                label="EMAIL ADDRESS"
                placeholder="name@example.com"
                value={form.email}
                onChangeText={set('email')}
                keyboardType="email-address"
                error={errors.email}
              />
              <Field
                label="PASSWORD"
                placeholder="••••••••"
                value={form.password}
                onChangeText={set('password')}
                secureTextEntry
                error={errors.password}
              />
              <Field
                label="CONFIRM PASSWORD"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChangeText={set('confirmPassword')}
                secureTextEntry
                error={errors.confirmPassword}
              />

              {/* Create Account Button */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={loading}
                className={`py-4 mt-4 rounded-full items-center ${
                  loading ? 'bg-app-accentSoft opacity-70' : 'bg-app-accentSoft'
                }`}
              >
                {loading ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#fff" />
                    <Text className="text-white font-bold text-[15px] tracking-widest">
                      CREATING...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white font-bold text-[15px] tracking-widest">
                    CREATE ACCOUNT
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-app-border" />
                <Text className="text-app-muted text-xs mx-3 font-bold tracking-widest">
                  OR CONTINUE WITH
                </Text>
                <View className="flex-1 h-px bg-app-border" />
              </View>

              {/* 🆕 Google Sign-Up Button */}
              <TouchableOpacity
                onPress={handleGoogleSignUp}
                disabled={googleLoading}
                activeOpacity={0.8}
                className={`flex-row items-center justify-center gap-3 py-3.5 rounded-full border border-app-border bg-app-card2 mb-6 ${
                  googleLoading ? 'opacity-60' : ''
                }`}
              >
                {googleLoading ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#fff" />
                    <Text className="text-app-light font-bold">Signing up...</Text>
                  </View>
                ) : (
                  <>
                    <Image
                      source={{ uri: 'https://www.google.com/favicon.ico' }}
                      style={{ width: 22, height: 22 }}
                      resizeMode="contain"
                    />
                    <Text className="text-app-light font-bold">Continue with Google</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <View className="flex-row justify-center">
                <Text className="text-app-muted">Already have an account? </Text>
                <TouchableOpacity onPress={onLoginPress} activeOpacity={0.7}>
                  <Text className="text-app-accentSoft font-bold">Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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

export default RegisterScreen;