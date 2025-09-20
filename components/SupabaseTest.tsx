import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { supabase } from '../lib/supabase'

export function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Not tested')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setConnectionStatus('Testing...')
    
    try {
      // Test basic connection by trying to get the current user
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        // If auth error, try a simple query to test connection
        const { data, error: queryError } = await supabase
          .from('test')
          .select('*')
          .limit(1)
        
        if (queryError && queryError.code === 'PGRST116') {
          // Table doesn't exist, but connection works
          setConnectionStatus('✅ Connected (no test table found)')
        } else if (queryError) {
          setConnectionStatus(`❌ Connection error: ${queryError.message}`)
        } else {
          setConnectionStatus('✅ Connected successfully')
        }
      } else {
        setConnectionStatus('✅ Connected successfully')
      }
    } catch (error) {
      setConnectionStatus(`❌ Connection failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Connection Test</Text>
      <Text style={styles.status}>{connectionStatus}</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={testConnection}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Testing...' : 'Test Connection'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.instructions}>
        Make sure to set up your .env file with your Supabase credentials before testing.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructions: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
})
