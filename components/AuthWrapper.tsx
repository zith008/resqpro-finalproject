import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useAuth } from '../hooks/useAuth'
import { useGameSync } from '../hooks/useGameSync'
import { AuthForm } from './AuthForm'

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth()
  const { isSynced, isLoading } = useGameSync()

  if (loading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return <>{children}</>
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
})
