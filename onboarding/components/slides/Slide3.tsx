import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FaceScanCard } from '../FaceScanCard';
import { COLORS } from '../../constants/onboarding';

interface Slide3Props {
  onSkip: () => void;
}

export const Slide3: React.FC<Slide3Props> = ({ onSkip }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Deepfake</Text>
        </View>
        {/* <TouchableOpacity onPress={onSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity> */}
      </View>
      <FaceScanCard
        tags={[
          { label: 'VERIFIED  98.4%', type: 'success' },
          { label: 'Threat Detected', type: 'warning' },
        ]}
        showBiometricBadge
      />
      <View style={styles.textSection}>
        <Text style={styles.title}>Detect. Verify. Trust.</Text>
        <Text style={styles.description}>
          Advanced AI forensic analysis to protect your digital identity and restore truth in every
          pixel.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginRight: 6 },
  badgeText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
  skipText: { color: COLORS.textMuted, fontSize: 15, fontWeight: '600' },
  textSection: { marginTop: 32 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textDark, textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  description: { fontSize: 15, color: COLORS.textMuted, lineHeight: 22, textAlign: 'center' },
});
