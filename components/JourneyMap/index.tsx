import React, { useEffect, useRef } from 'react';
import { ScrollView, Image, View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring 
} from 'react-native-reanimated';
import { Text, useTheme } from 'react-native-paper';
import { useGameStore } from '@/store/useGameStore';
import { waypoints, MAP_WIDTH, MAP_HEIGHT } from './world-data';
import { milestones } from '@/data/milestones';

const { width: SCREEN_W } = Dimensions.get('window');

export const JourneyMapScroll = () => {
  const theme = useTheme();
  const { totalXP } = useGameStore();
  const scrollRef = useRef<ScrollView>(null);
  const avatarX = useSharedValue(waypoints[0].x);
  const avatarY = useSharedValue(waypoints[0].y);

  const segmentIndex = Math.min(waypoints.length - 1, Math.floor(totalXP / 100));
  const percentIntoSegment = (totalXP % 100) / 100;

  useEffect(() => {
    const target = waypoints[segmentIndex];
    
    // Animate avatar position
    avatarX.value = withTiming(target.x, { duration: 600 });
    avatarY.value = withTiming(target.y, { duration: 600 });

    // Auto-scroll to center the current segment
    scrollRef.current?.scrollTo({
      x: Math.max(0, target.x - SCREEN_W / 2),
      animated: true,
    });
  }, [totalXP]);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: avatarX.value - 18 }, // center offset
      { translateY: avatarY.value - 36 },
    ],
  }));

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ width: MAP_WIDTH }}
      style={styles.container}
    >
      {/* Background path */}
      <Image
        source={require('@/assets/map/path-bg.png')}
        style={[styles.background, { width: MAP_WIDTH, height: MAP_HEIGHT }]}
        resizeMode="contain"
      />

      {/* Waypoints */}
      {waypoints.map((pt, i) => (
        <View key={i} style={[styles.waypointContainer, { left: pt.x - 12, top: pt.y - 12 }]}>
          <Image
            source={require('@/assets/icons/star-node.png')}
            style={[
              styles.node,
              { 
                tintColor: i <= segmentIndex 
                  ? theme.colors.primary 
                  : theme.colors.outlineVariant 
              }
            ]}
          />
          <Text 
            style={[
              styles.nodeLabel,
              { 
                color: i <= segmentIndex 
                  ? theme.colors.primary 
                  : theme.colors.outlineVariant 
              }
            ]}
          >
            {milestones[i].label}
          </Text>
        </View>
      ))}

      {/* Avatar */}
      <Animated.Image
        source={require('@/assets/map/avatar.png')}
        style={[styles.avatar, avatarStyle]}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: MAP_HEIGHT,
    marginVertical: 10,
  },
  background: {
    position: 'absolute',
  },
  waypointContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  node: {
    width: 24,
    height: 24,
  },
  nodeLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 80,
  },
  avatar: {
    position: 'absolute',
    width: 36,
    height: 36,
  },
}); 