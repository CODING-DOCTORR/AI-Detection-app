import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  User,
  ShieldCheck,
  ShieldOff,
  Bell,
  Palette,
  Globe,
  Info,
  FileText,
  ChevronRight,
  LucideIcon,
} from 'lucide-react-native';
import { SettingItem } from '../../types/settings.types';

const ICON_MAP: Record<string, LucideIcon> = {
  User,
  ShieldCheck,
  ShieldOff,
  Bell,
  Palette,
  Globe,
  Info,
  FileText,
};

interface SettingRowProps {
  item: SettingItem;
  isFirst: boolean;
  isLast: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({ item, isFirst, isLast }) => {
  const IconComponent = ICON_MAP[item.icon] ?? Info;

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={item.onPress}
      className={`flex-row items-center px-4 py-3.5  ${
        isFirst ? 'rounded-t-2xl' : ''
      } ${isLast ? 'rounded-b-2xl' : ''}`}
    >
      {/* Divider above (not first) */}
      {!isFirst && (
        <View
          className="absolute top-0 left-14 right-0"
          style={{ height: 0.5, backgroundColor: '#000000' }}
        />
      )}

      {/* Icon */}
      <View className="w-8 h-8 items-center justify-center mr-3">
        <IconComponent size={20} color="#ffff" strokeWidth={1.8} />
      </View>

      {/* Label */}
      <Text className="flex-1 text-white text-[15px] font-normal">
        {item.label}
      </Text>

      {/* Value badge (for items like Appearance: System) */}
      {item.type === 'value' && item.value ? (
        <Text className="text-gray-400 text-sm mr-1">{item.value}</Text>
      ) : null}

      {/* Chevron */}
      <ChevronRight size={18} color="#9CA3AF" strokeWidth={2} />
    </TouchableOpacity>
  );
};

export default SettingRow;
