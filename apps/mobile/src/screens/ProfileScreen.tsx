import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Contact handlers
const handleEmail = () => {
  Linking.openURL('mailto:hello@potluckhub.io?subject=PotLuck%20Inquiry');
};

const handleWhatsApp = () => {
  Linking.openURL('https://wa.me/6590480277');
};

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@email.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>👤</Text>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>💳</Text>
            <Text style={styles.menuText}>Payment Methods</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuText}>Notifications</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>❓</Text>
            <Text style={styles.menuText}>Help Center</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          {/* Contact Options */}
          <TouchableOpacity style={styles.menuItem} onPress={handleEmail}>
            <Text style={styles.menuIcon}>📧</Text>
            <Text style={styles.menuText}>Email Us</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleWhatsApp}>
            <Text style={styles.menuIcon}>💬</Text>
            <Text style={styles.menuText}>WhatsApp</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📄</Text>
            <Text style={styles.menuText}>Terms of Service</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔒</Text>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#fff' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 22, fontWeight: '700', color: '#111', marginTop: 12 },
  email: { fontSize: 14, color: '#666', marginTop: 4 },
  section: { backgroundColor: '#fff', marginTop: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#999', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, textTransform: 'uppercase' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#f3f4f6' },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuText: { flex: 1, fontSize: 16, color: '#111' },
  menuArrow: { fontSize: 20, color: '#ccc' },
  logoutBtn: { marginHorizontal: 20, marginTop: 30, padding: 16, backgroundColor: '#fee2e2', borderRadius: 12, alignItems: 'center' },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#dc2626' },
  version: { textAlign: 'center', color: '#999', marginTop: 20, marginBottom: 40 },
});
