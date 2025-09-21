import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Image, StyleSheet, Dimensions, Modal } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle, G } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  withTiming,
  interpolate,
  withRepeat,
  withSequence,
  withDelay,
  useAnimatedStyle,
  Easing
} from 'react-native-reanimated';
import { Text, useTheme, Button } from 'react-native-paper';
import { useGameStore } from '@/store/useGameStore';
import { milestones } from '@/data/milestones';
import ConfettiCannon from 'react-native-confetti-cannon';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_WIDTH = 1800;
const MAP_HEIGHT = 400;

// Predefined (x,y) positions along the curve for each milestone
const checkpointCoords = [
  { x: 120, y: 250 },    // Flood
  { x: 450, y: 150 },    // Wildfire
  { x: 850, y: 280 },    // Earthquake
  { x: 1250, y: 180 },   // Cyclone
  { x: 1600, y: 250 },   // Master
];

// Enhanced path for the journey with more dynamic curves
const COMPLETE_PATH = "M 120 250 Q 285 80, 450 150 Q 650 200, 850 280 Q 1050 220, 1250 180 Q 1425 200, 1600 250";

// Background terrain path for visual depth
const TERRAIN_PATH = "M 0 350 Q 200 320, 400 340 Q 600 360, 800 330 Q 1000 350, 1200 320 Q 1400 340, 1600 350 L 1800 350 L 1800 400 L 0 400 Z";

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
  const pulseAnimation = useSharedValue(0);

  const completedMilestoneIndex = getCompletedMilestoneIndex(dailyCompletions);
  const segment = completedMilestoneIndex;

  // Update progress when journeyProgress changes
  useEffect(() => {
    progress.value = journeyProgress;
  }, [journeyProgress]);

  // Pulse animation for active milestone
  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    const target = checkpointCoords[segment];
    
    // Animate progress and maintain it at 1 if completed
    const targetProgress = segment === checkpointCoords.length - 1 ? 1 : segment / (checkpointCoords.length - 1);
    progress.value = withTiming(targetProgress, { duration: 800, easing: Easing.out(Easing.cubic) });
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
          [1, 1.05]
        ) }
      ]
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(pulseAnimation.value, [0, 1], [0.3, 0.8]),
      transform: [{ scale: interpolate(pulseAnimation.value, [0, 1], [1, 1.2]) }]
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
            <SvgLinearGradient id="terrainGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#4a90e2" stopOpacity="0.1" />
              <Stop offset="1" stopColor="#2c5aa0" stopOpacity="0.3" />
            </SvgLinearGradient>
            <SvgLinearGradient id="pathGradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#FFD700" />
              <Stop offset="0.5" stopColor="#FFA500" />
              <Stop offset="1" stopColor="#FF8C00" />
            </SvgLinearGradient>
            <SvgLinearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#dd0436" />
              <Stop offset="0.5" stopColor="#ff6b35" />
              <Stop offset="1" stopColor="#f7931e" />
            </SvgLinearGradient>
            <SvgLinearGradient id="backgroundGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#f8f9fa" />
              <Stop offset="1" stopColor="#e9ecef" />
            </SvgLinearGradient>
          </Defs>
          
          {/* Background terrain */}
          <Path
            d={TERRAIN_PATH}
            fill="url(#terrainGradient)"
          />
          
          {/* Background Path with shadow */}
          <Path
            d={COMPLETE_PATH}
            stroke="#d1d5db"
            strokeWidth={18}
            fill="none"
            strokeLinecap="round"
            opacity={0.3}
          />
          
          {/* Main Path */}
          <Path
            d={COMPLETE_PATH}
            stroke="url(#pathGradient)"
            strokeWidth={16}
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Progress Path */}
          <Path
            d={COMPLETE_PATH}
            stroke="url(#progressGradient)"
            strokeWidth={16}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2500}
            strokeDashoffset={2500 * (1 - progress.value)}
          />
          
          {/* Progress glow effect */}
          <Path
            d={COMPLETE_PATH}
            stroke="#ffffff"
            strokeWidth={20}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2500}
            strokeDashoffset={2500 * (1 - progress.value)}
            opacity={0.6}
          />
        </Svg>

        {/* Milestones */}
        {checkpointCoords.map((point, index) => {
          const isCompleted = index <= segment;
          const isCurrent = index === segment;
          const isNext = index === segment + 1;
          
          return (
            <View
              key={milestones[index].id}
              style={[
                styles.milestone,
                { 
                  left: point.x - 40,
                  top: point.y - 40,
                },
              ]}
            >
              {/* Pulse effect for current milestone */}
              {isCurrent ? (
                <Animated.View style={[styles.pulseRing, pulseStyle]} />
              ) : null}
              
              {/* Milestone container with gradient background */}
              <LinearGradient
                colors={
                  isCompleted 
                    ? ['#FFD700', '#FFA500'] 
                    : isNext 
                    ? ['#e0e0e0', '#bdbdbd']
                    : ['#f5f5f5', '#e0e0e0']
                }
                style={[
                  styles.milestoneContainer,
                  {
                    shadowColor: isCompleted ? '#FFD700' : '#000',
                    shadowOpacity: isCompleted ? 0.3 : 0.1,
                    shadowRadius: isCompleted ? 8 : 4,
                    elevation: isCompleted ? 6 : 2,
                  }
                ]}
              >
                <Image
                  source={milestones[index].icon}
                  style={[
                    styles.icon,
                    { 
                      opacity: isCompleted ? 1 : isNext ? 0.7 : 0.4,
                      tintColor: isCompleted ? undefined : '#999'
                    }
                  ]}
                  resizeMode="contain"
                />
              </LinearGradient>
              
              {/* Milestone label with enhanced styling */}
              <View style={styles.labelContainer}>
                <Text 
                  style={[
                    styles.label,
                    { 
                      color: isCompleted 
                        ? '#2c3e50'
                        : isNext
                        ? '#666'
                        : '#999',
                      fontWeight: isCompleted ? 'bold' : 'normal'
                    }
                  ]}
                >
                  {milestones[index].label}
                </Text>
                {isCompleted ? (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>✓</Text>
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}

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
  milestoneContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
  },
  icon: {
    width: 50,
    height: 50,
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    opacity: 0.3,
  },
  labelContainer: {
    position: 'absolute',
    bottom: -35,
    alignItems: 'center',
    width: 120,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 2,
  },
  completedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
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
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
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
    fontFamily: 'Poppins_700Bold',
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
  },
  modalButton: {
    width: '100%',
  },
}); 