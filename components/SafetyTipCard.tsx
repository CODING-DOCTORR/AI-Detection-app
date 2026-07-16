// components/upload/SafetyTipCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';

const SafetyTipCard: React.FC = () => (
  <View className="flex-row items-start gap-3.5 p-4 mx-4 mb-6 rounded-2xl bg-app-card border border-app-border">
    <View className="w-[42px] h-[42px] rounded-xl bg-app-accent/20 items-center justify-center">
      <ShieldAlert size={22} color="#4F46E5" strokeWidth={2} />
    </View>
    <View className="flex-1">
      <Text className="text-[15px] font-bold text-app-light mb-1">
        Safety tip:{' '}
        <Text className="font-normal text-white/70">
          We prioritize your privacy.
        </Text>
      </Text>
      <Text className="text-[13px] text-app-muted leading-5">
        Files are processed securely and encrypted end-to-end.
      </Text>
    </View>
  </View>
);

export default SafetyTipCard;