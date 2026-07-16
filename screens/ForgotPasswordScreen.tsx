// screens/ForgotPasswordScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  StatusBar,
  TextInput,
} from 'react-native';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { resetPassword } from '../config/authService';

interface ForgotPasswordScreenProps {
  onBack?: () => void;
}

function validateEmail(email: string): string {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
  return '';
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = useCallback(async () => {
    setGlobalError('');
    const error = validateEmail(email);
    if (error) { setEmailError(error); return; }
    setEmailError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') setGlobalError('This email is not registered.');
      else setGlobalError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email]);

  return (
    <View className="flex-1 bg-app-bg">
      <StatusBar barStyle="light-content" backgroundColor="#0D0B14" translucent={false} />
      
      <SafeAreaView className="flex-1" edges={['top']}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Back Button */}
            <TouchableOpacity onPress={onBack} className="self-start p-2 -ml-2" activeOpacity={0.7}>
              <ChevronLeft size={28} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>

            <View className="flex-1 justify-center pb-32">
              {/* Icon */}
              <View className="items-center mb-8">
                <View className="w-24 h-24 rounded-full bg-red-500/10 items-center justify-center border border-red-500/20">
                  <ShieldCheck size={48} color="#f87171" strokeWidth={1.5} />
                </View>
              </View>

              <Text className="text-app-light text-2xl font-bold text-center mb-3">Reset Password</Text>
              <Text className="text-app-muted text-center text-sm leading-6 mb-12">
                Enter your email to receive a{'\n'}recovery link
              </Text>

              {sent ? (
                <View className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 mb-6">
                  <Text className="text-green-400 text-sm leading-6 text-center">
                    ✅ Recovery link sent! Check your inbox for <Text className="font-bold">{email}</Text>
                  </Text>
                </View>
              ) : (
                <>
                  {globalError ? <Text className="text-red-400 text-sm mb-4 text-center">{globalError}</Text> : null}

                  {/* Email Input */}
                  <View className="mb-6">
                    <Text className="text-app-muted text-xs font-bold tracking-widest mb-2 ml-1">EMAIL ADDRESS</Text>
                    <TextInput
                      className={`bg-app-card2 rounded-full px-5 py-4 text-[15px] text-app-light border-2 ${emailError ? 'border-red-500' : 'border-transparent'}`}
                      placeholder="name@example.com"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={email}
                      onChangeText={(t) => { setEmail(t); if(emailError) setEmailError(''); }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {!!emailError && <Text className="text-red-400 text-xs mt-1 ml-4">{emailError}</Text>}
                  </View>

                  {/* Primary Button */}
                  <TouchableOpacity
                    onPress={handleSend}
                    disabled={loading}
                    className={`py-4 rounded-full items-center ${loading ? 'bg-app-accentSoft' : 'bg-app-accentSoft'}`}
                  >
                    <Text className="text-white font-bold text-[15px] tracking-wide">
                      {loading ? 'SENDING...' : 'SEND RECOVERY LINK'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Footer */}
              <View className="flex-row justify-center mt-12">
                <Text className="text-app-muted text-sm">Having trouble? </Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text className="text-app-accentSoft font-bold text-sm">Contact Support</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default ForgotPasswordScreen;