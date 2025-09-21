 import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Text, useTheme } from 'react-native-paper';
import { useGameStore } from '@/store/useGameStore';
import { milestones } from '@/data/milestones';

const AVATAR_SIZE = 36;
const NODE_SIZE = 24;
const NODE_GAP = 80; // px between milestones
const TOTAL_WIDTH = NODE_GAP * (milestones.length - 1);

export const JourneyMap = () => {
  const theme = useTheme();
  const { totalXP } = useGameStore();
  const translateX = useSharedValue(0);

  // convert XP → X-pos
  const segment = Math.min(
    milestones.length - 1,
    Math.floor(totalXP / 100)
  );
  const percentIntoSegment = (totalXP % 100) / 100;

  useEffect(() => {
    translateX.value = withTiming(
      segment * NODE_GAP + percentIntoSegment * NODE_GAP,
      { duration: 600 }
    );
  }, [totalXP]);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.wrapper}>
      {/* Line */}
      <View
        style={[
          styles.line,
          { backgroundColor: theme.colors.outlineVariant },
        ]}
      />

      {/* Milestones */}
      {milestones.map((m, idx) => (
        <View
          key={m.id}
          style={[
            styles.node,
            { left: idx * NODE_GAP - NODE_SIZE / 2 },
          ]}
        >
          <View
            style={[
              styles.dot,
              {
                backgroundColor:
                  idx <= segment
                    ? theme.colors.primary
                    : theme.colors.outlineVariant,
              },
            ]}
          />
          <Text style={styles.nodeLabel}>{m.label}</Text>
        </View>
      ))}

      {/* Avatar */}
      <Animated.View
        style={[
          styles.avatarContainer,
          avatarStyle,
          { left: -AVATAR_SIZE / 2 },
        ]}
      >
        <Image
          source={require('@/assets/avatar.png')}
          style={styles.avatar}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 70,
    marginHorizontal: 20,
    marginTop: 4,
  },
  line: {
    position: 'absolute',
    top: 34,
    height: 4,
    width: TOTAL_WIDTH,
    borderRadius: 2,
  },
  node: {
    position: 'absolute',
    top: 22,
    width: NODE_SIZE,
    alignItems: 'center',
  },
  dot: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
  },
  nodeLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  avatarContainer: {
    position: 'absolute',
    top: 0,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
}); 