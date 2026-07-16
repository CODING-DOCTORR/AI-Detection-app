// components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Crown, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-row items-center justify-between px-5 py-3 bg-transparent">
      {/* Crown → ProAccess */}
      <TouchableOpacity
        onPress={() => navigation.navigate('ProAccess')}
        activeOpacity={0.7}
        className="bg-yellow-500 rounded-full p-1.5"
      >
        <Crown size={20} color="#fff" strokeWidth={2} />
      </TouchableOpacity>

      {/* Title */}
      <Text className="text-app-light text-2xl font-bold tracking-wide">{title}</Text>

      {/* Profile → Profile Screen */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        activeOpacity={0.7}
        className="p-1.5"
      >
        <View className="w-9 h-9 rounded-full bg-app-card2 border border-app-border items-center justify-center">
          <User size={18} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;