import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, StatusBar } from 'react-native';
import { Text, Card, Chip, Button, useTheme, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle } from 'lucide-react-native';
import { emergencyAlerts, EmergencyAlert } from '@/data/emergencyAlerts';
import { HapticFeedback, getHapticForSeverity, getHapticForType } from '@/utils/haptics';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export default function AlertsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);

  useEffect(() => {
    loadAlerts();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: location.coords.latitude,
        lon: location.coords.longitude
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadAlerts = () => {
    // Filter active alerts and sort by severity
    const activeAlerts = emergencyAlerts
      .filter(alert => alert.isActive)
      .sort((a, b) => {
        const severityOrder = { emergency: 0, warning: 1, watch: 2, advisory: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });
    
    setAlerts(activeAlerts);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAlerts();
    getCurrentLocation();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'emergency': return '#FF3B30';
      case 'warning': return '#FF9500';
      case 'watch': return '#FFCC00';
      case 'advisory': return '#007AFF';
      default: return '#8E8E93';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'emergency': return '🚨';
      case 'warning': return '⚠️';
      case 'watch': return '👁️';
      case 'advisory': return 'ℹ️';
      default: return '📢';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flood': return '🌊';
      case 'tornado': return '🌪️';
      case 'hurricane': return '🌀';
      case 'earthquake': return '🌍';
      case 'wildfire': return '🔥';
      case 'severe-weather': return '⛈️';
      default: return '⚠️';
    }
  };

  const simulateNearbyEmergency = async () => {
    if (!userLocation) {
      HapticFeedback.error();
      alert('Location not available. Please enable location services.');
      return;
    }

    // Initial haptic feedback when button is pressed
    HapticFeedback.selection();

    // Check if user is in any alert polygon
    const nearbyAlerts = alerts.filter(alert => {
      if (alert.location.polygon) {
        return pointInPolygon([userLocation.lat, userLocation.lon], alert.location.polygon);
      }
      return false;
    });

    if (nearbyAlerts.length > 0) {
      // Trigger notification for the most severe alert
      const mostSevereAlert = nearbyAlerts[0];
      
      // Trigger haptic feedback based on alert type and severity
      getHapticForType(mostSevereAlert.type)();
      setTimeout(() => getHapticForSeverity(mostSevereAlert.severity)(), 500);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${getSeverityIcon(mostSevereAlert.severity)} ${mostSevereAlert.title}`,
          body: mostSevereAlert.description,
          data: { alertId: mostSevereAlert.id },
        },
        trigger: null, // Show immediately
      });

      alert(`🚨 Emergency Alert Triggered!\n\n${mostSevereAlert.title}\n\n${mostSevereAlert.description}`);
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

      alert('🚨 Simulated Emergency Alert!\n\nSevere weather approaching your area. Take shelter immediately.');
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#dd0436' }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#dd0436" />
      
      {/* Header Banner */}
      <LinearGradient
        colors={['#dd0436', '#b8002a']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <AlertTriangle size={24} color="#ffffff" />
            </View>
            <View style={styles.titleContainer}>
              <Text variant="headlineMedium" style={styles.headerTitle}>Emergency Alerts</Text>
              <Text variant="bodyMedium" style={styles.headerSubtitle}>
                {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {alerts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text style={styles.emptyIcon}>✅</Text>
              <Text variant="headlineSmall" style={styles.emptyTitle}>
                All Clear
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                No active emergency alerts in your area.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} style={styles.alertCard}>
              <Card.Content>
                <View style={styles.alertHeader}>
                  <View style={styles.alertTitleRow}>
                    <Text style={styles.alertIcon}>
                      {getTypeIcon(alert.type)} {getSeverityIcon(alert.severity)}
                    </Text>
                    <Text variant="titleMedium" style={styles.alertTitle}>
                      {alert.title}
                    </Text>
                  </View>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getSeverityColor(alert.severity) }}
                    style={[styles.severityChip, { borderColor: getSeverityColor(alert.severity) }]}
                  >
                    {alert.severity.toUpperCase()}
                  </Chip>
                </View>

                <Text variant="bodyMedium" style={styles.alertDescription}>
                  {alert.description}
                </Text>

                <View style={styles.alertLocation}>
                  <Text variant="bodySmall" style={styles.locationText}>
                    📍 {alert.location.name}
                  </Text>
                </View>

                <View style={styles.instructionsContainer}>
                  <Text variant="titleSmall" style={styles.instructionsTitle}>
                    What to do:
                  </Text>
                  {alert.instructions.map((instruction, index) => (
                    <Text key={index} variant="bodySmall" style={styles.instruction}>
                      • {instruction}
                    </Text>
                  ))}
                </View>

                <View style={styles.alertFooter}>
                  <Text variant="bodySmall" style={styles.expiresText}>
                    Expires: {new Date(alert.expiresAt).toLocaleString()}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon="bell-alert"
        style={styles.fab}
        onPress={simulateNearbyEmergency}
        label="Test Alert"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 0,
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyCard: {
    marginTop: 40,
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#34C759',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
  alertCard: {
    marginBottom: 16,
    elevation: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  alertTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  severityChip: {
    marginLeft: 8,
  },
  alertDescription: {
    marginBottom: 12,
    lineHeight: 20,
  },
  alertLocation: {
    marginBottom: 12,
  },
  locationText: {
    color: '#666',
  },
  instructionsContainer: {
    marginBottom: 12,
  },
  instructionsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  instruction: {
    marginBottom: 4,
    lineHeight: 18,
    color: '#555',
  },
  alertFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    paddingTop: 12,
  },
  expiresText: {
    color: '#666',
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF3B30',
  },
});