import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Drawer } from '@/components/ui/drawer';

interface CreateGroceryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: { name: string }) => void;
}

export function CreateGroceryForm({ open, onClose, onSubmit }: CreateGroceryFormProps) {
  const [itemName, setItemName] = useState('');

  const handleSubmit = () => {
    if (!itemName.trim()) {
      return;
    }

    onSubmit({
      name: itemName.trim(),
    });

    // Reset form
    setItemName('');
    onClose();
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
          <Text className="text-sm font-semibold text-gray-700 mb-2">Item</Text>
          <TextInput
            value={itemName}
            onChangeText={setItemName}
            placeholder="Enter item name"
            className="w-full h-14 px-4 bg-white border border-gray-300 rounded-xl text-base text-gray-800"
            placeholderTextColor="#9ca3af"
            autoFocus
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-4 mb-6">
          <TouchableOpacity
            onPress={handleCancel}
            className="flex-1 bg-gray-100 p-4 rounded-xl items-center active:scale-98"
          >
            <Text className="text-gray-700 font-semibold text-base">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!itemName.trim()}
            className={`flex-1 p-4 rounded-xl items-center active:scale-98 ${
              itemName.trim() ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <Text
              className={`font-semibold text-base ${
                itemName.trim() ? 'text-white' : 'text-gray-500'
              }`}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Drawer>
  );
}

