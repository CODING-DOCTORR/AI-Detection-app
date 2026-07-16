export interface UserProfile {
  name: string;
  email: string;
  avatarUri?: string;
}

export type SettingItemType = 'navigate' | 'value' | 'action';

export interface SettingItem {
  id: string;
  label: string;
  icon: string; // lucide icon name
  type: SettingItemType;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
}

export interface SettingSection {
  id: string;
  title: string;
  items: SettingItem[];
}
