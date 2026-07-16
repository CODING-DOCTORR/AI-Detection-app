// screens/RegisterScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { registerUser } from '../config/authService';
import { updateProfile } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Theme Constants ---
const THEME = {
  bg: '#0D0B14',
  card: '#1A1826',
  card2: '#1E1B2E',
  border: '#2A2740',
  accent: '#4F46E5',
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

const Field: React.FC<FieldProps> = ({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, error }) => {
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
  const [form, setForm] = useState<FormValues>({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const set = useCallback((key: keyof FormValues) => (value: string) => setForm((prev) => ({ ...prev, [key]: value })), []);

  const handleRegister = useCallback(async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setLoading(true);
    try {
      const userCredential = await registerUser(form.email, form.password);
      await updateProfile(userCredential.user, { displayName: form.fullName });
      await userCredential.user.reload();
      onRegisterSuccess?.();
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') setErrors({ email: 'This email is already registered.' });
      else Alert.alert('Error', 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }, [form, onRegisterSuccess]);

  return (
    <View className="flex-1  bg-app-bg">
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />
      <SafeAreaView className="flex-1  " edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center  px-4 ">
          <TouchableOpacity onPress={onBack} className="p-2" activeOpacity={0.7}>
            <ChevronLeft size={24} color="#FFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text className="text-app-light text-xl font-bold ml-2">Register</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
          {/* Card */}
          <View className=" pY-6 rounded-3xl  ">
            <Text className="text-app-light text-3xl font-extrabold text-center mb-2">Create Account</Text>
            <Text className="text-app-muted text-center mb-8 leading-5">Join Deepfake to start securing your{'\n'}digital identity.</Text>

            <Field label="FULL NAME" placeholder="Enter your full name" value={form.fullName} onChangeText={set('fullName')} error={errors.fullName} />
            <Field label="EMAIL ADDRESS" placeholder="name@example.com" value={form.email} onChangeText={set('email')} keyboardType="email-address" error={errors.email} />
            <Field label="PASSWORD" placeholder="••••••••" value={form.password} onChangeText={set('password')} secureTextEntry error={errors.password} />
            <Field label="CONFIRM PASSWORD" placeholder="••••••••" value={form.confirmPassword} onChangeText={set('confirmPassword')} secureTextEntry error={errors.confirmPassword} />

            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className={`py-4 mt-4 rounded-full items-center ${loading ? 'bg-app-accentSoft' : 'bg-app-accentSoft'}`}
            >
              <Text className="text-white font-bold text-[15px] tracking-widest">
                {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-app-border" />
              <Text className="text-app-muted text-xs mx-3 font-bold tracking-widest">OR CONTINUE WITH</Text>
              <View className="flex-1 h-px bg-app-border" />
            </View>

            {/* Social Buttons */}
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-full border border-app-border bg-app-card2" activeOpacity={0.8}>
                <Text className="text-app-light font-bold">Google</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-full border border-app-border bg-app-card2" activeOpacity={0.8}>
                <Text className="text-app-light font-bold">Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View className="flex-row justify-center">
              <Text className="text-app-muted">Already have an account? </Text>
              <TouchableOpacity onPress={onLoginPress} activeOpacity={0.7}>
                <Text className="text-app-accentSoft font-bold">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default RegisterScreen;