import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  PixelRatio,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AlignLeft,
  Music,
  Play,
  Gamepad2,
  Check,
  X,
  ChevronsLeft,
  ChevronsRight,
  Star,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 🎯 RESPONSIVE HELPERS — Base design is 375x812 (iPhone X)
const BASE_WIDTH = 375;
const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size: number) => (SCREEN_HEIGHT / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// 🎨 CONSISTENT ILLUSTRATION CONTAINER SIZE
const ILLUSTRATION_HEIGHT = Math.min(verticalScale(380), 450); // Cap max height for tablets
const ILLUSTRATION_WIDTH = Math.min(SCREEN_WIDTH - 48, 500);   // Cap max width for tablets

const GRADIENT_COLORS = ['#2a2550', '#1a1730', '#12101f', '#0a0815'] as const;
const GRADIENT_LOCATIONS = [0, 0.4, 0.75, 1] as const;

type SlideId = 'text' | 'multimedia' | 'game' | 'review';
interface Slide { id: SlideId; title: string; desc: string; }
const slides: Slide[] = [
  { id: 'text', title: 'AI Text Detector\nand Humanizer', desc: 'Empowering accuracy in every word — detect real or AI-generated text and humanize it in just one click.' },
  { id: 'multimedia', title: 'All-in-one Multimedia\nDetector', desc: 'Detect AI in images, videos, and audio with precision. One tool to verify everything you see and hear.' },
  { id: 'game', title: 'Test IQ with AI\nChecker Game', desc: 'Unlock your true potential and challenge your mind — test your IQ with the AI Checker Game and discover your intellectual strength.' },
  { id: 'review', title: 'Help Us Grow & Share\nYour Experience', desc: 'Show your support, share your experience, and help us improve by leaving a glowing review on the App Store.' },
];

interface OnboardingScreenProps { onComplete: () => void; }

// ─── ILLUSTRATION WRAPPER (Uniform size for all slides) ───────────────────────
const IllustrationContainer = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      width: ILLUSTRATION_WIDTH,
      height: ILLUSTRATION_HEIGHT,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    }}
  >
    {children}
  </View>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1: TEXT DETECTOR
// ═══════════════════════════════════════════════════════════════════════════════
const TextDetectorIllustration = () => (
  <IllustrationContainer>
    {/* Input card */}
    <View style={{ position: 'absolute', top: scale(16), left: 0, right: scale(64) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8), marginBottom: scale(8), marginLeft: scale(8) }}>
        <View style={{ width: scale(28), height: scale(28), borderRadius: 999, backgroundColor: 'rgba(129,140,248,0.4)', alignItems: 'center', justifyContent: 'center' }}>
          <AlignLeft size={scale(14)} color="#fff" />
        </View>
        <Text style={{ color: '#fff', fontSize: moderateScale(14), fontWeight: '600' }}>Input</Text>
      </View>
      <View style={{ backgroundColor: 'rgba(129,140,248,0.7)', borderRadius: scale(16), padding: scale(14) }}>
        <Text style={{ color: '#fff', fontSize: moderateScale(11), lineHeight: moderateScale(16) }}>
          It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution.
        </Text>
      </View>
    </View>

    {/* AI Detection meter */}
    <View style={{ position: 'absolute', top: ILLUSTRATION_HEIGHT * 0.35, right: scale(8), backgroundColor: '#1E1B2E', borderWidth: 1, borderColor: 'rgba(239,68,68,0.6)', borderRadius: scale(16), paddingHorizontal: scale(20), paddingVertical: scale(14), alignItems: 'center' }}>
      <View style={{ width: scale(90), height: scale(45), borderTopWidth: scale(6), borderLeftWidth: scale(6), borderRightWidth: scale(6), borderColor: '#ef4444', borderTopLeftRadius: scale(90), borderTopRightRadius: scale(90), marginBottom: scale(4) }} />
      <Text style={{ color: '#ef4444', fontSize: moderateScale(18), fontWeight: '700' }}>97%</Text>
      <View style={{ backgroundColor: 'rgba(239,68,68,0.2)', borderWidth: 1, borderColor: '#ef4444', borderRadius: scale(8), paddingHorizontal: scale(10), paddingVertical: scale(4), marginTop: scale(4) }}>
        <Text style={{ color: '#f87171', fontSize: moderateScale(10), fontWeight: '600' }}>AI Detected Text</Text>
      </View>
    </View>

    {/* Output card */}
    <View style={{ position: 'absolute', bottom: 0, left: scale(32), right: 0 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: scale(8), marginBottom: scale(8), marginRight: scale(8) }}>
        <Text style={{ color: '#fff', fontSize: moderateScale(14), fontWeight: '600' }}>Output</Text>
        <View style={{ width: scale(28), height: scale(28), borderRadius: 999, backgroundColor: 'rgba(129,140,248,0.4)', alignItems: 'center', justifyContent: 'center' }}>
          <AlignLeft size={scale(14)} color="#fff" />
        </View>
      </View>
      <View style={{ alignItems: 'center', marginBottom: -scale(8), zIndex: 10 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: scale(16), paddingVertical: scale(6), borderWidth: 1, borderColor: '#4ade80' }}>
          <Text style={{ color: '#22c55e', fontSize: moderateScale(11), fontWeight: '700' }}>Humanize Text</Text>
        </View>
      </View>
      <View style={{ backgroundColor: 'rgba(129,140,248,0.7)', borderRadius: scale(16), padding: scale(14), paddingTop: scale(20) }}>
        <Text style={{ color: '#fff', fontSize: moderateScale(11), lineHeight: moderateScale(16) }}>
          It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more.
        </Text>
      </View>
    </View>
  </IllustrationContainer>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2: MULTIMEDIA
