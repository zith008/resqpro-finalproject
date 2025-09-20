import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { HapticFeedback } from '@/utils/haptics';

interface HapticDemoProps {
  visible: boolean;
  onClose: () => void;
}

export function HapticDemo({ visible, onClose }: HapticDemoProps) {
  const theme = useTheme();

  if (!visible) return null;

  const hapticButtons = [
    { label: 'Emergency', action: () => HapticFeedback.emergency(), color: '#FF3B30' },
    { label: 'Warning', action: () => HapticFeedback.warning(), color: '#FF9500' },
    { label: 'Watch', action: () => HapticFeedback.watch(), color: '#FFCC00' },
    { label: 'Advisory', action: () => HapticFeedback.advisory(), color: '#007AFF' },
    { label: 'Success', action: () => HapticFeedback.success(), color: '#34C759' },
    { label: 'Error', action: () => HapticFeedback.error(), color: '#FF3B30' },
    { label: 'Selection', action: () => HapticFeedback.selection(), color: '#8E8E93' },
    { label: 'Earthquake', action: () => HapticFeedback.earthquake(), color: '#8B4513' },
    { label: 'Tornado', action: () => HapticFeedback.tornado(), color: '#4A4A4A' },
    { label: 'Flood', action: () => HapticFeedback.flood(), color: '#007AFF' },
    { label: 'Wildfire', action: () => HapticFeedback.wildfire(), color: '#FF4500' },
    { label: 'Critical Emergency', action: () => HapticFeedback.criticalEmergency(), color: '#8B0000' },
  ];

  return (
    <View style={styles.overlay}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            🎮 Haptic Feedback Demo
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Test different vibration patterns
          </Text>

          <View style={styles.buttonGrid}>
            {hapticButtons.map((button, index) => (
              <Button
                key={index}
                mode="contained"
                onPress={button.action}
                style={[styles.hapticButton, { backgroundColor: button.color }]}
                textColor="#FFFFFF"
                compact
              >
                {button.label}
              </Button>
            ))}
          </View>

          <Button
            mode="outlined"
            onPress={onClose}
            style={styles.closeButton}
          >
            Close Demo
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    margin: 20,
    maxWidth: 400,
    width: '90%',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  hapticButton: {
    width: '48%',
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 8,
  },
});
