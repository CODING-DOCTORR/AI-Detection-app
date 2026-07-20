// screens/AppearanceScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Moon, Sun, Smartphone, Check, Palette } from 'lucide-react-native';

const THEME = {
  bg: '#0D0B14',
  card: '#1A1826',
  border: '#2A2740',
  accent: '#A69EFF',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',
};

type ThemeMode = 'dark' | 'light' | 'system';

const OPTIONS: { id: ThemeMode; label: string; desc: string; icon: any }[] = [
  { id: 'dark', label: 'Dark Mode', desc: 'Easy on the eyes at night', icon: Moon },
  { id: 'light', label: 'Light Mode', desc: 'Coming soon', icon: Sun },
  { id: 'system', label: 'System Default', desc: 'Match device settings', icon: Smartphone },
];

const ACCENT_COLORS = [
  { name: 'Purple', color: '#A69EFF' },
  { name: 'Blue', color: '#60a5fa' },
  { name: 'Pink', color: '#f472b6' },
  { name: 'Green', color: '#22c55e' },
  { name: 'Orange', color: '#fb923c' },
];

export default function AppearanceScreen() {
  const navigation = useNavigation<any>();
  const [selectedMode, setSelectedMode] = useState<ThemeMode>('dark');
  const [selectedAccent, setSelectedAccent] = useState('#A69EFF');

  return (
    <View style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }} activeOpacity={0.7}>
            <ArrowLeft size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={{ color: THEME.textLight, fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>
            Appearance
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
              <Palette size={32} color={THEME.accent} strokeWidth={2} />
            </View>
            <Text style={{ color: THEME.textLight, fontSize: 20, fontWeight: '800', marginBottom: 6 }}>
              Customize Your App
            </Text>
            <Text style={{ color: THEME.textMuted, fontSize: 13, textAlign: 'center' }}>
              Choose the look that fits you best
            </Text>
          </View>

          {/* Theme Options */}
          <Text
            style={{
              color: THEME.textMuted,
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: 1.2,
              marginLeft: 4,
              marginBottom: 12,
            }}
          >
            THEME
          </Text>
          <View style={{ gap: 10, marginBottom: 24 }}>
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedMode === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setSelectedMode(opt.id)}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: THEME.card,
                    borderRadius: 16,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    borderWidth: 2,
                    borderColor: isSelected ? THEME.accent : THEME.border,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: isSelected ? 'rgba(166,158,255,0.2)' : 'rgba(255,255,255,0.05)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={22} color={isSelected ? THEME.accent : THEME.textMuted} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: THEME.textLight, fontSize: 15, fontWeight: '700' }}>
                      {opt.label}
                    </Text>
                    <Text style={{ color: THEME.textMuted, fontSize: 12, marginTop: 2 }}>
                      {opt.desc}
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

          {/* Accent Colors */}
          {/* <Text
            style={{
              color: THEME.textMuted,
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: 1.2,
              marginLeft: 4,
              marginBottom: 12,
            }}
          >
            ACCENT COLOR
          </Text>
          <View
            style={{
              backgroundColor: THEME.card,
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: THEME.border,
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 14,
                justifyContent: 'space-between',
              }}
            >
              {ACCENT_COLORS.map((c) => {
                const isSelected = selectedAccent === c.color;
                return (
                  <TouchableOpacity
                    key={c.color}
                    onPress={() => setSelectedAccent(c.color)}
                    activeOpacity={0.7}
                    style={{ alignItems: 'center' }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 999,
                        backgroundColor: c.color,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: isSelected ? 3 : 0,
                        borderColor: '#fff',
                      }}
                    >
                      {isSelected && <Check size={20} color="#fff" strokeWidth={3} />}
                    </View>
                    <Text
                      style={{
                        color: THEME.textMuted,
                        fontSize: 11,
                        marginTop: 6,
                        fontWeight: '600',
                      }}
                    >
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View> */}

          {/* Info */}
          <View
            style={{
              backgroundColor: 'rgba(166,158,255,0.08)',
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: 'rgba(166,158,255,0.2)',
            }}
          >
            <Text style={{ color: THEME.textMuted, fontSize: 12, lineHeight: 18 }}>
              💡 Light mode and custom accent colors will be available in the next update.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}