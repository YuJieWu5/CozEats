import { useTheme } from '@/lib/theme-context';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useState } from 'react';

export default function SignupScreen() {
  const { activeTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // TODO: Add your registration logic here
    // For now, we'll just navigate to the tabs
    router.replace('/(tabs)/meals');
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

          {/* Sign Up Button */}
          <TouchableOpacity
            className="w-full bg-info py-4 rounded-lg mb-4 active:opacity-80"
            onPress={handleSignup}
          >
            <Text className="text-info-foreground text-center font-semibold text-lg">
              Sign Up
            </Text>
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

