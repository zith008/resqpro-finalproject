import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const theme = useTheme();
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons 
            name="robot" 
            size={24} 
            color={theme.colors.primary} 
          />
        </View>
      )}
      
      <Card 
        style={[
          styles.messageCard, 
          isUser ? styles.userMessage : styles.assistantMessage,
          isUser ? { backgroundColor: theme.colors.primary } : { backgroundColor: theme.colors.surface }
        ]}
      >
        <Card.Content style={styles.messageContent}>
          <Text 
            variant="bodyMedium" 
            style={[
              styles.messageText,
              isUser ? { color: theme.colors.onPrimary } : { color: theme.colors.onSurface }
            ]}
          >
            {message.content}
          </Text>
        </Card.Content>
      </Card>

      {isUser && (
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons 
            name="account" 
            size={24} 
            color={theme.colors.primary} 
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  messageCard: {
    maxWidth: '75%',
    elevation: 1,
    borderRadius: 18,
  },
  userMessage: {
    marginRight: 8,
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    marginLeft: 8,
    borderBottomLeftRadius: 4,
  },
  messageContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  messageText: {
    lineHeight: 22,
    fontSize: 16,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 2,
    elevation: 1,
  },
});
