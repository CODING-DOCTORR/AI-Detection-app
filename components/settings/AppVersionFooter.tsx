import React from 'react';
import { Text, View } from 'react-native';

interface AppVersionFooterProps {
  version: string;
  engineName: string;
}

const AppVersionFooter: React.FC<AppVersionFooterProps> = ({ version, engineName }) => {
  return (
    <View className="items-center pb-6 pt-2">
      <Text className="text-gray-400 text-xs text-center">
        App Version {version} • {engineName}
      </Text>
    </View>
  );
};

export default AppVersionFooter;
