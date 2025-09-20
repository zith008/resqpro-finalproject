import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, useTheme, Card, Button, FAB, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { QuickSuggestions } from '@/components/QuickSuggestions';
import { useAIChat } from '@/hooks/useAIChat';

export default function CoachScreen() {
  const theme = useTheme();
  const { messages, isLoading, error, sendMessage, clearChat } = useAIChat();
  const [showClearDialog, setShowClearDialog] = React.useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isLoading]);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons 
            name="robot" 
            size={32} 
            color={theme.colors.primary} 
          />
          <Text variant="headlineSmall" style={styles.headerTitle}>
            AI Coach
          </Text>
        </View>
        <Button
          mode="text"
          onPress={() => setShowClearDialog(true)}
          textColor={theme.colors.onSurfaceVariant}
          compact
        >
          Clear
        </Button>
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
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
    backgroundColor: '#FFFFFF',
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
  headerTitle: {
    fontWeight: 'bold',
    marginLeft: 12,
    fontSize: 20,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  messagesContent: {
    paddingVertical: 12,
    paddingBottom: 20,
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
}); 