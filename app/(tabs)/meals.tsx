import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CreateMealForm } from '@/components/create-meal-form';

// Mock data for meals with new format: [id, name, mealType]
const mockMeals: Record<string, Array<{ id: number; name: string; mealType: 'breakfast' | 'lunch' | 'dinner' }>> = {
  '2025-12-18': [
    { id: 1, name: 'Breakfast Burrito', mealType: 'breakfast' },
    { id: 2, name: 'Grilled Chicken Salad', mealType: 'lunch' },
    { id: 3, name: 'Salmon with Veggies', mealType: 'dinner' },
  ],
  '2025-12-19': [
    { id: 4, name: 'Oatmeal with Berries', mealType: 'breakfast' },
    { id: 5, name: 'Turkey Sandwich', mealType: 'lunch' },
    { id: 6, name: 'Pasta Primavera', mealType: 'dinner' },
  ],
  '2025-12-20': [
    { id: 7, name: 'Greek Yogurt Parfait', mealType: 'breakfast' },
    { id: 8, name: 'Chicken Caesar Wrap', mealType: 'lunch' },
  ],
  '2025-12-16': [
    { id: 9, name: 'Avocado Toast', mealType: 'breakfast' },
    { id: 10, name: 'Quinoa Bowl', mealType: 'lunch' },
    { id: 11, name: 'Stir Fry Noodles', mealType: 'dinner' },
  ],
};

const getMealTypeEmoji = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
  switch (mealType) {
    case 'breakfast':
      return '🌅';
    case 'lunch':
      return '☀️';
    case 'dinner':
      return '🌙';
    default:
      return '🍽️';
  }
};

const getMealTypeLabel = (mealType: string) => {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
};

export default function MealsScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date('2025-12-18'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Format date to YYYY-MM-DD for lookup
  const formatDateKey = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };
  
  // Get meals for selected date
  const dateKey = formatDateKey(selectedDate);
  const mealsForDate = mockMeals[dateKey] || [];
  
  // Group meals by type
  const mealsByType = mealsForDate.reduce((acc, meal) => {
    if (!acc[meal.mealType]) {
      acc[meal.mealType] = [];
    }
    acc[meal.mealType].push(meal);
    return acc;
  }, {} as Record<string, typeof mealsForDate>);

  // Highlight dates with meals
  const datesWithMeals = Object.keys(mockMeals).map(dateStr => new Date(dateStr));

  const handleAddMeal = (meal: { date: Date; name: string; mealType: 'breakfast' | 'lunch' | 'dinner' }) => {
    // TODO: Add meal to the data store
    console.log('Adding meal:', meal);
    // For now, this will just log. You can integrate with your data management later
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Calendar */}
      <View className="bg-white mb-4 shadow-sm">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date instanceof Date) {
              setSelectedDate(date);
            }
          }}
          className="border-0"
          showOutsideDays={true}
          enableQuickMonthYear={true}
        />
      </View>

      {/* Meals List */}
      <View className="px-4 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-gray-800">
            {format(selectedDate, 'EEEE, MMM d')}
          </Text>
          <View className="flex-row items-center">
            <View className={`w-2 h-2 rounded-full mr-2 ${
              mealsForDate.length > 0 ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <Text className="text-sm text-gray-600">
              {mealsForDate.length} meal{mealsForDate.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        
        {mealsForDate.length === 0 ? (
          <View className="bg-white p-8 rounded-xl items-center shadow-sm">
            <Text className="text-6xl mb-3">🍽️</Text>
            <Text className="text-gray-500 text-center text-base mb-2">
              No meals planned for this day
            </Text>
            <Text className="text-gray-400 text-center text-sm mb-6">
              Start planning your meals to track your nutrition
            </Text>
            <TouchableOpacity 
              className="bg-blue-600 px-6 py-3 rounded-xl shadow-sm active:scale-95"
              onPress={() => setIsDrawerOpen(true)}
            >
              <Text className="text-white font-semibold text-base">+ Add First Meal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Breakfast Section */}
            {mealsByType.breakfast && (
              <View className="mb-4">
                <View className="flex-row items-center mb-3">
                  <Text className="text-2xl mr-2">{getMealTypeEmoji('breakfast')}</Text>
                  <Text className="text-lg font-semibold text-gray-700">
                    {getMealTypeLabel('breakfast')}
                  </Text>
                </View>
                <View className="gap-2">
                  {mealsByType.breakfast.map((meal) => (
                    <TouchableOpacity
                      key={meal.id}
                      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm active:scale-98"
                    >
                      <Text className="text-base font-medium text-gray-800">
                        {meal.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Lunch Section */}
            {mealsByType.lunch && (
              <View className="mb-4">
                <View className="flex-row items-center mb-3">
                  <Text className="text-2xl mr-2">{getMealTypeEmoji('lunch')}</Text>
                  <Text className="text-lg font-semibold text-gray-700">
                    {getMealTypeLabel('lunch')}
                  </Text>
                </View>
                <View className="gap-2">
                  {mealsByType.lunch.map((meal) => (
                    <TouchableOpacity
                      key={meal.id}
                      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm active:scale-98"
                    >
                      <Text className="text-base font-medium text-gray-800">
                        {meal.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Dinner Section */}
            {mealsByType.dinner && (
              <View className="mb-4">
                <View className="flex-row items-center mb-3">
                  <Text className="text-2xl mr-2">{getMealTypeEmoji('dinner')}</Text>
                  <Text className="text-lg font-semibold text-gray-700">
                    {getMealTypeLabel('dinner')}
                  </Text>
                </View>
                <View className="gap-2">
                  {mealsByType.dinner.map((meal) => (
                    <TouchableOpacity
                      key={meal.id}
                      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm active:scale-98"
                    >
                      <Text className="text-base font-medium text-gray-800">
                        {meal.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Add Meal Button */}
            <TouchableOpacity 
              className="bg-blue-600 p-4 rounded-xl items-center mt-2 shadow-sm active:scale-98"
              onPress={() => setIsDrawerOpen(true)}
            >
              <Text className="text-white font-semibold text-base">+ Add Another Meal</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Create Meal Form Drawer */}
      <CreateMealForm
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleAddMeal}
        initialDate={selectedDate}
      />
    </ScrollView>
  );
}