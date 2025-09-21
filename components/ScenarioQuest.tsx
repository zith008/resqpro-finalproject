import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/store/useGameStore';
import { ScenarioQuest as ScenarioQuestType } from '@/data/quests';

interface Props {
  quest: ScenarioQuestType;
}

export function ScenarioQuest({ quest }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { completeQuest, dailyCompletions } = useGameStore((state) => ({
    completeQuest: state.completeQuest,
    dailyCompletions: state.dailyCompletions
  }));

  const handleOptionSelect = async (optionId: string) => {
    setSelectedOption(optionId);
    
    const selectedOptionData = quest.options.find((opt) => opt.id === optionId);
    if (!selectedOptionData) return;

    if (selectedOptionData.correct) {
      // Check if quest was already completed today
      const alreadyCompleted = dailyCompletions[quest.id];
      
      if (!alreadyCompleted) {
        // Only award XP if not already completed
        try {
          const result = await completeQuest(quest.id, quest.xpValue);
          let message = `🎉 Correct! +${quest.xpValue} XP earned!`;
          if (result.levelUp) {
            message += ` Level up! 🎉`;
          }
          setSnackbarMessage(message);
        } catch (error) {
          console.error('Failed to complete quest:', error);
          setSnackbarMessage('🎉 Correct! (Sync error, but quest completed)');
        }
      } else {
        setSnackbarMessage('🎉 Correct! (Already completed today)');
      }
      setShowSnackbar(true);
    } else {
      // For incorrect answer, show explanation
      setSnackbarMessage(selectedOptionData.explanation);
      setShowSnackbar(true);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardContent}>
            <Text 
              variant="titleLarge" 
              style={[styles.question, { color: theme.colors.onSurface }]}
            >
              {quest.title}
            </Text>

            <View style={styles.optionsContainer}>
              {quest.options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleOptionSelect(option.id)}
                  style={[
                    styles.optionButton,
                    { 
                      backgroundColor: selectedOption === option.id 
                        ? theme.colors.primary 
                        : 'transparent',
                      borderColor: theme.colors.outline,
                    }
                  ]}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      { 
                        color: selectedOption === option.id 
                          ? theme.colors.onPrimary 
                          : theme.colors.onSurface 
                      }
                    ]}
                  >
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        style={{ 
          backgroundColor: selectedOption && quest.options.find(opt => opt.id === selectedOption)?.correct 
            ? '#4CAF50' // Green color for success
            : theme.colors.primary 
        }}
      >
        <Text style={{ color: theme.colors.onPrimary, fontWeight: '600' }}>
          {snackbarMessage}
        </Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    elevation: 2,
  },
  cardContent: {
    padding: 20,
  },
  question: {
    fontWeight: 'bold',
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 4,
    width: '100%',
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'left',
    lineHeight: 24,
  },
  snackbar: {
    margin: 16,
    borderRadius: 8,
  },
}); 