import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FeatureRow } from '../FeatureRow';
import { COLORS } from '../../constants/onboarding';

export const Slide2: React.FC = () => {
  return (
    <View style={styles.container}>

      {/* Image — center top */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2092/2092663.png' }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Secure Your Content.</Text>
        <Text style={styles.description}>
          Your data is protected with clinical precision and military-grade encryption. No one else
          has access.
        </Text>
        <FeatureRow
          icon="🔒"
          label="End-to-End Encryption"
          description="Your uploads are encrypted before they even leave your device."
        />
        <FeatureRow
          icon="👁️"
          label="Zero-Knowledge Policy"
          description="We never store your personal biometrics or raw video data."
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:   { flex: 1 },
  imageWrap:   { alignItems: 'center', marginTop: 40 },
  image:       { width: 200, height: 200 },
  content:     { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  title:       { fontSize: 28, fontWeight: '800', color: COLORS.textDark, textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  description: { fontSize: 15, color: COLORS.textMuted, lineHeight: 22, textAlign: 'center', marginBottom: 24 },
});