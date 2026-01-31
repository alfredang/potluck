import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FOOD_CATEGORIES } from '@homechef/shared';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#0f172a' }}>
            Welcome to HomeChef
          </Text>
          <Text style={{ fontSize: 16, color: '#64748b', marginTop: 4 }}>
            Discover authentic home dining experiences
          </Text>
        </View>

        {/* Categories */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 12 }}>
            Browse by Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FOOD_CATEGORIES.map((category) => (
              <Link key={category.slug} href={`/explore?category=${category.slug}`} asChild>
                <Pressable
                  style={{
                    backgroundColor: '#fff7ed',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    marginRight: 12,
                    alignItems: 'center',
                    minWidth: 80,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{category.emoji}</Text>
                  <Text style={{ fontSize: 14, color: '#0f172a', marginTop: 4 }}>
                    {category.name}
                  </Text>
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* Featured Chefs Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}
          >
            <Text style={{ fontSize: 20, fontWeight: '600' }}>Featured Chefs</Text>
            <Link href="/explore" asChild>
              <Pressable>
                <Text style={{ color: '#f97316' }}>See all</Text>
              </Pressable>
            </Link>
          </View>

          {/* Placeholder for featured chefs */}
          <View
            style={{
              backgroundColor: '#f1f5f9',
              borderRadius: 12,
              padding: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#64748b' }}>Loading featured chefs...</Text>
          </View>
        </View>

        {/* Popular Menus Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}
          >
            <Text style={{ fontSize: 20, fontWeight: '600' }}>Popular Menus</Text>
            <Link href="/explore" asChild>
              <Pressable>
                <Text style={{ color: '#f97316' }}>See all</Text>
              </Pressable>
            </Link>
          </View>

          {/* Placeholder for popular menus */}
          <View
            style={{
              backgroundColor: '#f1f5f9',
              borderRadius: 12,
              padding: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#64748b' }}>Loading popular menus...</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
