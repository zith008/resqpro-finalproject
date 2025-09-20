import { Guide } from '@/types/guides';

// Guide content mapping
const guideContent: { [key: string]: string } = {
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

## Essential Techniques

### 1. Boiling
- Bring water to rolling boil
- Maintain boil for 1-3 minutes
- Let cool before drinking

### 2. Chemical Treatment
- Use water purification tablets
- Follow package instructions
- Wait recommended time

### 3. Filtration
- Use portable water filter
- Check filter specifications
- Maintain filter properly`,

  'fire-safety': `# Fire Safety & Starting

## Safety First

### 1. Fire Prevention
- Clear flammable materials
- Maintain safe distances
- Monitor fire at all times

### 2. Starting a Fire
- Gather dry materials
- Create proper structure
- Use appropriate ignition

### 3. Emergency Response
- Call emergency services
- Use fire extinguisher if safe
- Evacuate if necessary`,

  'emergency-shelter': `# Emergency Shelter

## Building Basics

### 1. Location Selection
- Find level ground
- Avoid flood areas
- Consider wind direction

### 2. Materials
- Use available resources
- Ensure stability
- Consider insulation

### 3. Construction
- Build sturdy frame
- Add weather protection
- Secure all components`,

  'signaling-rescue': `# Signaling for Rescue

## Communication Methods

### 1. Visual Signals
- Use bright colors
- Create large patterns
- Maintain visibility

### 2. Sound Signals
- Use whistle patterns
- Create loud noises
- Follow standard codes

### 3. Emergency Devices
- Use signal mirrors
- Deploy emergency beacons
- Follow device instructions`,

  'emergency-food': `# Emergency Food Sources

## Finding Food

### 1. Safe Sources
- Identify edible plants
- Hunt small game
- Fish in safe waters

### 2. Preparation
- Clean thoroughly
- Cook properly
- Store safely

### 3. Conservation
- Ration supplies
- Preserve excess
- Monitor freshness`
};

export const getGuideContent = async (slug: string): Promise<Guide> => {
  if (!guideContent[slug]) {
    throw new Error('Guide not found');
  }

  return {
    id: slug,
    title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    content: guideContent[slug],
    category: 'Emergency',
    icon: 'shield',
    filename: `${slug}.md`
  };
}; 