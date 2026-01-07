import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { login } from '@/lib/api';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useState } from 'react'

export default function LoginScreen() {
  const { activeTheme } = useTheme();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call the login API
      const user = await login({
        email: email.trim(),
        password: password,
      });

      // Save user to auth context
      await authLogin(user);

      // Navigate to the main app
      router.replace('/(tabs)/meals');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to log in';
      setError(message);
      Alert.alert('Login Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupNav = () => {
    router.push('/signup');
  };

  return (
    <SafeAreaView style={activeTheme} className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
      <View className="w-full max-w-md">
        {/* Logo/Title */}
        <Text className="text-4xl font-bold text-center mb-2 text-foreground">
          🍽️ CozEats
        </Text>
        <Text className="text-lg text-center mb-8 text-muted-foreground">
          Plan your meals, simplify your life
        </Text>

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

        {/* Login Button */}
        <TouchableOpacity
          className={`w-full bg-info py-4 rounded-lg mb-4 active:opacity-80 ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-info-foreground text-center font-semibold text-lg">
              Log In
            </Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity className="w-full py-2" onPress={handleSignupNav}>
          <Text className="text-center text-muted-foreground">
            Don't have an account?{' '}
            <Text className="text-info font-semibold">Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>

        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}