import { useTheme } from '@/lib/theme-context';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useState } from 'react'

export default function LoginScreen() {
  const { activeTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Add your authentication logic here
    // For now, we'll just navigate to the tabs
    router.replace('/(tabs)/meals');
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
          />
        </View>

        {/* Password Input */}
        <View className="mb-6">
          <Text className="text-sm font-medium mb-2 text-foreground">Password</Text>
          <TextInput
            className="w-full px-4 py-3 border border rounded-lg bg-card text-foreground"
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="w-full bg-info py-4 rounded-lg mb-4 active:opacity-80"
          onPress={handleLogin}
        >
          <Text className="text-info-foreground text-center font-semibold text-lg">
            Log In
          </Text>
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