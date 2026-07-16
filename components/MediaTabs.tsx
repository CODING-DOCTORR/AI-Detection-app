// components/upload/MediaTabs.tsx
import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { Image as ImageIcon, Video, FileText, Music } from 'lucide-react-native';
import { MediaTab } from '../types/upload.types';

interface MediaTabsProps {
  activeTab: MediaTab;
  setActiveTab: (tab: MediaTab) => void;
}

const TABS: { key: MediaTab; icon: React.ComponentType<any> }[] = [
  { key: 'Image', icon: ImageIcon },
  { key: 'Video', icon: Video },
  { key: 'Text',  icon: FileText },
  { key: 'Audio', icon: Music },
];

const MediaTabs: React.FC<MediaTabsProps> = ({ activeTab, setActiveTab }) => (
  <View className="py-2">
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
    >
      {TABS.map(({ key, icon: Icon }) => {
        const active = activeTab === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => setActiveTab(key)}
            activeOpacity={0.85}
            className={`flex-row items-center gap-2 px-5 py-2.5 rounded-full border ${
              active
                ? 'bg-app-accent border-app-accent shadow-lg shadow-app-accent/40'
                : 'bg-app-card border-app-border'
            }`}
          >
            <Icon
              size={16}
              color={active ? '#fff' : '#9CA3AF'}
              strokeWidth={active ? 2.5 : 2}
            />
            <Text
              className={`text-sm ${
                active ? 'text-white font-bold' : 'text-app-muted font-semibold'
              }`}
            >
              {key}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

export default MediaTabs;