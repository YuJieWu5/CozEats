import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

// Mock data
const mockGroupData = {
  name: 'The Foodie Family',
  inviteCode: 'COZE-XK9F-2024',
  members: [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'admin' as const, avatar: 'JD' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'member' as const, avatar: 'JS' },
    { id: 3, name: 'Mike Chen', email: 'mike.chen@example.com', role: 'member' as const, avatar: 'MC' },
  ],
  currentUserId: 1, // John Doe is the current user (admin)
};

export default function GroupInfoScreen() {
  const [showCode, setShowCode] = useState(false);
  
  const currentUser = mockGroupData.members.find(m => m.id === mockGroupData.currentUserId);
  const isAdmin = currentUser?.role === 'admin';

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(mockGroupData.inviteCode);
    Alert.alert('Copied!', 'Invite code copied to clipboard');
  };

  const handleShowInviteCode = () => {
    setShowCode(!showCode);
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
            {mockGroupData.name}
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

      {/* Invite Code Section */}
      <View className="px-4 mb-6">
        <Text className="text-sm font-semibold text-muted-foreground uppercase mb-3 tracking-wide">
          Invite Others
        </Text>
        <View className="bg-card rounded-xl overflow-hidden shadow-sm">
          <TouchableOpacity 
            className="p-4 flex-row items-center justify-between active:bg-accent/50"
            onPress={handleShowInviteCode}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-info/10 rounded-lg items-center justify-center mr-3">
                <Ionicons name="ticket-outline" size={20} color="#3B82F6" />
              </View>
              <View>
                <Text className="text-base font-medium text-foreground">Invite Code</Text>
                <Text className="text-sm text-muted-foreground">
                  Share this code with others to join
                </Text>
              </View>
            </View>
            <Ionicons 
              name={showCode ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#6B7280" 
            />
          </TouchableOpacity>
          
          {showCode && (
            <View className="px-4 pb-4 border-t border-border">
              <View className="flex-row items-center justify-between bg-muted rounded-lg p-3 mt-3">
                <Text className="text-lg font-mono font-semibold text-foreground tracking-wider">
                  {mockGroupData.inviteCode}
                </Text>
                <TouchableOpacity 
                  className="bg-info px-4 py-2 rounded-lg active:opacity-80"
                  onPress={handleCopyCode}
                >
                  <Text className="text-info-foreground font-medium text-sm">Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Members Section */}
      <View className="px-4 mb-6">
        <Text className="text-sm font-semibold text-muted-foreground uppercase mb-3 tracking-wide">
          Members ({mockGroupData.members.length})
        </Text>
        <View className="bg-card rounded-xl overflow-hidden shadow-sm">
          {mockGroupData.members.map((member, index) => (
            <View 
              key={member.id}
              className={`p-4 flex-row items-center ${
                index !== mockGroupData.members.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              {/* Avatar */}
              <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                member.role === 'admin' ? 'bg-success/20' : 'bg-muted'
              }`}>
                <Text className={`font-semibold ${
                  member.role === 'admin' ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {member.avatar}
                </Text>
              </View>
              
              {/* Member Info */}
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-base font-medium text-foreground">
                    {member.name}
                  </Text>
                  {member.id === mockGroupData.currentUserId && (
                    <Text className="text-xs text-muted-foreground ml-2">(You)</Text>
                  )}
                </View>
                <Text className="text-sm text-muted-foreground">{member.email}</Text>
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
      <View className="px-4 mb-6">
        <Text className="text-sm font-semibold text-muted-foreground uppercase mb-3 tracking-wide">
          Group Stats
        </Text>
        <View className="flex-row gap-3">
          <View className="flex-1 bg-card p-4 rounded-xl items-center shadow-sm">
            <Text className="text-3xl mb-1">🍽️</Text>
            <Text className="text-2xl font-bold text-foreground">24</Text>
            <Text className="text-sm text-muted-foreground">Meals Planned</Text>
          </View>
          <View className="flex-1 bg-card p-4 rounded-xl items-center shadow-sm">
            <Text className="text-3xl mb-1">🛒</Text>
            <Text className="text-2xl font-bold text-foreground">12</Text>
            <Text className="text-sm text-muted-foreground">Grocery Items</Text>
          </View>
        </View>
      </View>

      {/* Danger Zone (Admin only) */}
      {isAdmin && (
        <View className="px-4 mb-8">
          <Text className="text-sm font-semibold text-muted-foreground uppercase mb-3 tracking-wide">
            Danger Zone
          </Text>
          <View className="bg-card rounded-xl overflow-hidden shadow-sm">
            <TouchableOpacity 
              className="p-4 flex-row items-center active:bg-destructive/10"
              onPress={() => Alert.alert('Delete Group', 'Are you sure you want to delete this group? This action cannot be undone.')}
            >
              <View className="w-10 h-10 bg-destructive/10 rounded-lg items-center justify-center mr-3">
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </View>
              <Text className="text-base font-medium text-destructive">Delete Group</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

