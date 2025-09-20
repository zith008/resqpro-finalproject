import React, { useEffect, useRef } from 'react';
import { View, Modal, StyleSheet, Dimensions, Pressable, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Badge } from '@/data/badges';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BadgeViewerModalProps {
  visible: boolean;
  badge: Badge | null;
  isUnlock?: boolean;
  onDismiss: () => void;
}

export function BadgeViewerModal({ visible, badge, isUnlock = false, onDismiss }: BadgeViewerModalProps) {
  const theme = useTheme();
  const confettiRef = useRef<ConfettiCannon>(null);
  
  // Animation values
  const scale = useSharedValue(0);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const shineX = useSharedValue(-SCREEN_WIDTH);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(12);

  // Gesture handler
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      rotateX.value = e.translationY / 10;
      rotateY.value = e.translationX / 10;
    })
    .onEnd(() => {
      rotateX.value = withSpring(0);
      rotateY.value = withSpring(0);
    });

  // Animation effects
  useEffect(() => {
    if (visible) {
      // Spring scale with overshoot
      scale.value = withSpring(1, { 
        mass: 0.8, 
        damping: 10, 
        overshootClamping: false 
      });

      // Shine sweep
      shineX.value = withTiming(SCREEN_WIDTH, { 
        duration: 800, 
        easing: Easing.ease 
      });

      // Text reveal
      textOpacity.value = withTiming(1, { 
        duration: 350, 
        delay: 350 
      });
      textTranslateY.value = withTiming(0, { 
        duration: 350, 
        delay: 350 
      });

      // Confetti and haptic
      setTimeout(() => {
        confettiRef.current?.start();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }, 250);
    } else {
      scale.value = withTiming(0);
      shineX.value = -SCREEN_WIDTH;
      textOpacity.value = 0;
      textTranslateY.value = 12;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
      ],
    };
  });

  const shineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shineX.value }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textTranslateY.value }],
    };
  });

  if (!badge) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
    >
      <BlurView intensity={60} style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.67)']}
          style={StyleSheet.absoluteFill}
        />
      </BlurView>

      <Pressable style={styles.container} onPress={onDismiss}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.badgeContainer, animatedStyle]}>
            <View style={styles.badgeWrapper}>
              <Animated.View style={[styles.shine, shineStyle]}>
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
              <Image 
                source={badge.icon}
                style={styles.badgeIcon}
                resizeMode="contain"
              />
            </View>
            
            <Animated.View style={textStyle}>
              <Text variant="headlineMedium" style={styles.title}>
                {badge.title}
              </Text>
              <Text variant="bodyLarge" style={styles.description}>
                {badge.description}
              </Text>
            </Animated.View>
          </Animated.View>
        </GestureDetector>

        <ConfettiCannon
          ref={confettiRef}
          count={50}
          origin={{ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 }}
          autoStart={false}
          fadeOut={true}
          fallSpeed={3000}
        />
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  badgeWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 24,
  },
  shine: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    transform: [{ rotate: '45deg' }],
  },
  badgeIcon: {
    width: 140,
    height: 140,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 24,
  },
  description: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
}); 