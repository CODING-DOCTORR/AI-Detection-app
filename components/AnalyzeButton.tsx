// components/upload/AnalyzeButton.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface AnalyzeButtonProps {
  label: string;
  loading: boolean;
  onPress: () => void;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ label, loading, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    disabled={loading}
    className={`flex-row items-center justify-center py-4 mx-4 mb-8 rounded-2xl ${
      loading ? 'bg-app-accentSoft' : 'bg-app-accent'
    }`}
    style={{
      shadowColor: '#4F46E5',
      shadowOpacity: loading ? 0.2 : 0.5,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 14,
      elevation: 8,
    }}
  >
    {loading ? (
      <View className="flex-row items-center gap-2.5">
        <ActivityIndicator size="small" color="#fff" />
        <Text className="text-[17px] font-bold text-white tracking-wide">Analyzing...</Text>
      </View>
    ) : (
      <Text className="text-[17px] font-bold text-white tracking-wide">{label}</Text>
    )}
  </TouchableOpacity>
);

export default AnalyzeButton;