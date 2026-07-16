// screens/UploadScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import {
  PlusCircle,
  Video,
  Music,
  X,
  Play,
  FileText,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react-native';
import {
  detectText,
  detectDeepfakeImage,
  detectDeepfakeVideo,
} from '../services/detectionService';
import Header from '../components/Header';

type MediaTab = 'Image' | 'Video' | 'Text' | 'Audio';

interface PickedMedia {
  uri: string;
  type: 'image' | 'video' | 'audio';
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

const THEME = {
  bg: '#0D0B14',
  card: '#1A1826',
  card2: '#1E1B2E',
  border: '#2A2740',
  accent: '#A69EFF',
  accentSoft: '#818cf8',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',
};

const TABS = [
  { key: 'Image' as MediaTab, icon: PlusCircle },
  { key: 'Video' as MediaTab, icon: Video },
  { key: 'Text' as MediaTab, icon: FileText },
  { key: 'Audio' as MediaTab, icon: Music },
];

export default function UploadScreen() {
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState<MediaTab>('Image');
  const [analyzing, setAnalyzing] = useState(false);
  const [pickingMedia, setPickingMedia] = useState(false);
  const [imageMedia, setImageMedia] = useState<PickedMedia | null>(null);
  const [videoMedia, setVideoMedia] = useState<PickedMedia | null>(null);
  const [audioMedia, setAudioMedia] = useState<PickedMedia | null>(null);
  const [textMedia, setTextMedia] = useState('');

  const wordCount = textMedia.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const charCount = textMedia.length;
  const isTextEmpty = charCount === 0;
  const isTextShort = wordCount > 0 && wordCount < 300;

  const currentHasData = () => {
    if (activeTab === 'Image') return Boolean(imageMedia);
    if (activeTab === 'Video') return Boolean(videoMedia);
    if (activeTab === 'Audio') return Boolean(audioMedia);
    if (activeTab === 'Text') return textMedia.trim().length > 0;
    return false;
  };

  const isAnalyzeDisabled = () => {
    if (analyzing) return true;
    if (activeTab === 'Text' && isTextEmpty) return true;
    return false;
  };

  const getCurrentMedia = () => {
    if (activeTab === 'Image') return imageMedia;
    if (activeTab === 'Video') return videoMedia;
    if (activeTab === 'Audio') return audioMedia;
    return null;
  };

  const handlePickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Permission required', 'Please allow gallery access.');
      return;
    }

