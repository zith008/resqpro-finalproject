import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { Quest } from '@/data/quests';
import { Badge } from '@/data/badges';
import { supabase } from '../lib/supabase';

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
  completeQuest: (questId: string, xpValue: number) => { levelUp: boolean; newBadges: Badge[] };
  resetDailyProgress: () => void;
  checkAndUpdateStreak: () => void;
  getLevel: () => number;
  getXPProgress: () => number;
  
  // Supabase sync methods
  syncToSupabase: () => Promise<void>;
  loadFromSupabase: () => Promise<void>;
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
      setUserId: (userId) => set({ userId }),

      completeQuest: (questId: string, xpValue: number) => {
        const state = get();
        const currentLevel = Math.floor(state.totalXP / 100);
        const newXP = state.totalXP + xpValue;
        const newLevel = Math.floor(newXP / 100);
        const levelUp = newLevel > currentLevel;

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

        return { levelUp, newBadges };
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
              journey_progress: state.journeyProgress,
              updated_at: new Date().toISOString()
            });

          // Sync daily completions
          const completionEntries = Object.entries(state.dailyCompletions)
            .filter(([_, completed]) => completed)
            .map(([questId, _]) => ({
              user_id: state.userId,
              quest_id: questId,
              completion_date: state.lastActiveDate,
              xp_earned: 0 // Will be updated by quest completion
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
          // Load game state
          const { data: gameStateData } = await supabase
            .from('user_game_state')
            .select('*')
            .eq('user_id', state.userId)
            .single();

          // Load daily completions
          const { data: completionsData } = await supabase
            .from('daily_completions')
            .select('quest_id')
            .eq('user_id', state.userId);

          // Load badges
          const { data: badgesData } = await supabase
            .from('user_badges')
            .select('badge_id')
            .eq('user_id', state.userId);

          // Update local state with Supabase data
          if (gameStateData) {
            const dailyCompletions: Record<string, boolean> = {};
            completionsData?.forEach(item => {
              dailyCompletions[item.quest_id] = true;
            });

            set({
              totalXP: gameStateData.total_xp,
              streak: gameStateData.streak,
              lastActiveDate: gameStateData.last_active_date,
              journeyProgress: gameStateData.journey_progress,
              dailyCompletions,
              unlockedBadges: badgesData?.map(item => item.badge_id) || []
            });
          }
        } catch (error) {
          console.error('Error loading from Supabase:', error);
        }
      }
    }),
    {
      name: 'resq-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);