
import '../global.css';
import { ThemeProvider } from '@/lib/theme-context';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider defaultTheme="system">
        <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* Add more screens here */}
      </Stack>
    </ThemeProvider>
  );
}