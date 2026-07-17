// components/AppModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from 'react-native';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const THEME = {
  bg: '#0D0B14',
  card: '#1A1826',
  card2: '#1E1B2E',
  border: '#2A2740',
  accent: '#A69EFF',
  accentSoft: '#818cf8',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',
  success: '#22c55e',
  warning: '#fbbf24',
  danger: '#f87171',
  info: '#60a5fa',
};

export type ModalType = 'success' | 'warning' | 'error' | 'info' | 'loading' | 'confirm';

export interface ModalButton {
  text: string;
  onPress: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

interface AppModalProps {
  visible: boolean;
  type?: ModalType;
  title?: string;
  message?: string;
  buttons?: ModalButton[];
  onClose?: () => void;
  showCloseIcon?: boolean;
  loading?: boolean;
  hideOnBackdropPress?: boolean;
}

const AppModal: React.FC<AppModalProps> = ({
  visible,
  type = 'info',
  title,
  message,
  buttons = [],
  onClose,
  showCloseIcon = true,
  loading = false,
  hideOnBackdropPress = true,
}) => {
  // Icon & color based on type
  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return { Icon: CheckCircle2, color: THEME.success, bg: 'rgba(34,197,94,0.15)' };
      case 'warning':
        return { Icon: AlertTriangle, color: THEME.warning, bg: 'rgba(251,191,36,0.15)' };
      case 'error':
        return { Icon: XCircle, color: THEME.danger, bg: 'rgba(248,113,113,0.15)' };
      case 'confirm':
        return { Icon: AlertTriangle, color: THEME.accent, bg: 'rgba(166,158,255,0.15)' };
      case 'loading':
      case 'info':
      default:
        return { Icon: Info, color: THEME.info, bg: 'rgba(96,165,250,0.15)' };
    }
  };

  const { Icon, color, bg } = getIconConfig();

  const getButtonStyle = (btnStyle?: string) => {
    switch (btnStyle) {
      case 'primary':
        return { bg: THEME.accent, text: '#FFFFFF' };
      case 'danger':
        return { bg: THEME.danger, text: '#FFFFFF' };
      case 'secondary':
      default:
        return { bg: 'transparent', text: THEME.textMuted, border: THEME.border };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
        onPress={hideOnBackdropPress ? onClose : undefined}
      >
        {/* Prevent tap-through */}
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            style={{
              width: Math.min(SCREEN_WIDTH - 48, 400),
              backgroundColor: THEME.card,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: THEME.border,
              padding: 24,
              alignItems: 'center',
            }}
          >
            {/* Close icon (top-right) */}
            {showCloseIcon && onClose && !loading && (
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
            )}

            {/* Icon */}
            {loading ? (
              <View
                style={{
                  padding: 20,
                  borderRadius: 999,
                  backgroundColor: 'rgba(166,158,255,0.15)',
                  marginBottom: 20,
                  marginTop: 8,
                }}
              >
                <ActivityIndicator size="large" color={THEME.accent} />
              </View>
            ) : (
              <View
                style={{
                  padding: 16,
                  borderRadius: 999,
                  backgroundColor: bg,
                  marginBottom: 20,
                  marginTop: 8,
                }}
              >
                <Icon size={40} color={color} strokeWidth={2} />
              </View>
            )}

            {/* Title */}
            {title && (
              <Text
                style={{
                  color: THEME.textLight,
                  fontSize: 20,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: message ? 8 : 20,
                }}
              >
                {title}
              </Text>
            )}

            {/* Message */}
            {message && (
              <Text
                style={{
                  color: THEME.textMuted,
                  fontSize: 14,
                  lineHeight: 20,
                  textAlign: 'center',
                  marginBottom: 24,
                }}
              >
                {message}
              </Text>
            )}

            {/* Buttons */}
            {buttons.length > 0 && (
              <View
                style={{
                  flexDirection: buttons.length > 2 ? 'column' : 'row',
                  gap: 10,
                  width: '100%',
                }}
              >
                {buttons.map((btn, i) => {
                  const btnStyle = getButtonStyle(btn.style);
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={btn.onPress}
                      activeOpacity={0.85}
                      style={{
                        flex: buttons.length > 2 ? 0 : 1,
                        paddingVertical: 14,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: btnStyle.bg,
                        borderWidth: btn.style === 'secondary' ? 1 : 0,
                        borderColor: btnStyle.border,
                      }}
                    >
                      <Text
                        style={{
                          color: btnStyle.text,
                          fontSize: 15,
                          fontWeight: '700',
                        }}
                      >
                        {btn.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AppModal;