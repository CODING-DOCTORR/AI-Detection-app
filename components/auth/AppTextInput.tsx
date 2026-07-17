import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { AppTextInputProps } from '../../types/auth.types';

const AppTextInput: React.FC<AppTextInputProps> = ({
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  rightElement,
  error,
}) => {
  return (
    <View className="mb-4">
      <View
        className={`flex-row items-center bg-[#2A2740] rounded-full px-4 py-1 border ${
          error ? 'border-red-400' : 'border-gray-600'
        }`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 3,
          elevation: 1,
        }}
      >
        <View className="mr-3 opacity-60">{icon}</View>

        <TextInput
          className="flex-1 text-gray-200 text-[15px]"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />

        {rightElement && <View className="ml-2">{rightElement}</View>}
      </View>

      {error ? (
        <Text className="text-red-500 text-xs mt-1 ml-4">{error}</Text>
      ) : null}
    </View>
  );
};

export default AppTextInput;
