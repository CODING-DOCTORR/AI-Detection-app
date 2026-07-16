import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';

// Reusable Components Import
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import HistoryCard, { HistoryItem } from '../components/HistoryCard';

// Theme constants (match other screens)
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

// Clean Mock Data Array
const HISTORY_DATA = [
  {
    sectionTitle: 'TODAY',
    data: [
      { id: '1', fileName: 'Travel_Video.mp4', date: 'Oct 12, 2026', time: '14:30', type: 'video', isAuthentic: true, percentage: 98.2 },
      { id: '2', fileName: 'LinkedIn_Pic.png', date: 'Oct 12, 2026', time: '09:12', type: 'image', isAuthentic: false, percentage: 12.4 },
    ]
  },
  {
    sectionTitle: 'YESTERDAY',
    data: [
      { id: '3', fileName: 'Zoom_Meeting.mp4', date: 'Oct 11, 2026', time: '16:45', type: 'video', isAuthentic: true, percentage: 99.5 },
    ]
  },
  {
    sectionTitle: 'OCTOBER 2026',
    data: [
      { id: '4', fileName: 'Passport_Scan.pdf', date: 'Oct 05, 2026', time: '11:20', type: 'document', isAuthentic: false, percentage: 34.1 },
      { id: '5', fileName: 'Family_Photo.jpg', date: 'Oct 02, 2026', time: '18:05', type: 'image', isAuthentic: true, percentage: 88.9 },
    ]
  }
];

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleItemPress = (item: HistoryItem) => {
    console.log("Selected file logs analyzed:", item.fileName);
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} translucent={false} />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
        {/* 1. Reusable Header Component */}
        <Header title="History"  />

        {/* 2. Reusable SearchBar Component */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* List Feed Layout */}
        <ScrollView 
          className="flex-1 px-4" 
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: 'transparent' }}
        >
          {HISTORY_DATA.map((section, sectionIdx) => {
            const filteredItems = section.data.filter(item => 
              item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <View key={sectionIdx} className="mt-5">
                {/* Timeline Section Header Label — dark theme */}
                <Text 
                  style={{ 
                    color: THEME.textMuted, 
                    fontSize: 13, 
                    fontWeight: '700', 
                    letterSpacing: 1.2, 
                    marginBottom: 12 
                  }}
                >
                  {section.sectionTitle}
                </Text>

                {/* Loop handling using Reusable Card */}
                {filteredItems.map((item) => (
                  <HistoryCard 
                    key={item.id} 
                    item={item as HistoryItem} 
                    onPress={handleItemPress} 
                  />
                ))}
              </View>
            );
          })}

          {/* Empty state if all filtered out */}
          {searchQuery.length > 0 && HISTORY_DATA.every(section => 
            section.data.filter(item => 
              item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0
          ) && (
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

          {/* Extra Bottom Spacing for floating action layout */}
          <View className="h-24" />
        </ScrollView>

        {/* Floating Plus Action Button — accent color */}
        {/* <TouchableOpacity 
          onPress={() => console.log('Floating action button clicked')}
          activeOpacity={0.85}
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            borderRadius: 20,
            backgroundColor: THEME.accent,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: THEME.accent,
            shadowOpacity: 0.5,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 14,
            elevation: 10,
          }}
        >
          <Plus size={26} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity> */}
      </SafeAreaView>
    </View>
  );
}