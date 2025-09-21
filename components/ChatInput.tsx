import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const theme = useTheme();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          placeholder="Ask about emergency preparedness..."
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
          disabled={disabled}
          style={styles.textInput}
          outlineStyle={styles.outline}
          right={
            <TextInput.Icon
              icon="send"
              onPress={handleSend}
              disabled={!message.trim() || disabled}
              iconColor={message.trim() && !disabled ? theme.colors.primary : theme.colors.onSurfaceDisabled}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    minHeight: 44,
  },
  outline: {
    borderRadius: 22,
    borderWidth: 1,
  },
});
