import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Drawer } from '@/components/ui/drawer';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Select, SelectItem } from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';
import { createMeal, MealResponse } from '@/lib/api';

interface CreateMealFormProps {
  open: boolean;
  onClose: () => void;
  onMealCreated: (meal: MealResponse) => void;
  initialDate?: Date;
  groupId: string;
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

const mealTypes: { value: MealType; label: string; emoji: string }[] = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
];

export function CreateMealForm({ open, onClose, onMealCreated, initialDate, groupId }: CreateMealFormProps) {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(initialDate || new Date());
  const [mealName, setMealName] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update date when drawer opens or initialDate changes
  useEffect(() => {
    if (open && initialDate) {
      setDate(initialDate);
    }
  }, [open, initialDate]);

  const handleSubmit = async () => {
    if (!mealName.trim() || !user) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format date at noon local time to avoid timezone issues
      // This ensures the date doesn't shift when converted to UTC
      const dateAtNoon = new Date(date);
      dateAtNoon.setHours(12, 0, 0, 0);
      
      // Call the create meal API
      const newMeal = await createMeal({
        name: mealName.trim(),
        mealType: selectedMealType,
        date: dateAtNoon.toISOString(),
        createdBy: user.id,
        groupId: groupId,
      });

      // Notify parent component of the new meal
      onMealCreated(newMeal);

      // Reset form
      setMealName('');
      setSelectedMealType('breakfast');
      setDate(initialDate || new Date());
      onClose();
      
      Alert.alert('Success', 'Meal added successfully!');
    } catch (error) {
      console.error('Failed to create meal:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create meal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setMealName('');
    setSelectedMealType('breakfast');
    setDate(initialDate || new Date());
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add New Meal"
      size="large"
      avoidKeyboard={true}
    >
      <ScrollView className="flex-1 px-4 py-4">
        {/* Date Picker */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-2">Date</Text>
          <DateTimePicker
            mode="single"
            value={date}
            onValueChange={(value) => {
              if (value instanceof Date) {
                setDate(value);
              }
            }}
            placeholder="Select date"
            size="lg"
          />
        </View>

        {/* Meal Name Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-2">Meal</Text>
          <TextInput
            value={mealName}
            onChangeText={setMealName}
            placeholder="Enter meal name"
            className="w-full h-14 px-4 bg-card border border rounded-xl text-base text-foreground"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Meal Type Selector */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-2">Meal Type</Text>
          <Select
            value={selectedMealType}
            onValueChange={(value) => setSelectedMealType(value as MealType)}
            placeholder="Select meal type"
            size="small"
          >
            {mealTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.emoji} {type.label}
              </SelectItem>
            ))}
          </Select>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-4 mb-6">
          <TouchableOpacity
            onPress={handleCancel}
            className="flex-1 bg-muted p-4 rounded-xl items-center active:scale-98"
          >
            <Text className="text-foreground font-semibold text-base">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!mealName.trim() || isSubmitting}
            className={`flex-1 p-4 rounded-xl items-center active:scale-98 ${
              mealName.trim() && !isSubmitting ? 'bg-info' : 'bg-muted opacity-50'
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text
                className={`font-semibold text-base ${
                  mealName.trim() ? 'text-info-foreground' : 'text-muted-foreground'
                }`}
              >
                Add Meal
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Drawer>
  );
}

