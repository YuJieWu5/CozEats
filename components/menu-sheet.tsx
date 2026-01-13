import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Sheet } from '@/components/ui/sheet';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { useState, useEffect } from 'react';
import { getUserGroups, Group } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateGroupDialog } from '@/components/create-group-dialog';
import { JoinGroupDialog } from '@/components/join-group-dialog';

interface MenuSheetProps {
  open: boolean;
  onClose: () => void;
}

const SELECTED_GROUP_KEY = '@cozeats_selected_group';

export function MenuSheet({ open, onClose }: MenuSheetProps) {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [joinGroupOpen, setJoinGroupOpen] = useState(false);

  // Fetch user groups when sheet opens
  useEffect(() => {
    if (open && user?.id) {
      fetchGroups();
    }
  }, [open, user?.id]);

  // Load selected group from AsyncStorage and set default if needed
  useEffect(() => {
    if (groups.length > 0) {
      loadSelectedGroup();
    }
  }, [groups]);

  const loadSelectedGroup = async () => {
    try {
      const storedGroupId = await AsyncStorage.getItem(SELECTED_GROUP_KEY);
      
      if (storedGroupId && groups.some(g => g.groupId === storedGroupId)) {
        // Use stored group if it exists in current groups
        setSelectedGroupId(storedGroupId);
      } else if (groups.length > 0) {
        // Default to first group if no stored selection or stored group not found
        const firstGroupId = groups[0].groupId;
        setSelectedGroupId(firstGroupId);
        await AsyncStorage.setItem(SELECTED_GROUP_KEY, firstGroupId);
      }
    } catch (err) {
      console.error('Error loading selected group:', err);
      // Fallback to first group
      if (groups.length > 0) {
        setSelectedGroupId(groups[0].groupId);
      }
    }
  };

  const fetchGroups = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const userGroups = await getUserGroups(user.id);
      setGroups(userGroups);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load groups');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToProfile = () => {
    onClose();
    router.push('/profile');
  };

  const handleLogout = async () => {
    onClose();
    await logout();
    router.replace('/');
  };

  const handleGroupPress = async (groupId: string) => {
    // Only update if selecting a different group
    if (groupId !== selectedGroupId) {
      try {
        await AsyncStorage.setItem(SELECTED_GROUP_KEY, groupId);
        setSelectedGroupId(groupId);
        console.log('Selected group changed to:', groupId);
      } catch (err) {
        console.error('Error saving selected group:', err);
      }
    }
    
    onClose();
    // TODO: Navigate to group details page or refresh data for selected group
    console.log('Navigate to group:', groupId);
  };

  const handleCreateGroupSuccess = () => {
    setCreateGroupOpen(false);
    fetchGroups(); // Refresh the groups list
  };

  const handleJoinGroupSuccess = (groupName: string) => {
    setJoinGroupOpen(false);
    fetchGroups(); // Refresh the groups list
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
    <Sheet
      open={open}
      onClose={onClose}
      side="left"
      size={0.75}
    >
      <View className="flex-1 bg-background">
        {/* User Info Section */}
        <View className="p-6 border-b border-border">
          {/* Avatar placeholder */}
          <View className="w-20 h-20 bg-info rounded-full items-center justify-center mb-3">
            <Text className="text-info-foreground text-2xl font-bold">{getInitials()}</Text>
          </View>
          <Text className="text-xl font-bold text-foreground">
            {user?.name || 'User'}
          </Text>
          <Text className="text-muted-foreground mt-1">
            {user?.email || 'No email'}
          </Text>
        </View>

        {/* User Groups Section */}
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          <View className="mb-4">
            <Text className="text-sm font-semibold text-muted-foreground uppercase mb-2 px-2">
              My Groups
            </Text>
            
            {loading ? (
              <View className="py-8 items-center">
                <ActivityIndicator size="small" color="#6B7280" />
              </View>
            ) : error ? (
              <View className="p-4 bg-destructive/10 rounded-lg">
                <Text className="text-destructive text-sm">{error}</Text>
              </View>
            ) : groups.length > 0 ? (
              <View className="space-y-2">
                {groups.map((group) => {
                  const isSelected = group.groupId === selectedGroupId;
                  return (
                    <TouchableOpacity
                      key={group.groupId}
                      className={`flex-row items-center justify-between p-4 rounded-lg active:opacity-70 ${
                        isSelected ? 'bg-primary/10 border-2 border-primary' : 'bg-card'
                      }`}
                      onPress={() => handleGroupPress(group.groupId)}
                    >
                      <View className="flex-row items-center flex-1">
                        <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                          isSelected ? 'bg-primary' : 'bg-primary/10'
                        }`}>
                          <Ionicons 
                            name={isSelected ? "people" : "people-outline"} 
                            size={20} 
                            color={isSelected ? "#FFFFFF" : "#2563eb"} 
                          />
                        </View>
                        <Text className={`text-base flex-1 ${
                          isSelected ? 'text-primary font-semibold' : 'text-foreground font-medium'
                        }`}>
                          {group.name}
                        </Text>
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={20} color="#2563eb" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View className="p-4 bg-muted rounded-lg">
                <Text className="text-muted-foreground text-sm text-center">
                  No groups yet
                </Text>
              </View>
            )}

            {/* Create Group Button */}
            <TouchableOpacity
              className="flex-row items-center justify-center p-4 bg-primary rounded-lg mt-3 active:opacity-70"
              onPress={() => setCreateGroupOpen(true)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
              <Text className="text-primary-foreground ml-2 font-semibold text-base">
                Create Group
              </Text>
            </TouchableOpacity>

            {/* Join Group Button */}
            <TouchableOpacity
              className="flex-row items-center justify-center p-4 bg-background border-2 border-primary rounded-lg mt-2 active:opacity-70"
              onPress={() => setJoinGroupOpen(true)}
            >
              <Ionicons name="link-outline" size={20} color="#2563eb" />
              <Text className="text-primary ml-2 font-semibold text-base">
                Join Group
              </Text>
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View className="mt-4">
            <Text className="text-sm font-semibold text-muted-foreground uppercase mb-2 px-2">
              Settings
            </Text>
            <TouchableOpacity 
              className="flex-row items-center p-4 bg-card rounded-lg active:opacity-70"
              onPress={handleNavigateToProfile}
            >
              <Ionicons name="settings-outline" size={24} color="#6B7280" />
              <Text className="text-base text-foreground ml-4 font-medium">Profile Settings</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Logout Button */}
        <View className="p-4 border-t border-border">
          <TouchableOpacity 
            className="flex-row items-center justify-center p-4 bg-destructive rounded-lg active:opacity-70"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
            <Text className="text-base text-destructive-foreground ml-3 font-semibold">Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Create Group Dialog */}
      <CreateGroupDialog
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        onSuccess={handleCreateGroupSuccess}
      />

      {/* Join Group Dialog */}
      <JoinGroupDialog
        open={joinGroupOpen}
        onClose={() => setJoinGroupOpen(false)}
        onSuccess={handleJoinGroupSuccess}
      />
    </Sheet>
  );
}

