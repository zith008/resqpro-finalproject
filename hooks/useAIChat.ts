import { useState, useCallback, useEffect } from 'react';
import { openRouterService, ChatMessage } from '../services/openRouterService';
import { offlineLLMService } from '../services/offlineLLMService';
import { useSettingsStore } from '../store/useSettingsStore';
import { HapticFeedback } from '../utils/haptics';

interface ChatMessageWithId {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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

  // Check package availability on mount
  useEffect(() => {
    const status = offlineLLMService.getModelStatus();
    setPackageAvailable(status.packageAvailable);
  }, [setPackageAvailable]);

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
        
        aiResponse = await offlineLLMService.generateResponse(userMessage);
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
      
      const success = await offlineLLMService.downloadModel();
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
      
      const success = await offlineLLMService.loadModel();
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
    return offlineLLMService.getModelStatus();
  }, []);

  const getModelInfo = useCallback(() => {
    return offlineLLMService.getModelInfo();
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    downloadModel,
    loadModel,
    getModelStatus,
    getModelInfo,
    useOfflineMode,
    modelDownloaded,
    modelLoaded,
  };
}
