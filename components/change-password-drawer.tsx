import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Drawer } from '@/components/ui/drawer';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { changePassword } from '@/lib/api';

interface ChangePasswordDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ChangePasswordDrawer({ open, onClose }: ChangePasswordDrawerProps) {
  const { user, updateUser: updateAuthUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    if (!user?.id) {
      setError('User not found');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call API to change password (backend will verify current password)
      const updatedUser = await changePassword(user.id, currentPassword, newPassword);
      
      // Update auth context
      await updateAuthUser(updatedUser);
      
      Alert.alert('Success', 'Password changed successfully');
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to change password';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      onClose();
    }
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="Change Password"
      size="medium"
    >
      <View className="px-4 py-2">
        {/* Current Password Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2 text-foreground">Current Password</Text>
          <TextInput
            className="w-full px-4 py-3 border border rounded-lg bg-card text-foreground"
            placeholder="Enter current password"
            placeholderTextColor="#9ca3af"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        {/* New Password Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2 text-foreground">New Password</Text>
          <TextInput
            className="w-full px-4 py-3 border border rounded-lg bg-card text-foreground"
            placeholder="Enter new password"
            placeholderTextColor="#9ca3af"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            editable={!isLoading}
          />
          <Text className="text-xs text-muted-foreground mt-1">
            Must be at least 6 characters
          </Text>
        </View>

        {/* Confirm Password Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2 text-foreground">Re-enter New Password</Text>
          <TextInput
            className="w-full px-4 py-3 border border rounded-lg bg-card text-foreground"
            placeholder="Re-enter new password"
            placeholderTextColor="#9ca3af"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
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
              Change Password
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

