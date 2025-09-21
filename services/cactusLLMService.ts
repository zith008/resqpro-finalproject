import { CactusLM } from 'cactus-react-native';
import RNFS from 'react-native-fs';

interface CactusConfig {
  modelName: string;
  modelUrl: string;
  maxTokens: number;
  temperature: number;
  topK: number;
  topP: number;
}

class CactusLLMService {
  private lm: CactusLM | null = null;
  private isModelLoaded = false;
  private isModelDownloaded = false;
  private config: CactusConfig;

  constructor() {
    // Using Qwen 3 model as recommended in the article
    this.config = {
      modelName: 'qwen-3-1.8b-instruct',
      modelUrl: 'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf',
      maxTokens: 512,
      temperature: 0.7,
      topK: 40,
      topP: 0.9,
    };
  }


  // Hugging Face token for authenticated downloads
  private getHuggingFaceToken(): string | null {
    // You can set this in your environment variables or app config
    return process.env.EXPO_PUBLIC_HUGGINGFACE_TOKEN || null;
  }

  async downloadModel(): Promise<boolean> {
    try {
      if (this.isModelDownloaded) {
        console.log('Model already downloaded.');
        return true;
      }

      console.log('Downloading Qwen 3 model...');
      
      const localPath = `${RNFS.DocumentDirectoryPath}/${this.config.modelName}.gguf`;
      
      // Check if file already exists
      const fileExists = await RNFS.exists(localPath);
      if (fileExists) {
        console.log('Model file already exists locally.');
        this.isModelDownloaded = true;
        return true;
      }

      // Download the model file
      const downloadResult = await RNFS.downloadFile({
        fromUrl: this.config.modelUrl,
        toFile: localPath,
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Download progress: ${progress.toFixed(2)}%`);
        },
      }).promise;

      if (downloadResult.statusCode === 200) {
        console.log('Model downloaded successfully to:', localPath);
        this.isModelDownloaded = true;
        return true;
      } else {
        throw new Error(`Download failed with status: ${downloadResult.statusCode}`);
      }
    } catch (error) {
      console.error('Failed to download model:', error);
      this.isModelDownloaded = false;
      return false;
    }
  }

  async loadModel(): Promise<boolean> {
    try {
      if (this.isModelLoaded) {
        console.log('Model already loaded.');
        return true;
      }

      if (!this.isModelDownloaded) {
        const downloaded = await this.downloadModel();
        if (!downloaded) {
          throw new Error('Failed to download model');
        }
      }

      console.log('Loading Qwen 3 model using Cactus API...');
      
      const localPath = `${RNFS.DocumentDirectoryPath}/${this.config.modelName}.gguf`;
      
      // Initialize the Cactus LM using the correct API format from documentation
      const { lm, error } = await CactusLM.init({
        model: localPath,
        n_ctx: 2048,
        n_threads: 4,
        n_gpu_layers: 0, // Use CPU only for better compatibility
      });
      
      if (error) {
        throw new Error(`Cactus LM initialization failed: ${error}`);
      }
      
      if (!lm) {
        throw new Error('Cactus LM initialization returned null');
      }
      
      this.lm = lm;
      console.log('Model loaded successfully.');
      console.log('LM object after init:', {
        hasLM: !!this.lm,
        hasCompletion: typeof this.lm?.completion === 'function',
        lmKeys: Object.keys(this.lm || {}),
        lmType: typeof this.lm
      });
      this.isModelLoaded = true;
      return true;
    } catch (error) {
      console.error('Failed to load model:', error);
      this.isModelLoaded = false;
      return false;
    }
  }

  async generateResponse(prompt: string, messageHistory: Array<{role: string, content: string}> = []): Promise<string> {
    try {
      // Check if model is loaded, if not try to load it
      if (!this.lm) {
        console.log('Model not loaded, attempting to load...');
        const loaded = await this.loadModel();
        if (!loaded || !this.lm) {
          throw new Error('Model not loaded. Please download and load the model in settings.');
        }
      }

      console.log('Generating response with Qwen 3 using Cactus API...');
      console.log('LM object status:', {
        hasLM: !!this.lm,
        hasCompletion: typeof this.lm?.completion === 'function',
        lmType: typeof this.lm,
        lmKeys: Object.keys(this.lm || {}),
        lmMethods: Object.getOwnPropertyNames(this.lm || {})
      });
      
      // Build messages array in the format expected by Cactus API
      const messages = [
        { role: 'system', content: 'You are ResQ Pro, an AI assistant specialized in emergency preparedness and safety. You help users prepare for emergencies, create safety plans, and provide guidance during crisis situations. Keep responses helpful, practical, and focused on safety.' }
      ];
      
      // Add message history
      if (messageHistory && messageHistory.length > 0) {
        messages.push(...messageHistory);
      }
      
      // Add current user message
      messages.push({ role: 'user', content: prompt });
      
      console.log('Attempting completion with messages array...');
      console.log('Messages count:', messages.length);
      
      // Use the Cactus API format as documented
      const result = await this.lm.completion(messages, {
        n_predict: this.config.maxTokens,
        temperature: this.config.temperature,
        top_p: this.config.topP,
        top_k: this.config.topK,
        stop: ['</s>', '<|end|>', '<lim_end|>', '<|im_end|>', '<|endoftext|>', '<|stop|>'],
      });

      // Extract the response text and clean up stop tokens
      let response = result.text.trim();
      
      // Remove common stop tokens and unwanted endings
      response = response
        .replace(/<lim_end\|?>/g, '')
        .replace(/<\|end\|>/g, '')
        .replace(/<\/s>/g, '')
        .replace(/<end>/g, '')
        .replace(/<lim_end>/g, '')
        .replace(/<\|im_end\|>/g, '')
        .replace(/<\|endoftext\|>/g, '')
        .replace(/<\|stop\|>/g, '')
        .trim();
      
      return response || 'I apologize, but I couldn\'t generate a proper response. Please try again.';
    } catch (error) {
      console.error('Failed to generate response:', error);
      throw error;
    }
  }



  getModelStatus() {
    return {
      downloaded: this.isModelDownloaded,
      loaded: this.isModelLoaded,
      packageAvailable: true, // Cactus is available
    };
  }


  // Check if model should be loaded based on file existence and restore state
  async checkAndRestoreModelState(): Promise<{downloaded: boolean, loaded: boolean}> {
    try {
      const localPath = `${RNFS.DocumentDirectoryPath}/${this.config.modelName}.gguf`;
      const fileExists = await RNFS.exists(localPath);
      
      this.isModelDownloaded = fileExists;
      
      // If file exists but model is not loaded, try to load it
      if (fileExists && !this.isModelLoaded) {
        console.log('Model file exists but not loaded. Attempting to restore...');
        const loaded = await this.loadModel();
        return {
          downloaded: this.isModelDownloaded,
          loaded: loaded
        };
      }
      
      return {
        downloaded: this.isModelDownloaded,
        loaded: this.isModelLoaded
      };
    } catch (error) {
      console.error('Failed to check model state:', error);
      return {
        downloaded: false,
        loaded: false
      };
    }
  }


  getModelInfo() {
    return {
      name: 'Qwen 3 1.5B Instruct',
      size: '~1.2GB',
      description: 'Real AI model for emergency preparedness assistance',
      features: ['On-device inference', 'Privacy-focused', 'No internet required', 'Real AI responses'],
    };
  }

  async cleanup() {
    if (this.lm) {
      // Use Cactus API cleanup method
      await this.lm.release();
      this.lm = null;
      this.isModelLoaded = false;
    }
  }

  // Get model file size
  async getModelSize(): Promise<number> {
    try {
      const localPath = `${RNFS.DocumentDirectoryPath}/${this.config.modelName}.gguf`;
      const fileExists = await RNFS.exists(localPath);
      
      if (fileExists) {
        const stats = await RNFS.stat(localPath);
        return stats.size;
      }
      return 0;
    } catch (error) {
      console.error('Failed to get model size:', error);
      return 0;
    }
  }
}

export const cactusLLMService = new CactusLLMService();
