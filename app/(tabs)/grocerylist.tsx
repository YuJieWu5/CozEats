import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateGroceryForm } from '@/components/create-grocery-form';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { useAuth } from '@/lib/auth-context';
import { getGroceries, updateGrocery, getUserGroups, deleteAllGroceries, deleteGrocery, GroceryResponse } from '@/lib/api';

const SELECTED_GROUP_KEY = '@cozeats_selected_group';

export default function GroceryScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<GroceryResponse[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load selected group from AsyncStorage
  const loadSelectedGroup = useCallback(async () => {
    try {
      const storedGroupId = await AsyncStorage.getItem(SELECTED_GROUP_KEY);
      
      if (storedGroupId) {
        setGroupId(storedGroupId);
      } else if (user) {
        // Fallback: load first group if no stored selection
        const groups = await getUserGroups(user.id);
        if (groups.length > 0) {
          const firstGroupId = groups[0].groupId;
          setGroupId(firstGroupId);
          await AsyncStorage.setItem(SELECTED_GROUP_KEY, firstGroupId);
        } else {
          setError('No groups found. Please create or join a group first.');
          setLoading(false);
        }
      }
    } catch (err) {
      console.error('Failed to load selected group:', err);
      setError('Failed to load group');
      setLoading(false);
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

  const fetchGroceries = useCallback(async () => {
    if (!groupId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const groceries = await getGroceries(groupId);
      setItems(groceries);
    } catch (err) {
      console.error('Failed to fetch groceries:', err);
      setError(err instanceof Error ? err.message : 'Failed to load groceries');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // Fetch groceries when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (groupId) {
        fetchGroceries();
      }
    }, [groupId, fetchGroceries])
  );

  const toggleItem = async (groceryId: string, currentCompleted: boolean) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to update items');
      return;
    }

    // Only allow marking as completed (not uncompleting)
    if (currentCompleted) {
      return;
    }

    try {
      // Optimistically update the UI
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === groceryId ? { ...item, completed: true, completedBy: user.id } : item
        )
      );

      // Update on server
      await updateGrocery(groceryId, { userId: user.id });
    } catch (err) {
      console.error('Failed to update grocery:', err);
      Alert.alert('Error', 'Failed to update grocery item');
      // Revert optimistic update
      fetchGroceries();
    }
  };

  const handleAddItem = () => {
    // This will be handled by the CreateGroceryForm
    // After successful creation, we'll refresh the list
    setIsDrawerOpen(true);
  };

  const handleGroceryCreated = () => {
    // Refresh the list after creating a new item
    fetchGroceries();
    setIsDrawerOpen(false);
  };

  const handleDeleteItem = async (groceryId: string, event?: any) => {
    // Stop event propagation to prevent triggering the parent TouchableOpacity
    event?.stopPropagation?.();

    try {
      // Optimistically remove from UI
      setItems(prevItems => prevItems.filter(item => item.id !== groceryId));

      // Delete on server
      await deleteGrocery(groceryId);
    } catch (err) {
      console.error('Failed to delete grocery:', err);
      Alert.alert('Error', 'Failed to delete grocery item');
      // Refresh to revert optimistic update
      fetchGroceries();
    }
  };

  const handleDeleteAll = async () => {
    if (!groupId) {
      Alert.alert('Error', 'No group selected');
      return;
    }

    try {
      setIsDeleting(true);
      await deleteAllGroceries(groupId);
      
      // Clear the items list
      setItems([]);
      setDeleteDialogOpen(false);
      
      Alert.alert('Success', 'All grocery items have been deleted');
    } catch (err) {
      console.error('Failed to delete all groceries:', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to delete all grocery items');
    } finally {
      setIsDeleting(false);
    }
  };

  const uncheckedCount = items.filter(item => !item.completed).length;

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-muted-foreground mt-4">Loading groceries...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-destructive text-lg font-semibold mb-2">Error</Text>
        <Text className="text-muted-foreground text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={fetchGroceries}
          className="bg-info px-6 py-3 rounded-lg"
        >
          <Text className="text-info-foreground font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        {items.length === 0 ? (
          <View className="bg-card rounded-lg p-8 items-center mb-6">
            <Text className="text-muted-foreground text-center">
              No grocery items yet. Add your first item to get started!
            </Text>
          </View>
        ) : (
          <View className="bg-card rounded-lg overflow-hidden mb-6">
            {items.map((item, index) => (
              <View key={item.id} className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => toggleItem(item.id, item.completed)}
                  className="flex-1 p-4 flex-row items-center"
                  disabled={item.completed}
                >
                  {/* Checkbox */}
                  <View className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
                    item.completed 
                      ? 'bg-success border-success' 
                      : 'border-muted bg-card'
                  }`}>
                    {item.completed && (
                      <Text className="text-success-foreground font-bold text-sm">✓</Text>
                    )}
                  </View>

                  {/* Item Name */}
                  <View className="flex-1">
                    <Text className={`text-base font-medium ${
                      item.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}>
                      {item.item}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                  onPress={(e) => handleDeleteItem(item.id, e)}
                  className="p-4 items-center justify-center"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <View className="w-6 h-6 items-center justify-center">
                    <Text className="text-destructive font-bold text-lg">−</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Add Item Button */}
        <TouchableOpacity 
          className="bg-info p-4 rounded-lg items-center mb-3"
          onPress={handleAddItem}
        >
          <Text className="text-info-foreground font-semibold text-lg">+ Add Item</Text>
        </TouchableOpacity>

        {/* Delete All Button */}
        {items.length > 0 && (
          <TouchableOpacity 
            className="bg-destructive p-4 rounded-lg items-center mb-6"
            onPress={() => setDeleteDialogOpen(true)}
          >
            <Text className="text-destructive-foreground font-semibold text-lg">Delete All</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Create Grocery Form Drawer */}
      <CreateGroceryForm
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSuccess={handleGroceryCreated}
        groupId={groupId}
      />

      {/* Delete All Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteAll}
        title="Delete All Groceries?"
        description="This will permanently delete all grocery items in your list. This action cannot be undone."
        isDeleting={isDeleting}
        confirmText="Delete All"
      />
    </View>
  );
}