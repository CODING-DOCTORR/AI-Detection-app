import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

interface SettingsHeaderProps {
  title: string;
  onBack?: () => void;
  avatarUri?: string;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ title, onBack, avatarUri }) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onBack}
        className="w-9 h-9 items-center justify-center"
      >
        <ArrowLeft size={22} color="#111827" strokeWidth={2} />
      </TouchableOpacity>

      <Text className="text-gray-900 font-semibold text-lg">{title}</Text>

      <View
        className="rounded-full overflow-hidden"
        style={{ width: 36, height: 36, borderWidth: 1.5, borderColor: '#2563EB' }}
      >
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={{ width: 36, height: 36 }}
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 bg-blue-100 items-center justify-center">
            <Text className="text-blue-600 font-bold text-sm">J</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SettingsHeader;
