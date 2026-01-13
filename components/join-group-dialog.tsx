import { View, Text, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { joinGroupWithInvite } from '@/lib/api';

interface JoinGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (groupName: string) => void;
}

export function JoinGroupDialog({ open, onClose, onSuccess }: JoinGroupDialogProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      return;
    }

    try {
      setLoading(true);
      
      // Get userId from AsyncStorage
      const userJson = await AsyncStorage.getItem('@cozeats_user');
      if (!userJson) {
        Alert.alert('Error', 'User not found. Please log in again.');
        return;
      }
      
      const user = JSON.parse(userJson);
      if (!user.id) {
        Alert.alert('Error', 'Invalid user data. Please log in again.');
        return;
      }
      
      // Call join group API
      const response = await joinGroupWithInvite({
        code: inviteCode.trim().toUpperCase(),
        userId: user.id,
      });
      
      // Reset form
      setInviteCode('');
      
      // Show success message
      Alert.alert('Success', `You have successfully joined ${response.groupName}!`);
      
      onSuccess(response.groupName);
    } catch (err) {
      console.error('Failed to join group:', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setInviteCode('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent showCloseButton={true}>
        <DialogHeader>
          <DialogTitle>Join Group</DialogTitle>
        </DialogHeader>

        {/* Invite Code Input */}
        <View className="px-6 py-4">
          <Text className="text-sm font-semibold text-foreground mb-2">Invite Code</Text>
          <TextInput
            value={inviteCode}
            onChangeText={setInviteCode}
            placeholder="Enter invite code"
            className="w-full h-12 px-4 bg-card border border-border rounded-lg text-base text-foreground uppercase font-mono tracking-widest"
            placeholderTextColor="#9ca3af"
            autoFocus
            autoCapitalize="characters"
            maxLength={6}
            editable={!loading}
          />
          <Text className="text-xs text-muted-foreground mt-2">
            Enter the 6-character invite code shared by a group member
          </Text>
        </View>

        <DialogFooter>
          <Button
            variant="outline"
            onPress={handleCancel}
            disabled={loading}
          >
            <Text className="text-foreground font-semibold">Cancel</Text>
          </Button>

          <Button
            onPress={handleJoin}
            disabled={inviteCode.trim().length !== 6 || loading}
            className={inviteCode.trim().length !== 6 || loading ? 'opacity-50' : ''}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text className="text-primary-foreground font-semibold">Join</Text>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
