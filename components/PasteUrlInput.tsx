// components/upload/PasteUrlInput.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link2, Download } from 'lucide-react-native';

interface PasteUrlInputProps {
  onFetch: (url: string) => void;
  placeholder?: string;
}

const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

const PasteUrlInput: React.FC<PasteUrlInputProps> = ({
  onFetch,
  placeholder = 'https://example.com/media.jpg',
}) => {
  const [url, setUrl] = useState('');

  const handleFetch = () => {
    const trimmed = url.trim();
    if (!trimmed) {
      Alert.alert('Empty URL', 'Please paste a URL first.');
      return;
    }
    if (!URL_REGEX.test(trimmed)) {
      Alert.alert('Invalid URL', 'Please enter a valid http:// or https:// URL.');
      return;
    }
    onFetch(trimmed);
    setUrl('');
  };

  return (
    <View className="mt-5">
      {/* Divider — OR — */}
      <View className="flex-row items-center gap-3 mb-4">
        <View className="flex-1 h-px bg-app-border" />
        <Text className="text-xs text-app-muted font-bold tracking-widest">OR</Text>
        <View className="flex-1 h-px bg-app-border" />
      </View>

      {/* URL input row */}
      <View className="flex-row items-center gap-3 bg-app-card border border-app-border rounded-2xl px-3.5 py-3 mb-2.5">
        <View className="w-8 h-8 rounded-xl bg-app-accent/20 items-center justify-center">
          <Link2 size={18} color="#4F46E5" strokeWidth={2} />
        </View>
        <TextInput
          value={url}
          onChangeText={setUrl}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.4)"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          className="flex-1 text-app-light text-sm p-0"
        />
      </View>

      {/* Fetch button */}
      <TouchableOpacity
        onPress={handleFetch}
        activeOpacity={0.85}
        className="flex-row items-center justify-center gap-2 bg-app-accent rounded-2xl py-3"
      >
        <Download size={16} color="#fff" strokeWidth={2.5} />
        <Text className="text-white font-bold text-sm tracking-wide">
          Fetch from URL
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PasteUrlInput;