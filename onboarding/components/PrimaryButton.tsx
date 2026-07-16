import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/onboarding';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.btn}>
      <Text style={styles.text}>{label}  →</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { width: '100%', borderRadius: 16, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary },
  text: { color: COLORS.white, fontSize: 17, fontWeight: '700' },
});
