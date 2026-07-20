// screens/TermsOfServiceScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, FileText, CheckCircle2, XCircle, AlertCircle, Scale } from 'lucide-react-native';

const THEME = {
  bg: '#0D0B14',
  card: '#1A1826',
  border: '#2A2740',
  accent: '#A69EFF',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',
};

const SECTIONS = [
  {
    icon: CheckCircle2,
    title: '1. Acceptance of Terms',
    content:
      'By accessing or using the Deepfake Detector app, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our service.',
  },
  {
    icon: FileText,
    title: '2. Service Description',
    content:
      'Deepfake Detector provides AI-powered detection services for identifying manipulated media (deepfakes) and AI-generated content across images, videos, audio, and text formats.',
  },
  {
    icon: AlertCircle,
    title: '3. User Responsibilities',
    content:
      'You agree to use our service only for lawful purposes. You must not upload content that infringes on copyright, contains illegal material, or is intended to harass or harm others.',
  },
  {
    icon: XCircle,
    title: '4. Limitations & Disclaimers',
    content:
      'Our AI detection results are provided as-is and should not be considered 100% accurate. Results are indicators only and should not be used as sole evidence for legal or professional decisions.',
  },
  {
    icon: Scale,
    title: '5. Intellectual Property',
    content:
      'All content, features, and functionality of the app are owned by Deepfake Detector and are protected by international copyright, trademark, and other intellectual property laws.',
  },
];

export default function TermsOfServiceScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }} activeOpacity={0.7}>
            <ArrowLeft size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={{ color: THEME.textLight, fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>
            Terms of Service
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Hero Card */}
          <View
            style={{
              backgroundColor: THEME.card,
              borderRadius: 20,
              padding: 24,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: THEME.border,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 999,
                backgroundColor: 'rgba(166,158,255,0.15)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <FileText size={32} color={THEME.accent} strokeWidth={2} />
            </View>
            <Text style={{ color: THEME.textLight, fontSize: 20, fontWeight: '800', marginBottom: 8 }}>
              Terms & Conditions
            </Text>
            <Text style={{ color: THEME.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
              Last updated: January 2026{'\n'}Please read carefully before using our service.
            </Text>
          </View>

          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <View
                key={i}
                style={{
                  backgroundColor: THEME.card,
                  borderRadius: 18,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: THEME.border,
                  marginBottom: 12,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: 'rgba(166,158,255,0.15)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} color={THEME.accent} strokeWidth={2} />
                  </View>
                  <Text style={{ color: THEME.textLight, fontSize: 16, fontWeight: '700', flex: 1 }}>
                    {section.title}
                  </Text>
                </View>
                <Text style={{ color: THEME.textMuted, fontSize: 13, lineHeight: 20 }}>
                  {section.content}
                </Text>
              </View>
            );
          })}

          <View
            style={{
              backgroundColor: 'rgba(251,191,36,0.08)',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: 'rgba(251,191,36,0.2)',
              marginTop: 8,
            }}
          >
            <Text style={{ color: '#fbbf24', fontSize: 14, fontWeight: '700', marginBottom: 4 }}>
              Important Notice
            </Text>
            <Text style={{ color: THEME.textMuted, fontSize: 12, lineHeight: 18 }}>
              By continuing to use this app, you acknowledge that you have read, understood, and agreed to these terms.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}