import { Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

// Braille dot patterns (6-dot Braille standard)
// Each position represents a dot in the 2x3 Braille cell:
// 1 4
// 2 5  
// 3 6

export interface BraillePattern {
  name: string;
  description: string;
  dots: number[]; // Array of dot positions (1-6)
  vibrationPattern: number[]; // Vibration timing pattern
}

export interface EmergencyAlert {
  type: 'sos' | 'evacuation' | 'danger' | 'safe' | 'flood' | 'fire' | 'earthquake';
  message: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

// Braille patterns for emergency alerts - Enhanced with haptic feedback
export const BRAILLE_PATTERNS: Record<string, BraillePattern> = {
  // SOS - Three short bursts (S-O-S) with distinct haptic feedback
  sos: {
    name: 'SOS',
    description: 'Emergency distress signal',
    dots: [1, 2, 4, 1, 2, 4, 1, 2, 4], // S-O-S pattern
    vibrationPattern: [200, 100, 200, 100, 200, 300, 200, 100, 200, 100, 200, 300, 200, 100, 200, 100, 200]
  },
  
  // EVACUATION - Long-short-long pattern with urgent haptics
  evacuation: {
    name: 'EVACUATION',
    description: 'Immediate evacuation required',
    dots: [1, 5, 1, 2, 3, 1, 2, 4], // E-V-A pattern
    vibrationPattern: [500, 200, 200, 200, 200, 200, 500, 200, 200, 200, 500]
  },
  
  // DANGER - Rapid short bursts with escalating intensity
  danger: {
    name: 'DANGER',
    description: 'Dangerous situation ahead',
    dots: [1, 4, 5, 1, 5, 1, 3, 4, 5], // D-A-N pattern
    vibrationPattern: [100, 50, 100, 50, 100, 50, 100, 50, 100, 100, 100, 50, 100, 50, 100, 50, 100]
  },
  
  // SAFE - Slow, steady pattern with gentle haptics
  safe: {
    name: 'SAFE',
    description: 'Area is safe',
    dots: [1, 2, 4, 1, 5, 1, 2, 4], // S-A-F pattern
    vibrationPattern: [300, 200, 300, 200, 300, 400, 300, 200, 300]
  },
  
  // FLOOD - Wave-like pattern with flowing haptics
  flood: {
    name: 'FLOOD',
    description: 'Flood warning',
    dots: [1, 2, 4, 1, 2, 3, 1, 3, 5], // F-L-O pattern
    vibrationPattern: [200, 100, 300, 100, 200, 100, 300, 100, 200, 100, 300, 100, 200]
  },
  
  // FIRE - Intense rapid pattern with crackling haptics
  fire: {
    name: 'FIRE',
    description: 'Fire emergency',
    dots: [1, 2, 4, 2, 4, 1, 2, 3, 5], // F-I-R pattern
    vibrationPattern: [150, 75, 150, 75, 150, 75, 150, 75, 150, 75, 150, 75, 150, 75, 150, 75, 150]
  },
  
  // EARTHQUAKE - Shaking pattern with tremors
  earthquake: {
    name: 'EARTHQUAKE',
    description: 'Earthquake warning',
    dots: [1, 5, 1, 2, 4, 1, 2, 3, 5], // E-A-R pattern
    vibrationPattern: [100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100]
  }
};

// Timing constants for Braille haptics
export const BRAILLE_TIMING = {
  DOT_DURATION: 200,        // Duration of a single dot vibration
  RAISED_DOT_DURATION: 400, // Duration of a raised dot (longer)
  INTER_DOT_GAP: 100,       // Gap between dots in same cell
  INTER_CELL_GAP: 300,      // Gap between Braille cells
  INTER_LETTER_GAP: 500,    // Gap between letters
  INTER_WORD_GAP: 800,      // Gap between words
  ALERT_PAUSE: 1000,        // Pause before repeating alert
};

class BrailleHapticService {
  private isEnabled: boolean = false;
  private currentPattern: string | null = null;
  private isPlaying: boolean = false;

  constructor() {
    this.loadSettings();
  }

  private async loadSettings() {
    // Load from AsyncStorage or settings store
    // For now, default to enabled
    this.isEnabled = true;
  }

  public async enableBrailleHaptics(): Promise<void> {
    this.isEnabled = true;
    // Save to settings
  }

  public async disableBrailleHaptics(): Promise<void> {
    this.isEnabled = false;
    this.stopCurrentPattern();
    // Save to settings
  }

  public isBrailleHapticsEnabled(): boolean {
    return this.isEnabled;
  }

  public async playBraillePattern(patternKey: string, repeat: number = 1): Promise<void> {
    console.log(`Attempting to play Braille pattern: ${patternKey}, enabled: ${this.isEnabled}, repeat: ${repeat}`);
    
    if (!this.isEnabled) {
      console.log('Braille haptics not enabled');
      return;
    }

    // Stop any current pattern first
    this.stopCurrentPattern();

    const pattern = BRAILLE_PATTERNS[patternKey];
    if (!pattern) {
      console.warn(`Braille pattern '${patternKey}' not found`);
      return;
    }

    console.log(`Found pattern: ${pattern.name}, vibration pattern:`, pattern.vibrationPattern);

    this.isPlaying = true;
    this.currentPattern = patternKey;

    try {
      for (let i = 0; i < repeat; i++) {
        if (!this.isPlaying) break; // Allow early termination
        
        console.log(`Playing pattern repetition ${i + 1}/${repeat}`);
        await this.vibratePattern(pattern.vibrationPattern);
        
        if (i < repeat - 1 && this.isPlaying) {
          // Pause between repetitions
          console.log('Pausing between repetitions');
          await this.delay(BRAILLE_TIMING.ALERT_PAUSE);
        }
      }
    } catch (error) {
      console.error('Error playing Braille pattern:', error);
    } finally {
      this.isPlaying = false;
      this.currentPattern = null;
      console.log('Pattern playback completed');
    }
  }

  public async playEmergencyAlert(alert: EmergencyAlert): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    const patternKey = alert.type;
    const repeatCount = this.getRepeatCountForUrgency(alert.urgency);
    
    await this.playBraillePattern(patternKey, repeatCount);
  }

  private getRepeatCountForUrgency(urgency: string): number {
    switch (urgency) {
      case 'critical': return 5;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 1;
    }
  }

  private async vibratePattern(pattern: number[]): Promise<void> {
    return new Promise(async (resolve) => {
      console.log('Playing Braille pattern:', pattern);
      
      // Use the pattern array directly - React Native Vibration supports this
      Vibration.vibrate(pattern);
      
      // Also trigger haptic feedback for enhanced experience
      await this.playHapticPattern(pattern);
      
      // Calculate total duration including gaps
      const totalDuration = pattern.reduce((sum, duration) => sum + duration, 0);
      
      console.log('Pattern duration:', totalDuration);
      
      setTimeout(() => {
        resolve();
      }, totalDuration + 100); // Add small buffer
    });
  }

  private async playHapticPattern(pattern: number[]): Promise<void> {
    try {
      // Play haptic feedback synchronized with vibration pattern
      for (let i = 0; i < pattern.length; i += 2) {
        const vibrationDuration = pattern[i];
        const pauseDuration = pattern[i + 1] || 0;
        
        // Determine haptic intensity based on vibration duration
        if (vibrationDuration > 0) {
          if (vibrationDuration >= 400) {
            // Long vibration - use heavy haptic
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          } else if (vibrationDuration >= 200) {
            // Medium vibration - use medium haptic
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } else {
            // Short vibration - use light haptic
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }
        
        // Wait for the pause duration before next haptic
        if (pauseDuration > 0) {
          await this.delay(pauseDuration);
        }
      }
    } catch (error) {
      console.error('Error playing haptic pattern:', error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public stopCurrentPattern(): void {
    if (this.isPlaying) {
      Vibration.cancel();
      this.isPlaying = false;
      this.currentPattern = null;
    }
  }

  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  public getAvailablePatterns(): BraillePattern[] {
    return Object.values(BRAILLE_PATTERNS);
  }

  public getPattern(patternKey: string): BraillePattern | null {
    return BRAILLE_PATTERNS[patternKey] || null;
  }

  // Practice mode - play pattern with audio description
  public async playPracticePattern(patternKey: string): Promise<void> {
    const pattern = BRAILLE_PATTERNS[patternKey];
    if (!pattern) {
      return;
    }

    // Play the pattern once for practice
    await this.playBraillePattern(patternKey, 1);
  }

  // Simple test function to verify vibration works
  public async testVibration(): Promise<void> {
    console.log('Testing basic vibration...');
    try {
      // Test simple vibration first
      Vibration.vibrate(500);
      console.log('Basic vibration test completed');
    } catch (error) {
      console.error('Vibration test failed:', error);
    }
  }

  // Test all patterns in sequence
  public async testAllPatterns(): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    const patterns = Object.keys(BRAILLE_PATTERNS);
    
    for (const patternKey of patterns) {
      console.log(`Testing pattern: ${patternKey}`);
      await this.playBraillePattern(patternKey, 1);
      await this.delay(1500); // Longer pause between patterns for better testing
    }
  }

  // Enhanced test with pattern descriptions
  public async testPatternWithDescription(patternKey: string): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    const pattern = BRAILLE_PATTERNS[patternKey];
    if (!pattern) {
      console.warn(`Pattern '${patternKey}' not found`);
      return;
    }

    console.log(`Testing ${pattern.name}: ${pattern.description}`);
    await this.playBraillePattern(patternKey, 1);
  }

  // Test emergency-specific patterns
  public async testEmergencyPatterns(): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    const emergencyPatterns = ['sos', 'evacuation', 'danger', 'flood', 'fire', 'earthquake'];
    
    for (const patternKey of emergencyPatterns) {
      await this.testPatternWithDescription(patternKey);
      await this.delay(2000); // Longer pause for emergency patterns
    }
  }
}

// Export singleton instance
export const brailleHapticService = new BrailleHapticService();

// Helper function to create custom emergency alert
export const createEmergencyAlert = (
  type: EmergencyAlert['type'],
  message: string,
  urgency: EmergencyAlert['urgency'] = 'medium'
): EmergencyAlert => ({
  type,
  message,
  urgency
});

// Helper function to get Braille dot visualization
export const getBrailleDotVisualization = (dots: number[]): string => {
  const brailleCell = [
    ['○', '○'], // Row 1: dots 1, 4
    ['○', '○'], // Row 2: dots 2, 5
    ['○', '○']  // Row 3: dots 3, 6
  ];

  dots.forEach(dot => {
    switch (dot) {
      case 1: brailleCell[0][0] = '●'; break;
      case 2: brailleCell[1][0] = '●'; break;
      case 3: brailleCell[2][0] = '●'; break;
      case 4: brailleCell[0][1] = '●'; break;
      case 5: brailleCell[1][1] = '●'; break;
      case 6: brailleCell[2][1] = '●'; break;
    }
  });

  return brailleCell.map(row => row.join(' ')).join('\n');
};
