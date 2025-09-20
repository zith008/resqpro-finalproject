import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { useGameStore } from '../store/useGameStore'

/**
 * Hook that automatically syncs game state with Supabase when user logs in/out
 * This ensures seamless data persistence across devices
 */
export function useGameSync() {
  const { user, loading: authLoading, error } = useAuth()
  const { userId, setUserId, syncToSupabase, loadFromSupabase } = useGameStore()

  useEffect(() => {
    const syncGameData = async () => {
      if (authLoading || error) return

      if (user && !userId) {
        // User just logged in - load their data from Supabase
        console.log('User logged in, loading data from Supabase...')
        setUserId(user.id)
        await loadFromSupabase()
      } else if (!user && userId) {
        // User just logged out - clear userId but keep local data
        console.log('User logged out, clearing user ID...')
        setUserId(null)
      }
    }

    syncGameData()
  }, [user, userId, authLoading, setUserId, loadFromSupabase])

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
