import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { useGameStore } from '../store/useGameStore'

/**
 * Hook that automatically syncs game state with Supabase when user logs in/out
 * This ensures seamless data persistence across devices
 */
export function useGameSync() {
  const { user, loading: authLoading, error } = useAuth()
  const { userId, setUserId, syncToSupabase, loadFromSupabase, clearLocalState } = useGameStore()

  useEffect(() => {
    const syncGameData = async () => {
      if (authLoading || error) return

      if (user && !userId) {
        // User just logged in - check for local progress first
        console.log('User logged in, checking for local progress...')
        const currentState = useGameStore.getState()
        const hasLocalProgress = currentState.totalXP > 0 || currentState.streak > 0 || Object.keys(currentState.dailyCompletions).length > 0
        
        setUserId(user.id)
        
        if (hasLocalProgress) {
          // User has local progress, sync it to Supabase first
          console.log('User has local progress, syncing to Supabase...')
          await syncToSupabase()
        } else {
          // No local progress, load from Supabase
          console.log('No local progress, loading data from Supabase...')
          await loadFromSupabase()
        }
      } else if (!user && userId) {
        // User just logged out - clear all local state
        console.log('User logged out, clearing all local state...')
        clearLocalState()
      }
    }

    syncGameData()
  }, [user, userId, authLoading, setUserId, loadFromSupabase, syncToSupabase, clearLocalState])

  // Auto-sync to Supabase when user is logged in and data changes
  useEffect(() => {
    if (user && userId && !authLoading && !error) {
      const syncInterval = setInterval(() => {
        syncToSupabase()
      }, 30000) // Sync every 30 seconds

      return () => clearInterval(syncInterval)
    }
  }, [user, userId, authLoading, error, syncToSupabase])

  return {
    isSynced: !!(user && userId),
    isLoggedIn: !!user,
    isLoading: authLoading
  }
}
