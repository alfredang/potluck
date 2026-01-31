import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  // TODO: Get user from auth context
  const user = null;

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="person-circle-outline" size={80} color="#94a3b8" />
          <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 16 }}>Welcome to HomeChef</Text>
          <Text style={{ color: '#64748b', marginTop: 8, textAlign: 'center' }}>
            Sign in to book dining experiences and manage your account
          </Text>

          <Link href="/(auth)/login" asChild>
            <Pressable
              style={{
                backgroundColor: '#f97316',
                paddingVertical: 14,
                paddingHorizontal: 32,
                borderRadius: 8,
                marginTop: 24,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Sign In</Text>
            </Pressable>
          </Link>

          <Link href="/(auth)/register" asChild>
            <Pressable
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#e2e8f0',
                paddingVertical: 14,
                paddingHorizontal: 32,
                borderRadius: 8,
                marginTop: 12,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#0f172a', fontWeight: '600', fontSize: 16 }}>
                Create Account
              </Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Profile</Text>
        </View>

        {/* Profile Menu Items */}
        <View style={{ paddingHorizontal: 20 }}>
          <MenuItem icon="person-outline" label="Edit Profile" onPress={() => {}} />
          <MenuItem icon="card-outline" label="Payment Methods" onPress={() => {}} />
          <MenuItem icon="star-outline" label="My Reviews" onPress={() => {}} />
          <MenuItem icon="settings-outline" label="Settings" onPress={() => {}} />
          <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
          <MenuItem icon="log-out-outline" label="Sign Out" onPress={() => {}} danger />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
      }}
    >
      <Ionicons name={icon} size={24} color={danger ? '#ef4444' : '#0f172a'} />
      <Text
        style={{
          flex: 1,
          marginLeft: 16,
          fontSize: 16,
          color: danger ? '#ef4444' : '#0f172a',
        }}
      >
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </Pressable>
  );
}
