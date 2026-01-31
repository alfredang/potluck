import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const bookings = [
  { id: '1', chefName: 'Chef Sarah Tan', menu: 'Ayam Buah Keluak', date: 'Sat, Feb 8', time: '7:00 PM', guests: 2, total: 90, status: 'confirmed' },
  { id: '2', chefName: 'Chef Kenji', menu: 'Omakase Set', date: 'Sun, Feb 16', time: '6:30 PM', guests: 4, total: 480, status: 'pending' },
];

export default function BookingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {bookings.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No bookings yet</Text>
            <Text style={styles.emptySubtext}>Explore chefs and book your first dining experience</Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.chefName}>{booking.chefName}</Text>
                <View style={[styles.statusBadge, booking.status === 'confirmed' ? styles.confirmed : styles.pending]}>
                  <Text style={styles.statusText}>{booking.status}</Text>
                </View>
              </View>
              <Text style={styles.menu}>{booking.menu}</Text>
              <View style={styles.details}>
                <Text style={styles.detail}>📅 {booking.date}</Text>
                <Text style={styles.detail}>🕐 {booking.time}</Text>
                <Text style={styles.detail}>👥 {booking.guests} guests</Text>
              </View>
              <View style={styles.footer}>
                <Text style={styles.total}>${booking.total.toFixed(2)}</Text>
                <TouchableOpacity style={styles.viewBtn}>
                  <Text style={styles.viewBtnText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111', marginVertical: 20 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#111' },
  emptySubtext: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chefName: { fontSize: 18, fontWeight: '700', color: '#111' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  confirmed: { backgroundColor: '#dcfce7' },
  pending: { backgroundColor: '#fef3c7' },
  statusText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  menu: { fontSize: 15, color: '#666', marginTop: 4 },
  details: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  detail: { fontSize: 14, color: '#666' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderColor: '#eee' },
  total: { fontSize: 18, fontWeight: '700', color: '#F97316' },
  viewBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f3f4f6' },
  viewBtnText: { fontSize: 14, fontWeight: '600', color: '#111' },
});
