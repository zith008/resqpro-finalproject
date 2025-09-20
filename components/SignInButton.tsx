import React, { useState } from 'react'
import { TouchableOpacity, Text, StyleSheet, Alert, Modal } from 'react-native'
import { useAuth } from '../hooks/useAuth'
import { AuthForm } from './AuthForm'

export function SignInButton() {
  const { user, signOut, loading, error } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Don't show anything if Supabase isn't configured
  if (error || loading) {
    return null
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      Alert.alert('Success', 'You have been signed out')
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out')
    }
  }

  if (user) {
    return (
      <TouchableOpacity style={styles.signedInButton} onPress={handleSignOut}>
        <Text style={styles.signedInText}>
          👤 {user.email} | Sign Out
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <TouchableOpacity 
        style={styles.signInButton} 
        onPress={() => setShowAuthModal(true)}
      >
        <Text style={styles.signInText}>Sign In / Sign Up</Text>
      </TouchableOpacity>

      <Modal
        visible={showAuthModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowAuthModal(false)}
          >
            <Text style={styles.closeButtonText}>✕ Close</Text>
          </TouchableOpacity>
          <AuthForm onAuthSuccess={() => setShowAuthModal(false)} />
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  signInButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  signedInButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  signedInText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
  },
})
