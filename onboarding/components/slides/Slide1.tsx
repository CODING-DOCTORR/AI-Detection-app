import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BadgeLabel } from '../BadgeLabel';
import { FaceScanCard } from '../FaceScanCard';
import { COLORS } from '../../constants/onboarding';

export const Slide1: React.FC = () => {
  return (
    <View style={styles.container}>
      <BadgeLabel label="VERACITY SHIELD" />
      <Text style={styles.title}>AI-Powered Precision</Text>
      <Text style={styles.description}>
        Our multi-layered neural networks analyze biometric markers, lighting inconsistencies, and
        acoustic artifacts with forensic accuracy.
      </Text>
      <FaceScanCard
        tags={[
          { label: 'Deep Layer Analysis', type: 'info' },
          { label: '89% Confidence', type: 'success' },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 16 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textDark, textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  description: { fontSize: 15, color: COLORS.textMuted, lineHeight: 22, textAlign: 'center', marginBottom: 24 },
});
