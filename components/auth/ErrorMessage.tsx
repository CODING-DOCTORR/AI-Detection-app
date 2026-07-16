import React from 'react';
import { View, Text } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <View className="flex-row items-center bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
      <AlertCircle size={16} color="#EF4444" strokeWidth={2} />
      <Text className="text-red-600 text-sm ml-2 flex-1">{message}</Text>
    </View>
  );
};

export default ErrorMessage;
