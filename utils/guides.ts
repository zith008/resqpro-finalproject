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

### 2. Starting a Firer
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
- Monitor freshness`,

  'power-outage': `# Power Outage Survival Guide

## Immediate Actions

### When Power Goes Out
1. **Check if it's just your home** - Look at neighbors' lights
2. **Report the outage** - Call your utility company
3. **Turn off major appliances** - Prevent power surge damage
4. **Keep refrigerator/freezer closed** - Food stays cold longer
5. **Use flashlights, not candles** - Safer lighting option

### First 30 Minutes
- **Locate emergency supplies**
- **Check battery levels** on phones and devices
- **Inform family members** of the situation
- **Secure your home** - Lock doors and windows
- **Check on neighbors** if safe to do so

## Lighting Solutions

### Safe Lighting Options
- **LED flashlights** (most efficient)
- **Headlamps** (hands-free operation)
- **Battery-powered lanterns**
- **Solar-powered lights**
- **Glow sticks** (emergency backup)

### Avoid These
- **Candles** (fire hazard)
- **Gas stoves** for lighting
- **Generators indoors** (carbon monoxide risk)
- **Car engines in garage** (carbon monoxide)

## Food Safety

### Refrigerator Guidelines
- **Keep doors closed** - Food stays cold 4 hours
- **Freezer stays frozen** - 24-48 hours if full
- **Use perishables first** - Dairy, meat, leftovers
- **Group items together** - Helps maintain cold
- **Add ice** if available to extend cooling

### Safe Food Temperatures
- **Below 40°F** - Safe for refrigerated items
- **Below 0°F** - Safe for frozen items
- **When in doubt, throw it out** - Food poisoning risk

