import * as FileSystem from 'expo-file-system';

// Import with fallback for when native module isn't available
let useLLM: any = null;
try {
  // Try the better maintained package first
  useLLM = require('react-native-llm-mediapipe').useLLM;
} catch (error) {
  try {
    // Fallback to expo package
    useLLM = require('expo-llm-mediapipe').useLLM;
  } catch (fallbackError) {
    console.warn('No LLM MediaPipe package available:', error);
  }
}

interface OfflineLLMConfig {
  modelName: string;
  modelUrl: string;
  maxTokens: number;
  temperature: number;
  topK: number;
  randomSeed: number;
  // Gemma 3 1B specific config
  backend?: 'cpu' | 'gpu';
  numResponses?: number;
}

class OfflineLLMService {
  private llm: any = null;
  private isModelLoaded = false;
  private isModelDownloaded = false;
  private config: OfflineLLMConfig;

  constructor() {
    // Gemma 3 1B configuration based on Google AI Edge documentation
    this.config = {
      modelName: 'gemma-3-1b-it-int4.bin',
      modelUrl: 'https://huggingface.co/google/gemma-3-1b-it-int4/resolve/main/gemma-3-1b-it-int4.bin',
      maxTokens: 1000, // Context size for Gemma 3 1B
      temperature: 0.8,
      topK: 40,
      randomSeed: 42,
      backend: 'cpu', // CPU backend for better compatibility
      numResponses: 1,
    };
  }

  async initializeLLM() {
    try {
      if (!useLLM) {
        throw new Error('LLM MediaPipe package not available. Please install react-native-llm-mediapipe or expo-llm-mediapipe.');
      }
      this.llm = useLLM(this.config);
      return true;
    } catch (error) {
      console.error('Failed to initialize LLM:', error);
      return false;
    }
  }

  async downloadModel(): Promise<boolean> {
    try {
      if (this.isModelDownloaded) {
        console.log('Model already downloaded.');
        return true;
      }

      if (!this.llm) {
        await this.initializeLLM();
      }

      console.log('Downloading Gemma 3 1B model...');
      const success = await this.llm.downloadModel();
      if (success) {
        this.isModelDownloaded = true;
        console.log('Model downloaded successfully.');
        return true;
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Failed to download model:', error);
      this.isModelDownloaded = false;
      return false;
    }
  }

  async loadModel(): Promise<boolean> {
    try {
      if (!this.llm) {
        await this.initializeLLM();
      }
      if (!this.isModelDownloaded) {
        throw new Error('Model not downloaded. Please download first.');
      }
      if (this.isModelLoaded) {
        console.log('Model already loaded.');
        return true;
      }

      console.log('Loading Gemma 3 1B model...');
      const success = await this.llm.loadModel();
      if (success) {
        this.isModelLoaded = true;
        console.log('Model loaded successfully.');
        return true;
      } else {
        throw new Error('Load failed');
      }
    } catch (error) {
      console.error('Failed to load model:', error);
      this.isModelLoaded = false;
      return false;
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      if (!this.llm) {
        throw new Error('LLM not initialized. Call initializeLLM first.');
      }
      if (!this.isModelLoaded) {
        throw new Error('Model not loaded. Please load the model first.');
      }

      console.log('Generating response with Gemma 3 1B...');
      const result = await this.llm.generateResponse(prompt);
      return result;
    } catch (error) {
      console.error('Failed to generate response:', error);
      throw error;
    }
  }

  getModelStatus() {
    return {
      downloaded: this.isModelDownloaded,
      loaded: this.isModelLoaded,
      packageAvailable: !!useLLM,
    };
  }

  // Get model info for display
  getModelInfo() {
    return {
      name: 'Gemma 3 1B',
      size: '~1.5GB',
      description: 'Google\'s latest 1B parameter model with improved reasoning',
      features: ['On-device inference', 'Privacy-focused', 'No internet required'],
    };
  }
}

export const offlineLLMService = new OfflineLLMService();
