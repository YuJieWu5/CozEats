import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Sheet } from '@/components/ui/sheet';
import { View, Text } from 'react-native';
import { router } from 'expo-router';

function MenuSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const handleNavigateToProfile = () => {
    onClose();
    router.push('/profile');
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      side="left"
      size={0.75}
    >
      <View className="flex-1 bg-background">
        {/* User Info Section */}
        <View className="p-6">
          {/* Avatar placeholder */}
          <View className="w-20 h-20 bg-info rounded-full items-center justify-center mb-3">
            <Text className="text-info-foreground text-2xl font-bold">JD</Text>
          </View>
          <Text className="text-xl font-bold text-foreground">John Doe</Text>
          <Text className="text-muted-foreground mt-1">john.doe@example.com</Text>
        </View>

        {/* Menu Items */}
        <View className="flex-1 p-4">
          <TouchableOpacity 
            className="flex-row items-center p-4 bg-card rounded-lg active:opacity-70"
            onPress={handleNavigateToProfile}
          >
            <Ionicons name="settings-outline" size={24} color="#6B7280" />
            <Text className="text-base text-foreground ml-4 font-medium">Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Sheet>
  );
}

export default function TabLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2563eb', // blue-600
          tabBarInactiveTintColor: '#9ca3af', // gray-400
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => setMenuOpen(true)}
              className="ml-4 p-2"
            >
              <Ionicons name="menu" size={28} color="#000" />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="meals"
          options={{
            title: 'Meals',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="grocerylist"
          options={{
            title: 'Grocery List',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="groupinfo"
          options={{
            title: 'Group',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}