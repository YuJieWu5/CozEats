import { View, Text } from 'react-native';
import { useTheme } from '@/lib/theme-context';
import { StatusBar } from 'expo-status-bar';


export default function AppContent() {
  const { activeTheme } = useTheme();
  return (
    <View style={activeTheme} className="flex-1 bg-background items-center justify-center">
        <Text className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to CozEats! 🍽️
        </Text>
        <Text className="text-lg text-gray-600">
            Your app is working!
        </Text>
        <StatusBar style="auto" />
    </View>
  );
  }