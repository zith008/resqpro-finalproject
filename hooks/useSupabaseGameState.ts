import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

interface GameStateData {
  total_xp: number
  current_level: number
  streak: number
  last_active_date: string
  journey_progress: number
}

export function useSupabaseGameState() {
  const [loading, setLoading] = useState(true)
  const [gameState, setGameState] = useState<GameStateData | null>(null)
  const { user } = useAuth()

  // Load game state from Supabase
  const loadGameState = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_game_state')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading game state:', error)
      } else if (data) {
        setGameState(data)
      }
    } catch (error) {
      console.error('Error loading game state:', error)
    } finally {
      setLoading(false)
    }
  }

  // Save game state to Supabase
  const saveGameState = async (updates: Partial<GameStateData>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_game_state')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error saving game state:', error)
      } else {
        // Update local state
        setGameState(prev => prev ? { ...prev, ...updates } : null)
      }
    } catch (error) {
      console.error('Error saving game state:', error)
    }
  }

  // Record quest completion
  const recordQuestCompletion = async (questId: string, xpEarned: number) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('daily_completions')
        .upsert({
          user_id: user.id,
          quest_id: questId,
          completion_date: new Date().toISOString().split('T')[0],
          xp_earned: xpEarned
        })

      if (error) {
        console.error('Error recording quest completion:', error)
      }
    } catch (error) {
      console.error('Error recording quest completion:', error)
    }
  }

  // Get user's completed quests
  const getCompletedQuests = async (): Promise<string[]> => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from('daily_completions')
        .select('quest_id')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error getting completed quests:', error)
        return []
      }

      return data?.map(item => item.quest_id) || []
    } catch (error) {
      console.error('Error getting completed quests:', error)
      return []
    }
  }

  // Load user badges
  const getUserBadges = async (): Promise<string[]> => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error getting user badges:', error)
        return []
      }

      return data?.map(item => item.badge_id) || []
    } catch (error) {
      console.error('Error getting user badges:', error)
      return []
    }
  }

  // Award badge to user
  const awardBadge = async (badgeId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_badges')
        .upsert({
          user_id: user.id,
          badge_id: badgeId,
          earned_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error awarding badge:', error)
      }
    } catch (error) {
      console.error('Error awarding badge:', error)
    }
  }

  useEffect(() => {
    if (user) {
      loadGameState()
    } else {
      setLoading(false)
    }
  }, [user])

  return {
    gameState,
    loading,
    saveGameState,
    recordQuestCompletion,
    getCompletedQuests,
    getUserBadges,
    awardBadge,
    refreshGameState: loadGameState
  }
}
