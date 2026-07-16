import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/onboarding';

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({ total, activeIndex }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === activeIndex ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 3 },
  dotActive: { width: 24, backgroundColor: COLORS.primary },
  dotInactive: { width: 8, backgroundColor: '#CBD5E1' },
});
