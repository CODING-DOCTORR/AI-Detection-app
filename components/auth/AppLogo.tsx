import React from 'react';
import { View } from 'react-native';
import { User } from 'lucide-react-native';

interface AppLogoProps {
  size?: number;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 110 }) => {
  const outerSize = size;
  const innerSize = size * 0.78;
  const iconSize = size * 0.38;

  return (
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: outerSize,
        height: outerSize,
        backgroundColor: '#EBF0FB',
      }}
    >
      <View
        className="items-center justify-center rounded-full bg-white"
        style={{
          width: innerSize,
          height: innerSize,
          shadowColor: '#93C5FD',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <User size={iconSize} color="#2A2740" strokeWidth={1.5} />
      </View>
    </View>
  );
};

export default AppLogo;
