import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { quests } from '@/data/quests';
import { ScenarioQuest } from '@/components/ScenarioQuest';
import { ChecklistQuest } from '@/components/ChecklistQuest';

export default function QuestScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const quest = quests.find(q => q.id === id);

  if (!quest) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <IconButton
            icon={({ size, color }) => <ArrowLeft size={size} color={color} />}
            size={24}
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <Text variant="titleLarge" style={styles.title}>Quest Not Found</Text>
        </View>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            The requested quest could not be found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <IconButton
          icon={({ size, color }) => <ArrowLeft size={size} color={color} />}
          size={24}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text variant="titleLarge" style={styles.title} numberOfLines={2}>
          {quest.title}
        </Text>
      </View>
      <View style={styles.content}>
        {quest.type === 'scenario' && <ScenarioQuest quest={quest} />}
        {quest.type === 'checklist' && <ChecklistQuest quest={quest} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    minHeight: 72,
  },
  backButton: {
    margin: 0,
    marginTop: 4,
  },
  title: {
    flex: 1,
    marginLeft: 8,
    fontWeight: 'bold',
    paddingTop: 4,
    paddingRight: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
}); 