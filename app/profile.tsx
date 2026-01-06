import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Drawer } from '@/components/ui/drawer';
import { useTheme } from '@/lib/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const { themeOption, setThemeOption } = useTheme();
  const [isThemeSelectOpen, setIsThemeSelectOpen] = useState(false);

  const handleLogout = () => {
    // TODO: Add your logout logic here
    router.replace('/');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/meals');
    }
  };

  const getThemeLabel = (option: string) => {
    return option.charAt(0).toUpperCase() + option.slice(1);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="auto" />
      
      {/* Header with Back Button */}
      <View className="bg-card px-4 py-4 flex-row items-center">
        <TouchableOpacity onPress={handleBack} className="mr-4 p-2 active:opacity-70">
          <Ionicons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Profile Header */}
      <View className="bg-card px-4 py-6">
        <View className="items-center mb-4">
          {/* Avatar placeholder */}
          <View className="w-24 h-24 bg-info rounded-full items-center justify-center mb-3">
            <Text className="text-info-foreground text-3xl font-bold">JD</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground">John Doe</Text>
          <Text className="text-muted-foreground">john.doe@example.com</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Account Settings */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-muted-foreground uppercase mb-3 tracking-wide">
            Account
          </Text>
          <View className="bg-card rounded-lg overflow-hidden">
            <TouchableOpacity className="p-4 flex-row justify-between items-center">
              <Text className="text-base text-foreground">Edit Profile</Text>
              <Text className="text-muted-foreground">›</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-4 flex-row justify-between items-center">
              <Text className="text-base text-foreground">Change Group</Text>
              <Text className="text-muted-foreground">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Settings */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-muted-foreground uppercase mb-3 tracking-wide">
            Preferences
          </Text>
          <View className="bg-card rounded-lg overflow-hidden">
            <TouchableOpacity className="p-4 flex-row justify-between items-center">
              <Text className="text-base text-foreground">Notifications</Text>
              <Text className="text-muted-foreground">›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="p-4 flex-row justify-between items-center"
              onPress={() => setIsThemeSelectOpen(true)}
            >
              <Text className="text-base text-foreground">Theme</Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-muted-foreground">{getThemeLabel(themeOption)}</Text>
                <Text className="text-muted-foreground">›</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>


        {/* About */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-muted-foreground uppercase mb-3 tracking-wide">
            About
          </Text>
          <View className="bg-card rounded-lg overflow-hidden">
            <TouchableOpacity className="p-4 flex-row justify-between items-center">
              <Text className="text-base text-foreground">Help & Support</Text>
              <Text className="text-muted-foreground">›</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-4 flex-row justify-between items-center">
              <Text className="text-base text-foreground">Privacy Policy</Text>
              <Text className="text-muted-foreground">›</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-4 flex-row justify-between items-center">
              <Text className="text-base text-foreground">Terms of Service</Text>
              <Text className="text-muted-foreground">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-destructive p-4 rounded-lg items-center mb-6"
        >
          <Text className="text-destructive-foreground font-semibold text-lg">Log Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text className="text-center text-muted-foreground text-sm mb-8 opacity-70">
          Version 1.0.0
        </Text>
      </ScrollView>

      {/* Theme Selector Drawer */}
      <Drawer
        open={isThemeSelectOpen}
        onClose={() => setIsThemeSelectOpen(false)}
        title="Select Theme"
        size="small"
      >
        <View className="px-4 py-2">
          {['light', 'dark', 'system'].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                setThemeOption(option as 'light' | 'dark' | 'system');
                setIsThemeSelectOpen(false);
              }}
              className="flex-row items-center justify-between p-4 active:bg-accent/50 rounded-lg"
            >
              <Text className="text-base text-foreground">
                {getThemeLabel(option)}
              </Text>
              {themeOption === option && (
                <Ionicons name="checkmark" size={20} color="#4F46E5" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Drawer>
    </SafeAreaView>
  );
}

