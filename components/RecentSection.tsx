// components/upload/RecentSection.tsx
import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ImageOff, VideoOff, FileText, Music } from 'lucide-react-native';
import { MediaTab } from '../types/upload.types';

interface Photo { id: number | string; source: { uri: string } }

interface RecentSectionProps {
  activeTab: MediaTab;
  photos?: Photo[];
  onViewAllPress?: () => void;
  onPhotoPress?: (id: number | string) => void;
}

const EMPTY_CONFIG = {
  Image: { icon: ImageOff, label: 'No recent images available.' },
  Video: { icon: VideoOff, label: 'No recent video logs available.' },
  Text:  { icon: FileText, label: 'No recent text analyses available.' },
  Audio: { icon: Music,    label: 'No recent audio logs available.' },
};

const RecentSection: React.FC<RecentSectionProps> = ({
  activeTab,
  photos = [],
  onViewAllPress,
  onPhotoPress,
}) => {
  const title = `Recent ${activeTab}${activeTab === 'Text' || activeTab === 'Audio' ? '' : 's'}`;

  // ── Image tab: horizontal scroll of recent photos ──
  if (activeTab === 'Image' && photos.length > 0) {
    return (
      <View className="px-4 mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-xl font-bold text-app-light">{title}</Text>
          <TouchableOpacity onPress={onViewAllPress} activeOpacity={0.7}>
            <Text className="text-app-accentSoft text-sm font-semibold">View all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 16 }}
        >
          {photos.map((p) => (
            <TouchableOpacity
              key={p.id}
              activeOpacity={0.85}
              onPress={() => onPhotoPress?.(p.id)}
              className="rounded-2xl overflow-hidden border border-app-border"
            >
              <Image source={p.source} className="w-24 h-24" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // ── Empty state for all other tabs ──
  const config = EMPTY_CONFIG[activeTab];
  const Icon = config.icon;

  return (
    <View className="px-4 mb-6">
      <Text className="text-xl font-bold text-app-light mb-3">{title}</Text>
      <View className="bg-app-card p-7 rounded-2xl border border-app-border items-center gap-3">
        <View className="p-3 rounded-full bg-white/5">
          <Icon size={26} color="#9CA3AF" strokeWidth={1.5} />
        </View>
        <Text className="text-app-muted text-sm font-medium">{config.label}</Text>
      </View>
    </View>
  );
};

export default RecentSection;