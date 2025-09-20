import * as Haptics from 'expo-haptics';

export const HapticFeedback = {
  // Emergency alerts - strong, attention-grabbing vibrations
  emergency: () => {
    // Triple heavy impact for maximum attention
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 200);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 400);
  },

  // Warning alerts - double medium impact
  warning: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 150);
  },

  // Watch alerts - single medium impact
  watch: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  // Advisory alerts - light impact
  advisory: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  // Success feedback - light impact
  success: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  // Error feedback - heavy impact
  error: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  // Selection feedback - light impact
  selection: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  // Notification feedback - medium impact
  notification: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  // Custom pattern for critical emergencies
  criticalEmergency: () => {
    // Rapid succession of heavy impacts
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 100);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 200);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 300);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 400);
  },

  // Earthquake simulation - rapid light impacts
  earthquake: () => {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, i * 50);
    }
  },

  // Tornado simulation - escalating impacts
  tornado: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 200);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 400);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 600);
  },

  // Flood simulation - wave-like pattern
  flood: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 300);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 600);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 900);
  },

  // Wildfire simulation - crackling pattern
  wildfire: () => {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, i * 80);
    }
  }
};

// Helper function to get haptic feedback based on alert severity
export const getHapticForSeverity = (severity: string) => {
  switch (severity) {
    case 'emergency':
      return HapticFeedback.emergency;
    case 'warning':
      return HapticFeedback.warning;
    case 'watch':
      return HapticFeedback.watch;
    case 'advisory':
      return HapticFeedback.advisory;
    default:
      return HapticFeedback.notification;
  }
};

// Helper function to get haptic feedback based on alert type
export const getHapticForType = (type: string) => {
  switch (type) {
    case 'earthquake':
      return HapticFeedback.earthquake;
    case 'tornado':
      return HapticFeedback.tornado;
    case 'flood':
      return HapticFeedback.flood;
    case 'wildfire':
      return HapticFeedback.wildfire;
    case 'hurricane':
      return HapticFeedback.tornado; // Similar to tornado
    case 'severe-weather':
      return HapticFeedback.warning;
    default:
      return HapticFeedback.notification;
  }
};
