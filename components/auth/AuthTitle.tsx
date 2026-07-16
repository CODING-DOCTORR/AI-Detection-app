import React from 'react';
import { Text } from 'react-native';

interface AuthTitleProps {
  text: string;
}

const AuthTitle: React.FC<AuthTitleProps> = ({ text }) => (
  <Text className="text-[#A69EFF] text-2xl font-extrabold tracking-widest text-center mt-5 mb-2">
    {text.toUpperCase()}
  </Text>
);

export default AuthTitle;
