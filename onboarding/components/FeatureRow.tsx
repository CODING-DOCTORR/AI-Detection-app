import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/onboarding';

interface FeatureRowProps {
  icon: string;
  label: string;
  description: string;
}

export const FeatureRow: React.FC<FeatureRowProps> = ({ icon, label, description }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, borderRadius: 16, marginBottom: 12, backgroundColor: COLORS.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  icon: { fontSize: 18 },
  textBox: { flex: 1 },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 2 },
  description: { fontSize: 13, color: COLORS.textMuted, lineHeight: 18 },
});
