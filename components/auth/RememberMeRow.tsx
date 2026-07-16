import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface RememberMeRowProps {
  checked: boolean;
  onToggle: () => void;
  onForgotPassword: () => void;
}

const RememberMeRow: React.FC<RememberMeRowProps> = ({
  checked,
  onToggle,
  onForgotPassword,
}) => {
  return (
    <View className="flex-row items-center justify-between mb-7">
      {/* Checkbox + label */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onToggle}
        className="flex-row items-center"
      >
        <View
          className="rounded-full border-2 mr-2 items-center justify-center"
          style={{
            width: 22,
            height: 22,
            borderColor: checked ? '#2563EB' : '#D1D5DB',
            backgroundColor: checked ? '#2563EB' : 'transparent',
          }}
        >
          {checked && (
            <View className="w-2.5 h-2.5 rounded-full bg-white" />
          )}
        </View>
        <Text className="text-gray-400 font-semibold text-sm">Remember Me</Text>
      </TouchableOpacity>

      {/* Forgot password */}
      <TouchableOpacity activeOpacity={0.7} onPress={onForgotPassword}>
        <Text className="text-[#A69EFF] font-semibold text-sm">Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RememberMeRow;
