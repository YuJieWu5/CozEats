import { View, Text, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createGroup } from '@/lib/api';

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateGroupDialog({ open, onClose, onSuccess }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!groupName.trim()) {
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
      
      // Call create group API
      await createGroup({
        userId: user.id,
        groupName: groupName.trim(),
      });
      
      // Reset form
      setGroupName('');
      onSuccess();
    } catch (err) {
      console.error('Failed to create group:', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setGroupName('');
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create Group</AlertDialogTitle>
        </AlertDialogHeader>

        {/* Group Name Input */}
        <View className="px-6 py-4">
          <Text className="text-sm font-semibold text-foreground mb-2">Group Name</Text>
          <TextInput
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name"
            className="w-full h-12 px-4 bg-card border border-border rounded-lg text-base text-foreground"
            placeholderTextColor="#9ca3af"
            autoFocus
            editable={!loading}
          />
        </View>

        <AlertDialogFooter>
          <AlertDialogCancel>
            <Button
              variant="outline"
              onPress={handleCancel}
              disabled={loading}
            >
              <Text className="text-foreground font-semibold">Cancel</Text>
            </Button>
          </AlertDialogCancel>

          <AlertDialogAction>
            <Button
              onPress={handleCreate}
              disabled={!groupName.trim() || loading}
              className={!groupName.trim() || loading ? 'opacity-50' : ''}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text className="text-primary-foreground font-semibold">Create</Text>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
