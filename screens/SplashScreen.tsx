import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Image as ImageIcon,
  Film,
  AudioLines,
  TextQuote,
  ArrowRight,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Animations
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const containerScale   = useRef(new Animated.Value(0.8)).current;
  const rotation         = useRef(new Animated.Value(0)).current;

  // Icon pop-in
  const iconImage = useRef(new Animated.Value(0)).current;
  const iconVideo = useRef(new Animated.Value(0)).current;
  const iconAudio = useRef(new Animated.Value(0)).current;
  const iconText  = useRef(new Animated.Value(0)).current;

  // Button & Text
  const titleOpacity  = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // 1. Fade + scale in the whole scene
    Animated.parallel([
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(containerScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Stagger the icons popping in
    Animated.stagger(120, [
      Animated.spring(iconImage, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
      Animated.spring(iconVideo, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
      Animated.spring(iconAudio, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
      Animated.spring(iconText,  { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
    ]).start();

    // 3. Rotating magnifying glass (continuous)
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 4. Title fades in after icons
    Animated.sequence([
      Animated.delay(1200),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 5. Button appears last with bounce
    Animated.sequence([
      Animated.delay(1800),
      Animated.parallel([
        Animated.spring(buttonOpacity, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(buttonTranslateY, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const counterSpin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const ORBIT_RADIUS = 70;

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <SafeAreaView className="flex-1 items-center justify-between py-16">
        {/* Spacer */}
        <View />

        {/* ─── MAIN ANIMATION AREA ─── */}
        <Animated.View
          style={{
            opacity: containerOpacity,
            transform: [{ scale: containerScale }],
          }}
          className="items-center justify-center"
        >
          <View
            style={{ width: 260, height: 260 }}
            className="items-center justify-center"
          >
            {/* Static icons 2x2 grid */}
            <View className="absolute items-center justify-center">
              <View className="flex-row gap-x-8 mb-4">
                <Animated.View
                  style={{ opacity: iconImage, transform: [{ scale: iconImage }] }}
                  className="w-14 h-14 rounded-2xl bg-indigo-500 items-center justify-center"
                >
                  <ImageIcon size={28} color="#fff" strokeWidth={2} />
                </Animated.View>

                <Animated.View
                  style={{ opacity: iconVideo, transform: [{ scale: iconVideo }] }}
                  className="w-14 h-14 rounded-2xl bg-white items-center justify-center"
                >
                  <Film size={28} color="#000" strokeWidth={2} />
                </Animated.View>
              </View>

              <View className="flex-row gap-x-8">
                <Animated.View
                  style={{ opacity: iconAudio, transform: [{ scale: iconAudio }] }}
                  className="w-14 h-14 items-center justify-center"
                >
                  <AudioLines size={36} color="#fff" strokeWidth={2} />
                </Animated.View>

                <Animated.View
                  style={{ opacity: iconText, transform: [{ scale: iconText }] }}
                  className="w-14 h-14 items-center justify-center"
                >
                  <TextQuote size={32} color="#fff" strokeWidth={2} />
                </Animated.View>
              </View>
            </View>

            {/* Rotating magnifying glass */}
            <Animated.View
              style={{
                position: 'absolute',
                width: ORBIT_RADIUS * 2,
                height: ORBIT_RADIUS * 2,
                transform: [{ rotate: spin }],
              }}
              className="items-center"
            >
              <Animated.View
                style={{
                  transform: [{ rotate: counterSpin }],
                  marginTop: -20,
                }}
              >
                <Search size={90} color="#7C5CFF" strokeWidth={2.5} />
              </Animated.View>
            </Animated.View>
          </View>

          {/* ─── TITLE ─── */}
          <Animated.View
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            }}
            className="items-center mt-8"
          >
            <Text className="text-white text-3xl font-extrabold tracking-wide">
              AI Detector
            </Text>
            <Text className="text-white/60 text-sm mt-2 tracking-widest">
              DETECT · VERIFY · TRUST
            </Text>
          </Animated.View>
        </Animated.View>

        {/* ─── CONTINUE BUTTON ─── */}
        <Animated.View
          style={{
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
          }}
          className="w-full px-8"
        >
          <TouchableOpacity
            onPress={() => onFinish?.()}
            activeOpacity={0.85}
            style={{
              shadowColor: '#7C5CFF',
              shadowOpacity: 0.5,
              shadowOffset: { width: 0, height: 8 },
              shadowRadius: 20,
              elevation: 12,
            }}
            className="bg-indigo-500 rounded-2xl py-4 flex-row items-center justify-center gap-2"
          >
            <Text className="text-white text-lg font-bold tracking-wide">
              Get Started
            </Text>
            <ArrowRight size={22} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>

          <Text className="text-white/40 text-xs text-center mt-4">
            Powered by advanced AI models
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

export default SplashScreen;