### Emergency Food Options
- **Canned goods** (don't require refrigeration)
- **Dried foods** (nuts, crackers, cereal)
- **Peanut butter** (high calorie, no refrigeration)
- **Granola bars** (portable energy)
- **Bottled water** (hydration essential)

## Heating and Cooling

### Staying Warm (Winter)
- **Layer clothing** - Multiple thin layers
- **Close off unused rooms** - Conserve heat
- **Use blankets and sleeping bags**
- **Huddle together** - Body heat sharing
- **Avoid alcohol** - Actually lowers body temperature

### Staying Cool (Summer)
- **Stay hydrated** - Drink water regularly
- **Wear light, loose clothing**
- **Stay in basement** - Coolest part of house
- **Use wet cloths** - Evaporative cooling
- **Avoid strenuous activity**

## Communication

### Emergency Contacts
- **Utility company** - Report outages
- **Emergency services** - 911 for life-threatening situations
- **Family/friends** - Let them know you're safe
- **Work/school** - Inform of your situation

### Communication Devices
- **Cell phones** - Conserve battery, use sparingly
- **Battery-powered radio** - Get news updates
- **Car radio** - Alternative news source
- **Two-way radios** - Family communication
- **Whistle** - Signal for help if needed

## Generator Safety

### If Using Generator
- **Place outdoors only** - 20 feet from house
- **Never run in garage** - Carbon monoxide risk
- **Use heavy-duty extension cords**
- **Turn off before refueling**
- **Let cool before refueling**

### Generator Maintenance
- **Test monthly** - Ensure it works
- **Keep fuel fresh** - Add stabilizer
- **Change oil regularly** - Per manufacturer
- **Store fuel safely** - Away from heat sources

## Long-term Outage (3+ Days)

### Water Management
- **Fill bathtubs** - For flushing toilets
- **Store drinking water** - 1 gallon per person per day
- **Boil water** if contamination suspected
- **Use water purification tablets**

### Sanitation
- **Limit toilet flushing** - Use bucket method
- **Dispose of waste properly** - Bury or bag
- **Maintain hygiene** - Hand sanitizer, wet wipes
- **Keep living areas clean**

### Mental Health
- **Stay connected** - Talk to family/friends
- **Maintain routine** - As much as possible
- **Stay informed** - But limit news consumption
- **Help others** - Community support
- **Practice stress relief** - Deep breathing, meditation

## Prevention and Preparation

### Emergency Kit Essentials
- **Flashlights and batteries**
- **Battery-powered radio**
- **First aid kit**
- **Non-perishable food**
- **Bottled water**
- **Blankets and warm clothing**
- **Cash** (ATMs may not work)
- **Phone chargers and power banks**

### Home Preparation
- **Install surge protectors**
- **Consider whole-house generator**
- **Insulate pipes** (prevent freezing)
- **Trim trees near power lines**
- **Keep emergency contacts updated**

**Remember: Most power outages are short-term. Stay calm, stay safe, and help your neighbors when possible.**`,

  'navigation-basics': `# Emergency Navigation Without GPS

## Basic Navigation Principles

### Understanding Direction
- **North, South, East, West** - Cardinal directions
- **Sun rises in East, sets in West** - Universal truth
- **Magnetic vs True North** - Compass shows magnetic north
- **Declination** - Difference between magnetic and true north

### Using the Sun
#### Finding Direction
1. **Morning**: Sun in East, shadows point West
2. **Noon**: Sun in South (Northern Hemisphere), shadows point North
3. **Evening**: Sun in West, shadows point East

#### Shadow Stick Method
1. **Place stick vertically** in level ground
2. **Mark shadow tip** with stone
3. **Wait 15-30 minutes**
4. **Mark new shadow tip**
5. **Line between marks** points East-West
6. **First mark is West**, second is East

### Using Stars (Northern Hemisphere)

#### North Star (Polaris)
- **Find Big Dipper** (Ursa Major)
- **Follow pointer stars** (end of dipper bowl)
- **Extend line 5 times** the distance
- **Reaches North Star** - Always points North
- **Height above horizon** = Your latitude

## Natural Navigation Methods

### Tree and Plant Indicators
#### Tree Growth Patterns
- **Trees lean away from wind** - Prevailing wind direction
- **Branches longer on sunny side** - South in Northern Hemisphere
- **Moss grows on north side** - Shadier, cooler side
- **Tree rings thicker on south side** - More sunlight

#### Plant Behavior
- **Sunflowers face east** in morning
- **Flowers open toward sun** - Track sun's path
- **Leaves orient toward light** - South-facing

### Water Flow Patterns
- **Rivers flow downhill** - Toward lower elevation
- **Streams join larger rivers** - Follow to civilization
- **Water seeks lowest point** - Valleys and depressions
- **Coastal areas** - Water flows to ocean

## Using a Compass

### Basic Compass Use
1. **Hold level** - Parallel to ground
2. **Away from metal** - Avoid interference
3. **Let needle settle** - Wait for it to stop moving
4. **Red needle points North** - Magnetic north
5. **Read bearing** - Where you want to go

### Taking a Bearing
1. **Point compass** at destination
2. **Rotate bezel** until needle aligns with orienting arrow
3. **Read bearing** at index line
4. **Follow bearing** while walking
5. **Check frequently** - Stay on course

## Emergency Navigation Techniques

### Lost in Wilderness
1. **Stop and think** - Don't panic
2. **Stay put** - Easier to find you
3. **Signal for help** - Make yourself visible
4. **Conserve energy** - Don't wander aimlessly
5. **Use landmarks** - Find your way back

### Finding Civilization
- **Follow streams** - Lead to rivers, then towns
- **Look for power lines** - Follow to civilization
- **Find roads** - Even dirt roads lead somewhere
- **Listen for sounds** - Traffic, machinery, voices
- **Look for smoke** - Indicates human activity

### Emergency Direction Finding
#### Watch Method (Analog)
1. **Point hour hand** at sun
2. **Bisect angle** between hour hand and 12
3. **Line points South** (Northern Hemisphere)
4. **Works best** around noon

## Navigation Tools

### Essential Items
- **Compass** - Most reliable direction finder
- **Map** - Topographic map of area
- **Watch** - Time and direction finding
- **Protractor** - Measure bearings
- **Pencil** - Mark positions and routes

### Improvised Tools
- **Stick and shadow** - Sun compass
- **Watch** - Direction finding
- **Natural features** - Trees, rocks, streams
- **Celestial bodies** - Sun, moon, stars

## Common Mistakes

### What to Avoid
- **Panic** - Leads to poor decisions
- **Ignoring terrain** - Follows straight lines
- **Not checking progress** - Gets lost easily
- **Overconfidence** - Assumes you know where you are
- **Poor planning** - No backup routes

### Best Practices
- **Plan your route** - Before you start
- **Check frequently** - Confirm your position
- **Use multiple methods** - Don't rely on one technique
- **Stay oriented** - Know which way is which
- **Practice regularly** - Build navigation skills

**Remember: Navigation is a skill that improves with practice. Start with basic techniques and gradually learn more advanced methods.**`,

  'emergency-contacts': `# Emergency Contacts & Communication

## Essential Emergency Numbers

### Universal Emergency Numbers
- **911** - United States and Canada
- **112** - European Union and many countries
- **999** - United Kingdom and some Commonwealth countries
- **000** - Australia
- **110** - Police in many countries
- **118** - Medical emergency in some countries
- **119** - Fire department in some countries

### Important Contacts to Program
- **Local police** - Non-emergency number
- **Fire department** - Non-emergency number
- **Poison control** - 1-800-222-1222 (US)
- **Suicide prevention** - 988 (US)
- **Domestic violence hotline** - 1-800-799-7233 (US)
- **Child abuse hotline** - 1-800-4-A-CHILD (US)

## Family Emergency Contacts

### Primary Contacts
- **Spouse/Partner** - Most important contact
- **Parents** - Both sides if applicable
- **Adult children** - If you have them
- **Siblings** - Brothers and sisters
- **Close friends** - Trusted individuals

### Secondary Contacts
- **Neighbors** - Local support
- **Work contacts** - Supervisor, HR
- **School contacts** - If you have children
- **Medical contacts** - Doctors, specialists
- **Legal contacts** - Lawyer, insurance agent

### Contact Information to Include
- **Full name** - First and last
- **Phone numbers** - Home, work, cell
- **Email addresses** - Primary and backup
- **Physical addresses** - Home and work
- **Relationship** - How you know them
- **Special notes** - Medical conditions, accessibility needs

## Communication During Emergencies

### Phone Communication
#### When to Call vs Text
- **Call for urgent matters** - Life-threatening situations
- **Text for updates** - Saves battery and network capacity
- **Use voice calls sparingly** - Network may be overloaded
- **Keep calls short** - Free up network for others

#### Battery Conservation
- **Turn off unnecessary apps** - Save battery life
- **Reduce screen brightness** - Major battery drain
- **Use airplane mode** - When not actively communicating
- **Carry portable charger** - Backup power source
- **Use car charger** - If available

### Alternative Communication Methods
#### Two-Way Radios
- **Family radio service (FRS)** - Short range, no license needed
- **General mobile radio service (GMRS)** - Longer range, license required
- **Citizens band (CB)** - Long range, no license needed
- **Amateur radio** - Longest range, license required

#### Internet Communication
- **Social media** - Facebook, Twitter for updates
- **Messaging apps** - WhatsApp, Signal, Telegram
- **Email** - Works when voice calls don't
- **Video calls** - FaceTime, Zoom, Skype
- **Emergency apps** - FEMA, Red Cross apps

## Emergency Communication Plan

### Family Communication Plan
1. **Designate meeting places** - Home, school, workplace
2. **Choose out-of-area contact** - Someone not affected by local disaster
3. **Practice the plan** - Regular family drills
4. **Update contact information** - Keep current
5. **Share with family members** - Everyone knows the plan

### Workplace Communication
- **Emergency contact list** - HR department
- **Evacuation procedures** - Know the plan
- **Communication protocols** - How to report emergencies
- **Emergency assembly points** - Where to gather
- **Chain of command** - Who to contact first

### School Communication
- **Emergency contact forms** - Keep updated
- **School emergency procedures** - Know the protocols
- **Communication methods** - How school contacts parents
- **Pickup procedures** - During emergencies
- **Emergency supplies** - What school provides

## Special Communication Needs

### Medical Emergencies
#### What to Tell 911
- **Your location** - Exact address or landmarks
- **Nature of emergency** - Medical, fire, crime
- **Number of people involved** - How many need help
- **Condition of victim(s)** - Conscious, breathing, bleeding
- **Any hazards** - Fire, gas leak, dangerous animals
- **Your phone number** - In case call is disconnected

#### Medical Information to Share
- **Allergies** - Medications, foods, environmental
- **Current medications** - Names and dosages
- **Medical conditions** - Diabetes, heart disease, etc.
- **Blood type** - If known
- **Insurance information** - Policy numbers
- **Emergency contacts** - Family members

## Communication Equipment

### Essential Items
- **Cell phone** - Primary communication device
- **Portable charger** - Backup power
- **Emergency radio** - Battery or hand-crank
- **Whistle** - Signal for help
- **Flashlight** - Visual signaling
- **Paper and pen** - Write messages if needed

### Advanced Equipment
- **Satellite phone** - Works anywhere
- **Two-way radio** - Family communication
- **Emergency beacon** - GPS location transmitter
- **Solar charger** - Renewable power source
- **Ham radio** - Long-range communication
- **Emergency antenna** - Improves signal

## Communication Etiquette

### During Emergencies
- **Stay calm** - Clear communication is essential
- **Speak clearly** - Enunciate words
- **Listen carefully** - Don't interrupt
- **Ask questions** - Clarify instructions
- **Repeat important information** - Confirm understanding
- **Be patient** - Networks may be overloaded

### Network Congestion
- **Use text instead of calls** - Less network intensive
- **Avoid non-essential calls** - Keep lines open for emergencies
- **Wait between attempts** - Don't repeatedly dial
- **Use different networks** - Try different carriers
- **Move to higher ground** - Better signal reception

## Emergency Information Sources

### Official Sources
- **FEMA** - Federal Emergency Management Agency
- **Red Cross** - Disaster relief and information
- **NOAA** - Weather and environmental alerts
- **CDC** - Health and safety information
- **Local emergency management** - City/county alerts

### Media Sources
- **Emergency radio stations** - AM/FM frequencies
- **Television news** - Local and national
- **Internet news sites** - When available
- **Social media** - Official accounts only
- **Emergency apps** - Government and NGO apps

## Practice and Preparation

### Regular Drills
- **Monthly family drills** - Practice communication plan
- **Test emergency contacts** - Ensure numbers work
- **Practice with equipment** - Radios, chargers, etc.
- **Update contact lists** - Keep information current
- **Review procedures** - Refresh memory of plans

### Documentation
- **Written contact list** - Don't rely only on phone
- **Emergency procedures** - Step-by-step instructions
- **Medical information** - Allergies, medications, conditions
- **Insurance information** - Policy numbers and contacts
- **Important documents** - Copies of IDs, insurance cards

**Remember: Communication is critical during emergencies. Prepare multiple methods and practice regularly with your family.**`,

  'natural-disasters': `# Natural Disaster Preparedness

## General Preparedness Principles

### The Rule of 72 Hours
- **Prepare for 72 hours** without outside help
- **Essential supplies** - Food, water, shelter, first aid
- **Communication plan** - How to contact family
- **Evacuation plan** - Where to go and how to get there
- **Document protection** - Important papers and photos

### Emergency Kit Essentials
- **Water** - 1 gallon per person per day (3-day supply)
- **Food** - Non-perishable, 3-day supply
- **First aid kit** - Comprehensive medical supplies
- **Flashlight and batteries** - Multiple light sources
- **Radio** - Battery-powered or hand-crank
- **Cash** - Small bills, ATMs may not work
- **Important documents** - Copies in waterproof container
- **Medications** - 7-day supply minimum
- **Tools** - Multi-tool, duct tape, rope
- **Clothing** - Weather-appropriate, sturdy shoes

## Earthquake Preparedness

### Before an Earthquake
- **Secure heavy furniture** - Bookcases, water heaters
- **Install latches** on cabinets and drawers
- **Identify safe spots** - Under sturdy tables, against walls
- **Practice drop, cover, hold** - Regular drills
- **Know how to shut off** gas, water, electricity

### During an Earthquake
- **Drop to your hands and knees** - Before you're knocked down
- **Cover your head and neck** - Under sturdy furniture
- **Hold on** - Until shaking stops
- **Stay indoors** - Don't run outside
- **Stay away from windows** - Glass can shatter

### After an Earthquake
- **Check for injuries** - Yourself and others
- **Check for damage** - Gas leaks, electrical problems
- **Turn off utilities** - If you smell gas or see damage
- **Listen to radio** - For emergency information
- **Be prepared for aftershocks** - They can be as strong as original

## Flood Preparedness

### Before a Flood
- **Know your flood risk** - Check FEMA flood maps
- **Purchase flood insurance** - Standard insurance doesn't cover floods
- **Elevate utilities** - Electrical, heating, plumbing
- **Install check valves** - Prevent sewage backup
- **Create barriers** - Sandbags, flood barriers

### During a Flood
- **Move to higher ground** - Immediately
- **Don't walk through floodwater** - 6 inches can knock you down
- **Don't drive through floodwater** - Turn around, don't drown
- **Stay informed** - Listen to weather radio
- **Evacuate if ordered** - Don't wait

### After a Flood
- **Return only when safe** - Wait for official clearance
- **Avoid floodwater** - May be contaminated
- **Check for damage** - Structural, electrical, gas
- **Document damage** - Photos for insurance
- **Clean and disinfect** - Everything that got wet

## Hurricane Preparedness

### Before Hurricane Season
- **Know evacuation routes** - Plan multiple routes
- **Prepare emergency kit** - Food, water, supplies
- **Secure outdoor items** - Furniture, decorations
- **Trim trees and shrubs** - Remove dead branches
- **Install storm shutters** - Or board up windows

### Hurricane Watch (48 hours)
- **Monitor weather** - Stay informed
- **Check emergency kit** - Restock if needed
- **Fuel vehicles** - Gas stations may close
- **Secure outdoor items** - Bring inside or tie down
- **Prepare for evacuation** - Pack essentials

### Hurricane Warning (36 hours)
- **Evacuate if ordered** - Don't wait
- **Stay indoors** - If not evacuating
- **Stay away from windows** - Flying debris
- **Turn off utilities** - If flooding likely
- **Stay informed** - Weather radio, TV

### After Hurricane
- **Wait for official clearance** - Don't return too early
- **Avoid floodwater** - Contaminated and dangerous
- **Check for damage** - Structural, electrical
- **Use generators safely** - Outdoors only
- **Help neighbors** - Community recovery

## Tornado Preparedness

### Tornado Watch
- **Stay informed** - Weather radio, TV, phone alerts
- **Review safety plan** - Know where to go
- **Prepare emergency kit** - Have ready
- **Monitor weather** - Watch for changing conditions

### Tornado Warning
- **Seek shelter immediately** - Don't wait
- **Go to basement** - Lowest level, center room
- **No basement?** - Interior room, lowest floor
- **Cover yourself** - Mattress, blankets, helmet
- **Stay away from windows** - Flying glass

### Mobile Home Safety
- **Leave immediately** - Mobile homes not safe
- **Go to sturdy building** - Community shelter
- **Lie in ditch** - If no building available
- **Cover head** - Protect from flying debris

## Wildfire Preparedness

### Before Wildfire Season
- **Create defensible space** - Clear vegetation around home
- **Use fire-resistant materials** - Roof, siding, decking
- **Install spark arresters** - Chimney, stove pipes
- **Keep gutters clean** - Remove debris
- **Plan evacuation routes** - Multiple options

### During Wildfire
- **Evacuate immediately** - Don't wait for orders
- **Close all windows and doors** - But don't lock
- **Turn off gas** - At main valve
- **Leave lights on** - Helps firefighters see house
- **Take emergency kit** - Don't forget pets

### If Trapped
- **Call 911** - Give your location
- **Find water** - Pool, pond, stream
- **Lie face down** - In low area
- **Cover yourself** - Wet clothing, blanket
- **Stay calm** - Help will come

## Winter Storm Preparedness

### Before Winter
- **Winterize home** - Insulate, weatherstrip
- **Service heating system** - Annual maintenance
- **Stock emergency supplies** - Food, water, medications
- **Prepare vehicle** - Winter tires, emergency kit
- **Know weather alerts** - Sign up for notifications

### During Winter Storm
- **Stay indoors** - Avoid unnecessary travel
- **Dress warmly** - Layers, hat, gloves
- **Conserve heat** - Close off unused rooms
- **Use generators safely** - Outdoors only
- **Check on neighbors** - Especially elderly

### Power Outage
- **Use flashlights** - Not candles
- **Keep refrigerator closed** - Food stays cold longer
- **Turn off appliances** - Prevent surge damage
- **Stay warm** - Layer clothing, use blankets
- **Report outages** - Call utility company

## Heat Wave Preparedness

### Before Heat Wave
- **Install air conditioning** - Or have access to cooling
- **Insulate home** - Keep cool air in
- **Plant trees** - Provide shade
- **Know cooling centers** - Public air-conditioned spaces
- **Check on vulnerable** - Elderly, children, pets

### During Heat Wave
- **Stay indoors** - During hottest part of day
- **Use air conditioning** - If available
- **Drink water** - Stay hydrated
- **Wear light clothing** - Light colors, loose fit
- **Avoid strenuous activity** - Rest frequently

### Heat Illness Signs
- **Heat cramps** - Muscle spasms
- **Heat exhaustion** - Heavy sweating, weakness
- **Heat stroke** - High temperature, confusion
- **Seek medical help** - For severe symptoms

## Emergency Communication

### Stay Informed
- **Weather radio** - NOAA alerts
- **Phone apps** - Weather, emergency alerts
- **Social media** - Official accounts only
- **Television/radio** - Local news
- **Community alerts** - Sign up for notifications

### Communication Plan
- **Family contacts** - Out-of-area contact person
- **Meeting places** - Home, school, workplace
- **Evacuation routes** - Multiple options
- **Emergency kit** - Communication devices
- **Practice regularly** - Family drills

## Recovery and Rebuilding

### After Disaster
- **Safety first** - Don't return until safe
- **Document damage** - Photos, videos
- **Contact insurance** - File claims quickly
- **Apply for assistance** - FEMA, Red Cross
- **Help neighbors** - Community recovery

### Long-term Recovery
- **Mental health** - Seek counseling if needed
- **Financial recovery** - Budget for rebuilding
- **Community support** - Join recovery groups
- **Prepare for next time** - Learn from experience
- **Build back better** - Stronger, safer structures

**Remember: The best time to prepare for a disaster is before it happens. Start today with basic supplies and a family plan.**`
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