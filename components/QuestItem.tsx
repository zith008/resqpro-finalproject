import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { CheckCircle2, Circle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Quest } from '@/data/quests';

interface QuestItemProps {
  quest: Quest;
  completed: boolean;
  onComplete: () => void;
}

export function QuestItem({ quest, completed, onComplete }: QuestItemProps) {
  const theme = useTheme();
  const router = useRouter();

  const handlePress = () => {
    router.push(`/quest/${quest.id}`);
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { backgroundColor: theme.colors.surfaceVariant }
      ]}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <View style={styles.leftContent}>
          {completed ? (
            <CheckCircle2 size={24} color={theme.colors.primary} />
          ) : (
            <Circle size={24} color={theme.colors.onSurfaceVariant} />
          )}
          <View style={styles.textContainer}>
            <Text 
              variant="titleMedium" 
              style={[
                styles.title,
                completed && { textDecorationLine: 'line-through' }
              ]}
            >
              {quest.title}
            </Text>
            <Text 
              variant="bodySmall" 
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {quest.xpValue} XP
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 6,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins_500Medium',
    fontWeight: '500',
  },
});