import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Call login API
      console.log('Login:', { email, password });

      // On success, navigate to home
      router.replace('/(tabs)');
    } catch (err) {
      setError('Invalid email or password');
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
        <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            style={{ position: 'absolute', top: 20, left: 20 }}
          >
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </Pressable>

          {/* Logo/Title */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#f97316' }}>HomeChef</Text>
            <Text style={{ fontSize: 16, color: '#64748b', marginTop: 8 }}>
              Sign in to continue
            </Text>
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

          {/* Email Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#374151' }}>
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
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#374151' }}>
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
                placeholder="Enter your password"
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

          {/* Login Button */}
          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#fdba74' : '#f97316',
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </Pressable>

          {/* Forgot Password */}
          <Link href="/(auth)/forgot-password" asChild>
            <Pressable style={{ alignItems: 'center', marginTop: 16 }}>
              <Text style={{ color: '#f97316' }}>Forgot password?</Text>
            </Pressable>
          </Link>

          {/* Sign Up Link */}
          <View
            style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}
          >
            <Text style={{ color: '#64748b' }}>Don&apos;t have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text style={{ color: '#f97316', fontWeight: '600' }}>Sign Up</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
