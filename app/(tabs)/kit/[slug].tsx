import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, IconButton, useTheme, Banner, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getNetworkStateAsync } from 'expo-network';
import MarkdownDisplay from 'react-native-markdown-display';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { getGuideContent } from '@/utils/guides';
import { Guide } from '@/types/guides';

// Guide content mapping
const guideContent: Record<string, string> = {
  'first-aid': `# First Aid Basics

## Essential First Aid Skills

### 1. Assessing the Situation
- Check for danger
- Ensure scene safety
- Assess victim's condition

### 2. Basic Life Support
- Check responsiveness
- Call for help
- Begin CPR if needed

### 3. Wound Care
- Clean the wound
- Apply direct pressure
- Bandage properly

### 4. Emergency Response
- Stay calm
- Call emergency services
- Follow dispatcher instructions`,

  'water-purification': `# Water Purification Methods

## Why Purify Water?
Contaminated water can contain harmful bacteria, viruses, and parasites that cause serious illness.

## Boiling Method (Most Reliable)
1. **Bring water to rolling boil**
2. **Boil for 3 minutes** (5 minutes above 6,500 feet)
3. **Let cool before drinking**
4. **Store in clean container**

## Water Purification Tablets
- Follow package instructions carefully
- Usually 1 tablet per liter of water
- Wait recommended time (typically 30 minutes)
- Shake well after adding tablet

## Solar Disinfection (SODIS)
1. Fill clear plastic bottle with water
2. Shake vigorously for 20 seconds
3. Lay bottle on side in direct sunlight
4. Leave for 6 hours (2 days if cloudy)

## Improvised Filtration
### Sand and Gravel Filter
1. Cut bottom off plastic bottle
2. Layer from bottom up:
   - Coffee filter or clean cloth
   - Fine sand
   - Coarse sand
   - Small gravel
   - Large gravel
3. Pour water slowly through top

### Cloth Filtration
- Use clean cotton cloth
- Fold into multiple layers
- Pour water through slowly
- **Note: This removes particles, not bacteria**

## Natural Indicators
### Safe Water Sources
- Fast-flowing streams
- Springs from rock
- Rain water (collected cleanly)

### Avoid These Sources
- Stagnant pools
- Water near animal waste
- Discolored or foul-smelling water
- Water with algae growth

## Emergency Purification
If no other options available:
1. Let water settle (particles sink)
2. Pour clear water through cloth
3. Add 2 drops bleach per liter (unscented)
4. Mix well and wait 30 minutes

**Always have multiple purification methods available in your emergency kit.**`,

  'fire-safety': `# Fire Safety & Emergency Fire Starting

## Fire Safety First

### Prevention
- Keep flammable materials away from heat sources
- Maintain smoke detectors with fresh batteries
- Have escape plan and practice regularly
- Know location of fire extinguishers

### If Fire Starts
1. **Alert everyone** - shout "FIRE!"
2. **Call 911** immediately
3. **Get out fast** - don't gather belongings
4. **Stay low** - smoke rises, cleaner air near floor
5. **Feel doors** - if hot, find another exit
6. **Meet at designated spot** outside

## Emergency Fire Starting

### Basic Fire Requirements
- **Fuel**: Tinder, kindling, fuel wood
- **Heat**: Spark or flame source
- **Oxygen**: Proper air flow

### Fire Structure
1. **Tinder**: Dry grass, paper, birch bark
2. **Kindling**: Pencil-thin to thumb-thick dry wood
3. **Fuel wood**: Progressively larger pieces

### Methods Without Matches

#### Flint and Steel
1. Strike steel against flint
2. Catch sparks in tinder bundle
3. Blow gently when smoking
4. Add kindling when flame appears

#### Fire Bow Method
1. Create bow with string and curved wood
2. Make fire board with notch
3. Use spindle to create friction
4. Catch ember in tinder nest

#### Solar Method (Magnifying Glass)
1. Focus sunlight through lens
2. Aim at tinder bundle
3. Keep steady until smoking
4. Blow gently to create flame

### Fire Safety Rules
- Clear area of flammable debris (10-foot circle)
- Never leave fire unattended
- Keep water nearby for extinguishing
- Fully extinguish before leaving

### Extinguishing Fire
1. Pour water on flames
2. Stir ashes with stick
3. Pour more water
4. Stir again until cool
5. Check for hidden embers

**Practice fire starting in safe, controlled conditions before emergency situations.**`,

  'emergency-shelter': `# Emergency Shelter Construction

## Shelter Priorities
1. **Protection from elements** (wind, rain, cold)
2. **Insulation from ground** (prevents heat loss)
3. **Proper ventilation** (prevents condensation)
4. **Camouflaged location** (if needed)

## Site Selection
### Good Locations
- Level ground
- Natural windbreaks
- Near water source (but not too close)
- Away from hazards (dead trees, rock slides)
- South-facing slope (northern hemisphere)

### Avoid These Areas
- Bottom of hills (cold air settles)
- Ridge tops (exposed to wind)
- Flash flood zones
- Under dead trees
- Near animal trails

## Basic Shelter Types

### Debris Hut
**Best for: Cold weather, single person**
1. Find or create ridgepole (8-10 feet long)
2. Support one end 3 feet high (rock, tree fork)
3. Lean ribs against ridgepole at 45° angle
4. Cover with debris (leaves, pine needles)
5. Make debris layer 2-3 feet thick
6. Create door plug to seal entrance

### Lean-To Shelter
**Best for: Mild weather, quick setup**
1. Place ridgepole between two trees
2. Lean branches against ridgepole
3. Cover with bark, leaves, or tarp
4. Build reflector wall opposite opening
5. Create fire pit in front of opening

### A-Frame Shelter
**Best for: Versatile, longer-term**
1. Create triangular frame with ridge pole
2. Add ribs down both sides
3. Cover entire structure with debris
4. Seal all gaps to prevent heat loss

## Insulation from Ground
- Pine needles (6-8 inches deep)
- Dry leaves
- Grass bundles
- Pine boughs
- Emergency blanket (reflective side up)

## Improvised Materials
### Natural Materials
- Large bark sheets
- Pine boughs
- Grass bundles
- Mud and clay (chinking)
- Snow (insulation layer)

### Man-made Materials
- Plastic sheeting
- Emergency blankets
- Clothing layers
- Cardboard
- Newspapers

## Cold Weather Tips
- Make shelter small (easier to heat)
- Body heat should warm interior
- Use body heat to pre-warm bedding
- Wear dry clothes to sleep
- Keep spare socks dry

## Hot Weather Considerations
- Maximize airflow and shade
- Build off ground if possible
- Light-colored materials reflect heat
- Position opening away from sun

**Remember: Shelter is often your first priority in survival situations. Practice building different types before you need them.**`,

  'signaling-rescue': `# Signaling for Rescue

## Universal Distress Signals
- **Three of anything**: Three whistle blasts, three fires, three rock piles
- **SOS**: Three short, three long, three short (... --- ...)
- **Help**: Spell out with rocks, logs, or in sand
- **X**: Large X visible from air means "need medical help"

## Visual Signals

### Signal Fire
1. **Build three fires** in triangle pattern (100 feet apart)
2. **Use green vegetation** to create smoke during day
3. **Use dry wood** for bright flames at night
4. **Keep materials ready** to quickly build up signal

### Signal Mirror
1. **Aim reflected sunlight** at aircraft or distant people
2. **Use V-sight method**: Make V with fingers, aim through V
3. **Flash repeatedly** - three quick flashes
4. **Any reflective surface works**: Phone screen, CD, metal

### Ground Signals
- **Large letters**: H, X, or arrow made with rocks/logs
- **Bright clothing**: Laid out in large patterns
- **Contrast**: Dark materials on light ground, light on dark

## Audio Signals

### Whistle
- **Three sharp blasts** repeated
- **More effective than shouting** (travels farther)
- **Save your voice** and energy
- **Pattern every few minutes**

### Shouting
- **"HELP!"** is universally recognized
- **Cup hands around mouth** to direct sound
- **Listen for responses** between calls
- **Shout from high ground** when possible

### Improvised Noise
- Bang rocks together
- Hit metal objects
- Use car horn if available

## Electronic Signals

### Cell Phone
- **Text over voice** (uses less battery, works with weak signal)
- **Emergency location services** (some phones have this feature)
- **Save battery**: Turn off unnecessary apps
- **High ground**: Better signal reception

### Emergency Beacons
- **Personal Locator Beacon (PLB)**: Sends GPS coordinates to rescue
- **Satellite messenger**: Two-way communication
- **EPIRB**: For marine emergencies

## Location Awareness
- **Mark your trail** so rescuers can follow
- **Stay in one place** if possible
- **Make yourself visible** from multiple directions
- **Prepare signal materials** in advance

## Timing Your Signals
### Best Times
- **Dawn and dusk**: Search aircraft most active
- **Clear weather**: Better visibility
- **When you hear aircraft**: Be ready to signal immediately

### Continuous Signals
- **Keep signal materials ready** at all times
- **Have backup signals** prepared
- **Multiple signal types** increase chances

## What NOT to Do
- Don't waste energy on random signals
- Don't abandon working signals to chase aircraft
- Don't use all your signal materials at once
- Don't signal only once - repeat patterns

**The key to successful rescue is making yourself easier to find. Prepare multiple signal methods and use them consistently.**`,

  'emergency-food': `# Emergency Food Sources

## Safety First
**Never eat anything you cannot identify with 100% certainty.** When in doubt, don't risk it.

## Foraging Guidelines

### Universal Edibility Test
**Only use if absolutely necessary:**
1. **Inspect**: Look for worms, insects, or discoloration
2. **Smell**: Should not smell unusual or rotten
3. **Skin contact**: Rub on wrist, wait 15 minutes
4. **Lip test**: Touch to lips, wait 15 minutes
5. **Tongue test**: Small amount on tongue, wait 15 minutes
6. **Chew and spit**: Chew small amount, spit out, wait 15 minutes
7. **Swallow small amount**: Wait 8 hours for reaction
8. **If no reaction**: Eat normal amount

### Safe Wild Plants (Common in North America)
- **Dandelions**: Entire plant edible, rich in vitamins
- **Plantain**: Leaves are edible raw or cooked
- **Cattails**: Roots, shoots, and flower spikes edible
- **Acorns**: Shell and leach tannins, then grind
- **Pine needles**: Tea for vitamin C
- **Clover**: Flowers and leaves edible

### Plants to AVOID
- **Mushrooms**: Too risky for amateurs
- **White berries**: Generally poisonous
- **Plants with milky sap**: Often toxic
- **Three-leaved plants**: Could be poison ivy/oak
- **Beans in pods**: Many wild beans are toxic

## Animal Protein Sources

### Insects (High protein)
**Safe options:**
- **Grasshoppers**: Remove wings and legs, cook thoroughly
- **Crickets**: Cook thoroughly before eating
- **Ants**: Avoid red ants, cook others
- **Grubs**: Found under logs, high protein

**Avoid these insects:**
- Brightly colored insects
- Insects that smell bad
- Hairy caterpillars
- Insects near dead animals

### Fish and Water Animals
- **Fish**: All freshwater fish are edible when cooked
- **Crayfish**: Found under rocks in streams
- **Frogs**: Legs are edible, avoid bright-colored species

## Food Preparation

### Cooking Methods
1. **Always cook meat and fish** to kill parasites
2. **Boiling**: Safest method, purifies water too
3. **Roasting**: Over open fire, cook thoroughly
4. **Smoking**: Preserves meat for later

### Preservation
- **Smoking**: Hang thin strips over smoky fire
- **Drying**: Cut meat thin, dry in sun
- **Cold storage**: Use cold streams or snow

## Rationing Strategies
- **Water first**: More critical than food
- **Small frequent meals**: Better than large meals
- **Save energy**: Don't expend more calories hunting than gained
- **Emergency rations**: Save commercial food for when foraging fails

## Emergency Kit Foods
### Long-term Storage
- Energy bars
- Nuts and dried fruits
- Canned goods
- Rice and beans
- Honey (never spoils)
- Salt (for preservation)

### Calorie-dense Options
- Peanut butter
- Chocolate
- Dried meats (jerky)
- Granola
- Nuts

## Hunting and Trapping
### Simple Traps
- **Deadfall trap**: Heavy object triggered to fall
- **Snare trap**: Loop that tightens around animal
- **Fish trap**: Funnel-shaped enclosure in stream

### Regulations
- **Know local laws**: Hunting/trapping may be illegal
- **Emergency situations**: Survival takes precedence
- **Minimize suffering**: Quick, humane methods

## Water from Food
- **Cactus fruits**: Good water source
- **Dew collection**: Use cloth to absorb morning dew
- **Plant moisture**: Some plants store water in stems

**Remember: In most emergency situations, rescue comes before starvation becomes critical. Focus on signaling and shelter first.**`
};

export default function GuideScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [isOnline, setIsOnline] = useState(true);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <IconButton
          icon={({ size, color }) => <ArrowLeft size={size} color={color} />}
          size={24}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text variant="titleLarge" style={styles.title} numberOfLines={1}>
          {slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Guide'}
        </Text>
      </View>

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
      >
        <Card style={[styles.contentCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <MarkdownDisplay style={{
              body: {
                color: theme.colors.onSurface,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  backButton: {
    margin: 0,
  },
  title: {
    flex: 1,
    marginLeft: 8,
    fontWeight: 'bold',
    paddingTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  contentCard: {
    elevation: 0,
  },
});