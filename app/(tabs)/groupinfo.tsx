import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGroupDetail, GroupDetailResponse, createGroupInvite, InviteResponse } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useFocusEffect } from '@react-navigation/native';
import { InviteCodeDialog } from '@/components/invite-code-dialog';

const SELECTED_GROUP_KEY = '@cozeats_selected_group';

export default function GroupInfoScreen() {
  const [groupData, setGroupData] = useState<GroupDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState<InviteResponse | null>(null);
  const [generatingInvite, setGeneratingInvite] = useState(false);
  const { user } = useAuth();
  
  const loadGroupData = async (groupId: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getGroupDetail(groupId);
      setGroupData(data);
    } catch (err) {
      console.error('Error loading group data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load group data');
    } finally {
      setLoading(false);
    }
  };

  const checkAndLoadGroup = useCallback(async () => {
    try {
      const groupId = await AsyncStorage.getItem(SELECTED_GROUP_KEY);
      
      if (!groupId) {
        setError('No group selected');
        setLoading(false);
        return;
      }

      // Always reload data when group changes
      if (groupId !== currentGroupId) {
        setCurrentGroupId(groupId);
      } else {
        // Still reload even if same groupId (in case data changed)
        await loadGroupData(groupId);
      }
    } catch (err) {
      console.error('Error checking group ID:', err);
      setError('Failed to load group ID');
      setLoading(false);
    }
  }, [currentGroupId]);

  // Load group data whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      checkAndLoadGroup();
      
      // Set up polling to check for group changes while screen is focused
      const intervalId = setInterval(async () => {
        try {
          const storedGroupId = await AsyncStorage.getItem(SELECTED_GROUP_KEY);
          if (storedGroupId && storedGroupId !== currentGroupId) {
            setCurrentGroupId(storedGroupId);
          }
        } catch (err) {
          console.error('Error polling for group changes:', err);
        }
      }, 1000); // Check every second
      
      // Cleanup interval when screen loses focus
      return () => {
        clearInterval(intervalId);
      };
    }, [checkAndLoadGroup, currentGroupId])
  );

  // Watch for groupId changes and load data
  useEffect(() => {
    if (currentGroupId) {
      loadGroupData(currentGroupId);
    }
  }, [currentGroupId]);

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-4">Loading group info...</Text>
      </View>
    );
  }

  if (error || !groupData) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-4">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="text-destructive text-lg font-semibold mt-4">
          {error || 'Failed to load group'}
        </Text>
        <TouchableOpacity 
          className="bg-info px-6 py-3 rounded-lg mt-4"
          onPress={checkAndLoadGroup}
        >
          <Text className="text-info-foreground font-medium">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentUserMember = groupData.members.find(m => m.userEmail === user?.email);
  const isAdmin = currentUserMember?.role === 'admin';

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const handleGenerateInviteCode = async () => {
    if (!user?.id || !currentGroupId) {
      Alert.alert('Error', 'User or group information is missing');
      return;
    }

    try {
      setGeneratingInvite(true);
      const invite = await createGroupInvite(currentGroupId, {
        groupId: currentGroupId,
        createdById: user.id,
      });
      setInviteCode(invite);
      setInviteDialogOpen(true);
    } catch (err) {
      console.error('Failed to generate invite code:', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to generate invite code');
    } finally {
      setGeneratingInvite(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Group Header */}
      <View className="bg-card px-4 py-6 mb-4">
        <View className="items-center">
          {/* Group Icon */}
          <View className="w-24 h-24 bg-info rounded-2xl items-center justify-center mb-4 shadow-sm">
            <Text className="text-4xl">👨‍👩‍👧‍👦</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground mb-2">
            {groupData.groupName}
          </Text>
          <View className="flex-row items-center bg-muted px-3 py-1.5 rounded-full">
            <Ionicons 
              name={isAdmin ? 'shield-checkmark' : 'person'} 
              size={14} 
              color={isAdmin ? '#10B981' : '#6B7280'} 
            />
            <Text className={`ml-1.5 text-sm font-medium ${isAdmin ? 'text-success' : 'text-muted-foreground'}`}>
              {isAdmin ? 'Admin' : 'Member'}
            </Text>
          </View>
        </View>
      </View>

      {/* Invite Code Section - Only visible to admins */}
      {isAdmin && (
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-muted-foreground uppercase mb-3 tracking-wide">
            Invite Others
          </Text>
          <TouchableOpacity 
            className="bg-info rounded-xl p-4 flex-row items-center justify-center shadow-sm active:opacity-80"
            onPress={handleGenerateInviteCode}
            disabled={generatingInvite}
          >
            {generatingInvite ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="ticket-outline" size={20} color="#FFFFFF" />
                <Text className="text-info-foreground font-semibold text-base ml-2">
                  Generate Invite Code
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Members Section */}
      <View className="px-4 mb-6">
        <Text className="text-sm font-semibold text-muted-foreground uppercase mb-3 tracking-wide">
          Members ({groupData.members.length})
        </Text>
        <View className="bg-card rounded-xl overflow-hidden shadow-sm">
          {groupData.members.map((member, index) => (
            <View 
              key={`${member.userEmail}-${index}`}
              className={`p-4 flex-row items-center ${
                index !== groupData.members.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              {/* Avatar */}
              <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                member.role === 'admin' ? 'bg-success/20' : 'bg-muted'
              }`}>
                <Text className={`font-semibold ${
                  member.role === 'admin' ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {getInitials(member.userName, member.userEmail)}
                </Text>
              </View>
              
              {/* Member Info */}
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-base font-medium text-foreground">
                    {member.userName || 'No Name'}
                  </Text>
                  {member.userEmail === user?.email && (
                    <Text className="text-xs text-muted-foreground ml-2">(You)</Text>
                  )}
                </View>
                <Text className="text-sm text-muted-foreground">{member.userEmail}</Text>
              </View>
              
              {/* Role Badge */}
              {member.role === 'admin' && (
                <View className="bg-success/10 px-2.5 py-1 rounded-full">
                  <Text className="text-xs font-medium text-success">Admin</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Group Stats */}
      <View className="px-4 mb-8">
        <Text className="text-sm font-semibold text-muted-foreground uppercase mb-3 tracking-wide">
          Group Stats
        </Text>
        <View className="flex-row gap-3">
          <View className="flex-1 bg-card p-4 rounded-xl items-center shadow-sm">
            <Text className="text-3xl mb-1">🍽️</Text>
            <Text className="text-2xl font-bold text-foreground">{groupData.mealCount}</Text>
            <Text className="text-sm text-muted-foreground">Meals Planned</Text>
          </View>
          <View className="flex-1 bg-card p-4 rounded-xl items-center shadow-sm">
            <Text className="text-3xl mb-1">🛒</Text>
            <Text className="text-2xl font-bold text-foreground">{groupData.groceryCount}</Text>
            <Text className="text-sm text-muted-foreground">Grocery Items</Text>
          </View>
        </View>
      </View>

      {/* Invite Code Dialog */}
      <InviteCodeDialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        inviteCode={inviteCode}
      />
    </ScrollView>
  );
}