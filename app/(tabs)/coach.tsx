import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, useTheme, Card, Button, FAB, Snackbar } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { QuickSuggestions } from '@/components/QuickSuggestions';
import { useAIChat } from '@/hooks/useAIChat';

export default function CoachScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { messages, isLoading, error, sendMessage, sendImageMessage, clearChat, useOfflineMode, modelLoaded } = useAIChat();
  const [showClearDialog, setShowClearDialog] = React.useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const cameraRef = useRef<CameraView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isLoading]);

  // Handle keyboard events for better scrolling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      keyboardDidShowListener?.remove();
    };
  }, []);

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear the conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            clearChat();
            setShowClearDialog(false);
          }
        }
      ]
    );
  };

  const takePhoto = async () => {
    if (!permission) {
      Alert.alert('Permission needed', 'Camera permission is being requested...');
      return;
    }
    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission needed', 'Sorry, we need camera permissions to take photos!');
        return;
      }
    }
    setShowCamera(true);
  };

  const capturePhoto = async () => {
    if (!cameraRef.current) {
      console.error('Camera ref is null');
      Alert.alert('Error', 'Camera not ready. Please try again.');
      return;
    }

    try {
      console.log('Taking photo...');
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      console.log('Photo taken:', photo?.uri);
      
      if (photo?.uri) {
        setShowCamera(false);
        const prompt = "Please analyze this room for safety and emergency preparedness. Look for potential hazards, blocked exits, fire risks, and provide specific recommendations for improvement.";
        console.log('Sending image message...');
        await sendImageMessage(prompt, photo.uri);
      } else {
        console.error('No photo URI received');
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', `Failed to take photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const closeCamera = () => {
    setShowCamera(false);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.headerContent}>
              <MaterialCommunityIcons 
                name="robot" 
                size={20} 
                color={theme.colors.primary} 
              />
              <View style={styles.titleContainer}>
                <Text variant="titleLarge" style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
                  AI Coach
                </Text>
                {useOfflineMode && modelLoaded && (
                  <View style={[styles.offlineIndicator, { backgroundColor: theme.colors.primaryContainer }]}>
                    <MaterialCommunityIcons 
                      name="wifi-off" 
                      size={10} 
                      color={theme.colors.onPrimaryContainer} 
                    />
                    <Text variant="labelSmall" style={[styles.offlineText, { color: theme.colors.onPrimaryContainer }]}>
                      Offline
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.headerButtons}>
              <Button
                mode="text"
                onPress={takePhoto}
                textColor={theme.colors.primary}
                compact
                style={styles.cameraButton}
                icon="camera"
              >
                Scan Room
              </Button>
              <Button
                mode="text"
                onPress={() => setShowClearDialog(true)}
                textColor={theme.colors.onSurfaceVariant}
                compact
                style={styles.clearButton}
              >
                Clear
              </Button>
            </View>
          </View>

          {/* Chat Messages */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <View style={styles.loadingContainer}>
                <MaterialCommunityIcons 
                  name="robot" 
                  size={24} 
                  color={theme.colors.primary} 
                />
                <Text variant="bodyMedium" style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
                  ResQ Pro is thinking...
                </Text>
              </View>
            )}

            {/* Show quick suggestions only for the first message */}
            {messages.length === 1 && !isLoading && (
              <QuickSuggestions 
                onSuggestionPress={sendMessage}
                disabled={isLoading}
              />
            )}
          </ScrollView>

          {/* Chat Input */}
          <ChatInput 
            onSendMessage={sendMessage} 
            disabled={isLoading}
          />
          {/* Error Snackbar */}
          <Snackbar
            visible={!!error}
            onDismiss={() => {}}
            duration={5000}
            style={{ backgroundColor: theme.colors.error }}
          >
            <Text style={{ color: theme.colors.onError }}>
              {error}
            </Text>
          </Snackbar>

          {/* Clear Chat Dialog */}
          {showClearDialog && (
            <View style={styles.overlay}>
              <Card style={styles.dialogCard}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.dialogTitle}>
                    Clear Chat
                  </Text>
                  <Text variant="bodyMedium" style={styles.dialogText}>
                    Are you sure you want to clear the conversation? This action cannot be undone.
                  </Text>
                  <View style={styles.dialogButtons}>
                    <Button
                      mode="outlined"
                      onPress={() => setShowClearDialog(false)}
                      style={styles.dialogButton}
                    >
                      Cancel
                    </Button>
                    <Button
                      mode="contained"
                      onPress={handleClearChat}
                      buttonColor={theme.colors.error}
                      style={styles.dialogButton}
                    >
                      Clear
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            </View>
          )}

          {/* Camera Modal */}
          <Modal
            visible={showCamera}
            animationType="slide"
            onRequestClose={closeCamera}
          >
            <View style={styles.cameraContainer}>
              <CameraView
                key={`camera-${showCamera}`}
                ref={cameraRef}
                style={styles.camera}
                facing={cameraType}
              />
              <View style={styles.cameraOverlay}>
                <View style={styles.cameraHeader}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeCamera}
                  >
                    <MaterialCommunityIcons name="close" size={30} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.cameraTitle}>Scan Room for Safety</Text>
                  <TouchableOpacity
                    style={styles.flipButton}
                    onPress={() => setCameraType(
                      cameraType === 'back' ? 'front' : 'back'
                    )}
                  >
                    <MaterialCommunityIcons name="camera-flip" size={30} color="white" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.cameraFooter}>
                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={capturePhoto}
                  >
                    <MaterialCommunityIcons name="camera" size={40} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 18,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  offlineText: {
    marginLeft: 3,
    fontWeight: '500',
    fontSize: 11,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraButton: {
    minWidth: 80,
    height: 36,
    justifyContent: 'center',
    marginRight: 8,
  },
  clearButton: {
    minWidth: 50,
    height: 36,
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 1,
    marginBottom: 6,
  },
  loadingText: {
    marginLeft: 12,
    fontStyle: 'italic',
    color: '#666',
    fontSize: 15,
  },
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
  dialogCard: {
    margin: 20,
    maxWidth: 400,
    width: '90%',
  },
  dialogTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dialogText: {
    marginBottom: 16,
    lineHeight: 20,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dialogButton: {
    marginLeft: 8,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 10,
  },
  cameraTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flipButton: {
    padding: 10,
  },
  cameraFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
}); 