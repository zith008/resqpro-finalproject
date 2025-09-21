interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
      detail?: 'low' | 'high' | 'auto';
    };
  }>;
}

interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private model = 'x-ai/grok-4-fast:free'; // Free model for demo

  constructor() {
    // You'll need to set this in your .env file
    this.apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '';
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured. Please add EXPO_PUBLIC_OPENROUTER_API_KEY to your .env file.');
    }

    try {
      console.log('Sending message to OpenRouter API...');
      console.log('Message count:', messages.length);
      
      // Log message types for debugging
      messages.forEach((msg, index) => {
        if (typeof msg.content === 'string') {
          console.log(`Message ${index}: text (${msg.content.length} chars)`);
        } else {
          console.log(`Message ${index}: array with ${msg.content.length} items`);
          msg.content.forEach((item, itemIndex) => {
            if (item.type === 'text') {
              console.log(`  Item ${itemIndex}: text (${item.text?.length || 0} chars)`);
            } else if (item.type === 'image_url') {
              const url = item.image_url?.url || '';
              console.log(`  Item ${itemIndex}: image_url (${url.length} chars, starts with: ${url.substring(0, 50)}...)`);
            }
          });
        }
      });

      const requestBody = {
        model: this.model,
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://resqpro.app', // Optional: for analytics
          'X-Title': 'ResQ Pro Emergency Coach', // Optional: for analytics
        },
        body: JSON.stringify(requestBody),
      });

      console.log('OpenRouter response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenRouter error response:', errorData);
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data: OpenRouterResponse = await response.json();
      console.log('OpenRouter success response received');
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        throw new Error('No response from AI model');
      }
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw error;
    }
  }

  // Get system prompt for emergency preparedness coach
  getSystemPrompt(): string {
    return `You are ResQ Pro, an AI emergency preparedness coach. Your role is to help users prepare for and respond to emergencies.

Key guidelines:
- Be encouraging, supportive, and non-alarmist
- Provide practical, actionable advice
- Focus on emergency preparedness, safety, and survival
- Keep responses concise but informative (2-3 sentences max)
- Use emojis sparingly but appropriately
- If asked about non-emergency topics, gently redirect to emergency preparedness
- Always prioritize safety and official emergency services

You can help with:
- Emergency kit recommendations
- Evacuation planning
- First aid guidance
- Weather preparedness
- Home safety tips
- Emergency communication plans
- Disaster-specific preparation
- Room safety analysis (when images are provided)

When analyzing images:
- Look for safety hazards, blocked exits, fire risks
- Check for emergency equipment placement
- Assess accessibility and mobility issues
- Provide specific, actionable safety recommendations
- Rate safety level as low, medium, or high risk

Remember: You're a coach, not a replacement for professional emergency services. Always recommend calling 911 for actual emergencies.`;
  }

  // Helper method to create image message content
  createImageMessage(text: string, imageUrl: string): Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
      detail?: 'low' | 'high' | 'auto';
    };
  }> {
    // Check if it's a local file URI and convert to base64
    if (imageUrl.startsWith('file://')) {
      return [
        {
          type: 'text',
          text: text
        },
        {
          type: 'image_url',
          image_url: {
            url: imageUrl, // We'll handle base64 conversion in the hook
            detail: 'auto'
          }
        }
      ];
    }
    
    // For remote URLs, use as-is
    return [
      {
        type: 'text',
        text: text
      },
      {
        type: 'image_url',
        image_url: {
          url: imageUrl,
          detail: 'auto'
        }
      }
    ];
  }
}

export const openRouterService = new OpenRouterService();
export type { ChatMessage };
