import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Image } from 'react-native';
import { Badge } from '@/data/badges';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GlobalBadgeNotificationProps {
  badge: Badge | null;
  onDismiss: () => void;
}

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('GlobalBadgeNotification Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={[styles.container, { backgroundColor: 'red' }]}>
          <Text style={{ color: 'white' }}>Something went wrong with the notification</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export const GlobalBadgeNotification = ({ badge, onDismiss }: GlobalBadgeNotificationProps) => {
  const theme = useTheme();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    console.log('GlobalBadgeNotification mounted/updated with badge:', badge?.title);
    
    if (badge) {
      try {
        console.log('Starting animation sequence');
        // Simple slide in
        translateY.value = withTiming(0, { duration: 300 });
        opacity.value = withTiming(1, { duration: 300 });

        // Auto dismiss after 2 seconds
        const timer = setTimeout(() => {
          console.log('Starting dismiss animation');
          // Simple slide out without callback
          translateY.value = withTiming(-100, { duration: 300 });
          opacity.value = withTiming(0, { duration: 300 });
          
          // Call onDismiss after animation completes
          setTimeout(() => {
            onDismiss();
          }, 300);
        }, 2000);

        return () => {
          console.log('Cleaning up animation');
          clearTimeout(timer);
        };
      } catch (error) {
        console.error('Error in animation sequence:', error);
      }
    }
  }, [badge]);

  const animatedStyle = useAnimatedStyle(() => {
    try {
      return {
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
      };
    } catch (error) {
      console.error('Error in animatedStyle:', error);
      return {};
    }
  });

  if (!badge) {
    console.log('No badge to display');
    return null;
  }

  try {
    return (
      <ErrorBoundary>
        <View style={styles.container}>
          <Animated.View style={[styles.notification, animatedStyle, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.badgeContainer}>
              <Image 
                source={badge.icon} 
                style={styles.badgeIcon} 
                resizeMode="contain"
                onError={(error) => console.error('Image loading error:', error.nativeEvent.error)}
              />
            </View>
            <View style={styles.textContainer}>
              <Text variant="titleMedium" style={styles.title}>New Badge Unlocked!</Text>
              <Text variant="bodyMedium" style={styles.badgeName}>{badge.title}</Text>
            </View>
          </Animated.View>
        </View>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Render error:', error);
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 50,
    borderRadius: 16,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  badgeContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeIcon: {
    width: 35,
    height: 35,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badgeName: {
    color: '#666',
  },
}); 