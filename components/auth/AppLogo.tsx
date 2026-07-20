import React from 'react';
import { Text, View } from 'react-native';
import { LogIn } from 'lucide-react-native';

interface AppLogoProps {
  size?: number;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 110 }) => {
  const outerSize = size;
  const innerSize = size * 0.78;
  const iconSize = size * 0.38;

  return (
    <View
      className="items-center justify-center rounded"
      style={{
        width: outerSize,
        height: outerSize,
        
      }}
    >
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: 170,
          height: 100 *0.78,
          shadowColor: '#A69EFF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text className='text-white font-bold text-2xl'>Sign In</Text>
        {/* <LogIn size={iconSize} color='#EBF0FB'  strokeWidth={1.5} /> */}
      </View>
    </View>
  );
};

export default AppLogo;
