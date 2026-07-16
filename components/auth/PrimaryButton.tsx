import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { PrimaryButtonProps } from '../types/auth.types';

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      className="rounded-full py-4 items-center justify-center"
      style={{ backgroundColor: isDisabled ? '#93C5FD' : '#A69EFF' }}
    >
      {loading ? (
        <View className="flex-row items-center">
          <ActivityIndicator size="small" color="#ffffff" />
          <Text className="text-white font-bold text-base tracking-widest ml-2">
            {label.toUpperCase()}
          </Text>
        </View>
      ) : (
        <Text className="text-white font-bold text-base tracking-widest">
          {label.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;
