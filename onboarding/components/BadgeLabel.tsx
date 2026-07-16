import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/onboarding';

interface BadgeLabelProps {
  label: string;
}

export const BadgeLabel: React.FC<BadgeLabelProps> = ({ label }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>✦</Text>
      </View>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginBottom: 16, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE' },
  iconCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  icon: { color: COLORS.white, fontSize: 9, fontWeight: '700' },
  text: { color: COLORS.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
});
