import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type TagType = 'success' | 'info' | 'warning';

interface TagChipProps {
  label: string;
  type: TagType;
}

const TAG_STYLES = {
  success: { bg: '#F0FDF4', text: '#15803D', dot: '#16A34A' },
  info:    { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  warning: { bg: '#FFFBEB', text: '#B45309', dot: '#F59E0B' },
};

export const TagChip: React.FC<TagChipProps> = ({ label, type }) => {
  const s = TAG_STYLES[type];
  return (
    <View style={[styles.container, { backgroundColor: s.bg }]}>
      <View style={[styles.dot, { backgroundColor: s.dot }]} />
      <Text style={[styles.text, { color: s.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  text: { fontSize: 12, fontWeight: '600' },
});
