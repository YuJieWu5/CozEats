import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CreateMealForm } from '@/components/create-meal-form';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { useAuth } from '@/lib/auth-context';
import { getMeals, getUserGroups, MealResponse, deleteMeal } from '@/lib/api';

const SELECTED_GROUP_KEY = '@cozeats_selected_group';

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
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [meals, setMeals] = useState<MealResponse[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<MealResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Format date to YYYY-MM-DD for API
  const formatDateKey = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };
  
  // Load selected group from AsyncStorage
  const loadSelectedGroup = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const storedGroupId = await AsyncStorage.getItem(SELECTED_GROUP_KEY);
      
      if (storedGroupId) {
        setGroupId(storedGroupId);
      } else {
        // Fallback: load first group if no stored selection
        const groups = await getUserGroups(user.id);
        if (groups.length > 0) {
          const firstGroupId = groups[0].groupId;
          setGroupId(firstGroupId);
          await AsyncStorage.setItem(SELECTED_GROUP_KEY, firstGroupId);
        }
      }
    } catch (error) {
      console.error('Failed to load selected group:', error);
      Alert.alert('Error', 'Failed to load group');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load selected group when component mounts or comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSelectedGroup();
      
      // Set up polling to check for group changes while screen is focused
      const intervalId = setInterval(async () => {
        try {
          const storedGroupId = await AsyncStorage.getItem(SELECTED_GROUP_KEY);
          if (storedGroupId && storedGroupId !== groupId) {
            setGroupId(storedGroupId);
          }
        } catch (err) {
          console.error('Error polling for group changes:', err);
        }
      }, 1000); // Check every second
      
      // Cleanup interval when screen loses focus
      return () => {
        clearInterval(intervalId);
      };
    }, [loadSelectedGroup, groupId])
  );
  
  // Fetch meals when groupId or selectedDate changes
  useEffect(() => {
    const fetchMeals = async () => {
      if (!groupId) return;
      
      try {
        setIsLoadingMeals(true);
        const dateStr = formatDateKey(selectedDate);
        const fetchedMeals = await getMeals(groupId, dateStr);
        setMeals(fetchedMeals);
      } catch (error) {
        console.error('Failed to fetch meals:', error);
        Alert.alert('Error', 'Failed to load meals');
      } finally {
        setIsLoadingMeals(false);
      }
    };
    
    fetchMeals();
  }, [groupId, selectedDate]);
  
  // Group meals by type
  const mealsByType = meals.reduce((acc, meal) => {
    if (!acc[meal.mealType]) {
      acc[meal.mealType] = [];
    }
    acc[meal.mealType].push(meal);
    return acc;
  }, {} as Record<string, MealResponse[]>);

  const handleMealCreated = (newMeal: MealResponse) => {
    // Add the new meal to the list if it's for the selected date
    const mealDate = format(new Date(newMeal.date), 'yyyy-MM-dd');
    const selectedDateStr = formatDateKey(selectedDate);
    
    if (mealDate === selectedDateStr) {
      setMeals(prevMeals => [...prevMeals, newMeal]);
    }
  };

  const handleLongPressMeal = (meal: MealResponse) => {
    setMealToDelete(meal);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!mealToDelete) return;

    try {
      setIsDeleting(true);
      await deleteMeal(mealToDelete.id);
      
      // Remove the meal from local state
      setMeals(prevMeals => prevMeals.filter(m => m.id !== mealToDelete.id));
      
      // Close dialog and clear state
      setDeleteDialogOpen(false);
      setMealToDelete(null);
      
      Alert.alert('Success', 'Meal deleted successfully');
    } catch (error) {
      console.error('Failed to delete meal:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to delete meal');
    } finally {
      setIsDeleting(false);
    }
  };

  // Show loading state while fetching initial data
  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-muted-foreground mt-4">Loading groups...</Text>
      </View>
    );
  }
  
  // Show message if user has no groups
  if (!groupId) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <Text className="text-6xl mb-4">👥</Text>
        <Text className="text-xl font-bold text-foreground mb-2">No Group Found</Text>
        <Text className="text-muted-foreground text-center">
          You need to join or create a group to start planning meals.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Calendar */}
      <View className="bg-card mb-4 shadow-sm">
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
          <Text className="text-xl font-bold text-foreground">
            {format(selectedDate, 'EEEE, MMM d')}
          </Text>
          <View className="flex-row items-center">
            <View className={`w-2 h-2 rounded-full mr-2 ${
              meals.length > 0 ? 'bg-success' : 'bg-muted'
            }`} />
            <Text className="text-sm text-muted-foreground">
              {meals.length} meal{meals.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        
        {isLoadingMeals ? (
          <View className="bg-card p-8 rounded-xl items-center shadow-sm">
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text className="text-muted-foreground mt-2">Loading meals...</Text>
          </View>
        ) : meals.length === 0 ? (
          <View className="bg-card p-8 rounded-xl items-center shadow-sm">
            <Text className="text-6xl mb-3">🍽️</Text>
            <Text className="text-muted-foreground text-center text-base mb-2">
              No meals planned for this day
            </Text>
            <Text className="text-muted-foreground text-center text-sm mb-6 opacity-70">
              Start planning your meals to track your nutrition
            </Text>
            <TouchableOpacity 
              className="bg-info px-6 py-3 rounded-xl shadow-sm active:scale-95"
              onPress={() => setIsDrawerOpen(true)}
            >
              <Text className="text-info-foreground font-semibold text-base">+ Add First Meal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Breakfast Section */}
            {mealsByType.breakfast && (
              <View className="mb-4">
                <View className="flex-row items-center mb-3">
                  <Text className="text-2xl mr-2">{getMealTypeEmoji('breakfast')}</Text>
                  <Text className="text-lg font-semibold text-foreground">
                    {getMealTypeLabel('breakfast')}
                  </Text>
                </View>
                <View className="gap-2">
                  {mealsByType.breakfast.map((meal) => (
                    <TouchableOpacity
                      key={meal.id}
                      className="bg-card p-4 rounded-xl border border shadow-sm active:scale-98"
                      onLongPress={() => handleLongPressMeal(meal)}
                      delayLongPress={500}
                    >
                      <Text className="text-base font-medium text-foreground">
                        {meal.name}
                      </Text>
                      {meal.creatorName && (
                        <Text className="text-sm text-muted-foreground mt-1">
                          by {meal.creatorName}
                        </Text>
                      )}
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
                  <Text className="text-lg font-semibold text-foreground">
                    {getMealTypeLabel('lunch')}
                  </Text>
                </View>
                <View className="gap-2">
                  {mealsByType.lunch.map((meal) => (
                    <TouchableOpacity
                      key={meal.id}
                      className="bg-card p-4 rounded-xl border border shadow-sm active:scale-98"
                      onLongPress={() => handleLongPressMeal(meal)}
                      delayLongPress={500}
                    >
                      <Text className="text-base font-medium text-foreground">
                        {meal.name}
                      </Text>
                      {meal.creatorName && (
                        <Text className="text-sm text-muted-foreground mt-1">
                          by {meal.creatorName}
                        </Text>
                      )}
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
                  <Text className="text-lg font-semibold text-foreground">
                    {getMealTypeLabel('dinner')}
                  </Text>
                </View>
                <View className="gap-2">
                  {mealsByType.dinner.map((meal) => (
                    <TouchableOpacity
                      key={meal.id}
                      className="bg-card p-4 rounded-xl border border shadow-sm active:scale-98"
                      onLongPress={() => handleLongPressMeal(meal)}
                      delayLongPress={500}
                    >
                      <Text className="text-base font-medium text-foreground">
                        {meal.name}
                      </Text>
                      {meal.creatorName && (
                        <Text className="text-sm text-muted-foreground mt-1">
                          by {meal.creatorName}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Add Meal Button */}
            <TouchableOpacity 
              className="bg-info p-4 rounded-xl items-center mt-2 shadow-sm active:scale-98"
              onPress={() => setIsDrawerOpen(true)}
            >
              <Text className="text-info-foreground font-semibold text-base">+ Add Another Meal</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Create Meal Form Drawer */}
      {groupId && (
        <CreateMealForm
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onMealCreated={handleMealCreated}
          initialDate={selectedDate}
          groupId={groupId}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setMealToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Meal?"
        description={`Are you sure you want to delete "${mealToDelete?.name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
        confirmText="Delete"
      />
    </ScrollView>
  );
}