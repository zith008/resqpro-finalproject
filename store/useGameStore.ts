import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { Quest } from '@/data/quests';
import { Badge } from '@/data/badges';
import { supabase } from '../lib/supabase';

// Helper function to check and award milestones
const checkAndAwardMilestones = async (userId: string, completedQuestId: string) => {
  try {
    // Get all milestones with requirements
    const { data: milestones, error: milestonesError } = await supabase
      .from('milestones')
      .select('*')
      .eq('is_active', true);

    if (milestonesError) {
      console.error('Error fetching milestones:', milestonesError);
      return;
    }

    // Get user's completed quests
    const { data: completedQuests, error: questsError } = await supabase
      .from('daily_completions')
      .select('quest_id')
      .eq('user_id', userId);

    if (questsError) {
      console.error('Error fetching completed quests:', questsError);
      return;
    }

    const completedQuestIds = completedQuests?.map(q => q.quest_id) || [];

    // Check each milestone
    for (const milestone of milestones) {
      if (!milestone.requirement_quests) continue;

      // Count completed quests for this milestone category
      let completedCount = 0;
      const category = milestone.id; // flood, wildfire, earthquake, cyclone

      if (category === 'flood') {
        completedCount = completedQuestIds.filter(id => 
          id.includes('flood') || id.includes('hurricane')
        ).length;
      } else if (category === 'wildfire') {
        completedCount = completedQuestIds.filter(id => 
          id.includes('wildfire')
        ).length;
      } else if (category === 'earthquake') {
        completedCount = completedQuestIds.filter(id => 
          id.includes('earthquake') || id.includes('eq-')
        ).length;
      } else if (category === 'cyclone') {
        completedCount = completedQuestIds.filter(id => 
          id.includes('cyclone')
        ).length;
      } else if (category === 'master') {
        // Master milestone requires all milestone quests
        completedCount = completedQuestIds.filter(id => 
          id.includes('milestone')
        ).length;
      }

      // Check if milestone is earned
      if (completedCount >= milestone.requirement_quests) {
        // Check if user already has this milestone
        const { data: existingMilestone, error: checkError } = await supabase
          .from('user_milestones')
          .select('id')
          .eq('user_id', userId)
          .eq('milestone_id', milestone.id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking existing milestone:', checkError);
          continue;
        }

        // Award milestone if not already earned
        if (!existingMilestone) {
          const { error: insertError } = await supabase
            .from('user_milestones')
            .insert({
              user_id: userId,
              milestone_id: milestone.id,
              completed_at: new Date().toISOString()
            });

          if (insertError) {
            console.error('Error awarding milestone:', insertError);
          } else {
            console.log(`🎉 Milestone earned: ${milestone.label}!`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in checkAndAwardMilestones:', error);
  }
};

interface GameState {
  totalXP: number;
  streak: number;
  lastActiveDate: string;
  dailyCompletions: Record<string, boolean>;
  unlockedBadges: string[];
  hasShownSuccessModal: boolean;
  journeyProgress: number;
  globalBadge: Badge | null;
  userId: string | null; // Track if user is logged in
  setHasShownSuccessModal: (shown: boolean) => void;
  setJourneyProgress: (progress: number) => void;
  setGlobalBadge: (badge: Badge | null) => void;
  setUserId: (userId: string | null) => void;
  
  // Actions
  completeQuest: (questId: string, xpValue: number) => Promise<{ levelUp: boolean; newBadges: Badge[] }>;
  resetDailyProgress: () => void;
  checkAndUpdateStreak: () => void;
  getLevel: () => number;
  getXPProgress: () => number;
  
  // Supabase sync methods
  syncToSupabase: () => Promise<void>;
  loadFromSupabase: () => Promise<void>;
  forceSyncToSupabase: () => Promise<void>;
  resetAllData: () => Promise<void>;
  syncXPToSupabase: () => Promise<void>;
  clearLocalState: () => void;
  clearAllStorage: () => Promise<void>;
  clearGameStorage: () => Promise<void>;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      totalXP: 0,
      streak: 0,
      lastActiveDate: dayjs().format('YYYY-MM-DD'),
      dailyCompletions: {},
      unlockedBadges: [],
      hasShownSuccessModal: false,
      journeyProgress: 0,
      globalBadge: null,
      userId: null,
      setHasShownSuccessModal: (shown) => set({ hasShownSuccessModal: shown }),
      setJourneyProgress: (progress) => set({ journeyProgress: progress }),
      setGlobalBadge: (badge) => set({ globalBadge: badge }),
      setUserId: (userId) => {
        const currentUserId = get().userId;
        // If switching users, reset all local state
        if (currentUserId && currentUserId !== userId) {
          console.log('Switching users, resetting local state...');
          set({
            totalXP: 0,
            streak: 0,
            lastActiveDate: dayjs().format('YYYY-MM-DD'),
            dailyCompletions: {},
            unlockedBadges: [],
            hasShownSuccessModal: false,
            journeyProgress: 0,
            globalBadge: null,
            userId: userId
          });
        } else {
          set({ userId });
        }
      },

      completeQuest: async (questId: string, xpValue: number) => {
        console.log('🎯 completeQuest called:', { questId, xpValue });
        const state = get();
        console.log('🎯 Current state:', { totalXP: state.totalXP, userId: state.userId });
        
        if (!state.userId) {
          console.log('No user ID found, cannot complete quest');
          return { levelUp: false, newBadges: [] };
        }

        // Check if quest was already completed today
        if (state.dailyCompletions[questId]) {
          console.log('Quest already completed today:', questId);
          return { levelUp: false, newBadges: [] };
        }

        try {
          // Calculate new XP and level
          const currentLevel = Math.floor(state.totalXP / 100);
          const newXP = state.totalXP + xpValue;
          const newLevel = Math.floor(newXP / 100);
          const levelUp = newLevel > currentLevel;

          // Insert quest completion directly to Supabase first
          console.log('Inserting quest completion directly to Supabase:', { questId, xpValue, newXP });
          
          const { error: questError } = await supabase
            .from('daily_completions')
            .upsert({
              user_id: state.userId,
              quest_id: questId,
              completion_date: state.lastActiveDate,
              xp_earned: xpValue
            }, {
              onConflict: 'user_id,quest_id,completion_date'
            });

          if (questError) {
            console.error('Failed to insert quest completion to Supabase:', questError);
            throw questError;
          }

          // Update game state directly in Supabase
          const { error: gameStateError } = await supabase
            .from('user_game_state')
            .upsert({
              user_id: state.userId,
              total_xp: newXP,
              current_level: newLevel,
              streak: state.streak,
              last_active_date: state.lastActiveDate,
              journey_progress: Math.round(state.journeyProgress * 100), // Convert decimal to percentage
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });

          if (gameStateError) {
            console.error('Failed to update game state in Supabase:', gameStateError);
            throw gameStateError;
          }

          // Check for new badges
          const badges = require('../data/badges').badges as Badge[];
          const newBadges: Badge[] = [];
          
          badges.forEach(badge => {
            if (!state.unlockedBadges.includes(badge.id)) {
              let earned = false;
              switch (badge.type) {
                case 'xp':
                  earned = newXP >= badge.requirement;
                  break;
                case 'streak':
                  earned = state.streak >= badge.requirement;
                  break;
                case 'quests':
                  const completedCount = Object.keys({
                    ...state.dailyCompletions,
                    [questId]: true
                  }).length;
                  earned = completedCount >= badge.requirement;
                  break;
              }
              if (earned) {
                newBadges.push(badge);
              }
            }
          });

          // Insert new badges directly to Supabase
          if (newBadges.length > 0) {
            const badgeEntries = newBadges.map(badge => ({
              user_id: state.userId,
              badge_id: badge.id,
              earned_at: new Date().toISOString()
            }));

            const { error: badgeError } = await supabase
              .from('user_badges')
              .upsert(badgeEntries, {
                onConflict: 'user_id,badge_id'
              });

            if (badgeError) {
              console.error('Failed to insert badges to Supabase:', badgeError);
              // Don't throw here, badges are not critical
            } else {
              console.log('Successfully inserted badges to Supabase');
            }
          }

          // Check for milestone completion
          await checkAndAwardMilestones(state.userId, questId);

          // Update local state from Supabase data
          set(state => ({
            totalXP: newXP,
            dailyCompletions: {
              ...state.dailyCompletions,
              [questId]: true
            },
            unlockedBadges: [
              ...state.unlockedBadges,
              ...newBadges.map(b => b.id)
            ]
          }));

          // Show global notification for new badges
          if (newBadges.length > 0) {
            set({ globalBadge: newBadges[0] });
          }

          console.log('Successfully completed quest and synced to Supabase:', { questId, xpValue, newXP, levelUp, newBadges: newBadges.length });
          return { levelUp, newBadges };

        } catch (error) {
          console.error('Failed to complete quest:', error);
          // Return empty result on error
          return { levelUp: false, newBadges: [] };
        }
      },

      resetDailyProgress: () => {
        set({ dailyCompletions: {} });
      },

      checkAndUpdateStreak: () => {
        const state = get();
        const today = dayjs().format('YYYY-MM-DD');
        const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
        
        if (state.lastActiveDate === yesterday) {
          // Continue streak if we were active yesterday
          const hasCompletedQuestToday = Object.keys(state.dailyCompletions).length > 0;
          if (hasCompletedQuestToday) {
            set(state => ({
              streak: state.streak + 1,
              lastActiveDate: today
            }));
          }
        } else if (state.lastActiveDate !== today) {
          // Reset streak if we missed a day
          set({
            streak: Object.keys(state.dailyCompletions).length > 0 ? 1 : 0,
            lastActiveDate: today
          });
        }
      },

      getLevel: () => {
        return Math.floor(get().totalXP / 100);
      },

      getXPProgress: () => {
        const totalXP = get().totalXP;
        return (totalXP % 100) / 100;
      },

      // Sync current state to Supabase
      syncToSupabase: async () => {
        const state = get();
        if (!state.userId) return;

        try {
          // Update game state
          await supabase
            .from('user_game_state')
            .upsert({
              user_id: state.userId,
              total_xp: state.totalXP,
              current_level: Math.floor(state.totalXP / 100),
              streak: state.streak,
              last_active_date: state.lastActiveDate,
              journey_progress: Math.round(state.journeyProgress * 100), // Convert decimal to percentage
              updated_at: new Date().toISOString()
            });

          // Sync daily completions
          const completionEntries = Object.entries(state.dailyCompletions)
            .filter(([_, completed]) => completed)
            .map(([questId, _]) => ({
              user_id: state.userId,
              quest_id: questId,
              completion_date: state.lastActiveDate,
              xp_earned: 0 // This will be updated by the individual quest completion sync
            }));

          if (completionEntries.length > 0) {
            await supabase
              .from('daily_completions')
              .upsert(completionEntries);
          }

          // Sync badges
          const badgeEntries = state.unlockedBadges.map(badgeId => ({
            user_id: state.userId,
            badge_id: badgeId,
            earned_at: new Date().toISOString()
          }));

          if (badgeEntries.length > 0) {
            await supabase
              .from('user_badges')
              .upsert(badgeEntries);
          }

        } catch (error) {
          console.error('Error syncing to Supabase:', error);
        }
      },

      // Load state from Supabase
      loadFromSupabase: async () => {
        const state = get();
        if (!state.userId) return;

        try {
          console.log('Loading game state from Supabase for user:', state.userId);
          
          // Load game state
          const { data: gameStateData, error: gameStateError } = await supabase
            .from('user_game_state')
            .select('*')
            .eq('user_id', state.userId)
            .single();

          if (gameStateError && gameStateError.code !== 'PGRST116') {
            console.error('Error loading game state:', gameStateError);
            return;
          }

          // Load daily completions
          const { data: completionsData, error: completionsError } = await supabase
            .from('daily_completions')
            .select('quest_id')
            .eq('user_id', state.userId);

          if (completionsError) {
            console.error('Error loading completions:', completionsError);
          }

          // Load badges
          const { data: badgesData, error: badgesError } = await supabase
            .from('user_badges')
            .select('badge_id')
            .eq('user_id', state.userId);

          if (badgesError) {
            console.error('Error loading badges:', badgesError);
          }

          // Update local state with Supabase data
          if (gameStateData) {
            console.log('Found game state data:', gameStateData);
            const currentLocalState = get();
            const dailyCompletions: Record<string, boolean> = {};
            completionsData?.forEach(item => {
              dailyCompletions[item.quest_id] = true;
            });

            // Only override local data if Supabase has more recent or higher values
            const shouldUseSupabaseXP = gameStateData.total_xp > currentLocalState.totalXP;
            const shouldUseSupabaseStreak = gameStateData.streak > currentLocalState.streak;
            
            set({
              totalXP: shouldUseSupabaseXP ? (gameStateData.total_xp || 0) : currentLocalState.totalXP,
              streak: shouldUseSupabaseStreak ? (gameStateData.streak || 0) : currentLocalState.streak,
              lastActiveDate: gameStateData.last_active_date || dayjs().format('YYYY-MM-DD'),
              journeyProgress: (gameStateData.journey_progress || 0) / 100, // Convert percentage back to decimal
              dailyCompletions,
              unlockedBadges: badgesData?.map(item => item.badge_id) || []
            });
            
            console.log('Successfully loaded game state from Supabase', {
              usedSupabaseXP: shouldUseSupabaseXP,
              usedSupabaseStreak: shouldUseSupabaseStreak,
              finalXP: shouldUseSupabaseXP ? gameStateData.total_xp : currentLocalState.totalXP
            });
          } else {
            console.log('No game state data found in Supabase, keeping local data');
            // If no data in Supabase, keep the current local state
            // This prevents resetting to 0 when user has local progress but no cloud data yet
          }
        } catch (error) {
          console.error('Error loading from Supabase:', error);
        }
      },

      // Force sync to Supabase (useful for debugging)
      forceSyncToSupabase: async () => {
        const state = get();
        if (!state.userId) {
          console.log('No user ID, cannot sync to Supabase');
          return;
        }

        console.log('Force syncing game state to Supabase...');
        await syncToSupabase();
      },

      // Reset all data (both local and cloud)
      resetAllData: async () => {
        const state = get();
        
        console.log('Resetting all game data...');
        
        // Reset local state to defaults
        set({
          totalXP: 0,
          streak: 0,
          lastActiveDate: dayjs().format('YYYY-MM-DD'),
          dailyCompletions: {},
          unlockedBadges: [],
          hasShownSuccessModal: false,
          journeyProgress: 0,
          globalBadge: null,
          // Keep userId so we can clear cloud data
        });

        // Clear AsyncStorage to prevent old data from persisting
        try {
          await AsyncStorage.removeItem('resq-game-storage');
          console.log('Successfully cleared AsyncStorage');
        } catch (error) {
          console.error('Error clearing AsyncStorage:', error);
        }

        // If user is logged in, also clear cloud data
        if (state.userId) {
          try {
            console.log('Clearing cloud data for user:', state.userId);
            
            // Clear game state
            await supabase
              .from('user_game_state')
              .delete()
              .eq('user_id', state.userId);

            // Clear daily completions
            await supabase
              .from('daily_completions')
              .delete()
              .eq('user_id', state.userId);

            // Clear user badges
            await supabase
              .from('user_badges')
              .delete()
              .eq('user_id', state.userId);

            console.log('Successfully cleared all cloud data');
          } catch (error) {
            console.error('Error clearing cloud data:', error);
            // Don't throw error - local reset should still work
          }
        }
      },

      // Sync only XP to Supabase (useful for debugging)
      syncXPToSupabase: async () => {
        const state = get();
        if (!state.userId) {
          console.log('No user ID, cannot sync XP to Supabase');
          return;
        }

        try {
          console.log('Syncing XP to Supabase:', { totalXP: state.totalXP, level: Math.floor(state.totalXP / 100) });
          
          await supabase
            .from('user_game_state')
            .upsert({
              user_id: state.userId,
              total_xp: state.totalXP,
              current_level: Math.floor(state.totalXP / 100),
              streak: state.streak,
              last_active_date: state.lastActiveDate,
              journey_progress: Math.round(state.journeyProgress * 100), // Convert decimal to percentage
              updated_at: new Date().toISOString()
            });

          console.log('Successfully synced XP to Supabase');
        } catch (error) {
          console.error('Error syncing XP to Supabase:', error);
        }
      },

      // Clear all local state (useful for logout)
      clearLocalState: () => {
        console.log('Clearing all local game state...');
        set({
          totalXP: 0,
          streak: 0,
          lastActiveDate: dayjs().format('YYYY-MM-DD'),
          dailyCompletions: {},
          unlockedBadges: [],
          hasShownSuccessModal: false,
          journeyProgress: 0,
          globalBadge: null,
          userId: null
        });
      },

      // Clear all AsyncStorage data (nuclear option)
      clearAllStorage: async () => {
        console.log('Clearing all AsyncStorage data...');
        try {
          await AsyncStorage.clear();
          console.log('Successfully cleared all AsyncStorage data');
        } catch (error) {
          console.error('Error clearing AsyncStorage:', error);
        }
      },

      // Clear only game storage (more targeted)
      clearGameStorage: async () => {
        console.log('Clearing game storage...');
        try {
          await AsyncStorage.removeItem('resq-game-storage');
          console.log('Successfully cleared game storage');
        } catch (error) {
          console.error('Error clearing game storage:', error);
        }
      }
    }),
    {
      name: 'resq-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist certain fields, exclude userId to prevent cross-user contamination
      partialize: (state) => ({
        totalXP: state.totalXP,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        dailyCompletions: state.dailyCompletions,
        unlockedBadges: state.unlockedBadges,
        hasShownSuccessModal: state.hasShownSuccessModal,
        journeyProgress: state.journeyProgress,
        globalBadge: state.globalBadge,
        // Don't persist userId - it should be set fresh on each login
      }),
    }
  )
);