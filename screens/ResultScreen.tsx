// screens/ResultScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, AlertTriangle, ArrowLeft, Info, Bot, User } from 'lucide-react-native';

const THEME = {
  bg: '#0D0B14',
  card: '#1A1826',
  card2: '#1E1B2E',
  border: '#2A2740',
  accent: '#A69EFF',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',
};

const safeNum = (val: any, fallback = 0): number => {
  if (val === null || val === undefined || isNaN(Number(val))) return fallback;
  return Number(val);
};

export default function ResultScreen({ route, navigation }: any) {
  const { result, mediaUri, type } = route.params;
  console.log('API Result:', result);

  const isTextDetection = type === 'Text';

  // ===== FOR TEXT DETECTION =====
  // Try multiple possible key names from the API
  const aiPercentage = safeNum(
    result?.ai_generated_pct ??
    result?.p_ai_pct ??
    result?.ai_pct ??
    result?.p_fake_pct ??
    (result?.ai_score ? result.ai_score * 100 : 0)
  );

  const humanPercentage = safeNum(
    result?.human_written_pct ??
    result?.p_human_pct ??
    result?.human_pct ??
    result?.p_real_pct ??
    (100 - aiPercentage)
  );

  // ===== GENERAL DETECTION =====
  const isFake = isTextDetection
    ? aiPercentage > 50
    : (result?.label === 'fake' ||
       result?.label === 'ai' ||
       safeNum(result?.p_fake_pct) > 50);

  const confidence = isTextDetection
    ? Math.max(aiPercentage, humanPercentage)
    : safeNum(result?.confidence_pct || 0);

  const stats = [
    { label: 'Confidence', value: result?.confidence_pct },
    { label: 'Real Probability', value: result?.p_real_pct },
    { label: 'Fake Probability', value: result?.p_fake_pct },
    { label: 'Perplexity', value: result?.perplexity },
    { label: 'Burstiness', value: result?.burstiness },
  ].filter(s => s.value !== undefined && s.value !== null);

  return (
    <View style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 24 }}>
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={{ color: THEME.textLight, fontSize: 26, fontWeight: 'bold', marginBottom: 4 }}>
            Detection Result
          </Text>
          <Text style={{ color: THEME.textMuted, fontSize: 14, marginBottom: 24 }}>
            Analysis for your {type?.toLowerCase() || 'content'}
          </Text>

          {/* Media Preview */}
          {mediaUri && type === 'Image' && (
            <Image
              source={{ uri: mediaUri }}
              style={{ width: '100%', height: 200, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: THEME.border }}
              resizeMode="cover"
            />
          )}

          {/* MAIN VERDICT CARD */}
          <View style={{ backgroundColor: THEME.card, borderRadius: 24, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: THEME.border, marginBottom: 20 }}>
            
            <View style={{ padding: 16, borderRadius: 999, marginBottom: 20, backgroundColor: isFake ? 'rgba(248,113,113,0.1)' : 'rgba(34,197,94,0.1)' }}>
              {isFake ? (
                <AlertTriangle size={56} color="#f87171" strokeWidth={2} />
              ) : (
                <CheckCircle2 size={56} color="#22c55e" strokeWidth={2} />
              )}
            </View>

            <Text style={{ color: THEME.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 8 }}>
              VERDICT
            </Text>
            <Text style={{ color: isFake ? '#f87171' : '#22c55e', fontSize: 28, fontWeight: '800', marginBottom: 16, textAlign: 'center' }}>
              {isFake ? (isTextDetection ? 'AI GENERATED TEXT' : 'AI GENERATED') : (isTextDetection ? 'HUMAN WRITTEN' : 'AUTHENTIC')}
            </Text>

            <Text style={{ color: THEME.textLight, fontSize: 44, fontWeight: '800', marginBottom: 4 }}>
              {confidence.toFixed(1)}%
            </Text>
            <Text style={{ color: THEME.textMuted, fontSize: 13 }}>Confidence Score</Text>
          </View>

          {/* 🎯 SPECIAL TEXT DETECTION BREAKDOWN */}
          {isTextDetection && (
            <View style={{ backgroundColor: THEME.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: THEME.border, marginBottom: 16 }}>
              <Text style={{ color: THEME.textLight, fontSize: 16, fontWeight: '700', marginBottom: 16 }}>
                Analysis Breakdown
              </Text>

              {/* AI Section */}
              <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(248,113,113,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={16} color="#f87171" strokeWidth={2} />
                    </View>
                    <Text style={{ color: THEME.textLight, fontSize: 14, fontWeight: '600' }}>AI Generated</Text>
                  </View>
                  <Text style={{ color: '#f87171', fontSize: 18, fontWeight: '800' }}>
                    {aiPercentage.toFixed(1)}%
                  </Text>
                </View>
                <View style={{ height: 8, backgroundColor: THEME.card2, borderRadius: 999, overflow: 'hidden' }}>
                  <View style={{ width: `${aiPercentage}%`, height: '100%', backgroundColor: '#f87171', borderRadius: 999 }} />
                </View>
              </View>

              {/* Human Section */}
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(34,197,94,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={16} color="#22c55e" strokeWidth={2} />
                    </View>
                    <Text style={{ color: THEME.textLight, fontSize: 14, fontWeight: '600' }}>Human Written</Text>
                  </View>
                  <Text style={{ color: '#22c55e', fontSize: 18, fontWeight: '800' }}>
                    {humanPercentage.toFixed(1)}%
                  </Text>
                </View>
                <View style={{ height: 8, backgroundColor: THEME.card2, borderRadius: 999, overflow: 'hidden' }}>
                  <View style={{ width: `${humanPercentage}%`, height: '100%', backgroundColor: '#22c55e', borderRadius: 999 }} />
                </View>
              </View>
            </View>
          )}

          {/* Detailed Stats (for other detections) */}
          {!isTextDetection && stats.length > 0 && (
            <View style={{ backgroundColor: THEME.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: THEME.border, marginBottom: 16 }}>
              <Text style={{ color: THEME.textLight, fontSize: 16, fontWeight: '700', marginBottom: 16 }}>
                Detailed Analysis
              </Text>
              {stats.map((stat, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    borderBottomWidth: i < stats.length - 1 ? 1 : 0,
                    borderBottomColor: THEME.border,
                  }}
                >
                  <Text style={{ color: THEME.textMuted, fontSize: 14 }}>{stat.label}</Text>
                  <Text style={{ color: THEME.textLight, fontSize: 14, fontWeight: '700' }}>
                    {safeNum(stat.value).toFixed(2)}%
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Note */}
          {result?.note && (
            <View style={{ flexDirection: 'row', gap: 12, backgroundColor: THEME.card2, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: THEME.border, marginBottom: 20 }}>
              <Info size={20} color={THEME.accent} />
              <Text style={{ flex: 1, color: THEME.textMuted, fontSize: 13, lineHeight: 20, fontStyle: 'italic' }}>
                {result.note}
              </Text>
            </View>
          )}

          {/* Analyze Again Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: THEME.accent,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>Analyze Another</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}