import * as Notifications from 'expo-notifications';
import { brailleHapticService, createEmergencyAlert } from './brailleHapticService';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // Check if Braille haptics are enabled
    if (brailleHapticService.isBrailleHapticsEnabled()) {
      await handleBrailleNotification(notification);
    }
    
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

// Handle Braille haptic for notifications
async function handleBrailleNotification(notification: Notifications.Notification) {
  try {
    const { data, title, body } = notification.request.content;
    
    // Determine alert type from notification data or content
    let brailleType: 'sos' | 'evacuation' | 'danger' | 'safe' | 'flood' | 'fire' | 'earthquake' = 'danger';
    let urgency: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    
    // Check notification data for alert type
    if (data?.alertType) {
      brailleType = data.alertType;
    } else if (data?.type) {
      brailleType = data.type;
    } else {
      // Infer from title/body content
      const content = `${title || ''} ${body || ''}`.toLowerCase();
      
      if (content.includes('sos') || content.includes('emergency')) {
        brailleType = 'sos';
        urgency = 'critical';
      } else if (content.includes('evacuate') || content.includes('evacuation')) {
        brailleType = 'evacuation';
        urgency = 'high';
      } else if (content.includes('flood')) {
        brailleType = 'flood';
        urgency = 'high';
      } else if (content.includes('fire')) {
        brailleType = 'fire';
        urgency = 'high';
      } else if (content.includes('earthquake')) {
        brailleType = 'earthquake';
        urgency = 'high';
      } else if (content.includes('safe') || content.includes('all clear')) {
        brailleType = 'safe';
        urgency = 'low';
      }
    }
    
    // Check notification data for urgency
    if (data?.urgency) {
      urgency = data.urgency;
    } else if (data?.severity) {
      switch (data.severity) {
        case 'emergency':
          urgency = 'critical';
          break;
        case 'warning':
          urgency = 'high';
          break;
        case 'watch':
          urgency = 'medium';
          break;
        case 'advisory':
          urgency = 'low';
          break;
      }
    }
    
    // Create and play Braille alert
    const brailleAlert = createEmergencyAlert(
      brailleType,
      title || 'Emergency Alert',
      urgency
    );
    
    await brailleHapticService.playEmergencyAlert(brailleAlert);
    
  } catch (error) {
    console.error('Error handling Braille notification:', error);
  }
}

// Function to send a test notification with Braille haptics
export async function sendTestBrailleNotification(
  type: 'sos' | 'evacuation' | 'danger' | 'safe' | 'flood' | 'fire' | 'earthquake',
  title: string,
  body: string,
  urgency: 'low' | 'medium' | 'high' | 'critical' = 'medium'
) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: {
          alertType: type,
          urgency,
        },
        sound: true,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
}

// Function to send emergency alert notification
export async function sendEmergencyAlertNotification(
  alertType: string,
  title: string,
  body: string,
  severity: 'emergency' | 'warning' | 'watch' | 'advisory' = 'warning'
) {
  try {
    // Map alert type to Braille type
    let brailleType: 'sos' | 'evacuation' | 'danger' | 'safe' | 'flood' | 'fire' | 'earthquake' = 'danger';
    
    switch (alertType.toLowerCase()) {
      case 'flood':
        brailleType = 'flood';
        break;
      case 'tornado':
      case 'hurricane':
        brailleType = 'evacuation';
        break;
      case 'earthquake':
        brailleType = 'earthquake';
        break;
      case 'wildfire':
        brailleType = 'fire';
        break;
      case 'severe-weather':
        brailleType = 'danger';
        break;
      default:
        brailleType = 'danger';
    }
    
    // Map severity to urgency
    let urgency: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    switch (severity) {
      case 'emergency':
        urgency = 'critical';
        break;
      case 'warning':
        urgency = 'high';
        break;
      case 'watch':
        urgency = 'medium';
        break;
      case 'advisory':
        urgency = 'low';
        break;
    }
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: {
          alertType: brailleType,
          urgency,
          severity,
        },
        sound: true,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending emergency alert notification:', error);
  }
}

export default {
  sendTestBrailleNotification,
  sendEmergencyAlertNotification,
};
