import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../constants/onboarding';

export const ServerCard: React.FC = () => {
  const [error, setError] = useState('');

  return (
    <View className="w-full h-56 relative">
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1640552435388-a54879e72b28?w=800&q=80' }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        onError={(e) => setError(e.nativeEvent.error)}
      />
      {error ? (
        <Text style={{ color: 'red', padding: 8 }}>{error}</Text>
      ) : null}
      <View
        className="absolute bottom-4 right-4 w-12 h-12 rounded-full items-center justify-center"
        style={{ backgroundColor: COLORS.primary }}
      >
        <Text className="text-2xl">🛡️</Text>
      </View>
    </View>
  );
};