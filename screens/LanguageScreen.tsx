// screens/LanguageScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Check, Globe } from 'lucide-react-native';

const THEME = {
  bg: '#0D0B14',
  card: '#1A1826',
  border: '#2A2740',
  accent: '#A69EFF',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',
};

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
//   { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
//   { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
//   { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
//   { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
//   { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
//   { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
//   { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
//   { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
//   { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
//   { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
//   { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
//   { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
//   { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
];

export default function LanguageScreen() {
  const navigation = useNavigation<any>();
  const [selectedLang, setSelectedLang] = useState('en');

  return (
    <View style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }} activeOpacity={0.7}>
            <ArrowLeft size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={{ color: THEME.textLight, fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>
            Language
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Hero */}
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
              <Globe size={32} color={THEME.accent} strokeWidth={2} />
            </View>
            <Text style={{ color: THEME.textLight, fontSize: 20, fontWeight: '800', marginBottom: 6 }}>
              Choose Language
            </Text>
            <Text style={{ color: THEME.textMuted, fontSize: 13, textAlign: 'center' }}>
              Select your preferred language for the app
            </Text>
          </View>

          {/* Language List */}
          <View style={{ backgroundColor: THEME.card, borderRadius: 18, borderWidth: 1, borderColor: THEME.border, overflow: 'hidden' }}>
            {LANGUAGES.map((lang, i) => {
              const isSelected = selectedLang === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => setSelectedLang(lang.code)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    gap: 14,
                    borderBottomWidth: i < LANGUAGES.length - 1 ? 1 : 0,
                    borderBottomColor: THEME.border,
                    backgroundColor: isSelected ? 'rgba(166,158,255,0.05)' : 'transparent',
                  }}
                >
                  <Text style={{ fontSize: 28 }}>{lang.flag}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: THEME.textLight, fontSize: 15, fontWeight: '700' }}>
                      {lang.name}
                    </Text>
                    <Text style={{ color: THEME.textMuted, fontSize: 12, marginTop: 2 }}>
                      {lang.native}
                    </Text>
                  </View>
                  {isSelected && (
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 999,
                        backgroundColor: THEME.accent,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check size={14} color="#fff" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View
            style={{
              backgroundColor: 'rgba(166,158,255,0.08)',
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: 'rgba(166,158,255,0.2)',
              marginTop: 16,
            }}
          >
            <Text style={{ color: THEME.textMuted, fontSize: 12, lineHeight: 18 }}>
              🌍 More language translations will be available in upcoming updates.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}