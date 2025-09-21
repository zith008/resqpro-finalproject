import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Dimensions, StatusBar } from 'react-native';
import { Text, Card, Snackbar, useTheme, Button } from 'react-native-paper';
import { Flame, Shield, Target, AlertTriangle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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
    
    // Set status bar style for this screen
    StatusBar.setBarStyle('light-content', true);
    StatusBar.setBackgroundColor('#dd0436', true);
    
    // Cleanup function to reset status bar when leaving screen
    return () => {
      StatusBar.setBarStyle('dark-content', true);
      StatusBar.setBackgroundColor('#ffffff', true);
    };
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

  const handleQuestComplete = async (questId: string, xpValue: number) => {
    try {
      const result = await completeQuest(questId, xpValue);
      
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
    } catch (error) {
      console.error('Failed to complete quest:', error);
      // Still show success message even if sync failed
      setSnackbarMessage(`+${xpValue} XP earned! (Sync error, but quest completed)`);
      setSnackbarVisible(true);
      HapticFeedback.selection();
    }
  };

  const currentLevel = getLevel();
  const xpProgress = getXPProgress();
  const currentHour = dayjs().hour();
  const greeting = currentHour < 12 ? 'Good Morning' : 
                   currentHour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Debug logging
  console.log('Home Screen Debug:', {
    questsCount: quests.length,
    dailyCompletions: Object.keys(dailyCompletions).length,
    totalXP,
    currentLevel,
    journeyProgress: useGameStore.getState().journeyProgress
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#dd0436' }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#dd0436" translucent={false} />
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#dd0436', '#b8002a']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text variant="headlineMedium" style={styles.greeting}>
                {greeting}!
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                Ready to build your emergency preparedness?
              </Text>
            </View>
            {streak > 0 && (
              <View style={styles.streakContainer}>
                <Flame size={24} color="#ffba00" />
                <Text variant="titleMedium" style={styles.streakText}>
                  {streak}-day streak
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* XP Progress Section */}
        <Card style={styles.progressCard}>
          <Card.Content style={styles.progressContent}>
            <View style={styles.progressHeader}>
              <Target size={24} color="#dd0436" />
              <Text variant="titleLarge" style={styles.progressTitle}>
                Your Progress
              </Text>
            </View>
            <View style={styles.progressRingContainer}>
              <XPProgressRing 
                progress={xpProgress}
                level={currentLevel}
                size={100}
              />
              <View style={styles.progressInfo}>
                <Text variant="headlineSmall" style={styles.levelText}>
                  Level {currentLevel}
                </Text>
                <Text variant="bodyMedium" style={styles.xpText}>
                  {totalXP % 100}/100 XP to next level
                </Text>
                <Text variant="bodySmall" style={styles.totalXpText}>
                  {totalXP} total XP
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Journey Map */}
        <Card style={styles.journeyMapCard}>
          <Card.Content style={styles.journeyMapContent}>
            <View style={styles.journeyMapHeader}>
              <Target size={24} color="#dd0436" />
              <Text variant="titleLarge" style={styles.journeyMapTitle}>
                Your Preparedness Journey
              </Text>
            </View>
            <Text variant="bodyMedium" style={styles.journeyMapSubtitle}>
              Track your progress through different disaster preparedness milestones
            </Text>
            <View style={styles.journeyMapContainer}>
              <JourneyMapCurved />
            </View>
          </Card.Content>
        </Card>

        {/* Today's Quests */}
        <Card style={styles.questsCard}>
          <Card.Content style={styles.questsContent}>
            <View style={styles.questsHeader}>
              <Shield size={24} color="#dd0436" />
              <Text variant="titleLarge" style={styles.questsTitle}>
                Today's Quests
              </Text>
            </View>
            <Text variant="bodyMedium" style={styles.questsSubtitle}>
              Complete these tasks to build your emergency preparedness skills
            </Text>
            
            <View style={styles.questsList}>
              {quests.length > 0 ? quests.map(quest => (
                <QuestItem
                  key={quest.id}
                  quest={quest}
                  completed={dailyCompletions[quest.id] || false}
                  onComplete={() => handleQuestComplete(quest.id, quest.xpValue)}
                />
              )) : (
                <Text style={{ textAlign: 'center', color: '#666', padding: 20 }}>
                  No quests available
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Emergency Simulation */}
        <Card style={styles.emergencyCard}>
          <Card.Content style={styles.emergencyContent}>
            <View style={styles.emergencyHeader}>
              <AlertTriangle size={24} color="#b8002a" />
              <Text variant="titleLarge" style={styles.emergencyTitle}>
                Emergency Demo
              </Text>
            </View>
            <Text variant="bodyMedium" style={styles.emergencySubtitle}>
              Test location-based emergency alerts and see how the system responds to real-world scenarios
            </Text>
            
            <Button
              mode="contained"
              onPress={simulateNearbyEmergency}
              loading={simulating}
              disabled={simulating}
              buttonColor="#b8002a"
              textColor="#FFFFFF"
              style={styles.emergencyButton}
              icon="bell-alert"
              contentStyle={styles.emergencyButtonContent}
            >
              {simulating ? 'Simulating...' : 'Test Emergency Alert'}
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    minHeight: '100%',
  },
  headerGradient: {
    paddingTop: 0,
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#ffffff',
    opacity: 0.9,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 16,
  },
  streakText: {
    color: '#ffffff',
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: '600',
    marginLeft: 6,
  },
  progressCard: {
    marginHorizontal: 16,
    marginTop: -10,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  progressContent: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    color: '#2c3e50',
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    marginLeft: 8,
  },
  progressRingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressInfo: {
    flex: 1,
    marginLeft: 16,
  },
  levelText: {
    color: '#dd0436',
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    marginBottom: 4,
  },
  xpText: {
    color: '#666',
    marginBottom: 2,
    fontFamily: 'Poppins_400Regular',
  },
  totalXpText: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  questsCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  questsContent: {
    padding: 16,
  },
  questsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  questsTitle: {
    color: '#2c3e50',
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    marginLeft: 8,
  },
  questsSubtitle: {
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular',
  },
  questsList: {
    gap: 12,
  },
  emergencyCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#b8002a',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  emergencyContent: {
    padding: 16,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyTitle: {
    color: '#2c3e50',
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    marginLeft: 8,
  },
  emergencySubtitle: {
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular',
  },
  emergencyButton: {
    borderRadius: 12,
  },
  emergencyButtonContent: {
    paddingVertical: 8,
  },
  journeyMapCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  journeyMapContent: {
    padding: 16,
  },
  journeyMapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  journeyMapTitle: {
    color: '#2c3e50',
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
    marginLeft: 8,
  },
  journeyMapSubtitle: {
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular',
  },
  journeyMapContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    overflow: 'hidden',
  },
});