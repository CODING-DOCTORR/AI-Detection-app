// screens/ProAccessScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import {
  X,
  Brain,
  Image as ImageIcon,
  FileText,
  Video,
  Mic,
  Gamepad2,
  CheckCircle2,
  Circle,
} from 'lucide-react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';

const FEATURES = [
  { label: 'AI Image Detection', icon: ImageIcon },
  { label: 'AI Text Detect & Humanizer', icon: FileText },
  { label: 'AI Video Detection', icon: Video },
  { label: 'AI Voice Detection', icon: Mic },
  // { label: 'Play Unlimited AI Game', icon: Gamepad2 },
];

export default function ProAccessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // 🆕 Check if this screen was opened from Splash (initial launch)
  // If true, X button will be hidden for 3 seconds, then navigate to MainTabs
  // If false (normal navigation), X button is immediately visible and goes back
  const fromSplash = route.params?.fromSplash === true;

  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'weekly'>('yearly');
  const [showCloseIcon, setShowCloseIcon] = useState(!fromSplash); // 🆕 Hidden if from splash
  const fadeAnim = useState(new Animated.Value(fromSplash ? 0 : 1))[0]; // 🆕 Fade animation

  // 🆕 Show X button after 3 seconds when opened from splash
  useEffect(() => {
    if (fromSplash) {
      const timer = setTimeout(() => {
        setShowCloseIcon(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [fromSplash, fadeAnim]);

  // 🆕 Handle close button press
  const handleClose = () => {
    if (fromSplash) {
      // Coming from Splash — go to MainTabs and reset stack
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        })
      );
    } else {
      // Normal navigation — just go back
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0D0B14' }}>
      <StatusBar barStyle="light-content" />

      {/* Header Controls */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingTop: 48,
          paddingBottom: 16,
        }}
      >
        {/* 🆕 Animated Close Icon — hidden for 3s if from splash */}
        <Animated.View className={"pt-3"} style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            onPress={handleClose}
            style={{
              padding: 8,
              // 🆕 Disable touches while hidden
              pointerEvents: showCloseIcon ? 'auto' : 'none',
            }}
            disabled={!showCloseIcon}
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* <TouchableOpacity>
          <Text style={{ color: '#9CA3AF', fontWeight: '600', fontSize: 16 }}>Restore</Text>
        </TouchableOpacity> */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Logo/Brain Section */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 999,
              backgroundColor: '#1A1826',
              borderWidth: 1,
              borderColor: '#2A2740',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(166,158,255,0.2)',
                padding: 16,
                borderRadius: 999,
              }}
            >
              <Brain size={48} color="#A69EFF" />
            </View>
          </View>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 28,
              fontWeight: '800',
              letterSpacing: -0.5,
            }}
          >
            GET PRO ACCESS
          </Text>
          <Text
            style={{
              color: '#A69EFF',
              fontSize: 28,
              fontWeight: '700',
              marginTop: 4,
            }}
          >
            GO UNLIMITED
          </Text>
        </View>

        {/* Features List */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32, gap: 16 }}>
          {FEATURES.map((feature, i) => {
            const IconComponent = feature.icon;
            return (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    backgroundColor: '#1A1826',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent size={20} color="#818cf8" />
                </View>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                  {feature.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Subscription Plans */}
        <View style={{ paddingHorizontal: 24, gap: 16, marginBottom: 40 }}>
          {/* Yearly Card */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('yearly')}
            style={{
              padding: 20,
              borderRadius: 24,
              borderWidth: 2,
              borderColor: selectedPlan === 'yearly' ? '#A69EFF' : '#2A2740',
              backgroundColor: selectedPlan === 'yearly' ? '#1E1B2E' : '#1A1826',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: -12,
                right: 20,
                backgroundColor: '#A69EFF',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 999,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: '700',
                  letterSpacing: 1,
                }}
              >
                SAVE 80%
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {selectedPlan === 'yearly' ? (
                  <CheckCircle2 size={24} color="#A69EFF" />
                ) : (
                  <Circle size={24} color="#9CA3AF" />
                )}
                <View>
                  <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 18 }}>
                    Unlimited Yearly
                  </Text>
                  <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
                    Just PKR 286.54 per week
                  </Text>
                </View>
              </View>
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>
                Rs 14,900
              </Text>
            </View>
          </TouchableOpacity>

          {/* Weekly Card */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('weekly')}
            style={{
              padding: 20,
              borderRadius: 24,
              borderWidth: 2,
              borderColor: selectedPlan === 'weekly' ? '#A69EFF' : '#2A2740',
              backgroundColor: selectedPlan === 'weekly' ? '#1E1B2E' : '#1A1826',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {selectedPlan === 'weekly' ? (
                  <CheckCircle2 size={24} color="#A69EFF" />
                ) : (
                  <Circle size={24} color="#9CA3AF" />
                )}
                <View>
                  <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 18 }}>
                    Unlimited Weekly
                  </Text>
                  <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
                    Just PKR 242.86 per day
                  </Text>
                </View>
              </View>
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>
                Rs 1,700
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View
        style={{
          padding: 24,
          paddingBottom: 32,
          backgroundColor: '#0D0B14',
          borderTopWidth: 1,
          borderTopColor: '#2A2740',
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: '#A69EFF',
            paddingVertical: 16,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>Continue</Text>
        </TouchableOpacity>
        <Text style={{ color: '#9CA3AF', textAlign: 'center', fontSize: 12, marginTop: 16 }}>
          Cancel anytime
        </Text>
      </View>
    </View>
  );
}