import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type UserRole = 'customer' | 'chef';

export default function RegisterScreen() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('customer');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Call register API
      console.log('Register:', { firstName, lastName, email, password, role });

      // On success, navigate to home
      router.replace('/(tabs)');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            {/* Back Button */}
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
            </Pressable>

            {/* Title */}
            <View style={{ marginTop: 24, marginBottom: 32 }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#0f172a' }}>
                Create Account
              </Text>
              <Text style={{ fontSize: 16, color: '#64748b', marginTop: 8 }}>
                Join HomeChef and start your culinary journey
              </Text>
            </View>

            {/* Role Selector */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{ fontSize: 14, fontWeight: '500', marginBottom: 12, color: '#374151' }}
              >
                I want to...
              </Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Pressable
                  onPress={() => setRole('customer')}
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: role === 'customer' ? '#f97316' : '#e2e8f0',
                    backgroundColor: role === 'customer' ? '#fff7ed' : '#fff',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons
                    name="restaurant-outline"
                    size={32}
                    color={role === 'customer' ? '#f97316' : '#64748b'}
                  />
                  <Text
                    style={{
                      marginTop: 8,
                      fontWeight: '600',
                      color: role === 'customer' ? '#f97316' : '#0f172a',
                    }}
                  >
                    Dine at homes
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setRole('chef')}
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: role === 'chef' ? '#f97316' : '#e2e8f0',
                    backgroundColor: role === 'chef' ? '#fff7ed' : '#fff',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons
                    name="person-outline"
                    size={32}
                    color={role === 'chef' ? '#f97316' : '#64748b'}
                  />
                  <Text
                    style={{
                      marginTop: 8,
                      fontWeight: '600',
                      color: role === 'chef' ? '#f97316' : '#0f172a',
                    }}
                  >
                    Become a Chef
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Error Message */}
            {error ? (
              <View
                style={{
                  backgroundColor: '#fef2f2',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              >
                <Text style={{ color: '#dc2626' }}>{error}</Text>
              </View>
            ) : null}

            {/* Name Inputs */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#374151' }}
                >
                  First Name
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                  }}
                  placeholder="John"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#374151' }}
                >
                  Last Name
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                  }}
                  placeholder="Doe"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{ fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#374151' }}
              >
                Email
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
                placeholder="john@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{ fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#374151' }}
              >
                Password
              </Text>
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    paddingRight: 48,
                  }}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 16, top: 12 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={24}
                    color="#64748b"
                  />
                </Pressable>
              </View>
            </View>

            {/* Register Button */}
            <Pressable
              onPress={handleRegister}
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? '#fdba74' : '#f97316',
                paddingVertical: 14,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Text>
            </Pressable>

            {/* Terms */}
            <Text
              style={{
                color: '#64748b',
                fontSize: 12,
                textAlign: 'center',
                marginTop: 16,
              }}
            >
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>

            {/* Sign In Link */}
            <View
              style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}
            >
              <Text style={{ color: '#64748b' }}>Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text style={{ color: '#f97316', fontWeight: '600' }}>Sign In</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
