// components/upload/TextInputBox.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { X, FileText } from 'lucide-react-native';

interface TextInputBoxProps {
  value: string;
  onChangeText: (t: string) => void;
  onClear: () => void;
}

const MAX_CHARS = 5000;

const TextInputBox: React.FC<TextInputBoxProps> = ({ value, onChangeText, onClear }) => (
  <View className="rounded-3xl bg-app-card border border-app-border p-4 min-h-[320px]">
    {/* Header row */}
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-row items-center gap-2.5">
        <View className="w-8 h-8 rounded-xl bg-app-accent/20 items-center justify-center">
          <FileText size={16} color="#4F46E5" strokeWidth={2} />
        </View>
        <Text className="text-app-light text-[15px] font-semibold">Enter your text</Text>
      </View>

      {value.length > 0 && (
        <TouchableOpacity
          onPress={onClear}
          activeOpacity={0.7}
          className="bg-white/10 rounded-full p-1.5"
        >
          <X size={14} color="#fff" />
        </TouchableOpacity>
      )}
    </View>

    {/* Textarea */}
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Paste or type text to detect AI content..."
      placeholderTextColor="rgba(255,255,255,0.4)"
      multiline
      maxLength={MAX_CHARS}
      textAlignVertical="top"
      className="text-app-light text-[15px] leading-[22px] p-0"
      style={{ minHeight: 220 }}
    />

    {/* Char counter */}
    <Text className="mt-2 text-right text-app-muted text-xs font-medium">
      {value.length} / {MAX_CHARS} characters
    </Text>
  </View>
);

export default TextInputBox;