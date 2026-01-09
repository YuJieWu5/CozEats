import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Drawer } from '@/components/ui/drawer';
import { createGrocery } from '@/lib/api';

interface CreateGroceryFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  groupId: string | null;
}

export function CreateGroceryForm({ open, onClose, onSuccess, groupId }: CreateGroceryFormProps) {
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!itemName.trim()) {
      return;
    }

    if (!groupId) {
      Alert.alert('Error', 'No group selected');
      return;
    }

    try {
      setLoading(true);
      await createGrocery({
        item: itemName.trim(),
        groupId: groupId,
      });

      // Reset form
      setItemName('');
      onSuccess();
    } catch (err) {
      console.error('Failed to create grocery:', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create grocery item');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setItemName('');
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add Grocery Item"
      size="small"
      avoidKeyboard={true}
    >
      <ScrollView className="flex-1 px-4 py-4">
        {/* Item Name Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-2">Item</Text>
          <TextInput
            value={itemName}
            onChangeText={setItemName}
            placeholder="Enter item name"
            className="w-full h-14 px-4 bg-card border border rounded-xl text-base text-foreground"
            placeholderTextColor="#9ca3af"
            autoFocus
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-4 mb-6">
          <TouchableOpacity
            onPress={handleCancel}
            disabled={loading}
            className="flex-1 bg-muted p-4 rounded-xl items-center active:scale-98"
          >
            <Text className="text-foreground font-semibold text-base">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!itemName.trim() || loading}
            className={`flex-1 p-4 rounded-xl items-center active:scale-98 ${
              itemName.trim() && !loading ? 'bg-info' : 'bg-muted opacity-50'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text
                className={`font-semibold text-base ${
                  itemName.trim() ? 'text-info-foreground' : 'text-muted-foreground'
                }`}
              >
                Add
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Drawer>
  );
}

