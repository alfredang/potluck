import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { useState } from 'react';

const chefData = {
  id: '1',
  name: 'Chef Sarah Tan',
  specialty: 'Peranakan',
  bio: 'Passionate Peranakan chef with 15 years of experience.',
  rating: 4.9,
  reviews: 127,
  location: 'Tiong Bahru, Singapore',
  image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600',
  cuisines: ['Peranakan', 'Chinese'],
  menus: [
    { id: '1', name: 'Ayam Buah Keluak', description: 'Traditional Peranakan chicken stew.', price: 4500, prepTime: 90 },
    { id: '2', name: 'Laksa Lemak', description: 'Rich coconut curry noodle soup.', price: 3500, prepTime: 60 },
  ],
  availableSlots: [
    { date: '2025-02-05', displayDate: 'Wed, Feb 5', times: ['6:30 PM', '7:00 PM'] },
    { date: '2025-02-08', displayDate: 'Sat, Feb 8', times: ['12:00 PM', '6:00 PM'] },
  ],
};

export default function ChefProfileScreen() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [guests, setGuests] = useState(2);

  const selectedSlotData = chefData.availableSlots.find(s => s.date === selectedSlot);
  const totalPrice = selectedMenu ? (selectedMenu.price * guests) / 100 : 0;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: chefData.image }} style={styles.heroImage} />
      <View style={styles.content}>
        <Text style={styles.name}>{chefData.name}</Text>
        <Text style={styles.specialty}>{chefData.specialty} Cuisine</Text>
        <Text style={styles.rating}>★ {chefData.rating} ({chefData.reviews} reviews)</Text>
        <Text style={styles.location}>📍 {chefData.location}</Text>
        <Text style={styles.bio}>{chefData.bio}</Text>
        
        <Text style={styles.sectionTitle}>Menu</Text>
        {chefData.menus.map((menu) => (
          <View key={menu.id} style={styles.menuCard}>
            <Text style={styles.menuName}>{menu.name}</Text>
            <Text style={styles.menuDesc}>{menu.description}</Text>
            <Text style={styles.menuPrice}>${(menu.price / 100).toFixed(2)}/pax</Text>
            <TouchableOpacity style={styles.bookBtn} onPress={() => { setSelectedMenu(menu); setShowModal(true); }}>
              <Text style={styles.bookBtnText}>Select & Book</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Book {selectedMenu?.name}</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Select Date</Text>
            <ScrollView horizontal>
              {chefData.availableSlots.map((slot) => (
                <TouchableOpacity key={slot.date} style={[styles.slot, selectedSlot === slot.date && styles.slotActive]} onPress={() => { setSelectedSlot(slot.date); setSelectedTime(null); }}>
                  <Text>{slot.displayDate}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {selectedSlotData && (
              <>
                <Text style={styles.label}>Select Time</Text>
                <View style={styles.times}>
                  {selectedSlotData.times.map((time) => (
                    <TouchableOpacity key={time} style={[styles.time, selectedTime === time && styles.timeActive]} onPress={() => setSelectedTime(time)}>
                      <Text style={selectedTime === time ? styles.timeTextActive : {}}>{time}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
            <Text style={styles.label}>Guests</Text>
            <View style={styles.guestRow}>
              <TouchableOpacity style={styles.guestBtn} onPress={() => setGuests(Math.max(1, guests - 1))}><Text>−</Text></TouchableOpacity>
              <Text style={styles.guestCount}>{guests}</Text>
              <TouchableOpacity style={styles.guestBtn} onPress={() => setGuests(guests + 1)}><Text>+</Text></TouchableOpacity>
            </View>
            <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>
            <TouchableOpacity style={[styles.submitBtn, (!selectedSlot || !selectedTime) && styles.submitBtnDisabled]} disabled={!selectedSlot || !selectedTime}>
              <Text style={styles.submitBtnText}>Request Booking</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroImage: { width: '100%', height: 280 },
  content: { padding: 20 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#111' },
  specialty: { fontSize: 16, color: '#666', marginTop: 4 },
  rating: { fontSize: 14, color: '#F59E0B', marginTop: 8 },
  location: { fontSize: 14, color: '#666', marginTop: 4 },
  bio: { fontSize: 14, color: '#444', marginTop: 12, lineHeight: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 12 },
  menuCard: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, marginBottom: 12 },
  menuName: { fontSize: 16, fontWeight: '600' },
  menuDesc: { fontSize: 14, color: '#666', marginTop: 4 },
  menuPrice: { fontSize: 16, fontWeight: '700', color: '#F97316', marginTop: 8 },
  bookBtn: { backgroundColor: '#F97316', padding: 12, borderRadius: 8, marginTop: 12, alignItems: 'center' },
  bookBtnText: { color: '#fff', fontWeight: '600' },
  modal: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  closeBtn: { fontSize: 24, color: '#666' },
  modalContent: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  slot: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginRight: 8 },
  slotActive: { borderColor: '#F97316', backgroundColor: '#FFF7ED' },
  times: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  time: { padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  timeActive: { backgroundColor: '#F97316', borderColor: '#F97316' },
  timeTextActive: { color: '#fff' },
  guestRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  guestBtn: { width: 36, height: 36, borderWidth: 1, borderColor: '#ddd', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  guestCount: { fontSize: 18, fontWeight: '600' },
  total: { fontSize: 18, fontWeight: '700', color: '#F97316', marginTop: 20 },
  submitBtn: { backgroundColor: '#F97316', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  submitBtnDisabled: { backgroundColor: '#fdc' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
