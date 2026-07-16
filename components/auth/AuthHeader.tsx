import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Menu } from 'lucide-react-native';
import { AuthHeaderProps } from '../types/auth.types';

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, onMenuPress, avatarUri }) => {
  return (
    <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
      <TouchableOpacity activeOpacity={0.7} onPress={onMenuPress} className="p-1">
        <Menu size={26} color="#1D4ED8" strokeWidth={2} />
      </TouchableOpacity>

      <Text className="text-[#1D4ED8] text-xl font-bold tracking-wide">{title}</Text>

      <View
        className="rounded-full overflow-hidden"
        style={{ width: 42, height: 42 }}
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={{ width: 42, height: 42 }} resizeMode="cover" />
        ) : (
          <View className="flex-1 bg-orange-200 items-center justify-center">
            <Text className="text-orange-600 font-bold">A</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default AuthHeader;
