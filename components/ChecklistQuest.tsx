import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox, Text, Card, Button, Snackbar, useTheme } from 'react-native-paper';
import { ChecklistQuest as ChecklistQuestType } from '@/data/quests';
import { useGameStore } from '@/store/useGameStore';
import { useRouter } from 'expo-router';

type Props = {
  quest: ChecklistQuestType;
  onFinish?: () => void;
};

export const ChecklistQuest: React.FC<Props> = ({ quest, onFinish }) => {
  const theme = useTheme();
  const router = useRouter();
  const { completeQuest } = useGameStore();

  const [checks, setChecks] = useState<boolean[]>(
    Array.from<boolean>({ length: quest.steps.length }).fill(false)
  );
  const [snackbar, setSnackbar] = useState<{ visible: boolean; msg: string }>({
    visible: false,
    msg: '',
  });

  const toggle = (idx: number) => {
    setChecks(prev => {
      const newChecks = [...prev];
      newChecks[idx] = !newChecks[idx];
      return newChecks;
    });
  };

  const allDone = checks.every(c => c);

  const handleFinish = () => {
    const result = completeQuest(quest.id, quest.xpValue);
    let msg = `🎉 Quest complete! +${quest.xpValue} XP`;
    if (result.levelUp) msg += ' Level up!';
    setSnackbar({ visible: true, msg });

    setTimeout(() => router.replace('/(tabs)/home'), 2500);
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title={quest.title} titleVariant="titleLarge" />
        <Card.Content>
          {quest.steps.map((step, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.row}
              onPress={() => toggle(idx)}
              activeOpacity={0.7}
            >
              <Checkbox
                status={checks[idx] ? 'checked' : 'unchecked'}
                onPress={() => toggle(idx)}
              />
              <Text 
                variant="bodyLarge"
                style={[
                  styles.stepText,
                  checks[idx] && { textDecorationLine: 'line-through' }
                ]}
              >
                {step}
              </Text>
            </TouchableOpacity>
          ))}

          <Button
            mode="contained"
            style={styles.finishButton}
            onPress={handleFinish}
            disabled={!allDone}
          >
            Finish Quest
          </Button>
        </Card.Content>
      </Card>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
        style={{ backgroundColor: '#4CAF50' }}
      >
        <Text style={{ color: theme.colors.onPrimary }}>{snackbar.msg}</Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 8,
    paddingVertical: 4,
  },
  stepText: {
    marginLeft: 8,
    flex: 1,
  },
  finishButton: {
    marginTop: 24,
  },
}); 