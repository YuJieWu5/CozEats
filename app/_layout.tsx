
import '../global.css';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import { AuthProvider } from '@/lib/auth-context';
import { Stack } from 'expo-router';
import { View } from 'react-native';

function RootNavigator() {
  const { activeTheme } = useTheme();
  
  return (
    <View style={[{ flex: 1 }, activeTheme]}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Add more screens here */}
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}