// ═══════════════════════════════════════════════════════════════════════════════
const MultimediaIllustration = () => (
  <IllustrationContainer>
    {/* Audio card top-right */}
    <View style={{ position: 'absolute', top: scale(16), right: scale(8), backgroundColor: '#1E1B2E', borderRadius: scale(16), padding: scale(12), width: scale(224), flexDirection: 'row', alignItems: 'center', gap: scale(12) }}>
      <View style={{ width: scale(36), height: scale(36), borderRadius: 999, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' }}>
        <Music size={scale(16)} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#fff', fontSize: moderateScale(11), fontWeight: '600', marginBottom: scale(4) }}>Love me like you do .mp3</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(4) }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: moderateScale(9) }}>01:32</Text>
          <View style={{ flex: 1, height: scale(4), backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999 }}>
            <View style={{ width: '50%', height: '100%', backgroundColor: '#818cf8', borderRadius: 999 }} />
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: moderateScale(9) }}>06:11</Text>
        </View>
      </View>
    </View>

    {/* Image card left */}
    <View style={{ position: 'absolute', top: ILLUSTRATION_HEIGHT * 0.24, left: 0, backgroundColor: '#1E1B2E', borderRadius: scale(16), padding: scale(8), width: scale(208) }}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80' }}
        style={{ width: '100%', height: scale(128), borderRadius: scale(12), marginBottom: scale(8) }}
      />
      <View style={{ paddingHorizontal: scale(4) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: scale(2) }}>
          <Text style={{ color: '#fff', fontSize: moderateScale(10) }}>Real Image</Text>
          <Text style={{ color: '#fff', fontSize: moderateScale(10) }}>25%</Text>
        </View>
        <View style={{ height: scale(4), backgroundColor: '#22c55e', borderRadius: 999, width: '25%', marginBottom: scale(8) }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: scale(2) }}>
          <Text style={{ color: '#fff', fontSize: moderateScale(10) }}>AI Generated</Text>
          <Text style={{ color: '#fff', fontSize: moderateScale(10) }}>75%</Text>
        </View>
        <View style={{ height: scale(4), backgroundColor: '#ef4444', borderRadius: 999, width: '75%', marginBottom: scale(8) }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
          <View style={{ backgroundColor: '#818cf8', borderRadius: scale(8), paddingHorizontal: scale(8), paddingVertical: scale(4) }}>
            <Text style={{ color: '#fff', fontSize: moderateScale(10), fontWeight: '600' }}>Result</Text>
          </View>
          <Text style={{ color: '#f87171', fontSize: moderateScale(10) }}>This one is AI made image</Text>
        </View>
      </View>
    </View>

    {/* Video card bottom-right */}
    <View style={{ position: 'absolute', bottom: scale(16), right: 0, backgroundColor: '#1E1B2E', borderRadius: scale(16), padding: scale(8), width: scale(224) }}>
      <View style={{ width: '100%', height: scale(112), borderRadius: scale(12), marginBottom: scale(8), backgroundColor: '#000', overflow: 'hidden' }}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&q=80' }} style={{ width: '100%', height: '100%' }} />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: scale(40), height: scale(40), borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
            <Play size={scale(18)} color="#fff" fill="#fff" />
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: scale(4) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: scale(2) }}>
          <Text style={{ color: '#fff', fontSize: moderateScale(10) }}>AI Generated</Text>
          <Text style={{ color: '#fff', fontSize: moderateScale(10) }}>75%</Text>
        </View>
        <View style={{ height: scale(4), backgroundColor: '#ef4444', borderRadius: 999, width: '75%', marginBottom: scale(8) }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
          <View style={{ backgroundColor: '#818cf8', borderRadius: scale(8), paddingHorizontal: scale(8), paddingVertical: scale(4) }}>
            <Text style={{ color: '#fff', fontSize: moderateScale(10), fontWeight: '600' }}>Result</Text>
          </View>
          <Text style={{ color: '#f87171', fontSize: moderateScale(10) }}>This one is AI made image</Text>
        </View>
      </View>
    </View>
  </IllustrationContainer>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3: IQ GAME
// ═══════════════════════════════════════════════════════════════════════════════
const IQGameIllustration = () => (
  <IllustrationContainer>
    <View style={{ position: 'absolute', top: scale(56), left: scale(16), opacity: 0.3 }}>
      <Gamepad2 size={scale(40)} color="#fff" />
    </View>
    <View style={{ position: 'absolute', top: scale(56), right: scale(16), opacity: 0.3 }}>
      <Gamepad2 size={scale(40)} color="#fff" />
    </View>

    <View style={{ position: 'absolute', top: 0, alignItems: 'center' }}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80' }}
        style={{ width: scale(160), height: scale(192), borderRadius: scale(16), borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }}
      />
    </View>

    <View style={{ position: 'absolute', bottom: scale(64), left: scale(8), transform: [{ rotate: '-6deg' }] }}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80' }}
        style={{ width: scale(160), height: scale(208), borderRadius: scale(16), borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }}
      />
      <View style={{ position: 'absolute', bottom: scale(12), left: scale(8), backgroundColor: '#ef4444', borderRadius: scale(12), paddingHorizontal: scale(12), paddingVertical: scale(6), flexDirection: 'row', alignItems: 'center', gap: scale(4) }}>
        <X size={scale(14)} color="#fff" strokeWidth={3} />
        <Text style={{ color: '#fff', fontSize: moderateScale(11), fontWeight: '700' }}>AI Made</Text>
      </View>
    </View>

    <View style={{ position: 'absolute', bottom: scale(64), right: scale(8), transform: [{ rotate: '6deg' }] }}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' }}
        style={{ width: scale(160), height: scale(208), borderRadius: scale(16), borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }}
      />
      <View style={{ position: 'absolute', bottom: scale(12), right: scale(8), backgroundColor: '#22c55e', borderRadius: scale(12), paddingHorizontal: scale(12), paddingVertical: scale(6), flexDirection: 'row', alignItems: 'center', gap: scale(4) }}>
        <Check size={scale(14)} color="#fff" strokeWidth={3} />
        <Text style={{ color: '#fff', fontSize: moderateScale(11), fontWeight: '700' }}>Real Img</Text>
      </View>
    </View>

    <View style={{ position: 'absolute', bottom: -scale(8), flexDirection: 'row', alignItems: 'center', gap: scale(16) }}>
      <ChevronsLeft size={scale(36)} color="#7C5CFF" strokeWidth={3} />
      <View style={{ width: scale(56), height: scale(56), borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E1B2E', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' }}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: moderateScale(13) }}>OR</Text>
      </View>
      <ChevronsRight size={scale(36)} color="#7C5CFF" strokeWidth={3} />
    </View>
  </IllustrationContainer>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4: REVIEW
