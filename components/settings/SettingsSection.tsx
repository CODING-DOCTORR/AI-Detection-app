import React from 'react';
import { View, Text } from 'react-native';
import { SettingSection as SettingSectionType } from '../../types/settings.types';
import SettingRow from './SettingRow';

interface SettingsSectionProps {
  section: SettingSectionType;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ section }) => {
  return (
    <View className="mx-4 mb-6">
      {/* Section header */}
      <Text className="text-[#A69EFF] text-xs font-semibold tracking-widest mb-2 ml-1">
        {section.title}
      </Text>

      {/* Card wrapping all rows */}
      <View
        className="rounded-2xl overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        {section.items.map((item, index) => (
          <SettingRow
            key={item.id}
            item={item}
            isFirst={index === 0}
            isLast={index === section.items.length - 1}
          />
        ))}
      </View>
    </View>
  );
};

export default SettingsSection;
