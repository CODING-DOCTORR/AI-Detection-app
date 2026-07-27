// components/CreditsBadge.tsx
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Zap, Crown } from 'lucide-react-native';
import { useCredits } from '../hooks/useCredits';

interface CreditsBadgeProps {
  compact?: boolean; // For header use (icon only)
}

export default function CreditsBadge({ compact = false }: CreditsBadgeProps) {
  const { balance, isPro, isRewardedAdLoading } = useCredits();

  // ── PRO USER: Show unlimited ──
  if (isPro) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 999,
          backgroundColor: 'rgba(251,191,36,0.15)',
          borderWidth: 1,
          borderColor: 'rgba(251,191,36,0.3)',
          alignSelf: 'center',
          marginBottom: 12,
        }}
      >
        <Crown size={14} color="#fbbf24" fill="#fbbf24" strokeWidth={2} />
        <Text style={{ color: '#fbbf24', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
          {compact ? 'PRO' : 'Unlimited (PRO)'}
        </Text>
      </View>
    );
  }

  // ── FREE USER: Show credit count ──
  const hasCredits = balance > 0;
  const color = hasCredits ? '#A69EFF' : '#f87171';
  const bg = hasCredits ? 'rgba(166,158,255,0.15)' : 'rgba(248,113,113,0.15)';
  const borderColor = hasCredits ? 'rgba(166,158,255,0.3)' : 'rgba(248,113,113,0.3)';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: borderColor,
        alignSelf: 'center',
        marginBottom: 12,
      }}
    >
      {isRewardedAdLoading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Zap size={14} color={color} fill={hasCredits ? color : 'transparent'} strokeWidth={2} />
      )}
      <Text style={{ color, fontSize: 12, fontWeight: '700', letterSpacing: 0.3 }}>
        {compact ? balance : `${balance} ${balance === 1 ? 'Credit' : 'Credits'}`}
      </Text>
    </View>
  );
}