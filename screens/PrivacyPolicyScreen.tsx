// screens/PrivacyPolicyScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react-native';

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
    icon: Database,
    title: 'Information We Collect',
    content:
      'We collect information you provide directly, such as when you create an account, upload content for analysis, or contact us. This includes your email address, name, and the media files you submit for detection.',
  },
  {
    icon: Eye,
    title: 'How We Use Your Data',
    content:
      'Your data is used to provide our AI detection services, improve our models, and communicate important updates. We never sell your personal information to third parties.',
  },
  {
    icon: Lock,
    title: 'Data Security',
    content:
      'All files are encrypted end-to-end during transmission and storage. We use industry-standard security measures including SSL/TLS encryption and secure cloud infrastructure.',
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content:
      'You have the right to access, correct, or delete your personal data at any time. You can request a copy of your data or ask us to remove it from our systems by contacting support.',
  },
  {
    icon: Shield,
    title: 'Third-Party Services',
    content:
      'We use trusted third-party services like Firebase for authentication and Google AdMob for advertising. Each service has its own privacy policy governing its use of your data.',
  },
];

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }} activeOpacity={0.7}>
            <ArrowLeft size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={{ color: THEME.textLight, fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>
            Privacy Policy
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
              <Shield size={32} color={THEME.accent} strokeWidth={2} />
            </View>
            <Text style={{ color: THEME.textLight, fontSize: 20, fontWeight: '800', marginBottom: 8 }}>
              Your Privacy Matters
            </Text>
            <Text style={{ color: THEME.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
              Last updated: January 2026{'\n'}We take your privacy seriously.
            </Text>
          </View>

          {/* Sections */}
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

          {/* Contact Footer */}
          <View
            style={{
              backgroundColor: 'rgba(166,158,255,0.08)',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: 'rgba(166,158,255,0.2)',
              marginTop: 8,
            }}
          >
            <Text style={{ color: THEME.textLight, fontSize: 14, fontWeight: '700', marginBottom: 4 }}>
              Questions?
            </Text>
            <Text style={{ color: THEME.textMuted, fontSize: 12, lineHeight: 18 }}>
              Contact us at privacy@deepfakedetector.com for any privacy-related concerns.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}