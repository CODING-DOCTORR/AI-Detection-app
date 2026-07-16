import React from 'react';
import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ placeholder = "Search files...", value, onChangeText }: SearchBarProps) {
  return (
    <View className="mx-4 my-3 flex-row items-center gap-3 bg-app-card border border-app-border rounded-2xl px-4 py-3.5">
      <Search size={18} color="#9CA3AF" strokeWidth={2} />
      <TextInput
        className="flex-1 text-[15px] text-app-light p-0"
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value}
        onChangeText={onChangeText}
        selectionColor="#4F46E5"
      />
    </View>
  );
}