// screens/HistoryScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Trash2, Clock } from 'lucide-react-native';

// Reusable Components
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import HistoryCard, { HistoryItem } from '../components/HistoryCard';
import AppModal from '../components/AppModal';
import { useModal } from '../hooks/ui/useModal';

// Service
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
  groupHistoryByDate,
  HistorySection,
} from '../services/historyService';

const THEME = {
  bg: '#0D0B14',
  card: '#1A1826',
  card2: '#1E1B2E',
  border: '#2A2740',
  accent: '#4F46E5',
  accentSoft: '#818cf8',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',
};

export default function HistoryScreen() {
  const navigation = useNavigation<any>();
  const { modal, hideModal, showConfirm, showInfo } = useModal();

  const [searchQuery, setSearchQuery] = useState('');
  const [historyData, setHistoryData] = useState<HistorySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load history from AsyncStorage
  const loadHistory = useCallback(async () => {
    try {
      const items = await getHistory();
      const grouped = groupHistoryByDate(items);
      setHistoryData(grouped);
    } catch (e) {
      console.log('Error loading history:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refresh on focus (when user navigates back to this tab)
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  // Pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHistory();
  }, [loadHistory]);

  // View item details — navigate to Result screen
  const handleItemPress = (item: HistoryItem) => {
    if (item.rawResult) {
      const parentNav = navigation.getParent();
      const nav = parentNav || navigation;
      nav.navigate('Result', {
        result: item.rawResult,
        type: item.mode === 'AI' && item.type === 'text' ? 'Text' :
              item.type.charAt(0).toUpperCase() + item.type.slice(1),
        mode: item.mode,
      });
    } else {
      showInfo('History Item', `${item.detectionLabel}\n\n${item.fileName}\n${item.isAuthentic ? 'AUTHENTIC' : 'SYNTHETIC'} — ${item.percentage}%`);
    }
  };

  // Clear all history
  const handleClearAll = () => {
    showConfirm(
      'Clear All History?',
      'This will permanently delete all your analysis history. This action cannot be undone.',
      async () => {
        await clearHistory();
        loadHistory();
      },
      undefined,
      'Clear All',
      'Cancel'
    );
  };

  // Filter history based on search
  const getFilteredData = (): HistorySection[] => {
    if (!searchQuery.trim()) return historyData;

    return historyData
      .map((section) => ({
        ...section,
        data: section.data.filter(
          (item) =>
            item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.detectionLabel.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((section) => section.data.length > 0);
  };

  const filteredData = getFilteredData();
  const isEmpty = historyData.length === 0;
  const hasSearchResults = filteredData.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} translucent={false} />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
        <Header title="History" />

        {/* Search + Clear All Row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 16 }}>
          <View style={{ flex: 1 }}>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </View>
          {!isEmpty && (
            <TouchableOpacity
              onPress={handleClearAll}
              activeOpacity={0.7}
              style={{
                backgroundColor: 'rgba(248,113,113,0.1)',
                padding: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(248,113,113,0.2)',
              }}
            >
              <Trash2 size={18} color="#f87171" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={THEME.accent} />
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={THEME.accent}
                colors={[THEME.accent]}
              />
            }
          >
            {/* Empty state */}
            {isEmpty && (
              <View
                style={{
                  backgroundColor: THEME.card,
                  padding: 40,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: THEME.border,
                  alignItems: 'center',
                  marginTop: 80,
                }}
              >
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 999,
                    backgroundColor: 'rgba(129,140,248,0.15)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}
                >
                  <Clock size={32} color={THEME.accentSoft} strokeWidth={1.5} />
                </View>
                <Text style={{ color: THEME.textLight, fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
                  No History Yet
                </Text>
                <Text
                  style={{
                    color: THEME.textMuted,
                    fontSize: 13,
                    textAlign: 'center',
                    lineHeight: 20,
                    maxWidth: 260,
                  }}
                >
                  Your analysis history will appear here after you start detecting content.
                </Text>
              </View>
            )}

            {/* No search results */}
            {!isEmpty && searchQuery.length > 0 && !hasSearchResults && (
              <View
                style={{
                  backgroundColor: THEME.card,
                  padding: 32,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: THEME.border,
                  alignItems: 'center',
                  marginTop: 40,
                }}
              >
                <Text style={{ color: THEME.textLight, fontSize: 16, fontWeight: '600', marginBottom: 6 }}>
                  No results found
                </Text>
                <Text style={{ color: THEME.textMuted, fontSize: 13, textAlign: 'center' }}>
                  Try adjusting your search query
                </Text>
              </View>
            )}

            {/* History sections */}
            {filteredData.map((section, sectionIdx) => (
              <View key={sectionIdx} style={{ marginTop: 20 }}>
                <Text
                  style={{
                    color: THEME.textMuted,
                    fontSize: 13,
                    fontWeight: '700',
                    letterSpacing: 1.2,
                    marginBottom: 12,
                  }}
                >
                  {section.sectionTitle}
                </Text>

                {section.data.map((item) => (
                  <HistoryCard key={item.id} item={item} onPress={handleItemPress} />
                ))}
              </View>
            ))}

            {/* Bottom spacing */}
            <View style={{ height: 100 }} />
          </ScrollView>
        )}
      </SafeAreaView>

      {/* Modal */}
      <AppModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        buttons={modal.buttons}
        loading={modal.loading}
        showCloseIcon={modal.showCloseIcon !== false}
        onClose={hideModal}
      />
    </View>
  );
}