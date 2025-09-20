import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedScrollHandler,
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

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.ScrollView 
        style={styles.scrollView}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>
            Achievement Badges
          </Text>
          <Text 
            variant="bodyLarge" 
            style={{ 
              color: theme.colors.onSurfaceVariant,
              marginTop: 4
            }}
          >
            {unlockedBadges.length} of {badges.length} unlocked
          </Text>
        </View>

        {/* Badges Grid */}
        <View style={styles.badgesGrid}>
          {badges.map((badge, index) => {
            const isUnlocked = isBadgeUnlocked(badge.id);
            const progress = getBadgeProgress(badge);
            const translateY = useSharedValue(0);
            
            // Parallax effect
            const parallaxStyle = useAnimatedStyle(() => ({
              transform: [
                { translateY: translateY.value + (scrollY.value * 0.05) }
              ],
            }));

            return (
              <Animated.View key={badge.id} style={parallaxStyle}>
                <Pressable
                  onPress={() => isUnlocked && setSelectedBadge(badge)}
                  style={({ pressed }) => [
                    styles.badgePressable,
                    isUnlocked && pressed && { transform: [{ scale: 0.95 }] }
                  ]}
                >
                  <Card 
                    style={[
                      styles.badgeCard,
                      { 
                        width: cardWidth,
                        backgroundColor: isUnlocked 
                          ? theme.colors.primaryContainer 
                          : theme.colors.surfaceVariant,
                        opacity: isUnlocked ? 1 : 0.6,
                        elevation: isUnlocked ? 3 : 0
                      }
                    ]}
                  >
                    <Card.Content style={styles.badgeContent}>
                      <View style={styles.imageContainer}>
                        <Animated.Image
                          source={badge.icon}
                          style={[
                            styles.badgeImage,
                            !isUnlocked && { opacity: 0.3, tintColor: '#777' }
                          ]}
                          resizeMode="contain"
                        />
                        {!isUnlocked && (
                          <View style={styles.lockOverlay}>
                            <Lock size={24} color={theme.colors.onSurfaceVariant} />
                          </View>
                        )}
                      </View>
                      
                      <Text 
                        variant="titleSmall" 
                        style={{ 
                          fontWeight: 'bold',
                          textAlign: 'center',
                          marginTop: 12,
                          marginBottom: 4,
                          color: isUnlocked 
                            ? theme.colors.primary 
                            : theme.colors.onSurfaceVariant
                        }}
                      >
                        {badge.title}
                      </Text>
                      
                      <Text 
                        variant="bodySmall" 
                        style={{ 
                          textAlign: 'center',
                          color: theme.colors.onSurfaceVariant,
                          marginBottom: 8
                        }}
                      >
                        {badge.description}
                      </Text>
                      
                      {!isUnlocked && (
                        <Text 
                          variant="bodySmall" 
                          style={{ 
                            textAlign: 'center',
                            color: theme.colors.primary,
                            fontWeight: '600'
                          }}
                        >
                          {progress}/{badge.requirement}
                        </Text>
                      )}
                    </Card.Content>
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
  header: {
    padding: 20,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  badgePressable: {
    marginBottom: 16,
  },
  badgeCard: {
    overflow: 'hidden',
  },
  badgeContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeImage: {
    width: '100%',
    height: '100%',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 40,
  },
});