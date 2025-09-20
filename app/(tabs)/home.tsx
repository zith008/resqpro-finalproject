import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Snackbar, useTheme, Button } from 'react-native-paper';
import { Flame } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '@/store/useGameStore';
import { XPProgressRing } from '@/components/XPProgressRing';
import { QuestItem } from '@/components/QuestItem';
import { BadgeModal } from '@/components/BadgeModal';
import { JourneyMapCurved } from '@/components/JourneyMapCurved';
import { quests } from '@/data/quests';
import { Badge } from '@/data/badges';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { emergencyAlerts } from '@/data/emergencyAlerts';
import { HapticFeedback, getHapticForSeverity, getHapticForType } from '@/utils/haptics';
import dayjs from 'dayjs';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { 
    totalXP, 
    streak, 
    dailyCompletions, 
    completeQuest, 
    checkAndUpdateStreak,
    getLevel,
    getXPProgress
  } = useGameStore();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [badgeModalVisible, setBadgeModalVisible] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    checkAndUpdateStreak();
  }, []);

  const simulateNearbyEmergency = async () => {
    setSimulating(true);
    
    // Initial haptic feedback when button is pressed
    HapticFeedback.selection();
    
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        HapticFeedback.error();
        Alert.alert('Permission Required', 'Location permission is needed to simulate emergency alerts.');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const userLat = location.coords.latitude;
      const userLon = location.coords.longitude;

      // Check if user is in any alert polygon
      const nearbyAlerts = emergencyAlerts.filter(alert => {
        if (alert.location.polygon) {
          return pointInPolygon([userLat, userLon], alert.location.polygon);
        }
        return false;
      });

      if (nearbyAlerts.length > 0) {
        // User is in an alert area - trigger real alert
        const mostSevereAlert = nearbyAlerts[0];
        
        // Trigger haptic feedback based on alert type and severity
        getHapticForType(mostSevereAlert.type)();
        setTimeout(() => getHapticForSeverity(mostSevereAlert.severity)(), 500);
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `🚨 ${mostSevereAlert.title}`,
            body: mostSevereAlert.description,
            data: { alertId: mostSevereAlert.id },
          },
          trigger: null,
        });

        Alert.alert(
          '🚨 Emergency Alert!',
          `${mostSevereAlert.title}\n\n${mostSevereAlert.description}\n\nCheck the Alerts tab for more details.`,
          [
            { text: 'View Alerts', onPress: () => router.push('/(tabs)/alerts') },
            { text: 'OK' }
          ]
        );
      } else {
        // Simulate a nearby emergency
        // Trigger emergency haptic pattern
        HapticFeedback.emergency();
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🚨 Emergency Alert',
            body: 'Severe weather approaching your area. Take shelter immediately.',
            data: { alertId: 'simulated' },
          },
          trigger: null,
        });

        Alert.alert(
          '🚨 Simulated Emergency!',
          'Severe weather is approaching your area. This is a simulation for demonstration purposes.\n\nIn a real emergency, you would receive this alert and should follow safety instructions.',
          [
            { text: 'View Alerts', onPress: () => router.push('/(tabs)/alerts') },
            { text: 'OK' }
          ]
        );
      }
    } catch (error) {
      console.error('Error simulating emergency:', error);
      HapticFeedback.error();
      Alert.alert('Error', 'Failed to simulate emergency alert. Please try again.');
    } finally {
      setSimulating(false);
    }
  };

  // Point in polygon function
  const pointInPolygon = (point: [number, number], polygon: [number, number][]): boolean => {
    const [x, y] = point;
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      
      if (intersect) inside = !inside;
    }
    
    return inside;
  };

  const handleQuestComplete = (questId: string, xpValue: number) => {
    const result = completeQuest(questId, xpValue);
    
    // Trigger haptic feedback for quest completion
    if (result.levelUp) {
      HapticFeedback.success(); // Success haptic for level up
    } else {
      HapticFeedback.selection(); // Light haptic for regular completion
    }
    
    // Show XP gain message
    let message = `+${xpValue} XP earned!`;
    if (result.levelUp) {
      message += ` Level up! 🎉`;
    }
    setSnackbarMessage(message);
    setSnackbarVisible(true);

    // Show badge modal if new badge unlocked
    if (result.newBadges.length > 0) {
      setNewBadge(result.newBadges[0]); // Show first new badge
      setBadgeModalVisible(true);
    }
  };

  const currentLevel = getLevel();
  const xpProgress = getXPProgress();
  const currentHour = dayjs().hour();
  const greeting = currentHour < 12 ? 'Good Morning' : 
                   currentHour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>
            {greeting}!
          </Text>
          {streak > 0 && (
            <View style={styles.streakContainer}>
              <Flame size={20} color={theme.colors.secondary} />
              <Text 
                variant="titleMedium" 
                style={{ 
                  color: theme.colors.secondary,
                  fontWeight: '600',
                  marginLeft: 4
                }}
              >
                {streak}-day streak
              </Text>
            </View>
          )}
        </View>

        {/* XP Progress Ring */}
        <View style={styles.progressContainer}>
          <XPProgressRing 
            progress={xpProgress}
            level={currentLevel}
            size={140}
          />
          <Text 
            variant="bodyLarge" 
            style={{ 
              marginTop: 12,
              color: theme.colors.onSurfaceVariant,
              textAlign: 'center'
            }}
          >
            {totalXP % 100}/100 XP to next level
          </Text>
        </View>

        {/* Journey Map */}
        <JourneyMapCurved />

        {/* Today's Quests */}
        <Card style={styles.questsCard}>
          <Card.Content>
            <Text 
              variant="titleLarge" 
              style={{ 
                fontWeight: 'bold',
                marginBottom: 16,
                color: theme.colors.onSurface
              }}
            >
              Today's Quests
            </Text>
            
            {quests.map(quest => (
              <QuestItem
                key={quest.id}
                quest={quest}
                completed={dailyCompletions[quest.id] || false}
                onComplete={() => handleQuestComplete(quest.id, quest.xpValue)}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Emergency Simulation */}
        <Card style={styles.emergencyCard}>
          <Card.Content>
            <Text 
              variant="titleLarge" 
              style={{ 
                fontWeight: 'bold',
                marginBottom: 8,
                color: theme.colors.onSurface
              }}
            >
              🚨 Emergency Demo
            </Text>
            <Text 
              variant="bodyMedium" 
              style={{ 
                marginBottom: 16,
                color: theme.colors.onSurfaceVariant
              }}
            >
              Test location-based emergency alerts
            </Text>
            
            <Button
              mode="contained"
              onPress={simulateNearbyEmergency}
              loading={simulating}
              disabled={simulating}
              buttonColor="#FF3B30"
              textColor="#FFFFFF"
              style={styles.emergencyButton}
              icon="bell-alert"
            >
              {simulating ? 'Simulating...' : 'Simulate Nearby Emergency'}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Snackbar for XP notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Text style={{ color: theme.colors.onPrimary, fontWeight: '600' }}>
          {snackbarMessage}
        </Text>
      </Snackbar>

      {/* Badge unlock modal */}
      <BadgeModal
        visible={badgeModalVisible}
        badge={newBadge}
        onDismiss={() => {
          setBadgeModalVisible(false);
          setNewBadge(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  questsCard: {
    margin: 20,
    marginTop: 10,
  },
  emergencyCard: {
    margin: 20,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  emergencyButton: {
    marginTop: 8,
  },
});