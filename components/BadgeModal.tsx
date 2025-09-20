import React from 'react';
import { View, Modal } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { Award } from 'lucide-react-native';
import { Badge } from '@/data/badges';

interface BadgeModalProps {
  visible: boolean;
  badge: Badge | null;
  onDismiss: () => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ 
  visible, 
  badge, 
  onDismiss 
}) => {
  const theme = useTheme();

  if (!badge) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}>
        <Card style={{ 
          width: '100%', 
          maxWidth: 300,
          backgroundColor: theme.colors.surface
        }}>
          <Card.Content style={{ 
            alignItems: 'center', 
            padding: 24 
          }}>
            <View style={{
              backgroundColor: theme.colors.primaryContainer,
              borderRadius: 50,
              padding: 20,
              marginBottom: 16
            }}>
              <Award 
                size={48} 
                color={theme.colors.primary} 
              />
            </View>
            
            <Text 
              variant="headlineSmall" 
              style={{ 
                textAlign: 'center',
                marginBottom: 8,
                fontWeight: 'bold',
                color: theme.colors.primary
              }}
            >
              Badge Unlocked!
            </Text>
            
            <Text 
              variant="titleMedium" 
              style={{ 
                textAlign: 'center',
                marginBottom: 8,
                fontWeight: '600'
              }}
            >
              {badge.title}
            </Text>
            
            <Text 
              variant="bodyMedium" 
              style={{ 
                textAlign: 'center',
                color: theme.colors.onSurfaceVariant,
                marginBottom: 24
              }}
            >
              {badge.description}
            </Text>
            
            <Button 
              mode="contained" 
              onPress={onDismiss}
              style={{ minWidth: 120 }}
            >
              Awesome!
            </Button>
          </Card.Content>
        </Card>
      </View>
    </Modal>
  );
};