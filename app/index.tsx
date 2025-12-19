import { useTheme } from '@/lib/theme-context';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
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

  
  return (
    <View style={activeTheme} className="flex-1 items-center justify-center bg-white px-6">
      <View className="w-full max-w-md">
        {/* Logo/Title */}
        <Text className="text-4xl font-bold text-center mb-2 text-gray-800">
          🍽️ CozEats
        </Text>
        <Text className="text-lg text-center mb-8 text-gray-600">
          Plan your meals, simplify your life
        </Text>

        {/* Email Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2 text-gray-700">Email</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View className="mb-6">
          <Text className="text-sm font-medium mb-2 text-gray-700">Password</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="w-full bg-blue-600 py-4 rounded-lg mb-4 active:bg-blue-700"
          onPress={handleLogin}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Log In
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity className="w-full py-2">
          <Text className="text-center text-gray-600">
            Don't have an account?{' '}
            <Text className="text-blue-600 font-semibold">Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
  }