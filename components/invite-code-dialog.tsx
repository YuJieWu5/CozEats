import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InviteResponse } from '@/lib/api';

interface InviteCodeDialogProps {
  open: boolean;
  onClose: () => void;
  inviteCode: InviteResponse | null;
}

export function InviteCodeDialog({ open, onClose, inviteCode }: InviteCodeDialogProps) {
  const handleCopyCode = async () => {
    if (!inviteCode?.code) return;
    
    await Clipboard.setStringAsync(inviteCode.code);
    Alert.alert('Copied!', 'Invite code copied to clipboard');
  };

  const formatExpiryDate = (expiresAt: string) => {
    const date = new Date(expiresAt);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent showCloseButton={true}>
        <DialogHeader>
          <DialogTitle>Invite Code Generated</DialogTitle>
          <DialogDescription>
            Share this code with others to join the group
          </DialogDescription>
        </DialogHeader>

        <View className="px-6 pb-4">
          {/* Invite Code Display */}
          <View className="bg-info/10 rounded-xl p-6 items-center mb-4">
            <Text className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              Invite Code
            </Text>
            <Text className="text-4xl font-bold text-info tracking-widest mb-3 font-mono">
              {inviteCode?.code}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text className="text-xs text-muted-foreground ml-1">
                Expires: {inviteCode?.expiresAt ? formatExpiryDate(inviteCode.expiresAt) : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Copy Button */}
          <TouchableOpacity
            className="bg-info rounded-lg p-4 flex-row items-center justify-center active:opacity-80"
            onPress={handleCopyCode}
          >
            <Ionicons name="copy-outline" size={20} color="#FFFFFF" />
            <Text className="text-info-foreground font-semibold ml-2">
              Copy Code
            </Text>
          </TouchableOpacity>
        </View>

        <DialogFooter>
          <DialogClose>
            <Button variant="outline" onPress={onClose}>
              <Text className="text-foreground font-semibold">Close</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
