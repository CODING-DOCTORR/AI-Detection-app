// components/RewardedAdModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Gift, Play, X, Sparkles } from 'lucide-react-native';

const THEME = {
  bg: '#0D0B14',
  card: '#1A1826',
  border: '#2A2740',
  accent: '#A69EFF',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',
};

interface RewardedAdModalProps {
  visible: boolean;
  onClose: () => void;
  onWatchAd: () => Promise<void>;
  isAdReady: boolean;
  isLoading: boolean;
}

export default function RewardedAdModal({
  visible,
  onClose,
  onWatchAd,
  isAdReady,
  isLoading,
}: RewardedAdModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.75)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 380,
            backgroundColor: THEME.card,
            borderRadius: 28,
            padding: 28,
            borderWidth: 1,
            borderColor: THEME.border,
            alignItems: 'center',
          }}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              padding: 8,
              zIndex: 10,
            }}
          >
            <X size={20} color={THEME.textMuted} />
          </TouchableOpacity>

          {/* Icon */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 999,
              backgroundColor: 'rgba(166,158,255,0.15)',
              borderWidth: 2,
              borderColor: 'rgba(166,158,255,0.3)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              marginTop: 8,
            }}
          >
            <Gift size={40} color={THEME.accent} strokeWidth={2} />
          </View>

          {/* Title */}
          <Text
            style={{
              color: THEME.textLight,
              fontSize: 22,
              fontWeight: '800',
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            No Credits Left!
          </Text>

          {/* Message */}
          <Text
            style={{
              color: THEME.textMuted,
              fontSize: 14,
              textAlign: 'center',
              lineHeight: 20,
              marginBottom: 20,
              paddingHorizontal: 8,
            }}
          >
            Watch a short ad to earn{' '}
            <Text style={{ color: THEME.accent, fontWeight: '700' }}>1 free credit</Text>{' '}
            and continue detecting.
          </Text>

          {/* Reward highlight */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'rgba(251,191,36,0.1)',
              borderWidth: 1,
              borderColor: 'rgba(251,191,36,0.25)',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              marginBottom: 24,
            }}
          >
            <Sparkles size={14} color="#fbbf24" fill="#fbbf24" />
            <Text style={{ color: '#fbbf24', fontSize: 12, fontWeight: '700', letterSpacing: 0.3 }}>
              +1 CREDIT REWARD
            </Text>
          </View>

          {/* Watch Ad Button */}
          <TouchableOpacity
            onPress={onWatchAd}
            disabled={!isAdReady || isLoading}
            activeOpacity={0.85}
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              backgroundColor: isAdReady && !isLoading ? THEME.accent : '#4B4867',
              paddingVertical: 16,
              borderRadius: 16,
              marginBottom: 10,
              opacity: isAdReady && !isLoading ? 1 : 0.6,
            }}
          >
            {isLoading ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Loading ad...</Text>
              </>
            ) : isAdReady ? (
              <>
                <Play size={18} color="#fff" fill="#fff" strokeWidth={2} />
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Watch Ad</Text>
              </>
            ) : (
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                Preparing ad...
              </Text>
            )}
          </TouchableOpacity>

          {/* Cancel button */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={{ paddingVertical: 12, paddingHorizontal: 20 }}
          >
            <Text style={{ color: THEME.textMuted, fontSize: 14, fontWeight: '600' }}>
              Maybe Later
            </Text>
          </TouchableOpacity>

          {/* Pro upsell hint */}
          <Text
            style={{
              color: THEME.textMuted,
              fontSize: 11,
              textAlign: 'center',
              marginTop: 8,
              opacity: 0.7,
            }}
          >
            💎 Get unlimited access with Pro
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}