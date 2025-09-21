import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Linking, StatusBar } from 'react-native';
import { Text, Button, Snackbar, useTheme, Card, Switch, Divider, Avatar, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGameStore } from '@/store/useGameStore';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useAIChat } from '@/hooks/useAIChat';
import { useSettingsStore } from '@/store/useSettingsStore';
import { cactusLLMService } from '@/services/cactusLLMService';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const resetStore = useGameStore.persist.clearStorage;
  const { user, signOut } = useAuth();
  const { forceSyncToSupabase, loadFromSupabase, resetAllData, syncXPToSupabase, totalXP, streak, userId } = useGameStore();
  
  // Settings store
  const { useOfflineMode, modelDownloaded, modelLoaded, setUseOfflineMode } = useSettingsStore();
  
  // AI Chat hook for model management
  const { downloadModel, loadModel, checkAndRestoreModelState, isLoading, getModelInfo } = useAIChat();
  

  const handleSignOut = async () => {
    try {
      await signOut();
      setSnackbarMsg('Signed out successfully!');
      setSnackbarVisible(true);
      router.replace('/auth/login');
    } catch (error) {
      setSnackbarMsg('Failed to sign out.');
      setSnackbarVisible(true);
    }
  };

  const handleReset = async () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This will clear both local and cloud data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              // Use the new resetAllData function that clears both local and cloud data
              await resetAllData();
              
              // Also clear AsyncStorage completely to be thorough
              await AsyncStorage.clear();
              
              setSnackbarMsg('All progress reset successfully!');
              setSnackbarVisible(true);
              router.replace('/(tabs)/home');
            } catch (e) {
              console.error('Reset error:', e);
              setSnackbarMsg('Failed to reset progress.');
              setSnackbarVisible(true);
            }
          },
        },
      ]
    );
  };

  const handleSyncToSupabase = async () => {
    try {
      await forceSyncToSupabase();
      setSnackbarMsg('Data synced to Supabase successfully!');
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMsg('Failed to sync data to Supabase');
      setSnackbarVisible(true);
    }
  };

  const handleLoadFromSupabase = async () => {
    try {
      await loadFromSupabase();
      setSnackbarMsg('Data loaded from Supabase successfully!');
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMsg('Failed to load data from Supabase');
      setSnackbarVisible(true);
    }
  };

  const handleDebugReset = async () => {
    Alert.alert(
      'Debug Reset',
      'This will reset all data (local + cloud) for testing purposes.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetAllData();
              setSnackbarMsg('Debug reset completed!');
              setSnackbarVisible(true);
            } catch (error) {
              setSnackbarMsg('Debug reset failed');
              setSnackbarVisible(true);
            }
          },
        },
      ]
    );
  };

  const handleSyncXP = async () => {
    try {
      console.log('🔄 Manual XP sync triggered');
      await syncXPToSupabase();
      setSnackbarMsg('XP synced to Supabase successfully!');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('❌ Manual XP sync failed:', error);
      setSnackbarMsg('Failed to sync XP to Supabase');
      setSnackbarVisible(true);
    }
  };

  const handleTestQuest = () => {
    try {
      console.log('🧪 Testing quest completion...');
      const { completeQuest } = useGameStore.getState();
      completeQuest('test-quest', 25);
      setSnackbarMsg('Test quest completed! Check console for logs.');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('❌ Test quest failed:', error);
      setSnackbarMsg('Test quest failed');
      setSnackbarVisible(true);
    }
  };

  const handleDownloadModel = async () => {
    try {
      await downloadModel();
      setSnackbarMsg('Model downloaded successfully!');
      setSnackbarVisible(true);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to download model.';
      setSnackbarMsg(errorMsg);
      setSnackbarVisible(true);
    }
  };

  const handleLoadModel = async () => {
    try {
      await loadModel();
      setSnackbarMsg('Model loaded successfully!');
      setSnackbarVisible(true);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load model.';
      setSnackbarMsg(errorMsg);
      setSnackbarVisible(true);
    }
  };

  const handleRestoreModel = async () => {
    try {
      await checkAndRestoreModelState();
      setSnackbarMsg('Model state restored!');
      setSnackbarVisible(true);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to restore model state.';
      setSnackbarMsg(errorMsg);
      setSnackbarVisible(true);
    }
  };



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#dd0436' }]} edges={['top']}> 
      <StatusBar barStyle="light-content" backgroundColor="#dd0436" translucent={false} />
      <View style={styles.contentContainer}>
        {/* Header Section */}
        <LinearGradient
          colors={['#dd0436', '#b8002a']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <Avatar.Icon 
              size={80} 
              icon="cog" 
              style={styles.headerAvatar}
            />
            <Text variant="headlineMedium" style={styles.headerTitle}>Settings</Text>
            <Text variant="bodyMedium" style={styles.headerSubtitle}>Configure your ResQ Pro experience</Text>
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* User Account Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="account" size={24} color={theme.colors.primary} />
              <Text variant="titleLarge" style={styles.sectionTitle}>Account</Text>
            </View>
            
            {user ? (
              <View style={styles.userSection}>
                <View style={styles.userInfo}>
                  <MaterialCommunityIcons name="email" size={20} color={theme.colors.onSurface} />
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <Button
                  mode="outlined"
                  onPress={handleSignOut}
                  style={styles.signOutButton}
                  icon="logout"
                >
                  Sign Out
                </Button>
              </View>
            ) : (
              <View style={styles.signInSection}>
                <Text variant="bodyMedium" style={styles.signInPrompt}>
                  Sign in to sync your progress across devices
                </Text>
                <Button
                  mode="contained"
                  onPress={() => router.push('/auth/login')}
                  style={styles.signInButton}
                  buttonColor={theme.colors.primary}
                  icon="login"
                >
                  Sign In / Sign Up
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* AI Model Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="brain" size={24} color={theme.colors.primary} />
              <Text variant="titleLarge" style={styles.sectionTitle}>AI Model Settings</Text>
            </View>

            {/* Online/Offline Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text variant="titleMedium" style={styles.settingTitle}>
                  Offline Mode
                </Text>
                <Text variant="bodySmall" style={styles.settingDescription}>
                  {useOfflineMode 
                    ? 'Using local AI model (privacy-focused)' 
                    : 'Using online AI model (requires internet)'
                  }
                </Text>
              </View>
              <Switch
                value={useOfflineMode}
                onValueChange={setUseOfflineMode}
                color={theme.colors.primary}
              />
            </View>

            <Divider style={styles.divider} />

            {/* Model Status */}
            <View style={styles.modelStatus}>
              <Text variant="titleSmall" style={styles.statusTitle}>
                Model Status
              </Text>
              <View style={styles.statusRow}>
                <MaterialCommunityIcons 
                  name={modelDownloaded ? "check-circle" : "close-circle"} 
                  size={20} 
                  color={modelDownloaded ? theme.colors.primary : theme.colors.error} 
                />
                <Text variant="bodySmall" style={[
                  styles.statusText,
                  { color: modelDownloaded ? theme.colors.primary : theme.colors.error }
                ]}>
                  {modelDownloaded ? 'Downloaded' : 'Not Downloaded'}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <MaterialCommunityIcons 
                  name={modelLoaded ? "check-circle" : "close-circle"} 
                  size={20} 
                  color={modelLoaded ? theme.colors.primary : theme.colors.error} 
                />
                <Text variant="bodySmall" style={[
                  styles.statusText,
                  { color: modelLoaded ? theme.colors.primary : theme.colors.error }
                ]}>
                  {modelLoaded ? 'Loaded' : 'Not Loaded'}
                </Text>
              </View>
            </View>

            {/* Model Management Buttons */}
            <View style={styles.modelButtons}>
              <Button
                mode="outlined"
                onPress={handleDownloadModel}
                disabled={isLoading || modelDownloaded}
                loading={isLoading}
                style={styles.modelButton}
                icon="download"
              >
                {modelDownloaded ? 'Downloaded' : 'Download Model'}
              </Button>
              
              <Button
                mode="outlined"
                onPress={handleLoadModel}
                disabled={isLoading || !modelDownloaded || modelLoaded}
                loading={isLoading}
                style={styles.modelButton}
                icon="upload"
              >
                {modelLoaded ? 'Loaded' : 'Load Model'}
              </Button>
            </View>

            <Button
              mode="outlined"
              onPress={handleRestoreModel}
              disabled={isLoading}
              loading={isLoading}
              style={styles.restoreButton}
              buttonColor={theme.colors.primaryContainer}
              icon="restore"
            >
              Restore Model State
            </Button>

            <Text variant="bodySmall" style={styles.modelInfo}>
              Offline mode uses Qwen 3 1.5B (~1.2GB). Real AI model for emergency preparedness!
            </Text>
          </Card.Content>
        </Card>

        {/* Accessibility Features */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="hand-heart" size={24} color={theme.colors.primary} />
              <Text variant="titleLarge" style={styles.sectionTitle}>Accessibility</Text>
            </View>
            
            <Text variant="bodyMedium" style={styles.sectionDescription}>
              Braille haptic alerts for emergency notifications
            </Text>
            
            <Button
              mode="contained"
              style={styles.accessibilityButton}
              onPress={() => router.push('/(tabs)/alerts')}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              icon="bell-alert"
            >
              Test Braille Alerts
            </Button>
            
            <Text variant="bodySmall" style={styles.description}>
              Go to the Alerts page and use the "Test Alert" button to experience Braille haptic patterns for emergency notifications. Designed for visually impaired and deaf-blind users.
            </Text>
          </Card.Content>
        </Card>

        {/* Danger Zone */}
        <Card style={[styles.card, styles.dangerCard]}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="alert-circle" size={24} color={theme.colors.error} />
              <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.error }]}>
                Danger Zone
              </Text>
            </View>
            
            <Text variant="bodyMedium" style={styles.dangerDescription}>
              This will permanently erase all your progress, XP, badges, and quest completions.
            </Text>
            
            <Button
              mode="contained"
              style={styles.resetButton}
              onPress={handleReset}
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
              icon="delete-forever"
            >
              Reset All Progress
            </Button>
          </Card.Content>
        </Card>

        {/* Debug Section - Only show if user is logged in */}
        {user && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="bug" size={24} color={theme.colors.primary} />
                <Text variant="titleLarge" style={styles.sectionTitle}>Debug Tools</Text>
              </View>
              
              <Text variant="bodyMedium" style={styles.sectionDescription}>
                Current State: Level {Math.floor(totalXP / 100)}, {totalXP} XP, {streak} day streak
              </Text>
              <Text variant="bodySmall" style={styles.sectionDescription}>
                User ID: {userId || 'Not logged in'}
              </Text>
              
              <View style={styles.buttonRow}>
                <Button
                  mode="outlined"
                  style={[styles.debugButton, { flex: 1, marginRight: 4 }]}
                  onPress={handleSyncToSupabase}
                  icon="cloud-upload"
                >
                  Sync All
                </Button>
                <Button
                  mode="outlined"
                  style={[styles.debugButton, { flex: 1, marginHorizontal: 4 }]}
                  onPress={handleLoadFromSupabase}
                  icon="cloud-download"
                >
                  Load from Cloud
                </Button>
                <Button
                  mode="outlined"
                  style={[styles.debugButton, { flex: 1, marginLeft: 4 }]}
                  onPress={handleSyncXP}
                  icon="star"
                  buttonColor="#4caf50"
                  textColor="#ffffff"
                >
                  Sync XP
                </Button>
              </View>
              <View style={styles.buttonRow}>
                <Button
                  mode="outlined"
                  style={[styles.debugButton, { flex: 1, marginRight: 4 }]}
                  onPress={handleDebugReset}
                  icon="refresh"
                  buttonColor="#ff9800"
                  textColor="#ffffff"
                >
                  Debug Reset
                </Button>
                <Button
                  mode="outlined"
                  style={[styles.debugButton, { flex: 1, marginLeft: 4 }]}
                  onPress={handleTestQuest}
                  icon="test-tube"
                  buttonColor="#9c27b0"
                  textColor="#ffffff"
                >
                  Test Quest
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* About Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="account-circle" size={24} color={theme.colors.primary} />
              <Text variant="titleLarge" style={styles.sectionTitle}>About This Project</Text>
            </View>
            
            <View style={styles.aboutContent}>
              <View style={styles.developerInfo}>
                <Avatar.Text 
                  size={60} 
                  label="FM" 
                  style={styles.developerAvatar}
                />
                <View style={styles.developerDetails}>
                  <Text variant="titleMedium" style={styles.developerName}>Fazith Mohamed</Text>
                  <Text variant="bodyMedium" style={styles.developerRole}>BSc Computer Science Student</Text>
                  <Text variant="bodySmall" style={styles.developerUni}>University of London</Text>
                </View>
              </View>
              
              <Text variant="bodyMedium" style={styles.projectDescription}>
                <Text style={styles.boldText}>ResQ Pro</Text> is my final year project for BSc Computer Science. 
                This innovative emergency preparedness app combines gamification, AI coaching, and accessibility features 
                to help users learn vital survival skills through an engaging, interactive experience.
              </Text>
              
              <View style={styles.projectFeatures}>
                <Text variant="titleSmall" style={styles.featuresTitle}>Key Features:</Text>
                <View style={styles.featureList}>
                  <View style={styles.featureItem}>
                    <MaterialCommunityIcons name="gamepad-variant" size={16} color={theme.colors.primary} />
                    <Text variant="bodySmall" style={styles.featureText}>Gamified Learning Experience</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <MaterialCommunityIcons name="robot" size={16} color={theme.colors.primary} />
                    <Text variant="bodySmall" style={styles.featureText}>AI-Powered Emergency Coach</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <MaterialCommunityIcons name="hand-heart" size={16} color={theme.colors.primary} />
                    <Text variant="bodySmall" style={styles.featureText}>Braille Haptic Alerts</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <MaterialCommunityIcons name="bell-alert" size={16} color={theme.colors.primary} />
                    <Text variant="bodySmall" style={styles.featureText}>Real-time Emergency Notifications</Text>
                  </View>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
        </ScrollView>
      </View>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Text style={{ color: theme.colors.onPrimary }}>{snackbarMsg}</Text>
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  
  // Header Styles
  headerGradient: {
    paddingTop: 0,
    paddingBottom: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerAvatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  
  // Card Styles
  card: {
    elevation: 2,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  dangerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  
  // Section Styles
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  sectionDescription: {
    marginBottom: 16,
    color: '#666',
    lineHeight: 20,
  },
  
  // About Section Styles
  aboutContent: {
    marginTop: 8,
  },
  developerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  developerAvatar: {
    backgroundColor: '#dd0436',
    marginRight: 16,
  },
  developerDetails: {
    flex: 1,
  },
  developerName: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  developerRole: {
    color: '#666',
    marginBottom: 2,
  },
  developerUni: {
    color: '#888',
    fontStyle: 'italic',
  },
  projectDescription: {
    lineHeight: 22,
    marginBottom: 20,
    color: '#555',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#dd0436',
  },
  projectFeatures: {
    marginTop: 16,
  },
  featuresTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    color: '#666',
  },
  
  // User Section Styles
  userSection: {
    marginTop: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  userEmail: {
    marginLeft: 8,
    color: '#666',
    flex: 1,
  },
  signInSection: {
    marginTop: 8,
  },
  signInPrompt: {
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  signOutButton: {
    marginTop: 8,
  },
  signInButton: {
    marginTop: 8,
  },
  
  // Setting Styles
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  settingDescription: {
    color: '#666',
    lineHeight: 18,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#e0e0e0',
  },
  
  // Model Status Styles
  modelStatus: {
    marginBottom: 16,
  },
  statusTitle: {
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  modelButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  modelButton: {
    flex: 1,
  },
  restoreButton: {
    marginBottom: 12,
  },
  modelInfo: {
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  
  // Button Styles
  accessibilityButton: {
    marginBottom: 12,
  },
  resetButton: {
    marginTop: 16,
  },
  debugButton: {
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  description: {
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  dangerDescription: {
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
}); 