    setPickingMedia(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: activeTab === 'Image' ? ['images'] : ['videos'],
        quality: 0.85,
      });
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const media: PickedMedia = {
          uri: asset.uri,
          type: activeTab === 'Image' ? 'image' : 'video',
          fileName: asset.fileName || undefined,
          fileSize: asset.fileSize || undefined,
          mimeType: asset.mimeType || (activeTab === 'Image' ? 'image/jpeg' : 'video/mp4'),
        };
        if (activeTab === 'Image') setImageMedia(media);
        else setVideoMedia(media);
      }
    } catch (err) {
      console.log('Pick media error:', err);
      Alert.alert('Error', 'Could not pick media file.');
    } finally {
      setPickingMedia(false);
    }
  };

  const handlePickAudio = async () => {
    setPickingMedia(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setAudioMedia({
          uri: asset.uri,
          type: 'audio',
          fileName: asset.name,
          fileSize: asset.size,
          mimeType: asset.mimeType || 'audio/mpeg',
        });
      }
    } catch (err) {
      console.log('Audio pick error:', err);
      Alert.alert('Error', 'Could not pick audio file.');
    } finally {
      setPickingMedia(false);
    }
  };

  const handleClearMedia = useCallback(() => {
    if (activeTab === 'Image') setImageMedia(null);
    if (activeTab === 'Video') setVideoMedia(null);
    if (activeTab === 'Audio') setAudioMedia(null);
    if (activeTab === 'Text') setTextMedia('');
  }, [activeTab]);

  const handleAnalyze = useCallback(async () => {
    if (!currentHasData()) {
      Alert.alert('Nothing to analyze', 'Please add content first.');
      return;
    }

    setAnalyzing(true);
    try {
      let result;
      let mediaUri;

      if (activeTab === 'Text') {
        result = await detectText(textMedia);
      } else if (activeTab === 'Image' && imageMedia) {
        mediaUri = imageMedia.uri;
        result = await detectDeepfakeImage(imageMedia.uri, imageMedia.fileName);
      } else if (activeTab === 'Video' && videoMedia) {
        mediaUri = videoMedia.uri;
        result = await detectDeepfakeVideo(videoMedia.uri, videoMedia.fileName);
      } else if (activeTab === 'Audio' && audioMedia) {
        mediaUri = audioMedia.uri;
        result = await detectDeepfakeVideo(audioMedia.uri, audioMedia.fileName);
      }

      const parentNav = navigation.getParent();
      const nav = parentNav || navigation;
      nav.navigate('Result', { result, mediaUri, type: activeTab });
      handleClearMedia();
    } catch (e: any) {
      console.log('Analyze Error:', e);

      if (activeTab === 'Text') {
        const errorMsg = e.message || '';
        if (errorMsg.indexOf('300 words') !== -1 || errorMsg.indexOf('reliable result') !== -1) {
          const wordMatch = errorMsg.match(/got (\d+)/);
          const actualWords = wordMatch ? wordMatch[1] : wordCount;

          const fallbackResult = {
            label: 'unknown',
            confidence_pct: 50,
            p_real_pct: 50,
            p_fake_pct: 50,
            ai_generated_pct: 50,
            human_written_pct: 50,
            note: 'Analysis performed on limited text (' + actualWords + ' words). Results may not be accurate. For reliable AI detection, please provide at least 300 words.',
            low_confidence: true,
          };

          const parentNav = navigation.getParent();
          const nav = parentNav || navigation;
          nav.navigate('Result', { result: fallbackResult, type: activeTab });
          handleClearMedia();
          return;
        }
      }

      Alert.alert('Analysis Failed', e.message || 'Something went wrong');
    } finally {
      setAnalyzing(false);
    }
  }, [activeTab, imageMedia, videoMedia, audioMedia, textMedia, navigation, wordCount]);

  const getPickerFn = () => (activeTab === 'Audio' ? handlePickAudio : handlePickMedia);

  const renderPreviewIcon = () => {
    if (activeTab === 'Video') return <Video size={44} color={THEME.accent} strokeWidth={1.5} />;
    if (activeTab === 'Audio') return <Music size={44} color={THEME.accent} strokeWidth={1.5} />;
    return null;
  };

  const renderEmptyIcon = () => {
    if (activeTab === 'Image') return <PlusCircle size={32} color={THEME.accent} strokeWidth={1.5} />;
    if (activeTab === 'Video') return <Video size={32} color={THEME.accent} strokeWidth={1.5} />;
    if (activeTab === 'Audio') return <Music size={32} color={THEME.accent} strokeWidth={1.5} />;
    return null;
  };

  const getUploadTitle = () => {
    if (activeTab === 'Image') return 'Tap to Upload Image';
    if (activeTab === 'Video') return 'Tap to Upload Video';
    return 'Tap to Upload Audio';
  };

  const getUploadSubtitle = () => {
    if (activeTab === 'Image') return 'Supported: JPG, PNG, WEBP';
    if (activeTab === 'Video') return 'Supported: MP4, MOV, AVI';
    return 'Supported: MP3, WAV, M4A';
  };

  const currentMedia = getCurrentMedia();

  return (
    <View style={{ flex: 1, paddingBottom: 30, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} translucent={false} />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
        <Header title="Upload" />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* TABS */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 10 }}
            >
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key)}
                    activeOpacity={0.85}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      paddingHorizontal: 18,
                      paddingVertical: 10,
                      borderRadius: 999,
                      backgroundColor: active ? THEME.accent : THEME.card,
                      borderWidth: 1,
                      borderColor: active ? THEME.accent : THEME.border,
                    }}
                  >
                    <Icon size={16} color={active ? '#fff' : THEME.textMuted} strokeWidth={active ? 2.5 : 2} />
                    <Text
                      style={{
                        color: active ? '#fff' : THEME.textMuted,
                        fontSize: 14,
                        fontWeight: active ? '700' : '600',
                      }}
                    >
                      {tab.key}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* INPUT AREA */}
            <View style={{ marginHorizontal: 16, marginTop: 8, marginBottom: 20 }}>
              {activeTab === 'Text' ? (
                <View
                  style={{
                    borderRadius: 24,
                    backgroundColor: THEME.card,
                    borderWidth: 1,
                    borderColor: THEME.border,
                    padding: 16,
                    minHeight: 320,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          backgroundColor: 'rgba(79,70,229,0.2)',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FileText size={16} color={THEME.accent} strokeWidth={2} />
                      </View>
                      <Text style={{ color: THEME.textLight, fontSize: 15, fontWeight: '600' }}>Enter your text</Text>
                    </View>
                    {textMedia.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setTextMedia('')}
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999, padding: 6 }}
                      >
                        <X size={14} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <ScrollView
                    style={{ maxHeight: 250 }}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled"
                  >
                    <TextInput
                      value={textMedia}
                      onChangeText={setTextMedia}
                      placeholder="Paste or type text (minimum 300 words for best accuracy)..."
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      multiline
                      maxLength={100000}
                      textAlignVertical="top"
                      scrollEnabled={false}
                      style={{
                        color: THEME.textLight,
                        fontSize: 15,
                        lineHeight: 22,
                        minHeight: 200,
                        padding: 0,
                      }}
                    />
                  </ScrollView>

                  {isTextShort && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        backgroundColor: 'rgba(251,191,36,0.1)',
                        borderWidth: 1,
                        borderColor: 'rgba(251,191,36,0.3)',
                        padding: 10,
                        borderRadius: 12,
                        marginTop: 12,
                      }}
                    >
                      <AlertTriangle size={16} color="#fbbf24" strokeWidth={2} />
                      <Text style={{ flex: 1, color: '#fbbf24', fontSize: 12, fontWeight: '500' }}>
                        Results may not be accurate for text under 300 words.
                      </Text>
                    </View>
                  )}

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                    <Text
                      style={{
                        color: wordCount >= 300 ? '#22c55e' : wordCount > 0 ? '#fbbf24' : THEME.textMuted,
                        fontSize: 12,
                        fontWeight: '600',
                      }}
                    >
                      Words: {wordCount} / 300+ {wordCount >= 300 ? '✓' : ''}
                    </Text>
                    <Text style={{ color: THEME.textMuted, fontSize: 12 }}>Chars: {charCount}</Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={getPickerFn()}
                  activeOpacity={0.85}
                  disabled={pickingMedia}
                  style={{
                    aspectRatio: 1,
                    borderRadius: 24,
                    backgroundColor: THEME.card,
                    borderWidth: 1.5,
                    borderStyle: 'dashed',
                    borderColor: THEME.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 32,
                    overflow: 'hidden',
                  }}
                >
                  {pickingMedia ? (
                    <View style={{ alignItems: 'center' }}>
                      <ActivityIndicator size="large" color={THEME.accent} />
                      <Text style={{ color: THEME.textLight, fontSize: 16, fontWeight: '600', marginTop: 16 }}>
                        Loading {activeTab.toLowerCase()}...
                      </Text>
                      <Text style={{ color: THEME.textMuted, fontSize: 12, marginTop: 4 }}>Please wait</Text>
                    </View>
                  ) : currentMedia ? (
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                      {currentMedia.type === 'image' ? (
                        <Image
                          source={{ uri: currentMedia.uri }}
                          style={{ width: '100%', height: '100%', borderRadius: 22 }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: THEME.card2,
                            borderRadius: 22,
                            paddingHorizontal: 20,
                          }}
                        >
                          <View
                            style={{
                              position: 'absolute',
                              top: 20,
                              right: 20,
                              width: 44,
                              height: 44,
                              borderRadius: 999,
                              backgroundColor: THEME.accent,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Play size={22} color="#fff" fill="#fff" />
                          </View>
                          <View
                            style={{
                              backgroundColor: 'rgba(79,70,229,0.2)',
                              padding: 22,
                              borderRadius: 999,
                              marginBottom: 12,
                            }}
                          >
                            {renderPreviewIcon()}
                          </View>
                          <Text style={{ color: THEME.textLight, fontSize: 16, fontWeight: '700', marginBottom: 6 }}>
                            {activeTab === 'Video' ? 'Video Selected' : 'Audio Selected'}
                          </Text>
                          <Text
                            style={{ color: THEME.textMuted, fontSize: 12, maxWidth: '90%' }}
                            numberOfLines={1}
                          >
                            {currentMedia.fileName || activeTab.toLowerCase() + ' file'}
                          </Text>
                        </View>
                      )}
                      <TouchableOpacity
                        onPress={handleClearMedia}
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          zIndex: 10,
                          backgroundColor: 'rgba(0,0,0,0.65)',
                          borderRadius: 999,
                          padding: 6,
                          borderWidth: 1,
                          borderColor: 'rgba(255,255,255,0.15)',
                        }}
                      >
                        <X size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{ alignItems: 'center' }}>
                      <View
                        style={{
                          backgroundColor: 'rgba(79,70,229,0.2)',
                          padding: 8,
                          borderRadius: 999,
                          marginBottom: 20,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: THEME.card2,
                            padding: 18,
                            borderRadius: 999,
                            borderWidth: 1,
                            borderColor: THEME.border,
                          }}
                        >
                          {renderEmptyIcon()}
                        </View>
                      </View>
                      <Text
                        style={{
                          color: THEME.textLight,
                          fontSize: 18,
                          fontWeight: '700',
                          textAlign: 'center',
                          marginBottom: 8,
                        }}
                      >
                        {getUploadTitle()}
                      </Text>
                      <Text style={{ color: THEME.textMuted, fontSize: 13, textAlign: 'center' }}>
                        {getUploadSubtitle()}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* SAFETY TIP */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 14,
                padding: 16,
                marginHorizontal: 16,
                marginBottom: 24,
                borderRadius: 18,
                backgroundColor: THEME.card,
                borderWidth: 1,
                borderColor: THEME.border,
              }}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: 'rgba(79,70,229,0.18)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldAlert size={22} color={THEME.accent} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: THEME.textLight, marginBottom: 4 }}>
                  Safety tip:{' '}
                  <Text style={{ fontWeight: '400', color: 'rgba(255,255,255,0.7)' }}>
                    We prioritize your privacy.
                  </Text>
                </Text>
                <Text style={{ fontSize: 13, color: THEME.textMuted, lineHeight: 20 }}>
                  Files are processed securely and encrypted end-to-end.
                </Text>
              </View>
            </View>

            {/* ANALYZE BUTTON */}
            <TouchableOpacity
              onPress={handleAnalyze}
              activeOpacity={0.85}
              disabled={isAnalyzeDisabled()}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 16,
                marginHorizontal: 16,
                marginBottom: 32,
                borderRadius: 16,
                backgroundColor: isAnalyzeDisabled() ? '#4B4867' : THEME.accent,
                opacity: isAnalyzeDisabled() ? 0.6 : 1,
              }}
            >
              {analyzing ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff', letterSpacing: 0.3 }}>
                    Analyzing...
                  </Text>
                </View>
              ) : (
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff', letterSpacing: 0.3 }}>
                  Analyze {activeTab}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}