import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const allChefs = [
  {
    id: '1',
    name: 'Chef Sarah Tan',
    specialty: 'Peranakan',
    cuisines: ['Peranakan', 'Chinese'],
    rating: 4.9,
    reviews: 127,
    location: 'Tiong Bahru',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
    price: '$40-60',
  },
  {
    id: '2',
    name: 'Chef Ahmad Rahman',
    specialty: 'Malay',
    cuisines: ['Malay', 'Halal'],
    rating: 4.8,
    reviews: 89,
    location: 'Geylang Serai',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    price: '$35-50',
  },
  {
    id: '3',
    name: 'Chef Maria Santos',
    specialty: 'Filipino',
    cuisines: ['Filipino', 'Western'],
    rating: 4.7,
    reviews: 64,
    location: 'Toa Payoh',
    image: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?w=400',
    price: '$30-45',
  },
  {
    id: '4',
    name: 'Chef Kenji Yamamoto',
    specialty: 'Japanese',
    cuisines: ['Japanese'],
    rating: 4.9,
    reviews: 156,
    location: 'Robertson Quay',
    image: 'https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?w=400',
    price: '$60-90',
  },
  {
    id: '5',
    name: 'Chef Priya Sharma',
    specialty: 'Indian',
    cuisines: ['Indian', 'Vegetarian'],
    rating: 4.8,
    reviews: 103,
    location: 'Little India',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400',
    price: '$35-55',
  },
  {
    id: '6',
    name: 'Chef Kim Soo-young',
    specialty: 'Korean',
    cuisines: ['Korean'],
    rating: 4.7,
    reviews: 78,
    location: 'Tanjong Pagar',
    image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=400',
    price: '$45-65',
  },
];

const categories = ['All', 'Chinese', 'Malay', 'Indian', 'Japanese', 'Korean', 'Western', 'Halal', 'Vegetarian'];

export default function ExploreScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredChefs = allChefs.filter((chef) => {
    const matchesSearch =
      searchQuery === '' ||
      chef.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chef.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chef.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      chef.cuisines.some((c) => c.toLowerCase() === selectedCategory.toLowerCase()) ||
      chef.specialty.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const renderChefCard = ({ item: chef }: { item: typeof allChefs[0] }) => (
    <TouchableOpacity
      style={styles.chefCard}
      onPress={() => navigation.navigate('ChefProfile', { chefId: chef.id })}
    >
      <Image source={{ uri: chef.image }} style={styles.chefImage} />
      <View style={styles.chefInfo}>
        <View style={styles.chefHeader}>
          <Text style={styles.chefName}>{chef.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {chef.rating}</Text>
            <Text style={styles.reviews}>({chef.reviews})</Text>
          </View>
        </View>
        <Text style={styles.chefSpecialty}>{chef.specialty} Cuisine</Text>
        <View style={styles.chefMeta}>
          <Text style={styles.location}>📍 {chef.location}</Text>
          <Text style={styles.price}>{chef.price}/pax</Text>
        </View>
        <View style={styles.cuisineTags}>
          {chef.cuisines.map((cuisine) => (
            <View key={cuisine} style={styles.cuisineTag}>
              <Text style={styles.cuisineTagText}>{cuisine}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore Chefs</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by cuisine, chef, or location..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <Text style={styles.resultCount}>
        {filteredChefs.length} chef{filteredChefs.length !== 1 ? 's' : ''} found
      </Text>

      <FlatList
        data={filteredChefs}
        renderItem={renderChefCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No chefs found</Text>
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              <Text style={styles.clearFilters}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
  },
  categoryChipActive: {
    backgroundColor: '#F97316',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  resultCount: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: '#6B7280',
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chefCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  chefImage: {
    width: '100%',
    height: 180,
  },
  chefInfo: {
    padding: 16,
  },
  chefHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chefName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#F59E0B',
    fontWeight: '600',
    marginRight: 4,
  },
  reviews: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  chefSpecialty: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  chefMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
  },
  cuisineTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  cuisineTag: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cuisineTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F97316',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
  },
  clearFilters: {
    color: '#F97316',
    fontWeight: '600',
    marginTop: 12,
  },
});
