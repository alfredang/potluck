import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const categories = [
  { id: '1', name: 'Chinese', emoji: '🥢' },
  { id: '2', name: 'Malay', emoji: '🍛' },
  { id: '3', name: 'Indian', emoji: '🍲' },
  { id: '4', name: 'Japanese', emoji: '🍱' },
  { id: '5', name: 'Korean', emoji: '🥘' },
  { id: '6', name: 'Western', emoji: '🍝' },
];

const featuredChefs = [
  {
    id: '1',
    name: 'Chef Sarah Tan',
    specialty: 'Peranakan',
    rating: 4.9,
    reviews: 127,
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
    price: '$40-60',
  },
  {
    id: '2',
    name: 'Chef Kenji',
    specialty: 'Japanese',
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?w=400',
    price: '$60-90',
  },
  {
    id: '3',
    name: 'Chef Priya',
    specialty: 'Indian',
    rating: 4.8,
    reviews: 103,
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400',
    price: '$35-55',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Potluck</Text>
          <Text style={styles.subtitle}>
            Discover home-cooked meals in Singapore
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search cuisines, chefs, or dishes..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Cuisine</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Chefs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Chefs</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {featuredChefs.map((chef) => (
            <TouchableOpacity
              key={chef.id}
              style={styles.chefCard}
              onPress={() => navigation.navigate('ChefProfile', { chefId: chef.id })}
            >
              <Image source={{ uri: chef.image }} style={styles.chefImage} />
              <View style={styles.chefInfo}>
                <Text style={styles.chefName}>{chef.name}</Text>
                <Text style={styles.chefSpecialty}>{chef.specialty} Cuisine</Text>
                <View style={styles.chefMeta}>
                  <Text style={styles.rating}>★ {chef.rating}</Text>
                  <Text style={styles.reviews}>({chef.reviews})</Text>
                  <Text style={styles.price}>{chef.price}/pax</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* How it Works */}
        <View style={styles.howItWorks}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepContainer}>
            <View style={styles.step}>
              <Text style={styles.stepIcon}>🔍</Text>
              <Text style={styles.stepTitle}>Discover</Text>
              <Text style={styles.stepDesc}>Find home chefs near you</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepIcon}>📅</Text>
              <Text style={styles.stepTitle}>Book</Text>
              <Text style={styles.stepDesc}>Choose a date & time</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepIcon}>🍽️</Text>
              <Text style={styles.stepTitle}>Enjoy</Text>
              <Text style={styles.stepDesc}>Dine at chef's home</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F97316',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  section: {
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  seeAll: {
    color: '#F97316',
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: 90,
    marginHorizontal: 4,
  },
  categoryEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  chefCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chefImage: {
    width: 120,
    height: 120,
  },
  chefInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  chefName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  chefSpecialty: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  chefMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  rating: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  reviews: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  price: {
    color: '#F97316',
    fontWeight: '600',
    marginLeft: 'auto',
  },
  howItWorks: {
    backgroundColor: '#FFF7ED',
    marginTop: 24,
    paddingVertical: 24,
    marginBottom: 24,
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  step: {
    alignItems: 'center',
    flex: 1,
  },
  stepIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
