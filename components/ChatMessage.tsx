import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string | Array<{
      type: 'text' | 'image_url';
      text?: string;
      image_url?: {
        url: string;
        detail?: 'low' | 'high' | 'auto';
      };
    }>;
    timestamp: Date;
    imageUri?: string;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const theme = useTheme();
  const isUser = message.role === 'user';

  // Markdown styles for ChatGPT-like formatting
  const markdownStyles = {
    body: {
      color: isUser ? theme.colors.onPrimary : theme.colors.onSurface,
      fontSize: 16,
      lineHeight: 24,
    },
    strong: {
      color: isUser ? theme.colors.onPrimary : theme.colors.primary,
      fontWeight: '600',
    },
    em: {
      color: isUser ? theme.colors.onPrimary : theme.colors.onSurface,
      fontStyle: 'italic',
    },
    list_item: {
      color: isUser ? theme.colors.onPrimary : theme.colors.onSurface,
      fontSize: 16,
      lineHeight: 24,
    },
    ordered_list: {
      color: isUser ? theme.colors.onPrimary : theme.colors.onSurface,
    },
    bullet_list: {
      color: isUser ? theme.colors.onPrimary : theme.colors.onSurface,
    },
    code_inline: {
      backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : theme.colors.surfaceVariant,
      color: isUser ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 14,
    },
    code_block: {
      backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : theme.colors.surfaceVariant,
      color: isUser ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
      padding: 12,
      borderRadius: 8,
      fontSize: 14,
      marginVertical: 8,
    },
    blockquote: {
      backgroundColor: isUser ? 'rgba(255,255,255,0.1)' : theme.colors.surfaceVariant,
      borderLeftWidth: 4,
      borderLeftColor: isUser ? theme.colors.onPrimary : theme.colors.primary,
      paddingLeft: 12,
      paddingVertical: 8,
      marginVertical: 8,
    },
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons 
            name="robot" 
            size={20} 
            color={theme.colors.primary} 
          />
        </View>
      )}
      
      <View 
        style={[
          styles.messageContainer, 
          isUser ? styles.userMessage : styles.assistantMessage,
          isUser ? { backgroundColor: theme.colors.primary } : { backgroundColor: theme.colors.surface }
        ]}
      >
        {isUser ? (
          <View>
            {message.imageUri && (
              <Image 
                source={{ uri: message.imageUri }} 
                style={styles.messageImage}
                resizeMode="cover"
              />
            )}
            <Text 
              style={[
                styles.messageText,
                { color: theme.colors.onPrimary }
              ]}
            >
              {typeof message.content === 'string' ? message.content : 
               Array.isArray(message.content) ? 
                 message.content.find(c => c.type === 'text')?.text || '' : ''}
            </Text>
          </View>
        ) : (
          <Markdown style={markdownStyles}>
            {typeof message.content === 'string' ? message.content : 
             Array.isArray(message.content) ? 
               message.content.find(c => c.type === 'text')?.text || '' : ''}
          </Markdown>
        )}
      </View>

      {isUser && (
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons 
            name="account" 
            size={20} 
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
    marginVertical: 2,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userMessage: {
    marginRight: 8,
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    marginLeft: 8,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    lineHeight: 24,
    fontSize: 16,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
