import { useState, useCallback, useEffect } from 'react';
import { openRouterService, ChatMessage } from '../services/openRouterService';
import { cactusLLMService } from '../services/cactusLLMService';
import { useSettingsStore } from '../store/useSettingsStore';
import { HapticFeedback } from '../utils/haptics';
import * as FileSystem from 'expo-file-system';

interface ChatMessageWithId {
  id: string;
  role: 'user' | 'assistant';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
      detail?: 'low' | 'high' | 'auto';
    };
  }>;
  timestamp: Date;
  imageUri?: string; // For local image storage
}

export function useAIChat() {
  const { useOfflineMode, modelDownloaded, modelLoaded, setModelDownloaded, setModelLoaded, setPackageAvailable } = useSettingsStore();
  const [messages, setMessages] = useState<ChatMessageWithId[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi there! I\'m ResQ Pro, your go-to for emergency preparedness. What can I help you get ready for today? 🚀',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check package availability and restore model state on mount
  useEffect(() => {
    const initializeModelState = async () => {
      try {
        const status = cactusLLMService.getModelStatus();
        setPackageAvailable(status.packageAvailable);
        
        // If settings indicate model should be loaded, check and restore state
        if (modelDownloaded && modelLoaded) {
          console.log('Settings indicate model should be loaded. Checking actual state...');
          const actualState = await cactusLLMService.checkAndRestoreModelState();
          
          // Update settings store to match actual state
          setModelDownloaded(actualState.downloaded);
          setModelLoaded(actualState.loaded);
          
          if (actualState.loaded) {
            console.log('Model state restored successfully');
          } else {
            console.log('Model state could not be restored');
          }
        }
      } catch (error) {
        console.error('Failed to initialize model state:', error);
        // Reset model state if there's an error
        setModelDownloaded(false);
        setModelLoaded(false);
      }
    };
    
    initializeModelState();
  }, [setPackageAvailable, setModelDownloaded, setModelLoaded, modelDownloaded, modelLoaded]);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Add user message
    const userMsg: ChatMessageWithId = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);
    
    // Haptic feedback for sending message
    HapticFeedback.selection();

    try {
      let aiResponse: string;

      if (useOfflineMode) {
        // Use offline LLM
        if (!modelDownloaded || !modelLoaded) {
          throw new Error('Offline model not ready. Please download and load the model in settings.');
        }
        
        // Convert messages to the format expected by Cactus
        const messageHistory = messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        
        aiResponse = await cactusLLMService.generateResponse(userMessage, messageHistory);
      } else {
        // Use online LLM
        const apiMessages: ChatMessage[] = [
          { role: 'system', content: openRouterService.getSystemPrompt() },
          ...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: userMessage }
        ];

        aiResponse = await openRouterService.sendMessage(apiMessages);
      }

      // Add AI response
      const aiMsg: ChatMessageWithId = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);
      
      // Haptic feedback for receiving AI response
      HapticFeedback.success();
    } catch (err) {
      console.error('AI Chat error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get AI response');
      
      // Haptic feedback for error
      HapticFeedback.error();
      
      // Add error message
      const errorMsg: ChatMessageWithId = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Oops! I encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, useOfflineMode, modelDownloaded, modelLoaded]);

  const sendImageMessage = useCallback(async (userMessage: string, imageUri: string) => {
    if (!userMessage.trim() || !imageUri) return;

    setIsLoading(true);
    setError(null);
    
    // Haptic feedback for sending message
    HapticFeedback.selection();

    try {
      let aiResponse: string;

      if (useOfflineMode) {
        // Offline mode doesn't support images yet
        throw new Error('Image analysis is only available in online mode. Please switch to online mode in settings.');
      } else {
        // Convert local file URI to base64 if needed
        let imageContent;
        if (imageUri.startsWith('file://')) {
          try {
            console.log('Converting image to base64:', imageUri);
            
            // Check if file exists
            const fileInfo = await FileSystem.getInfoAsync(imageUri);
            if (!fileInfo.exists) {
              throw new Error('Image file does not exist');
            }
            
            console.log('File exists, reading as base64...');
            const base64 = await FileSystem.readAsStringAsync(imageUri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            
            if (!base64 || base64.length === 0) {
              throw new Error('Failed to read image data');
            }
            
            console.log('Base64 conversion successful, length:', base64.length);
            const mimeType = 'image/jpeg'; // Assuming JPEG from camera
            const dataUrl = `data:${mimeType};base64,${base64}`;
            
            // Create image content with base64 data URL
            imageContent = [
              {
                type: 'text' as const,
                text: userMessage
              },
              {
                type: 'image_url' as const,
                image_url: {
                  url: dataUrl,
                  detail: 'auto' as const
                }
              }
            ];
            
            console.log('Image content prepared for API');
          } catch (error) {
            console.error('Error converting image to base64:', error);
            throw new Error(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        } else {
          imageContent = openRouterService.createImageMessage(userMessage, imageUri);
        }

        // Add user message with processed image content (base64)
        const userMsg: ChatMessageWithId = {
          id: Date.now().toString(),
          role: 'user',
          content: imageContent,
          timestamp: new Date(),
          imageUri: imageUri,
        };

        setMessages(prev => [...prev, userMsg]);

        const apiMessages: ChatMessage[] = [
          { role: 'system', content: openRouterService.getSystemPrompt() },
          ...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: imageContent }
        ];

        aiResponse = await openRouterService.sendMessage(apiMessages);
      }

      // Add AI response
      const aiMsg: ChatMessageWithId = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);
      
      // Haptic feedback for receiving AI response
      HapticFeedback.success();
    } catch (err) {
      console.error('AI Chat error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      HapticFeedback.error();
      
      // Add error message
      const errorMsg: ChatMessageWithId = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Oops! I encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, useOfflineMode]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hi there! I\'m ResQ Pro, your go-to for emergency preparedness. What can I help you get ready for today? 🚀',
        timestamp: new Date(),
      }
    ]);
    setError(null);
  }, []);

  const downloadModel = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await cactusLLMService.downloadModel();
      if (success) {
        setModelDownloaded(true);
        HapticFeedback.success();
      } else {
        throw new Error('Failed to download model');
      }
    } catch (err) {
      console.error('Model download error:', err);
      setError(err instanceof Error ? err.message : 'Failed to download model');
      HapticFeedback.error();
    } finally {
      setIsLoading(false);
    }
  }, [setModelDownloaded]);

  const loadModel = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await cactusLLMService.loadModel();
      if (success) {
        setModelLoaded(true);
        HapticFeedback.success();
      } else {
        throw new Error('Failed to load model');
      }
    } catch (err) {
      console.error('Model load error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load model');
      HapticFeedback.error();
    } finally {
      setIsLoading(false);
    }
  }, [setModelLoaded]);

  const getModelStatus = useCallback(() => {
    return cactusLLMService.getModelStatus();
  }, []);

  const getModelInfo = useCallback(() => {
    return cactusLLMService.getModelInfo();
  }, []);

  const checkAndRestoreModelState = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const actualState = await cactusLLMService.checkAndRestoreModelState();
      setModelDownloaded(actualState.downloaded);
      setModelLoaded(actualState.loaded);
      
      if (actualState.loaded) {
        HapticFeedback.success();
        console.log('Model state restored successfully');
      } else {
        HapticFeedback.error();
        console.log('Model state could not be restored');
      }
    } catch (err) {
      console.error('Failed to restore model state:', err);
      setError(err instanceof Error ? err.message : 'Failed to restore model state');
      HapticFeedback.error();
    } finally {
      setIsLoading(false);
    }
  }, [setModelDownloaded, setModelLoaded]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    sendImageMessage,
    clearChat,
    downloadModel,
    loadModel,
    getModelStatus,
    getModelInfo,
    checkAndRestoreModelState,
    useOfflineMode,
    modelDownloaded,
    modelLoaded,
  };
}
