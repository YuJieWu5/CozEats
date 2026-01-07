import { View, Text, TouchableOpacity } from 'react-native';
import { Drawer } from '@/components/ui/drawer';
import { Ionicons } from '@expo/vector-icons';

interface ThemeSelectorDrawerProps {
  open: boolean;
  onClose: () => void;
  currentTheme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export function ThemeSelectorDrawer({ 
  open, 
  onClose, 
  currentTheme, 
  onThemeChange 
}: ThemeSelectorDrawerProps) {
  const getThemeLabel = (option: string) => {
    return option.charAt(0).toUpperCase() + option.slice(1);
  };

  const handleThemeSelect = (option: 'light' | 'dark' | 'system') => {
    onThemeChange(option);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Select Theme"
      size="small"
    >
      <View className="px-4 py-2">
        {(['light', 'dark', 'system'] as const).map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => handleThemeSelect(option)}
            className="flex-row items-center justify-between p-4 active:bg-accent/50 rounded-lg"
          >
            <Text className="text-base text-foreground">
              {getThemeLabel(option)}
            </Text>
            {currentTheme === option && (
              <Ionicons name="checkmark" size={20} color="#4F46E5" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Drawer>
  );
}

