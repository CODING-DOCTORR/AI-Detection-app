import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { LogOut } from 'lucide-react-native';

interface LogOutButtonProps {
  onPress: () => void;
}

const LogOutButton: React.FC<LogOutButtonProps> = ({ onPress }) => {
  return (
    <View className="mx-4 mb-4">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        className="bg-white rounded-2xl py-4 flex-row items-center justify-center"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <LogOut size={18} color="#EF4444" strokeWidth={2} style={{ marginRight: 8 }} />
        <Text className="text-red-500 font-semibold text-base">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LogOutButton;
