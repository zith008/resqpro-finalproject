import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native'
import { TextInput, Button, Card } from 'react-native-paper'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'expo-router'

const { width, height } = Dimensions.get('window')

export default function SignupScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signUp } = useAuth()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await signUp(email, password)
      
      if (error) {
        setError(error.message)
      } else {
        // Navigate directly to main app since email verification is disabled
        router.replace('/(tabs)/home')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const goToLogin = () => {
    router.push('/auth/login')
  }


  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#dd0436', '#b8002a']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {/* Header Section */}
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <MaterialCommunityIcons 
                    name="shield-plus" 
                    size={60} 
                    color="#ffffff" 
                  />
                  <Text style={styles.appName}>ResQ Pro</Text>
                </View>
                <Text style={styles.welcomeText}>Join ResQ Pro!</Text>
                <Text style={styles.subtitle}>
                  Create your account to start your emergency preparedness journey
                </Text>
              </View>

              {/* Decorative Elements */}
              <View style={styles.decorativeContainer}>
                <View style={[styles.decorativeCircle, styles.circle1]} />
                <View style={[styles.decorativeCircle, styles.circle2]} />
                <View style={[styles.decorativeCircle, styles.circle3]} />
              </View>

              {/* Form Card */}
              <Card style={styles.formCard} elevation={4}>
                <Card.Content style={styles.formContent}>
                  <View style={styles.formHeader}>
                    <Text style={styles.formTitle}>Create Account</Text>
                    <Text style={styles.formSubtitle}>Fill in your details to get started</Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <MaterialCommunityIcons 
                        name="email-outline" 
                        size={20} 
                        color="#dd0436" 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.input}
                        outlineColor="#e0e0e0"
                        activeOutlineColor="#dd0436"
                        contentStyle={styles.inputContent}
                      />
                    </View>

                    <View style={styles.inputWrapper}>
                      <MaterialCommunityIcons 
                        name="lock-outline" 
                        size={20} 
                        color="#dd0436" 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry
                        autoCapitalize="none"
                        style={styles.input}
                        outlineColor="#e0e0e0"
                        activeOutlineColor="#dd0436"
                        contentStyle={styles.inputContent}
                      />
                    </View>

                    <View style={styles.inputWrapper}>
                      <MaterialCommunityIcons 
                        name="lock-check-outline" 
                        size={20} 
                        color="#dd0436" 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        mode="outlined"
                        secureTextEntry
                        autoCapitalize="none"
                        style={styles.input}
                        outlineColor="#e0e0e0"
                        activeOutlineColor="#dd0436"
                        contentStyle={styles.inputContent}
                      />
                    </View>

                    {error ? (
                      <View style={styles.errorContainer}>
                        <MaterialCommunityIcons 
                          name="alert-circle-outline" 
                          size={16} 
                          color="#dd0436" 
                        />
                        <Text style={styles.errorText}>{error}</Text>
                      </View>
                    ) : null}

                    <Button
                      mode="contained"
                      onPress={handleSignup}
                      loading={loading}
                      disabled={loading}
                      style={styles.createAccountButton}
                      buttonColor="#dd0436"
                      labelStyle={styles.buttonLabel}
                      contentStyle={styles.buttonContent}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </View>

                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <View style={styles.actionButtons}>
                    <Button
                      mode="outlined"
                      onPress={goToLogin}
                      style={styles.signInButton}
                      labelStyle={styles.outlinedButtonLabel}
                      contentStyle={styles.outlinedButtonContent}
                    >
                      Sign In
                    </Button>

                  </View>
                </Card.Content>
              </Card>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    zIndex: 0,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  circle1: {
    width: 120,
    height: 120,
    backgroundColor: '#ffba00',
    top: 50,
    right: -30,
  },
  circle2: {
    width: 80,
    height: 80,
    backgroundColor: '#ff8e00',
    top: 120,
    left: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    top: 200,
    right: 50,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  formContent: {
    padding: 20,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dd0436',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#ffffff',
    paddingLeft: 50,
  },
  inputContent: {
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#dd0436',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  createAccountButton: {
    borderRadius: 12,
    marginTop: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
  actionButtons: {
    gap: 12,
  },
  signInButton: {
    borderRadius: 12,
    borderColor: '#dd0436',
    borderWidth: 2,
  },
  outlinedButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dd0436',
  },
  outlinedButtonContent: {
    paddingVertical: 8,
  },
})
