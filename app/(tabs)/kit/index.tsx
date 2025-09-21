import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, StatusBar } from 'react-native';
import { Text, Card, useTheme, Banner } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getNetworkStateAsync } from 'expo-network';
import {
  Heart,
  Droplets,
  Flame,
  Shield,
  Radio,
  Home,
  Mountain,
  Utensils
} from 'lucide-react-native';

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: keyof typeof iconMap;
  filename: string;
}

const iconMap = {
  heart: Heart,
  droplets: Droplets,
  flame: Flame,
  shield: Shield,
  radio: Radio,
  home: Home,
  mountain: Mountain,
  utensils: Utensils,
} as const;

const guides: Guide[] = [
  {
    id: 'first-aid',
    title: 'First Aid Basics',
    description: 'Essential first aid techniques for emergency situations',
    category: 'Medical',
    icon: 'heart',
    filename: 'first_aid.md'
  },
  {
    id: 'water-purification',
    title: 'Water Purification',
    description: 'Methods to purify water when clean sources are unavailable',
    category: 'Survival',
    icon: 'droplets',
    filename: 'water_purification.md'
  },
  {
    id: 'fire-safety',
    title: 'Fire Safety & Starting',
    description: 'Fire prevention, safety protocols, and emergency fire starting',
    category: 'Safety',
    icon: 'flame',
    filename: 'fire_safety.md'
  },
  {
    id: 'emergency-shelter',
    title: 'Emergency Shelter',
    description: 'Building temporary shelter in emergency situations',
    category: 'Survival',
    icon: 'home',
    filename: 'emergency_shelter.md'
  },
  {
    id: 'signaling-rescue',
    title: 'Signaling for Rescue',
    description: 'Communication methods and rescue signaling techniques',
    category: 'Communication',
    icon: 'radio',
    filename: 'signaling_rescue.md'
  },
  {
    id: 'emergency-food',
    title: 'Emergency Food Sources',
    description: 'Finding and preparing food in survival situations',
    category: 'Survival',
    icon: 'utensils',
    filename: 'emergency_food.md'
  }
];

export default function SurvivalKitScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    checkNetworkStatus();
  }, []);

  const checkNetworkStatus = async () => {
    try {
      const networkState = await getNetworkStateAsync();
      setIsOnline(networkState.isConnected ?? true);
    } catch (error) {
      // Default to offline if we can't check
      setIsOnline(false);
    }
  };

  const handleGuidePress = (guide: Guide) => {
    router.push(`/kit/${guide.id}`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Medical':
        return theme.colors.primary;
      case 'Safety':
        return theme.colors.secondary;
      case 'Survival':
        return theme.colors.tertiary;
      case 'Communication':
        return '#9c27b0'; // Purple
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#dd0436' }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#dd0436" />
      
      {/* Header Banner */}
      <LinearGradient
        colors={['#dd0436', '#b8002a']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Shield size={24} color="#ffffff" />
            </View>
            <View style={styles.titleContainer}>
              <Text variant="headlineMedium" style={styles.headerTitle}>
                Emergency Survival Kit
              </Text>
              <Text variant="bodyMedium" style={styles.headerSubtitle}>
                Essential guides for emergency preparedness
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Offline Status Banner */}
        <Banner
          visible={!isOnline}
          actions={[]}
          icon={() => (
            <Shield size={20} color={theme.colors.tertiary} />
          )}
          style={{
            backgroundColor: theme.colors.tertiaryContainer,
            marginHorizontal: 20,
            marginBottom: 16,
            borderRadius: 8
          }}
        >
          <Text style={{ color: theme.colors.tertiary, fontWeight: '600' }}>
            ✓ Offline Mode - All guides available without internet
          </Text>
        </Banner>

        {/* Guides List */}
        <View style={styles.guidesContainer}>
          {guides.map(guide => {
            const IconComponent = iconMap[guide.icon];
            const categoryColor = getCategoryColor(guide.category);
            
            return (
              <Card 
                key={guide.id}
                style={[styles.guideCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => handleGuidePress(guide)}
              >
                <Card.Content style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={[
                      styles.iconContainer,
                      { backgroundColor: `${categoryColor}20` }
                    ]}>
                      <IconComponent 
                        size={24} 
                        color={categoryColor}
                      />
                    </View>
                    
                    <View style={[
                      styles.categoryBadge,
                      { backgroundColor: `${categoryColor}15` }
                    ]}>
                      <Text 
                        variant="bodySmall" 
                        style={{ 
                          color: categoryColor,
                          fontWeight: '600'
                        }}
                      >
                        {guide.category}
                      </Text>
                    </View>
                  </View>
                  
                  <Text 
                    variant="titleMedium" 
                    style={{ 
                      fontWeight: 'bold',
                      marginTop: 12,
                      marginBottom: 4,
                      color: theme.colors.onSurface
                    }}
                  >
                    {guide.title}
                  </Text>
                  
                  <Text 
                    variant="bodyMedium" 
                    style={{ 
                      color: theme.colors.onSurfaceVariant,
                      lineHeight: 20
                    }}
                  >
                    {guide.description}
                  </Text>
                </Card.Content>
              </Card>
            );
          })}
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text 
            variant="bodySmall" 
            style={{ 
              color: theme.colors.onSurfaceVariant,
              textAlign: 'center',
              lineHeight: 18
            }}
          >
            All guides are stored locally and available offline.{'\n'}
            No internet connection required.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: 'Poppins_700Bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  guidesContainer: {
    paddingHorizontal: 20,
  },
  guideCard: {
    marginBottom: 12,
    elevation: 2,
  },
  cardContent: {
    paddingVertical: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  footer: {
    padding: 20,
    paddingTop: 16,
  },
});