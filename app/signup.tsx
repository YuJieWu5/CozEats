import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { signup } from '@/lib/api';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useState } from 'react';

export default function SignupScreen() {
  const { activeTheme } = useTheme();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    // Validate inputs
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call the signup API
      const user = await signup({
        email: email.trim(),
        password: password,
        name: username.trim(),
      });

      // Save user to auth context
      await login(user);

      // Navigate to the main app
      router.replace('/(tabs)/meals');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create account';
      setError(message);
      Alert.alert('Sign Up Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={activeTheme} className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="flex-1 items-center justify-center px-6 py-12">
        <View className="w-full max-w-md">
          {/* Logo/Title */}
          <Text className="text-4xl font-bold text-center mb-2 text-foreground">
            🍽️ CozEats
          </Text>
          <Text className="text-lg text-center mb-8 text-muted-foreground">
            Create your account
          </Text>

          {/* Username Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 text-foreground">Username</Text>
            <TextInput
              className="w-full px-4 py-3 border border rounded-lg bg-card text-foreground"
              placeholder="johndoe"
              placeholderTextColor="#9ca3af"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 text-foreground">Email</Text>
            <TextInput
              className="w-full px-4 py-3 border border rounded-lg bg-card text-foreground"
              placeholder="you@example.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 text-foreground">Password</Text>
            <TextInput
              className="w-full px-4 py-3 border border rounded-lg bg-card text-foreground"
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          {/* Error Message */}
          {error ? (
            <View className="mb-4">
              <Text className="text-destructive text-sm text-center">{error}</Text>
            </View>
          ) : null}

          {/* Sign Up Button */}
          <TouchableOpacity
            className={`w-full bg-info py-4 rounded-lg mb-4 active:opacity-80 ${isLoading ? 'opacity-50' : ''}`}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-info-foreground text-center font-semibold text-lg">
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          {/* Log In Link */}
          <TouchableOpacity className="w-full py-2" onPress={handleBackToLogin}>
            <Text className="text-center text-muted-foreground">
              Already have an account?{' '}
              <Text className="text-info font-semibold">Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