// ═══════════════════════════════════════════════════════════════════════════════
const Cloud = ({ style, small }: any) => (
  <View style={[{ position: 'absolute', flexDirection: 'row', alignItems: 'flex-end' }, style]}>
    <View style={{ width: small ? scale(16) : scale(24), height: small ? scale(12) : scale(18), backgroundColor: '#fff', borderRadius: 999, marginRight: -scale(6), opacity: 0.95 }} />
    <View style={{ width: small ? scale(24) : scale(36), height: small ? scale(16) : scale(22), backgroundColor: '#fff', borderRadius: 999 }} />
    <View style={{ width: small ? scale(14) : scale(20), height: small ? scale(10) : scale(16), backgroundColor: '#fff', borderRadius: 999, marginLeft: -scale(6), opacity: 0.95 }} />
  </View>
);

const ReviewIllustration = () => (
  <IllustrationContainer>
    <View style={{ position: 'absolute', top: scale(15), left: scale(5), right: scale(5), bottom: scale(65), borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', borderStyle: 'dashed', borderRadius: scale(40), transform: [{ rotate: '-4deg' }] }} />

    <View style={{ position: 'absolute', top: scale(4), left: scale(12), width: scale(28), height: scale(28), borderRadius: scale(8), backgroundColor: 'rgba(129,140,248,0.2)', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-12deg' }] }}>
      <View style={{ width: scale(10), height: scale(10), backgroundColor: '#fde047', borderRadius: 999 }} />
    </View>
    <View style={{ position: 'absolute', top: scale(20), right: scale(20), width: scale(28), height: scale(28), borderRadius: scale(8), backgroundColor: 'rgba(168,85,247,0.2)', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '12deg' }] }}>
      <Music size={scale(12)} color="#c4b5fd" />
    </View>
    <View style={{ position: 'absolute', bottom: scale(24), left: scale(24), width: scale(32), height: scale(32), borderRadius: scale(12), backgroundColor: 'rgba(96,165,250,0.2)', borderWidth: 1, borderColor: 'rgba(147,197,253,0.2)', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: scale(16), height: scale(16), backgroundColor: 'rgba(147,197,253,0.6)', borderRadius: scale(2) }} />
    </View>

    {/* City Skyline */}
    <View style={{ position: 'absolute', bottom: scale(70), left: scale(8), right: scale(8), height: scale(128), flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', opacity: 0.9 }}>
      <View style={{ width: scale(32), height: scale(56), backgroundColor: 'rgba(255,255,255,0.9)', marginRight: scale(4), borderTopLeftRadius: scale(4), borderTopRightRadius: scale(4) }} />
      <View style={{ width: scale(44), height: scale(80), backgroundColor: 'rgba(255,255,255,0.9)', marginRight: scale(4), borderTopLeftRadius: scale(2), borderTopRightRadius: scale(2) }} />
      <View style={{ width: scale(64), height: scale(112), backgroundColor: '#fff', marginRight: scale(4), borderTopLeftRadius: scale(4), borderTopRightRadius: scale(4) }} />
      <View style={{ width: scale(64), height: scale(96), backgroundColor: 'rgba(255,255,255,0.9)', marginRight: scale(4), borderTopLeftRadius: scale(2), borderTopRightRadius: scale(2) }} />
      <View style={{ width: scale(48), height: scale(64), backgroundColor: 'rgba(255,255,255,0.85)', marginRight: scale(4), borderTopLeftRadius: scale(4), borderTopRightRadius: scale(4) }} />
      <View style={{ width: scale(40), height: scale(80), backgroundColor: 'rgba(255,255,255,0.9)', borderTopLeftRadius: scale(2), borderTopRightRadius: scale(2) }} />
    </View>

    <Cloud style={{ top: scale(38), left: scale(54) }} />
    <Cloud style={{ top: scale(62), right: scale(58) }} />
    <Cloud style={{ top: scale(110), left: scale(82) }} small />
    <Cloud style={{ top: scale(132), right: scale(32) }} small />
    <Cloud style={{ top: scale(184), left: scale(114) }} small />

    <View style={{ position: 'absolute', bottom: scale(58), width: '88%', height: scale(18), backgroundColor: '#fff', borderRadius: 999 }} />

    <View style={{ position: 'absolute', bottom: scale(78), left: '15%', width: scale(210), height: scale(68), backgroundColor: '#8b82f7', borderRadius: scale(16), transform: [{ rotate: '-30deg' }], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: scale(12) }}>
      <Star size={scale(16)} color="#fff" fill="#fff" />
      <Star size={scale(20)} color="#fff" fill="#fff" />
      <Star size={scale(14)} color="#fff" fill="#fff" />
      <Star size={scale(18)} color="#fff" fill="#fff" />
      <Star size={scale(12)} color="#fff" fill="#fff" />
    </View>

    <View style={{ position: 'absolute', bottom: scale(166), right: scale(48), width: 0, height: 0, borderLeftWidth: scale(18), borderRightWidth: scale(18), borderBottomWidth: scale(34), borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#8b82f7', transform: [{ rotate: '60deg' }] }} />

    <View style={{ position: 'absolute', bottom: scale(82), right: scale(40), width: scale(76), height: scale(28), backgroundColor: '#a99cff', borderRadius: scale(10), transform: [{ rotate: '-30deg' }], opacity: 0.8 }} />

    {/* Person 1 */}
    <View style={{ position: 'absolute', bottom: scale(76), left: '28%', alignItems: 'center' }}>
      <View style={{ width: scale(26), height: scale(26), borderRadius: 999, backgroundColor: '#ffdbac', borderWidth: 1.5, borderColor: 'white' }} />
      <View style={{ width: scale(34), height: scale(38), backgroundColor: '#e9e3ff', borderTopLeftRadius: scale(12), borderTopRightRadius: scale(12), marginTop: -scale(2) }} />
      <View style={{ width: scale(34), height: scale(38), flexDirection: 'row', marginTop: -scale(2) }}>
        <View style={{ flex: 1, backgroundColor: '#12101f', borderBottomLeftRadius: scale(8) }} />
        <View style={{ width: scale(4) }} />
        <View style={{ flex: 1, backgroundColor: '#12101f', borderBottomRightRadius: scale(8) }} />
      </View>
      <View style={{ position: 'absolute', top: scale(34), right: -scale(18), width: scale(24), height: scale(4), backgroundColor: '#ffdbac', borderRadius: 2, transform: [{ rotate: '-35deg' }] }} />
    </View>

    {/* Person 2 */}
    <View style={{ position: 'absolute', bottom: scale(143), right: '28%', alignItems: 'center' }}>
      <View style={{ width: scale(26), height: scale(26), borderRadius: 999, backgroundColor: '#ffdbac', borderWidth: 1.5, borderColor: 'white' }} />
      <View style={{ width: scale(38), height: scale(42), backgroundColor: '#e9e3ff', borderTopLeftRadius: scale(14), borderTopRightRadius: scale(14), marginTop: -scale(2) }} />
      <View style={{ flexDirection: 'row', marginTop: -scale(1) }}>
        <View style={{ width: scale(16), height: scale(34), backgroundColor: '#12101f', borderRadius: scale(4), transform: [{ rotate: '15deg' }] }} />
        <View style={{ width: scale(16), height: scale(26), backgroundColor: '#12101f', borderRadius: scale(4), marginLeft: scale(6) }} />
      </View>
    </View>
  </IllustrationContainer>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE VIEW & MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const SlideView = ({ slide, onCta, currentIndex, total }: { slide: Slide; onCta: () => void; currentIndex: number; total: number }) => {
  const renderIllustration = () => {
    switch (slide.id) {
      case 'text': return <TextDetectorIllustration />;
      case 'multimedia': return <MultimediaIllustration />;
      case 'game': return <IQGameIllustration />;
      case 'review': return <ReviewIllustration />;
    }
  };
  return (
    <View style={{ width: SCREEN_WIDTH, flex: 1, backgroundColor: 'transparent' }}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: 'transparent', paddingHorizontal: scale(24), justifyContent: 'space-between' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: verticalScale(16), backgroundColor: 'transparent' }}>
          {renderIllustration()}
        </View>
        <View style={{ alignItems: 'center', marginBottom: verticalScale(24), backgroundColor: 'transparent' }}>
          <Text style={{ color: '#fff', fontSize: moderateScale(28), fontWeight: '700', textAlign: 'center', lineHeight: moderateScale(38), marginBottom: verticalScale(12) }}>
            {slide.title}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: moderateScale(14), textAlign: 'center', lineHeight: moderateScale(20), paddingHorizontal: scale(8) }}>
            {slide.desc}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(8), marginBottom: verticalScale(20), backgroundColor: 'transparent' }}>
          {Array.from({ length: total }).map((_, i) => (
            <View key={i} style={{ height: scale(6), width: i === currentIndex ? scale(24) : scale(6), borderRadius: 999, backgroundColor: i === currentIndex ? '#818cf8' : 'rgba(255,255,255,0.25)' }} />
          ))}
        </View>
        <TouchableOpacity onPress={onCta} activeOpacity={0.85} style={{ width: '100%', paddingVertical: verticalScale(16), borderRadius: scale(16), alignItems: 'center', backgroundColor: '#818cf8', marginBottom: verticalScale(16) }}>
          <Text style={{ color: '#fff', fontSize: moderateScale(17), fontWeight: '600' }}>Cont.inue</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentIndex(next);
    } else {
      onComplete();
    }
  };
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index ?? 0);
  }).current;
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0815' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={GRADIENT_COLORS as any} locations={GRADIENT_LOCATIONS as any} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SlideView slide={item} onCta={goNext} currentIndex={currentIndex} total={slides.length} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        contentContainerStyle={{ backgroundColor: 'transparent' }}
      />
    </View>
  );
} 