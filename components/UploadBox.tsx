// components/upload/UploadBox.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { PlusCircle, Video as VideoIcon, Music, X, Play } from 'lucide-react-native';
import { PickedMedia, MediaTab } from '../types/upload.types';

interface UploadBoxProps {
  type: Exclude<MediaTab, 'Text'>;
  media: PickedMedia | null;
  onPress: () => void;
  onClear: () => void;
}

const CONFIG = {
  Image: {
    icon: PlusCircle,
    title: 'Tap to Upload Image',
    subtitle: 'Supported: JPG, PNG, WEBP · Max 10MB',
  },
  Video: {
    icon: VideoIcon,
    title: 'Tap to Upload Video',
    subtitle: 'Supported: MP4, MOV, AVI · Max 50MB',
  },
  Audio: {
    icon: Music,
    title: 'Tap to Upload Audio',
    subtitle: 'Supported: MP3, WAV, M4A · Max 30MB',
  },
};

const UploadBox: React.FC<UploadBoxProps> = ({ type, media, onPress, onClear }) => {
  const config = CONFIG[type];
  const Icon = config.icon;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{ aspectRatio: 1, borderStyle: 'dashed' }}
      className="rounded-3xl bg-app-card border-[1.5px] border-app-border items-center justify-center p-8 overflow-hidden"
    >
      {media ? (
        <View className="absolute inset-0">
          {media.type === 'image' ? (
            <Image
              source={{ uri: media.uri }}
              className="w-full h-full rounded-3xl"
              resizeMode="cover"
            />
          ) : (
            <MediaFilePreview
              icon={type === 'Video' ? VideoIcon : Music}
              label={type === 'Video' ? 'Video Selected ✅' : 'Audio Selected ✅'}
              fileName={media.fileName ?? `${type.toLowerCase()} file`}
            />
          )}

          <TouchableOpacity
            onPress={onClear}
            activeOpacity={0.7}
            className="absolute top-3 right-3 z-10 bg-black/60 rounded-full p-1.5 border border-white/15"
          >
            <X size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="items-center">
          {/* Outer glow */}
          <View className="bg-app-accent/20 p-2 rounded-full mb-5">
            {/* Inner circle */}
            <View
              className="bg-app-card2 p-[18px] rounded-full border border-app-border"
              style={{
                shadowColor: '#4F46E5',
                shadowOpacity: 0.5,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 14,
                elevation: 8,
              }}
            >
              <Icon size={32} color="#4F46E5" strokeWidth={1.5} />
            </View>
          </View>

          <Text className="text-lg font-bold text-app-light text-center mb-2">
            {config.title}
          </Text>
          <Text className="text-[13px] text-app-muted text-center">
            {config.subtitle}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ── File preview sub-component ──
const MediaFilePreview = ({
  icon: Icon,
  label,
  fileName,
}: {
  icon: React.ComponentType<any>;
  label: string;
  fileName: string;
}) => (
  <View className="flex-1 items-center justify-center bg-app-card2 rounded-3xl px-5">
    {/* Floating play button */}
    <View className="absolute top-5 right-5 w-11 h-11 rounded-full bg-app-accent items-center justify-center">
      <Play size={22} color="#fff" fill="#fff" />
    </View>

    <View className="bg-app-accent/20 p-[22px] rounded-full mb-3">
      <Icon size={44} color="#4F46E5" strokeWidth={1.5} />
    </View>

    <Text className="text-app-light text-base font-bold mb-1.5">{label}</Text>
    <Text className="text-app-muted text-xs max-w-[90%]" numberOfLines={1}>
      {fileName}
    </Text>
  </View>
);

export default UploadBox;