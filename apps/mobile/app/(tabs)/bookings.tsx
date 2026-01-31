import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BookingsScreen() {
  // TODO: Fetch bookings from API
  const bookings: unknown[] = [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>My Bookings</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {bookings.length === 0 ? (
          <View
            style={{
              backgroundColor: '#f1f5f9',
              borderRadius: 12,
              padding: 40,
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <Ionicons name="calendar-outline" size={48} color="#94a3b8" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#0f172a',
                marginTop: 16,
              }}
            >
              No bookings yet
            </Text>
            <Text
              style={{
                color: '#64748b',
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              Discover amazing home chefs and book your first dining experience!
            </Text>

            <Link href="/explore" asChild>
              <Pressable
                style={{
                  backgroundColor: '#f97316',
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  marginTop: 20,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Explore Chefs</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          <View>
            {/* Booking cards will go here */}
            <Text>Bookings list</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
