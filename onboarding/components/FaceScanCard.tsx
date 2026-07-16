import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, StyleSheet, Image } from 'react-native';
import { COLORS } from '../constants/onboarding';
import { TagChip } from './TagChip';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.82;

interface FaceScanCardProps {
  tags?: { label: string; type: 'success' | 'info' | 'warning' }[];
  showBiometricBadge?: boolean;
}

export const FaceScanCard: React.FC<FaceScanCardProps> = ({ tags, showBiometricBadge = false }) => {
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const scanTranslateY = scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 160] });

  return (
    <View style={[styles.card, { width: CARD_WIDTH }]}>
      <View style={styles.imageArea}>

        {/* Face image */}
        <Image
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-GdFcB1gcl0A_iCxiUEUpkrxGZVd2kl-6M5hNSYjZW0e2_noKiVwqrfdk2wLpKfwwizKdjmurwAS6v4agSO3gP5ACAkXrS-dDJFIDQQbc1YEdDnZOPI0fLJzFMDltffSPKmTsETmHJc2FFtz4mh3DbbAA_wXKmzUzEK8GG7Q4OJIgODVO3NVv-_IkV3RA2ftmgIhS2RF0v33Q4bwc5U4zJcvZl4Y1pYolYZ9C8wRNyZjO2soANHXQ20vFt0AJHQXTGsc-SHzA5HvJ' }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Scan line */}
        <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanTranslateY }] }]} />

        {/* Biometric badge */}
        {showBiometricBadge && (
          <View style={styles.bioBadge}>
            <View style={styles.bioDot} />
            <Text style={styles.bioText}>Biometric Link</Text>
          </View>
        )}
      </View>

      {tags && tags.length > 0 && (
        <View style={styles.tagsRow}>
          {tags.map((tag, i) => (
            <TagChip key={i} label={tag.label} type={tag.type} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { alignSelf: 'center', borderRadius: 24, overflow: 'hidden', backgroundColor: '#D1D5DB', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 8 },
  imageArea: { height: 200, position: 'relative' },
  image: { width: '100%', height: '100%' },
  scanLine: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: COLORS.primary, opacity: 0.8 },
  bioBadge: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  bioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginRight: 6 },
  bioText: { fontSize: 11, fontWeight: '700', color: COLORS.textDark },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingVertical: 12, backgroundColor: 'rgba(255,255,255,0.95)' },
});   