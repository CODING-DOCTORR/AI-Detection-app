export interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface AppTextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: React.ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  rightElement?: React.ReactNode;
  error?: string;
}

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface AuthHeaderProps {
  title: string;
  onMenuPress?: () => void;
  avatarUri?: string;
}
