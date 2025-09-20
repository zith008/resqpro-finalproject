import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { Redirect } from 'expo-router'
import { useAuth } from '../hooks/useAuth'

export default function Index() {
  const { user, loading, error } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Give auth system time to initialize
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Show loading screen while auth initializes
  if (loading || !isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading ResQ Pro...</Text>
      </View>
    )
  }

  // If user is logged in, go to main app
  if (user) {
    return <Redirect href="/(tabs)/home" />
  }

  // If Supabase isn't configured, go directly to main app (guest mode)
  if (error) {
    return <Redirect href="/(tabs)/home" />
  }

  // Otherwise, show login screen
  return <Redirect href="/auth/login" />
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
}) 