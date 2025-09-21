import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Modal, 
  Portal, 
  Card, 
  Text, 
  Button, 
  Switch, 
  useTheme,
  IconButton,
  Chip,
  Divider
} from 'react-native-paper';
import { 
  brailleHapticService, 
  BRAILLE_PATTERNS, 
  getBrailleDotVisualization,
  type BraillePattern 
} from '@/services/brailleHapticService';
import { sendTestBrailleNotification } from '@/services/notificationBrailleService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface BraillePracticeModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export function BraillePracticeModal({ visible, onDismiss }: BraillePracticeModalProps) {
  const theme = useTheme();
  const [isEnabled, setIsEnabled] = useState(brailleHapticService.isBrailleHapticsEnabled());
  const [selectedPattern, setSelectedPattern] = useState<string>('sos');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleEnabled = async (value: boolean) => {
    if (value) {
      await brailleHapticService.enableBrailleHaptics();
    } else {
      await brailleHapticService.disableBrailleHaptics();
    }
    setIsEnabled(value);
  };

  const handlePlayPattern = async (patternKey: string) => {
    if (isPlaying) {
      // Stop current pattern if playing
      brailleHapticService.stopCurrentPattern();
      setIsPlaying(false);
      return;
    }
    
    setIsPlaying(true);
    try {
      await brailleHapticService.playPracticePattern(patternKey);
    } catch (error) {
      Alert.alert('Error', 'Failed to play Braille pattern');
    } finally {
      setIsPlaying(false);
    }
  };

  const handleTestAllPatterns = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      await brailleHapticService.testAllPatterns();
    } catch (error) {
      Alert.alert('Error', 'Failed to test patterns');
    } finally {
      setIsPlaying(false);
    }
  };

  const handleTestNotification = async (type: 'sos' | 'evacuation') => {
    try {
      if (type === 'sos') {
        await sendTestBrailleNotification(
          'sos',
          'Emergency Alert',
          'This is a test SOS emergency alert',
          'critical'
        );
      } else {
        await sendTestBrailleNotification(
          'evacuation',
          'Evacuation Notice',
          'This is a test evacuation alert',
          'high'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const handleTestBasicVibration = async () => {
    try {
      await brailleHapticService.testVibration();
    } catch (error) {
      Alert.alert('Error', 'Failed to test vibration');
    }
  };

  const renderBrailleCell = (pattern: BraillePattern) => {
    const brailleVisualization = getBrailleDotVisualization(pattern.dots);
    
    return (
      <View style={styles.brailleCell}>
        <Text style={[styles.brailleText, { color: theme.colors.onSurface }]}>
          {brailleVisualization}
        </Text>
      </View>
    );
  };

  const renderPatternCard = (patternKey: string, pattern: BraillePattern) => {
    const isSelected = selectedPattern === patternKey;
    
    return (
      <Card 
        key={patternKey}
        style={[
          styles.patternCard, 
          { 
            backgroundColor: theme.colors.surface,
            borderColor: isSelected ? theme.colors.primary : 'transparent',
            borderWidth: isSelected ? 2 : 0
          }
        ]}
        onPress={() => setSelectedPattern(patternKey)}
      >
        <Card.Content style={styles.patternContent}>
          <View style={styles.patternHeader}>
            <View style={styles.patternInfo}>
              <Text variant="titleMedium" style={styles.patternName}>
                {pattern.name}
              </Text>
              <Text variant="bodySmall" style={[styles.patternDescription, { color: theme.colors.onSurfaceVariant }]}>
                {pattern.description}
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={() => handlePlayPattern(patternKey)}
              disabled={!isEnabled}
              compact
              style={styles.playButton}
            >
              <MaterialCommunityIcons 
                name={isPlaying && selectedPattern === patternKey ? "stop" : "play"} 
                size={16} 
                color="#ffffff" 
              />
            </Button>
          </View>
          
          <View style={styles.brailleContainer}>
            {renderBrailleCell(pattern)}
          </View>
          
          <View style={styles.patternDetails}>
            <Chip 
              icon="dots-horizontal" 
              compact
              style={styles.dotsChip}
            >
              {pattern.dots.length} dots
            </Chip>
            <Chip 
              icon="vibrate" 
              compact
              style={styles.vibrationChip}
            >
              {pattern.vibrationPattern.length} pulses
            </Chip>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.background }]}
        style={styles.modal}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialCommunityIcons 
              name="hand-heart" 
              size={24} 
              color={theme.colors.primary} 
            />
            <Text variant="headlineSmall" style={styles.title}>
              Braille Haptic Alerts
            </Text>
          </View>
          <IconButton
            icon="close"
            onPress={onDismiss}
            size={24}
          />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Enable/Disable Toggle */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text variant="titleMedium">Enable Braille Haptics</Text>
                <Text variant="bodySmall" style={[styles.toggleDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Receive emergency alerts through Braille vibration patterns
                </Text>
              </View>
              <Switch
                value={isEnabled}
                onValueChange={handleToggleEnabled}
              />
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsSection}>
            <Text variant="titleMedium" style={styles.instructionsTitle}>
              How It Works
            </Text>
            <Text variant="bodyMedium" style={[styles.instructionsText, { color: theme.colors.onSurfaceVariant }]}>
              • Each emergency alert has a unique Braille pattern{'\n'}
              • Patterns are transmitted through vibration sequences{'\n'}
              • Learn the patterns by practicing with the examples below{'\n'}
              • Critical alerts repeat multiple times for emphasis
            </Text>
            
            {/* Test Basic Vibration */}
            <Button
              mode="outlined"
              onPress={handleTestBasicVibration}
              style={styles.testVibrationButton}
              icon="vibrate"
            >
              Test Basic Vibration
            </Button>
          </View>

          {/* Example Patterns */}
          <Text variant="titleMedium" style={styles.patternsTitle}>
            Example Alert Patterns
          </Text>
          <Text variant="bodySmall" style={[styles.exampleDescription, { color: theme.colors.onSurfaceVariant }]}>
            Try these examples to feel how Braille haptic alerts work:
          </Text>

          {/* SOS Example */}
          {renderPatternCard('sos', BRAILLE_PATTERNS.sos)}
          <View style={styles.testNotificationButtons}>
            <Button
              mode="outlined"
              onPress={() => handleTestNotification('sos')}
              style={styles.testNotificationButton}
              icon="bell"
            >
              Test SOS Notification
            </Button>
          </View>
          
          {/* Evacuation Example */}
          {renderPatternCard('evacuation', BRAILLE_PATTERNS.evacuation)}
          <View style={styles.testNotificationButtons}>
            <Button
              mode="outlined"
              onPress={() => handleTestNotification('evacuation')}
              style={styles.testNotificationButton}
              icon="bell"
            >
              Test Evacuation Notification
            </Button>
          </View>

          {/* Accessibility Note */}
          <View style={[styles.accessibilitySection, { backgroundColor: theme.colors.primaryContainer }]}>
            <View style={styles.accessibilityHeader}>
              <MaterialCommunityIcons 
                name="accessibility" 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text variant="titleSmall" style={[styles.accessibilityTitle, { color: theme.colors.primary }]}>
                Accessibility Feature
              </Text>
            </View>
            <Text variant="bodySmall" style={[styles.accessibilityText, { color: theme.colors.onPrimaryContainer }]}>
              This feature is designed to help visually impaired and deaf-blind users receive emergency alerts through tactile feedback, making emergency information accessible to everyone.
            </Text>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    margin: 20,
    maxHeight: '85%',
    width: '90%',
    borderRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  toggleSection: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  instructionsSection: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  accessibilitySection: {
    marginTop: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleDescription: {
    marginTop: 4,
  },
  instructionsTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  instructionsText: {
    lineHeight: 20,
    marginBottom: 16,
  },
  testVibrationButton: {
    marginTop: 8,
  },
  testAllButton: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  patternsTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  exampleDescription: {
    marginBottom: 16,
    lineHeight: 18,
  },
  patternCard: {
    marginBottom: 12,
    elevation: 2,
  },
  patternContent: {
    padding: 16,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patternInfo: {
    flex: 1,
    marginRight: 12,
  },
  patternName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  patternDescription: {
    lineHeight: 16,
  },
  playButton: {
    minWidth: 40,
  },
  brailleContainer: {
    alignItems: 'center',
    marginVertical: 12,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  brailleCell: {
    alignItems: 'center',
  },
  brailleText: {
    fontFamily: 'monospace',
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  patternDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dotsChip: {
    marginRight: 8,
  },
  vibrationChip: {
    marginLeft: 8,
  },
  accessibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  accessibilityTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  accessibilityText: {
    lineHeight: 18,
  },
  testNotificationButtons: {
    marginBottom: 16,
    alignItems: 'center',
  },
  testNotificationButton: {
    marginTop: 8,
  },
});
