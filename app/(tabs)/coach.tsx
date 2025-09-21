import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { Text, useTheme, Card, Button, FAB, Snackbar } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
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
  const [isNearBottom, setIsNearBottom] = useState(true);

  // Auto-scroll to bottom when new messages arrive (only if user is near bottom)
  useEffect(() => {
    if (messages.length > 0 && isNearBottom) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [messages.length, isLoading, isNearBottom]);

  // Additional scroll effect when loading state changes
  useEffect(() => {
    if (!isLoading && messages.length > 0 && isNearBottom) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 500);
    }
  }, [isLoading, isNearBottom]);

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

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    setIsNearBottom(isAtBottom);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#dd0436' }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#dd0436" translucent={false} />
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.contentContainer}>
            {/* Header with Subtle Gradient */}
            <LinearGradient
              colors={['#dd0436', '#b8002a']}
              style={styles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons 
                      name="robot" 
                      size={24} 
                      color="#ffffff" 
                    />
                  </View>
                  <View style={styles.titleContainer}>
                    <Text variant="headlineSmall" style={styles.headerTitle}>
                      AI Coach
                    </Text>
                    <Text variant="bodyMedium" style={styles.headerSubtitle}>
                      Your emergency preparedness assistant
                    </Text>
                    {useOfflineMode && modelLoaded && (
                      <View style={styles.offlineIndicator}>
                        <MaterialCommunityIcons 
                          name="wifi-off" 
                          size={12} 
                          color="#ffffff" 
                        />
                        <Text variant="labelSmall" style={styles.offlineText}>
                          Offline Mode
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.headerButtons}>
                  <Button
                    mode="contained"
                    onPress={takePhoto}
                    buttonColor="rgba(255, 255, 255, 0.2)"
                    textColor="#ffffff"
                    compact
                    style={styles.cameraButton}
                    icon="camera"
                    labelStyle={styles.buttonLabel}
                  >
                    Scan Room
                  </Button>
                  <Button
                    mode="text"
                    onPress={() => setShowClearDialog(true)}
                    textColor="#ffffff"
                    compact
                    style={styles.clearButton}
                    labelStyle={styles.buttonLabel}
                  >
                    Clear
                  </Button>
                </View>
              </View>
            </LinearGradient>

          {/* Chat Messages */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={true}
            keyboardDismissMode="interactive"
            onScroll={handleScroll}
            scrollEventThrottle={16}
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
  headerGradient: {
    paddingTop: 0,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    fontFamily: 'Poppins_700Bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    color: '#ffffff',
    opacity: 0.9,
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 4,
  },
  offlineText: {
    marginLeft: 4,
    fontWeight: '500',
    fontSize: 10,
    color: '#ffffff',
    fontFamily: 'Poppins_500Medium',
  },
  buttonLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraButton: {
    minWidth: 100,
    height: 36,
    justifyContent: 'center',
    marginRight: 8,
    borderRadius: 18,
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
    paddingBottom: 120,
    flexGrow: 1,
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