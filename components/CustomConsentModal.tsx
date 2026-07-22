// components/CustomConsentModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { useConsent } from '../contexts/ConsentContext';

const THEME = {
  bg: '#0D0B14',
  card: '#1A1826',
  border: '#2A2740',
  accent: '#A69EFF',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',
};

const CustomConsentModal: React.FC = () => {
  const { showCustomConsent, acceptCustomConsent } = useConsent();

  return (
    <Modal visible={showCustomConsent} transparent animationType="fade" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', paddingHorizontal: 20 }}>
        <View style={{ backgroundColor: THEME.card, borderRadius: 20, borderWidth: 1, borderColor: THEME.border, padding: 24, maxHeight: '80%' }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View style={{ backgroundColor: 'rgba(166,158,255,0.15)', padding: 14, borderRadius: 999, marginBottom: 12 }}>
              <ShieldCheck size={28} color={THEME.accent} strokeWidth={2} />
            </View>
            <Text style={{ color: THEME.textLight, fontSize: 18, fontWeight: '700' }}>
              Your Privacy Matters
            </Text>
          </View>

          <ScrollView style={{ maxHeight: 240 }} showsVerticalScrollIndicator={false}>
            <Text style={{ color: THEME.textMuted, fontSize: 14, lineHeight: 21 }}>
              We use cookies and similar technologies, and may collect device
              information, to provide, maintain, and improve our services,
              including showing you personalized ads. By continuing, you agree
              to our use of this data as described in our Privacy Policy.
              {'\n\n'}
              This app displays ads provided by Google AdMob to support free
              access to our detection tools. You can review or manage your
              privacy choices anytime in Settings.
            </Text>
          </ScrollView>

          <TouchableOpacity
            onPress={acceptCustomConsent}
            activeOpacity={0.85}
            style={{
              backgroundColor: THEME.accent,
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
              Accept & Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomConsentModal;