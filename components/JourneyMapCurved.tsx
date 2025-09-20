import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Image, StyleSheet, Dimensions, Modal } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  withTiming,
  interpolate,
  withRepeat,
  withSequence,
  withDelay,
  useAnimatedStyle
} from 'react-native-reanimated';
import { Text, useTheme, Button } from 'react-native-paper';
import { useGameStore } from '@/store/useGameStore';
import { milestones } from '@/data/milestones';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_WIDTH = 1600;
const MAP_HEIGHT = 320;

// Predefined (x,y) positions along the curve for each milestone
const checkpointCoords = [
  { x: 80, y: 200 },    // Flood
  { x: 400, y: 120 },   // Wildfire
  { x: 750, y: 220 },   // Earthquake
  { x: 1100, y: 140 },  // Cyclone
  { x: 1400, y: 200 },  // Master
];

// Complete path for the journey - adjusted to match milestone positions exactly
const COMPLETE_PATH = "M 80 200 Q 240 80, 400 120 T 750 220 T 1100 140 T 1400 200";

// Helper function to check if milestone quests are completed
const getCompletedMilestoneIndex = (dailyCompletions: Record<string, boolean>) => {
  const milestoneQuests = [
    ['flood-milestone-1', 'flood-milestone-2'],
    ['wildfire-milestone-1', 'wildfire-milestone-2'],
    ['earthquake-milestone-1', 'earthquake-milestone-2'],
    ['cyclone-milestone-1', 'cyclone-milestone-2'],
    ['master-milestone-1', 'master-milestone-2']
  ];

  // Find the highest completed milestone
  let highestCompleted = -1;
  for (let i = 0; i < milestoneQuests.length; i++) {
    const [quest1, quest2] = milestoneQuests[i];
    if (dailyCompletions[quest1] && dailyCompletions[quest2]) {
      highestCompleted = i;
    }
  }
  return highestCompleted >= 0 ? highestCompleted : 0;
};

export const JourneyMapCurved = () => {
  const theme = useTheme();
  const { 
    totalXP, 
    dailyCompletions, 
    hasShownSuccessModal, 
    setHasShownSuccessModal,
    journeyProgress,
    setJourneyProgress
  } = useGameStore();
  const scrollRef = useRef<ScrollView>(null);
  const progress = useSharedValue(journeyProgress);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const confettiRef = useRef<ConfettiCannon>(null);

  const completedMilestoneIndex = getCompletedMilestoneIndex(dailyCompletions);
  const segment = completedMilestoneIndex;

  // Update progress when journeyProgress changes
  useEffect(() => {
    progress.value = journeyProgress;
  }, [journeyProgress]);

  useEffect(() => {
    const target = checkpointCoords[segment];
    
    // Animate progress and maintain it at 1 if completed
    const targetProgress = segment === checkpointCoords.length - 1 ? 1 : segment / (checkpointCoords.length - 1);
    progress.value = withTiming(targetProgress, { duration: 600 });
    setJourneyProgress(targetProgress);

    // Auto-scroll to center the current segment
    scrollRef.current?.scrollTo({
      x: Math.max(0, target.x - SCREEN_WIDTH / 2),
      animated: true,
    });

    // Show success modal only if we haven't shown it before
    if (segment === checkpointCoords.length - 1 && !hasShownSuccessModal) {
      setShowSuccessModal(true);
      setHasShownSuccessModal(true);
      // Trigger confetti after a short delay
      setTimeout(() => {
        confettiRef.current?.start();
      }, 500);
    }
  }, [segment, hasShownSuccessModal]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(
          progress.value,
          [0, 1],
          [1, 1.1]
        ) }
      ]
    };
  });

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
        style={styles.container}
      >
        <Svg
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            <LinearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#FFD700" />
              <Stop offset="1" stopColor="#FFD700" />
            </LinearGradient>
          </Defs>
          
          {/* Background Path */}
          <Path
            d={COMPLETE_PATH}
            stroke={theme.colors.outlineVariant}
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Golden Trace */}
          <Path
            d={COMPLETE_PATH}
            stroke="url(#gold)"
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2000}
            strokeDashoffset={2000 * (1 - progress.value)}
          />
        </Svg>

        {/* Milestones */}
        {checkpointCoords.map((point, index) => (
          <View
            key={milestones[index].id}
            style={[
              styles.milestone,
              { 
                left: point.x - 32,
                top: point.y - 32,
                transform: [{ scale: index <= segment ? 1.1 : 1 }]
              },
            ]}
          >
            <Image
              source={milestones[index].icon}
              style={[
                styles.icon,
                { opacity: index <= segment ? 1 : 0.5 }
              ]}
              resizeMode="contain"
            />
            <Text 
              style={[
                styles.label,
                { 
                  color: index <= segment 
                    ? '#FFD700'
                    : theme.colors.outlineVariant 
                }
              ]}
            >
              {milestones[index].label}
            </Text>
          </View>
        ))}

        {/* Progress Message */}
        {completedMilestoneIndex === 0 && !dailyCompletions['flood-milestone-1'] && !dailyCompletions['flood-milestone-2'] && (
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              Complete milestone quests to check your progress
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <ConfettiCannon
              ref={confettiRef}
              count={200}
              origin={{ x: SCREEN_WIDTH / 2, y: 0 }}
              autoStart={false}
              fadeOut={true}
            />
            <Image
              source={milestones[milestones.length - 1].icon}
              style={styles.modalIcon}
              resizeMode="contain"
            />
            <Text variant="headlineMedium" style={styles.modalTitle}>
              Congratulations!
            </Text>
            <Text variant="bodyLarge" style={[styles.modalText, { color: theme.colors.onSurfaceVariant }]}>
              You've achieved Preparedness Pro status! Your dedication to learning about disaster preparedness is truly remarkable.
            </Text>
            <Button
              mode="contained"
              onPress={handleCloseModal}
              style={styles.modalButton}
            >
              Continue Journey
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: MAP_HEIGHT,
  },
  milestone: {
    position: 'absolute',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 100,
    height: 100,
  },
  label: {
    position: 'absolute',
    bottom: -24,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 100,
  },
  messageContainer: {
    position: 'absolute',
    top: MAP_HEIGHT - 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  message: {
    color: '#666',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalIcon: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    width: '100%',
  },
}); 