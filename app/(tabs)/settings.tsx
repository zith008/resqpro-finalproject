import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, Snackbar, useTheme, Card, Switch, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGameStore } from '@/store/useGameStore';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useAIChat } from '@/hooks/useAIChat';
import { useSettingsStore } from '@/store/useSettingsStore';
import { HapticDemo } from '@/components/HapticDemo';
import { cactusLLMService } from '@/services/cactusLLMService';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [hapticDemoVisible, setHapticDemoVisible] = useState(false);
  const resetStore = useGameStore.persist.clearStorage;
  const { user, signOut } = useAuth();
  
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
      'Are you sure you want to reset all your progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              if (resetStore) await resetStore();
              setSnackbarMsg('Progress reset!');
              setSnackbarVisible(true);
              router.replace('/(tabs)/home');
            } catch (e) {
              setSnackbarMsg('Failed to reset progress.');
              setSnackbarVisible(true);
            }
          },
        },
      ]
    );
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>Settings</Text>
            
            {user ? (
              <View style={styles.userSection}>
                <Text style={styles.userInfo}>Signed in as: {user.email}</Text>
                <Button
                  mode="outlined"
                  onPress={handleSignOut}
                  style={styles.signOutButton}
                >
                  Sign Out
                </Button>
              </View>
            ) : (
              <Button
                mode="contained"
                onPress={() => router.push('/auth/login')}
                style={styles.signInButton}
                buttonColor="#007AFF"
              >
                Sign In / Sign Up
              </Button>
            )}
            
            <Button
              mode="contained"
              onPress={() => setHapticDemoVisible(true)}
              style={styles.hapticButton}
              buttonColor="#8E8E93"
            >
              🎮 Test Haptic Feedback
            </Button>
          </Card.Content>
        </Card>

        {/* AI Model Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              🤖 AI Model Settings
            </Text>

            {/* Online/Offline Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text variant="titleMedium" style={styles.settingTitle}>
                  Use Offline Mode
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
                Model Status:
              </Text>
              <Text variant="bodySmall" style={[
                styles.statusText,
                { color: modelDownloaded ? theme.colors.primary : theme.colors.error }
              ]}>
                {modelDownloaded ? '✅ Downloaded' : '❌ Not Downloaded'}
              </Text>
              <Text variant="bodySmall" style={[
                styles.statusText,
                { color: modelLoaded ? theme.colors.primary : theme.colors.error }
              ]}>
                {modelLoaded ? '✅ Loaded' : '❌ Not Loaded'}
              </Text>
            </View>

            {/* Model Management Buttons */}
            <View style={styles.modelButtons}>
              <Button
                mode="outlined"
                onPress={handleDownloadModel}
                disabled={isLoading || modelDownloaded}
                loading={isLoading}
                style={styles.modelButton}
              >
                {modelDownloaded ? 'Downloaded' : 'Download Model'}
              </Button>
              
              <Button
                mode="outlined"
                onPress={handleLoadModel}
                disabled={isLoading || !modelDownloaded || modelLoaded}
                loading={isLoading}
                style={styles.modelButton}
              >
                {modelLoaded ? 'Loaded' : 'Load Model'}
              </Button>
            </View>

            {/* Restore Model Button */}
            <Button
              mode="outlined"
              onPress={handleRestoreModel}
              disabled={isLoading}
              loading={isLoading}
              style={styles.restoreButton}
              buttonColor={theme.colors.primaryContainer}
            >
              🔄 Restore Model State
            </Button>

                   <Text variant="bodySmall" style={styles.modelInfo}>
                     Offline mode uses Qwen 3 1.5B (~1.2GB). Real AI model for emergency preparedness!
                   </Text>
                 </Card.Content>
               </Card>


        {/* Reset Progress */}
        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="contained"
              style={styles.resetButton}
              onPress={handleReset}
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
            >
              Reset Progress
            </Button>
            <Text style={styles.description}>
              This will erase all your XP, badges, and quest progress. Use with caution!
            </Text>
          </Card.Content>
               </Card>
      </ScrollView>
             <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Text style={{ color: theme.colors.onPrimary }}>{snackbarMsg}</Text>
      </Snackbar>

      <HapticDemo
        visible={hapticDemoVisible}
        onClose={() => setHapticDemoVisible(false)}
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    elevation: 4,
    padding: 8,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  userSection: {
    marginBottom: 16,
  },
  userInfo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  signOutButton: {
    marginBottom: 8,
  },
  signInButton: {
    marginBottom: 16,
  },
  hapticButton: {
    marginBottom: 16,
  },
  resetButton: {
    marginVertical: 16,
  },
  description: {
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  settingDescription: {
    color: '#666',
    lineHeight: 18,
  },
  divider: {
    marginVertical: 16,
  },
  modelStatus: {
    marginBottom: 16,
  },
  statusTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusText: {
    marginBottom: 4,
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
  },
  progressContainer: {
    marginVertical: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressPercent: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#007AFF',
  },
}); 