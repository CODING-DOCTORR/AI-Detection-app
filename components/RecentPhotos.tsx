import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { View as ViewIcon } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = (width - (16 * 2 + 12 * 2)) / 3; // 3 columns handling

interface PhotoItem {
  id: number;
  source: any;
}

interface RecentPhotosProps {
  photos: PhotoItem[];
  onViewAllPress?: () => void;
  onPhotoPress?: (id: number) => void;
}

export default function RecentPhotos({ photos, onViewAllPress, onPhotoPress }: RecentPhotosProps) {
  return (
    <View className="px-4 mt-6">
      {/* Title Bar */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-2xl font-bold text-gray-900">Recent Photos</Text>
        <TouchableOpacity onPress={onViewAllPress} className="flex-row items-center gap-1.5">
          <Text className="text-sm font-semibold text-[#4F46E5]">View All</Text>
          {/* <ViewIcon size={16} stroke="#4F46E5" /> */}
        </TouchableOpacity>
      </View>

      {/* Grid view */}
      <View className="flex-row gap-3 mb-6">
        {photos.map((photo) => (
          <TouchableOpacity 
            key={photo.id} 
            activeOpacity={0.9}
            onPress={() => onPhotoPress?.(photo.id)}
          >
            <Image 
              source={photo.source} 
              style={{ width: IMAGE_WIDTH, height: IMAGE_WIDTH }} 
              className="rounded-2xl bg-gray-200"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}