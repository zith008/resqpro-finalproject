import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

interface QuickSuggestionsProps {
  onSuggestionPress: (suggestion: string) => void;
  disabled?: boolean;
}

const suggestions = [
  "What should I include in my emergency kit?",
  "How do I create an evacuation plan?",
  "What should I do during a power outage?",
  "How do I prepare for severe weather?"
];

export function QuickSuggestions({ onSuggestionPress, disabled = false }: QuickSuggestionsProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          mode="outlined"
          onPress={() => onSuggestionPress(suggestion)}
          disabled={disabled}
          style={styles.suggestionButton}
          textColor={theme.colors.primary}
          compact
        >
          {suggestion}
        </Button>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  suggestionButton: {
    marginBottom: 4,
    borderRadius: 20,
  },
});
