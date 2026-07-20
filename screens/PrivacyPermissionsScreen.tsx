// screens/PrivacyPermissionsScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Switch, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Shield, Camera, Mic, ImageIcon, Bell, Cookie, ExternalLink } from 'lucide-react-native';

const THEME = {
  bg: '#0D0B14',
  card: '#1A1826',
  border: '#2A2740',
  accent: '#A69EFF',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',
};

const PERMISSIONS = [
  { id: 'camera', icon: Camera, title: 'Camera', desc: 'Access camera for capturing media', enabled: true },
  { id: 'media', icon: ImageIcon, title: 'Photos & Media', desc: 'Access to gallery for uploads', enabled: true },
  { id: 'mic', icon: Mic, title: 'Microphone', desc: 'Record audio for analysis', enabled: false },
  { id: 'notif', icon: Bell, title: 'Notifications', desc: 'Send analysis updates', enabled: true },
  { id: 'ads', icon: Cookie, title: 'Personalized Ads', desc: 'Show relevant advertisements', enabled: true },
];

export default function PrivacyPermissionsScreen() {
  const navigation = useNavigation<any>();
  const [perms, setPerms] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    PERMISSIONS.forEach((p) => (initial[p.id] = p.enabled));
    return initial;
  });

  const toggle = (id: string) => {
    setPerms((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openSystemSettings = () => {
    Linking.openSettings();
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
            Privacy & Permissions
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
              <Shield size={32} color={THEME.accent} strokeWidth={2} />
            </View>
            <Text style={{ color: THEME.textLight, fontSize: 20, fontWeight: '800', marginBottom: 6 }}>
              Your Privacy Matters
            </Text>
            <Text style={{ color: THEME.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
              Control what data the app can access
            </Text>
          </View>

          {/* Permissions List */}
          <Text style={{ color: THEME.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.2, marginLeft: 4, marginBottom: 12 }}>
            APP PERMISSIONS
          </Text>
          <View style={{ backgroundColor: THEME.card, borderRadius: 18, borderWidth: 1, borderColor: THEME.border, overflow: 'hidden', marginBottom: 20 }}>
            {PERMISSIONS.map((perm, i) => {
              const Icon = perm.icon;
              const isEnabled = perms[perm.id];
              return (
                <View
                  key={perm.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    gap: 14,
                    borderBottomWidth: i < PERMISSIONS.length - 1 ? 1 : 0,
                    borderBottomColor: THEME.border,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: isEnabled ? 'rgba(166,158,255,0.2)' : 'rgba(255,255,255,0.05)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} color={isEnabled ? THEME.accent : THEME.textMuted} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: THEME.textLight, fontSize: 14, fontWeight: '700' }}>
                      {perm.title}
                    </Text>
                    <Text style={{ color: THEME.textMuted, fontSize: 12, marginTop: 2 }}>
                      {perm.desc}
                    </Text>
                  </View>
                  <Switch
                    value={isEnabled}
                    onValueChange={() => toggle(perm.id)}
                    trackColor={{ false: THEME.border, true: THEME.accent }}
                    thumbColor="#fff"
                  />
                </View>
              );
            })}
          </View>

          {/* Open System Settings */}
          <TouchableOpacity
            onPress={openSystemSettings}
            activeOpacity={0.8}
            style={{
              backgroundColor: THEME.card,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: THEME.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              marginBottom: 20,
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
              <ExternalLink size={20} color={THEME.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: THEME.textLight, fontSize: 14, fontWeight: '700' }}>
                Open System Settings
              </Text>
              <Text style={{ color: THEME.textMuted, fontSize: 12, marginTop: 2 }}>
                Manage permissions in your device
              </Text>
            </View>
          </TouchableOpacity>

          {/* Info */}
          <View
            style={{
              backgroundColor: 'rgba(251,191,36,0.08)',
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: 'rgba(251,191,36,0.2)',
            }}
          >
            <Text style={{ color: '#fbbf24', fontSize: 12, fontWeight: '700', marginBottom: 4 }}>
              Important
            </Text>
            <Text style={{ color: THEME.textMuted, fontSize: 12, lineHeight: 18 }}>
              Disabling permissions may limit certain app features. All data is processed securely and never shared without your consent.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}