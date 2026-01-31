import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FOOD_CATEGORIES } from '@homechef/shared';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Search Header */}
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Explore</Text>

        {/* Search Input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f1f5f9',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            style={{ flex: 1, marginLeft: 12, fontSize: 16 }}
            placeholder="Search chefs or menus..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 20, maxHeight: 50 }}
      >
        <Pressable
          onPress={() => setSelectedCategory(null)}
          style={{
            backgroundColor: !selectedCategory ? '#f97316' : '#f1f5f9',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            marginRight: 8,
          }}
        >
          <Text style={{ color: !selectedCategory ? '#fff' : '#0f172a' }}>All</Text>
        </Pressable>
        {FOOD_CATEGORIES.map((category) => (
          <Pressable
            key={category.slug}
            onPress={() => setSelectedCategory(category.slug)}
            style={{
              backgroundColor: selectedCategory === category.slug ? '#f97316' : '#f1f5f9',
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
              marginRight: 8,
            }}
          >
            <Text style={{ color: selectedCategory === category.slug ? '#fff' : '#0f172a' }}>
              {category.emoji} {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Results */}
      <ScrollView style={{ flex: 1, marginTop: 20, paddingHorizontal: 20 }}>
        <View
          style={{
            backgroundColor: '#f1f5f9',
            borderRadius: 12,
            padding: 40,
            alignItems: 'center',
          }}
        >
          <Ionicons name="restaurant-outline" size={48} color="#94a3b8" />
          <Text style={{ color: '#64748b', marginTop: 12, textAlign: 'center' }}>
            Search for chefs and menus to find your perfect home dining experience
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
