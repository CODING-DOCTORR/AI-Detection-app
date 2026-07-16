import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, Film, Image as ImageIcon, FileText } from 'lucide-react-native';

export interface HistoryItem {
  id: string;
  fileName: string;
  date: string;
  time: string;
  type: 'video' | 'image' | 'document';
  isAuthentic: boolean;
  percentage: number;
}

interface HistoryCardProps {
  item: HistoryItem;
  onPress?: (item: HistoryItem) => void;
}

export default function HistoryCard({ item, onPress }: HistoryCardProps) {
  const renderIcon = () => {
    const iconSize = 22;
    const strokeColor = item.isAuthentic ? '#818cf8' : '#f87171'; // accentSoft / danger
    
    switch (item.type) {
      case 'video': return <Film size={iconSize} color={strokeColor} strokeWidth={2} />;
      case 'image': return <ImageIcon size={iconSize} color={strokeColor} strokeWidth={2} />;
      case 'document': return <FileText size={iconSize} color={strokeColor} strokeWidth={2} />;
    }
  };

  return (
    <TouchableOpacity 
      onPress={() => onPress?.(item)}
      activeOpacity={0.8}
      className="flex-row items-center justify-between p-4 mb-3 bg-app-card border border-app-border rounded-2xl"
    >
      {/* Left Section: Icon and Details */}
      <View className="flex-row items-center flex-1 pr-2">
        <View className={`p-3 rounded-xl mr-3.5 ${item.isAuthentic ? 'bg-app-accent/20' : 'bg-app-danger/15'}`}>
          {renderIcon()}
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-app-light" numberOfLines={1}>
            {item.fileName}
          </Text>
          <Text className="text-[12px] font-medium text-app-muted mt-1">
            {item.date} • {item.time}
          </Text>
        </View>
      </View>

      {/* Right Section: Status Badge, Percent & Chevron */}
      <View className="flex-row items-center gap-2.5">
        <View className="items-end">
          <View className={`px-2.5 py-1 rounded-full items-center justify-center ${
            item.isAuthentic ? 'bg-app-accent/15' : 'bg-app-danger/15'
          }`}>
            <Text className={`text-[10px] font-bold tracking-wider ${
              item.isAuthentic ? 'text-app-accentSoft' : 'text-app-danger'
            }`}>
              {item.isAuthentic ? 'AUTHENTIC' : 'SYNTHETIC'}
            </Text>
          </View>
          <Text className={`text-[13px] font-bold mt-1.5 ${
            item.isAuthentic ? 'text-app-accentSoft' : 'text-app-danger'
          }`}>
            {item.percentage}%
          </Text>
        </View>
        <ChevronRight size={18} color="#4B5563" strokeWidth={2} />
      </View>
    </TouchableOpacity>
  );
}