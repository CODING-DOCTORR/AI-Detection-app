import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Lock, Eye, EyeOff } from 'lucide-react-native';
import AppTextInput from './AppTextInput';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChangeText,
  placeholder = '••••••',
  error,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <AppTextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      
      secureTextEntry={!visible}
      icon={<Lock size={18} color="#A69EFF" strokeWidth={1.8} />}
      error={error}
      rightElement={
        <TouchableOpacity  activeOpacity={0.6} onPress={() => setVisible((v) => !v)}>
          {visible ? (
            <EyeOff size={18} color="#9CA3AF" strokeWidth={1.8} />
          ) : (
            <Eye size={18} color="#9CA3AF" strokeWidth={1.8} />
          )}
        </TouchableOpacity>
      }
    />
  );
};

export default PasswordInput;
