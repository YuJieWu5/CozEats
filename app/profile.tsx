import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeSelectorDrawer } from '@/components/theme-selector-drawer';
import { EditProfileDrawer } from '@/components/edit-profile-drawer';
import { ChangePasswordDrawer } from '@/components/change-password-drawer';

export default function ProfileScreen() {
  const { themeOption, setThemeOption } = useTheme();
  const { user, logout } = useAuth();
  const [isThemeSelectOpen, setIsThemeSelectOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
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

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.name) return '?';
    const names = user.name.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
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
            <Text className="text-info-foreground text-3xl font-bold">{getInitials()}</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground">{user?.name || 'User'}</Text>
          <Text className="text-muted-foreground">{user?.email || 'No email'}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Account Settings */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-muted-foreground uppercase mb-3 tracking-wide">
            Account
          </Text>
          <View className="bg-card rounded-lg overflow-hidden">
            <TouchableOpacity 
              className="p-4 flex-row justify-between items-center active:opacity-70"
              onPress={() => setIsEditProfileOpen(true)}
            >
              <Text className="text-base text-foreground">Edit Name</Text>
              <Text className="text-muted-foreground">›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="p-4 flex-row justify-between items-center active:opacity-70"
              onPress={() => setIsChangePasswordOpen(true)}
            >
              <Text className="text-base text-foreground">Change Password</Text>
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
      <ThemeSelectorDrawer
        open={isThemeSelectOpen}
        onClose={() => setIsThemeSelectOpen(false)}
        currentTheme={themeOption}
        onThemeChange={setThemeOption}
      />

      {/* Edit Profile Drawer */}
      <EditProfileDrawer
        open={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* Change Password Drawer */}
      <ChangePasswordDrawer
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </SafeAreaView>
  );
}

