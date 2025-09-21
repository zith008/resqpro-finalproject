import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Card, IconButton, useTheme, Banner, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getNetworkStateAsync } from 'expo-network';
import MarkdownDisplay from 'react-native-markdown-display';
import { ArrowLeft, Shield, BookOpen } from 'lucide-react-native';
import { getGuideContent } from '@/utils/guides';
import { Guide } from '@/types/guides';


export default function GuideScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [isOnline, setIsOnline] = useState(true);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Get gradient colors based on guide type
  const getGradientColors = (guideSlug: string): [string, string] => {
    switch (guideSlug) {
      case 'first-aid':
        return ['#e53e3e', '#c53030']; // Red gradient for medical
      case 'water-purification':
        return ['#3182ce', '#2c5282']; // Blue gradient for water
      case 'fire-safety':
        return ['#f56565', '#e53e3e']; // Orange-red gradient for fire
      case 'emergency-shelter':
        return ['#38a169', '#2f855a']; // Green gradient for shelter
      case 'signaling-rescue':
        return ['#805ad5', '#6b46c1']; // Purple gradient for communication
      case 'emergency-food':
        return ['#d69e2e', '#b7791f']; // Yellow gradient for food
      case 'power-outage':
        return ['#f6ad55', '#ed8936']; // Orange gradient for power
      case 'navigation-basics':
        return ['#319795', '#2c7a7b']; // Teal gradient for navigation
      case 'emergency-contacts':
        return ['#4299e1', '#3182ce']; // Blue gradient for communication
      case 'natural-disasters':
        return ['#2d3748', '#1a202c']; // Dark gradient for disasters
      default:
        return ['#4a5568', '#2d3748']; // Default gray gradient
    }
  };

  useEffect(() => {
    checkNetworkStatus();
    loadGuide();
  }, [slug]);

  const checkNetworkStatus = async () => {
    try {
      const networkState = await getNetworkStateAsync();
      setIsOnline(networkState.isConnected ?? true);
    } catch (error) {
      setIsOnline(false);
    }
  };

  const loadGuide = async () => {
    try {
      const guideData = await getGuideContent(slug);
      setGuide(guideData);
      setContent(guideData.content);
    } catch (error) {
      Alert.alert('Error', 'Failed to load guide content');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!guide) {
    return null;
  }

  const gradientColors = getGradientColors(slug || '');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: gradientColors[0] }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={gradientColors[0]} />
      
      {/* Beautiful Header with Gradient */}
      <LinearGradient
        colors={gradientColors}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <BookOpen size={24} color="#ffffff" />
            </View>
            <View style={styles.titleContainer}>
              <Text variant="headlineMedium" style={styles.headerTitle} numberOfLines={1}>
                {slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Guide'}
              </Text>
              <Text variant="bodyMedium" style={styles.headerSubtitle}>
                Emergency Preparedness Guide
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Offline Banner */}
      {!isOnline && (
        <Banner
          visible={true}
          actions={[]}
          icon={() => <Shield size={16} color={theme.colors.tertiary} />}
          style={{
            backgroundColor: theme.colors.tertiaryContainer,
            marginBottom: 0
          }}
        >
          <Text style={{ 
            color: theme.colors.tertiary, 
            fontWeight: '600',
            fontSize: 14
          }}>
            Offline Mode Active
          </Text>
        </Banner>
      )}

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={[styles.contentCard, { backgroundColor: '#ffffff' }]} elevation={4}>
          <Card.Content style={styles.cardContent}>
            <MarkdownDisplay style={{
              body: {
                color: '#2d3748',
                fontSize: 16,
                lineHeight: 24,
              },
              heading1: {
                color: theme.colors.onSurface,
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 16,
              },
              heading2: {
                color: theme.colors.onSurface,
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 12,
              },
              heading3: {
                color: theme.colors.onSurface,
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 8,
              },
              paragraph: {
                marginBottom: 16,
              },
              list_item: {
                marginBottom: 8,
              },
              bullet_list: {
                marginBottom: 16,
              },
              ordered_list: {
                marginBottom: 16,
              },
              code_inline: {
                backgroundColor: theme.colors.surfaceVariant,
                padding: 4,
                borderRadius: 4,
                fontFamily: 'monospace',
              },
              code_block: {
                backgroundColor: theme.colors.surfaceVariant,
                padding: 16,
                borderRadius: 8,
                fontFamily: 'monospace',
                marginBottom: 16,
              },
            }}>
              {content}
            </MarkdownDisplay>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    paddingTop: 0,
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    paddingTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  contentCard: {
    borderRadius: 16,
    marginBottom: 16,
  },
  cardContent: {
    padding: 20,
  },
});