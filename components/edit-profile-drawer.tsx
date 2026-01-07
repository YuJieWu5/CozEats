import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Drawer } from '@/components/ui/drawer';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { updateUserName } from '@/lib/api';

interface EditProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function EditProfileDrawer({ open, onClose }: EditProfileDrawerProps) {
  const { user, updateUser: updateAuthUser } = useAuth();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load current user name when drawer opens
  useEffect(() => {
    if (open && user?.name) {
      setName(user.name);
      setError('');
    }
  }, [open, user]);

  const handleSave = async () => {
    // Validate input
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    if (name.trim() === user?.name) {
      setError('No changes made');
      return;
    }

    if (!user?.id) {
      setError('User not found');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call API to update user name
      const updatedUser = await updateUserName(user.id, name.trim());
      
      // Update auth context
      await updateAuthUser(updatedUser);
      
      Alert.alert('Success', 'Profile updated successfully');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError('');
      onClose();
    }
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="Edit Profile"
      size="small"
    >
      <View className="px-4 py-2">
        {/* Name Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2 text-foreground">Name</Text>
          <TextInput
            className="w-full px-4 py-3 border border rounded-lg bg-card text-foreground"
            placeholder="Enter your name"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!isLoading}
          />
        </View>

        {/* Error Message */}
        {error ? (
          <View className="mb-4">
            <Text className="text-destructive text-sm">{error}</Text>
          </View>
        ) : null}

        {/* Save Button */}
        <TouchableOpacity
          className={`w-full bg-info py-3 rounded-lg items-center active:opacity-80 ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-info-foreground font-semibold text-base">
              Save Changes
            </Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          className="w-full py-3 rounded-lg items-center active:opacity-80 mt-2"
          onPress={handleClose}
          disabled={isLoading}
        >
          <Text className="text-muted-foreground font-medium text-base">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </Drawer>
  );
}

