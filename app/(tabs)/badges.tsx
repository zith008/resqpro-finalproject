import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Pressable, StatusBar } from 'react-native';
import { Text, Card, useTheme, ProgressBar } from 'react-native-paper';
import { Lock, Trophy, Star, Zap, Target, Award } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedScrollHandler,
  withSpring,
  withSequence,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { useGameStore } from '@/store/useGameStore';
import { badges, Badge } from '@/data/badges';
import { BadgeViewerModal } from '@/components/BadgeViewerModal';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 columns with margins

export default function BadgesScreen() {
  const theme = useTheme();
  const { unlockedBadges, totalXP, streak } = useGameStore();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(1);

  const isBadgeUnlocked = (badgeId: string) => {
    return unlockedBadges.includes(badgeId);
  };

  const getBadgeProgress = (badge: Badge) => {
    switch (badge.type) {
      case 'xp':
        return Math.min(totalXP, badge.requirement);
      case 'streak':
        return Math.min(streak, badge.requirement);
      case 'quests':
        return Math.min(unlockedBadges.length, badge.requirement);
      default:
        return 0;
    }
  };

  const getProgressPercentage = (badge: Badge) => {
    const progress = getBadgeProgress(badge);
    return Math.min((progress / badge.requirement) * 100, 100);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      headerOpacity.value = interpolate(
        event.contentOffset.y,
        [0, 100],
        [1, 0.8],
        'clamp'
      );
    },
  });

  const unlockedCount = unlockedBadges.length;
  const totalCount = badges.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#dd0436' }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#dd0436" translucent={false} />
      <Animated.ScrollView 
        style={styles.scrollView}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header with Gradient */}
        <LinearGradient
          colors={['#dd0436', '#b8002a']}
          style={styles.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
            <View style={styles.heroContent}>
              <View style={styles.heroIconContainer}>
                <Trophy size={32} color="#FFD700" />
              </View>
              <Text variant="headlineMedium" style={styles.heroTitle}>
                Achievement Hall
              </Text>
              <Text variant="bodyLarge" style={styles.heroSubtitle}>
                Your preparedness journey milestones
              </Text>
              
              {/* Progress Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text variant="headlineSmall" style={styles.statNumber}>
                    {unlockedCount}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Unlocked
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text variant="headlineSmall" style={styles.statNumber}>
                    {totalCount}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Total
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text variant="headlineSmall" style={styles.statNumber}>
                    {Math.round(completionPercentage)}%
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Complete
                  </Text>
                </View>
              </View>
              
              {/* Overall Progress Bar */}
              <View style={styles.overallProgressContainer}>
                <ProgressBar 
                  progress={completionPercentage / 100} 
                  color="#FFD700"
                  style={styles.overallProgressBar}
                />
                <Text variant="bodySmall" style={styles.progressText}>
                  {Math.round(completionPercentage)}% Complete
                </Text>
              </View>
            </View>
        </LinearGradient>

        {/* Badges Grid */}
        <View style={styles.badgesGrid}>
          {badges.map((badge, index) => {
            const isUnlocked = isBadgeUnlocked(badge.id);
            const progress = getBadgeProgress(badge);
            const progressPercentage = getProgressPercentage(badge);
            const translateY = useSharedValue(0);
            const scale = useSharedValue(1);
            
            // Enhanced animations
            const cardStyle = useAnimatedStyle(() => ({
              transform: [
                { translateY: translateY.value + (scrollY.value * 0.02) },
                { scale: scale.value }
              ],
            }));

            const handlePressIn = () => {
              if (isUnlocked) {
                scale.value = withSpring(0.95);
              }
            };

            const handlePressOut = () => {
              scale.value = withSpring(1);
            };

            return (
              <Animated.View key={badge.id} style={[styles.badgeContainer, cardStyle]}>
                <Pressable
                  onPress={() => isUnlocked && setSelectedBadge(badge)}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  style={styles.badgePressable}
                >
                  <Card 
                    style={[
                      styles.badgeCard,
                      { 
                        width: cardWidth,
                        elevation: isUnlocked ? 8 : 2,
                        shadowColor: isUnlocked ? '#FFD700' : '#000',
                        shadowOpacity: isUnlocked ? 0.3 : 0.1,
                        shadowRadius: isUnlocked ? 12 : 4,
                      }
                    ]}
                  >
                    {isUnlocked ? (
                      <LinearGradient
                        colors={['#FFD700', '#FFA500', '#FF8C00']}
                        style={styles.badgeGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Card.Content style={styles.badgeContent}>
                          <View style={styles.badgeHeader}>
                            <View style={styles.unlockedBadge}>
                              <Star size={16} color="#ffffff" />
                            </View>
                          </View>
                          
                          <View style={styles.imageContainer}>
                            <Animated.Image
                              source={badge.icon}
                              style={styles.badgeImage}
                              resizeMode="contain"
                            />
                          </View>
                          
                          <Text 
                            variant="titleSmall" 
                            style={styles.badgeTitleUnlocked}
                          >
                            {badge.title}
                          </Text>
                          
                          <Text 
                            variant="bodySmall" 
                            style={styles.badgeDescriptionUnlocked}
                          >
                            {badge.description}
                          </Text>
                          
                          <View style={styles.completedBadge}>
                            <Award size={12} color="#ffffff" />
                            <Text style={styles.completedText}>Earned</Text>
                          </View>
                        </Card.Content>
                      </LinearGradient>
                    ) : (
                      <Card.Content style={styles.badgeContent}>
                        <View style={styles.badgeHeader}>
                          <View style={styles.lockedBadge}>
                            <Lock size={16} color="#999" />
                          </View>
                        </View>
                        
                        <View style={styles.imageContainer}>
                          <Animated.Image
                            source={badge.icon}
                            style={[
                              styles.badgeImage,
                              { opacity: 0.4, tintColor: '#999' }
                            ]}
                            resizeMode="contain"
                          />
                        </View>
                        
                        <Text 
                          variant="titleSmall" 
                          style={styles.badgeTitleLocked}
                        >
                          {badge.title}
                        </Text>
                        
                        <Text 
                          variant="bodySmall" 
                          style={styles.badgeDescriptionLocked}
                        >
                          {badge.description}
                        </Text>
                        
                        {/* Progress for locked badges */}
                        <View style={styles.progressContainer}>
                          <ProgressBar 
                            progress={progressPercentage / 100} 
                            color="#dd0436"
                            style={styles.progressBar}
                          />
                          <Text style={styles.progressText}>
                            {progress}/{badge.requirement}
                          </Text>
                        </View>
                      </Card.Content>
                    )}
                  </Card>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </Animated.ScrollView>

      <BadgeViewerModal
        visible={!!selectedBadge}
        badge={selectedBadge}
        onDismiss={() => setSelectedBadge(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  
  // Hero Header Styles
  heroGradient: {
    paddingTop: 0,
    paddingBottom: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: 50,
  },
  heroIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 20,
  },
  
  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  statLabel: {
    color: '#ffffff',
    opacity: 0.8,
    fontFamily: 'Poppins_400Regular',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  
  // Overall Progress
  overallProgressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  overallProgressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 8,
  },
  progressText: {
    color: '#ffffff',
    opacity: 0.8,
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
  
  // Badges Grid
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  badgeContainer: {
    marginBottom: 16,
  },
  badgePressable: {
    borderRadius: 16,
  },
  badgeCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  badgeGradient: {
    borderRadius: 16,
  },
  badgeContent: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  badgeHeader: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  unlockedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeImage: {
    width: '100%',
    height: '100%',
  },
  badgeTitleUnlocked: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 14,
  },
  badgeTitleLocked: {
    color: '#2c3e50',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 14,
  },
  badgeDescriptionUnlocked: {
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    lineHeight: 14,
    marginBottom: 8,
  },
  badgeDescriptionLocked: {
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    lineHeight: 14,
    marginBottom: 8,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
    fontFamily: 'Poppins_600SemiBold',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e0e0e0',
    marginBottom: 4,
  },
});