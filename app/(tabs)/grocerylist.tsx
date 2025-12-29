import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { CreateGroceryForm } from '@/components/create-grocery-form';

// Mock grocery data
const mockGroceryItems = [
  { id: 1, name: 'Chicken Breast', checked: false },
  { id: 2, name: 'Romaine Lettuce', checked: true },
  { id: 3, name: 'Tomatoes', checked: false },
  { id: 4, name: 'Salmon Fillet', checked: false },
  { id: 5, name: 'Olive Oil', checked: true },
  { id: 6, name: 'Brown Rice', checked: false },
  { id: 7, name: 'Greek Yogurt', checked: false },
];

export default function GroceryScreen() {
  const [items, setItems] = useState(mockGroceryItems);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleItem = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleAddItem = (item: { name: string }) => {
    // TODO: Add item to the data store
    console.log('Adding item:', item);
    // For now, this will just log. You can integrate with your data management later
  };

  const uncheckedCount = items.filter(item => !item.checked).length;

  return (
    <View className="flex-1 bg-background">
      {/* Header Stats */}
      <View className="bg-card px-4 py-6">
        <Text className="text-2xl font-bold text-foreground mb-2">
          Grocery List
        </Text>
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-info rounded-full mr-2" />
            <Text className="text-muted-foreground">
              {uncheckedCount} items left
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-success rounded-full mr-2" />
            <Text className="text-muted-foreground">
              {items.length - uncheckedCount} completed
            </Text>
          </View>
        </View>
      </View>

      {/* Grocery Items */}
      <ScrollView className="flex-1 px-4 py-4">
        <View className="bg-card rounded-lg overflow-hidden mb-6">
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleItem(item.id)}
              className="p-4 flex-row items-center"
            >
              {/* Checkbox */}
              <View className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
                item.checked 
                  ? 'bg-success border-success' 
                  : 'border-muted bg-card'
              }`}>
                {item.checked && (
                  <Text className="text-success-foreground font-bold text-sm">✓</Text>
                )}
              </View>

              {/* Item Name */}
              <View className="flex-1">
                <Text className={`text-base font-medium ${
                  item.checked ? 'text-muted-foreground line-through' : 'text-foreground'
                }`}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Item Button */}
        <TouchableOpacity 
          className="bg-info p-4 rounded-lg items-center mb-6"
          onPress={() => setIsDrawerOpen(true)}
        >
          <Text className="text-info-foreground font-semibold text-lg">+ Add Item</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Create Grocery Form Drawer */}
      <CreateGroceryForm
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleAddItem}
      />
    </View>
  );
}