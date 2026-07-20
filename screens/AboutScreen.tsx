// screens/AboutScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Mail,
  Globe,
  Star,
  Bot,
  Video,
  Image as ImageIcon,
  Music,
} from 'lucide-react-native';

const THEME = {
  bg: '#0D0B14',
  card: '#1A1826',
  border: '#2A2740',
  accent: '#A69EFF',
  accentSoft: '#818cf8',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',
};

const FEATURES = [
  { icon: Bot, title: 'AI Text Detection', desc: 'Identify AI-generated text with 95% accuracy' },
  { icon: ImageIcon, title: 'Image Analysis', desc: 'Detect deepfakes and AI-generated images' },
  { icon: Video, title: 'Video Detection', desc: 'Frame-by-frame deepfake video analysis' },
  { icon: Music, title: 'Audio Analysis', desc: 'Detect voice cloning and synthetic audio' },
];

const STATS = [
  { value: '10M+', label: 'Analyses' },
  { value: '95%', label: 'Accuracy' },
  { value: '500K+', label: 'Users' },
];

export default function AboutScreen() {
  const navigation = useNavigation<any>();

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }} activeOpacity={0.7}>
            <ArrowLeft size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={{ color: THEME.textLight, fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>
            About
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View
            style={{
              backgroundColor: THEME.card,
              borderRadius: 24,
              padding: 28,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: THEME.border,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                backgroundColor: 'rgba(166,158,255,0.15)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <ShieldCheck size={40} color={THEME.accent} strokeWidth={2} />
            </View>
            <Text style={{ color: THEME.textLight, fontSize: 24, fontWeight: '800', marginBottom: 6 }}>
              Deepfake Detector
            </Text>
            <Text style={{ color: THEME.accentSoft, fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 12 }}>
              VERSION 2.4.12
            </Text>
            <Text style={{ color: THEME.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
              Advanced AI-powered detection for the modern era. Verify authenticity, protect your identity, and stay ahead of misinformation.
            </Text>
          </View>

          {/* Stats Row */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            {STATS.map((stat, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: THEME.card,
                  borderRadius: 16,
                  padding: 16,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: THEME.border,
                }}
              >
                <Text style={{ color: THEME.accent, fontSize: 20, fontWeight: '800', marginBottom: 4 }}>
                  {stat.value}
                </Text>
                <Text style={{ color: THEME.textMuted, fontSize: 11, fontWeight: '600' }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Features */}
          <Text style={{ color: THEME.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.2, marginLeft: 4, marginBottom: 12 }}>
            KEY FEATURES
          </Text>
          <View style={{ backgroundColor: THEME.card, borderRadius: 18, borderWidth: 1, borderColor: THEME.border, marginBottom: 20, overflow: 'hidden' }}>
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    gap: 14,
                    borderBottomWidth: i < FEATURES.length - 1 ? 1 : 0,
                    borderBottomColor: THEME.border,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: 'rgba(166,158,255,0.15)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} color={THEME.accent} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: THEME.textLight, fontSize: 14, fontWeight: '700' }}>
                      {feat.title}
                    </Text>
                    <Text style={{ color: THEME.textMuted, fontSize: 12, marginTop: 2 }}>
                      {feat.desc}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Contact & Links */}
          <Text style={{ color: THEME.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.2, marginLeft: 4, marginBottom: 12 }}>
            GET IN TOUCH
          </Text>
          <View style={{ backgroundColor: THEME.card, borderRadius: 18, borderWidth: 1, borderColor: THEME.border, overflow: 'hidden' }}>
            <TouchableOpacity
              onPress={() => openLink('mailto:support@deepfakedetector.com')}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                gap: 14,
                borderBottomWidth: 1,
                borderBottomColor: THEME.border,
              }}
            >
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
                <Mail size={18} color={THEME.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: THEME.textLight, fontSize: 14, fontWeight: '600' }}>
                  Email Support
                </Text>
                <Text style={{ color: THEME.textMuted, fontSize: 12 }}>
                  support@deepfakedetector.com
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openLink('https://deepfakedetector.com')}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                gap: 14,
                borderBottomWidth: 1,
                borderBottomColor: THEME.border,
              }}
            >
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
                <Globe size={18} color={THEME.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: THEME.textLight, fontSize: 14, fontWeight: '600' }}>
                  Visit Website
                </Text>
                <Text style={{ color: THEME.textMuted, fontSize: 12 }}>
                  deepfakedetector.com
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: 'rgba(251,191,36,0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Star size={18} color="#fbbf24" fill="#fbbf24" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: THEME.textLight, fontSize: 14, fontWeight: '600' }}>
                  Rate Us
                </Text>
                <Text style={{ color: THEME.textMuted, fontSize: 12 }}>
                  Enjoy the app? Leave a review!
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <Text style={{ color: THEME.textMuted, fontSize: 12 }}>Made with 💜 by Deepfake Team</Text>
            <Text style={{ color: THEME.textMuted, fontSize: 11, marginTop: 4 }}>
              © 2026 Deepfake Detector. All rights reserved.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}