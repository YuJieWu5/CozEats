import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Sheet } from '@/components/ui/sheet';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { useState, useEffect } from 'react';
import { getUserGroups, Group } from '@/lib/api';

interface MenuSheetProps {
  open: boolean;
  onClose: () => void;
}

export function MenuSheet({ open, onClose }: MenuSheetProps) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user groups when sheet opens
  useEffect(() => {
    if (open && user?.id) {
      fetchGroups();
    }
  }, [open, user?.id]);

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

  const handleGroupPress = (groupId: string) => {
    onClose();
    // TODO: Navigate to group details page
    console.log('Navigate to group:', groupId);
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
        <View className="flex-1 p-4">
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
                {groups.map((group) => (
                  <TouchableOpacity
                    key={group.groupId}
                    className="flex-row items-center justify-between p-4 bg-card rounded-lg active:opacity-70"
                    onPress={() => handleGroupPress(group.groupId)}
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
                        <Ionicons name="people" size={20} color="#2563eb" />
                      </View>
                      <Text className="text-base text-foreground font-medium flex-1">
                        {group.name}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className="p-4 bg-muted rounded-lg">
                <Text className="text-muted-foreground text-sm text-center">
                  No groups yet
                </Text>
              </View>
            )}
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
        </View>
      </View>
    </Sheet>
  );
}

