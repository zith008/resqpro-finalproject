export type ScenarioOption = {
  id: string;
  text: string;
  correct: boolean;
  explanation: string;
};

export type ScenarioQuest = {
  id: string;
  type: 'scenario';
  title: string;
  description?: string;
  xpValue: number;
  options: ScenarioOption[];
};

export type ChecklistQuest = {
  id: string;
  type: 'checklist';
  title: string;
  xpValue: number;
  steps: string[];
};

export type Quest = ScenarioQuest | ChecklistQuest;

export const quests: Quest[] = [
  // Scenario-based choice quest
  {
    id: 'water-shortage',
    type: 'scenario',
    title: 'Storm Incoming – What Do You Do?',
    xpValue: 15,
    options: [
      {
        id: 'water-shortage-1',
        text: 'Go to the store immediately',
        correct: false,
        explanation: 'Stores may already be empty or closed this late.',
      },
      {
        id: 'water-shortage-2',
        text: 'Wait and see what happens',
        correct: false,
        explanation: 'Delaying prep can be dangerous during fast-onset disasters.',
      },
      {
        id: 'water-shortage-3',
        text: 'Fill your bathtub with clean water',
        correct: true,
        explanation: 'Smart move! This gives you a safe backup water supply.',
      },
    ],
  },

  // Checklist quest
  {
    id: 'earthquake-kit',
    type: 'checklist',
    title: 'Build Your Earthquake Go-Bag',
    xpValue: 20,
    steps: [
      'Add flashlight to your bag',
      'Pack bottled water (1 L)',
      'Include a basic first-aid kit',
      'Attach whistle or signal tool',
    ],
  },

  /* ⬇️  ADD AFTER YOUR EXISTING QUESTS  ⬇️ */
  {
    /* ───────── EARTHQUAKE MINI-QUIZ (3 separate scenario quests) ───────── */
    id: 'eq-basics-drop-cover',
    type: 'scenario',
    title: 'Earthquake Safety: Where Do You Shelter?',
    xpValue: 10,
    options: [
      {
        id: 'eq-basics-drop-cover-1',
        text: 'Run outside right away',
        correct: false,
        explanation: 'Falling glass and debris make exits dangerous during shaking.',
      },
      {
        id: 'eq-basics-drop-cover-2',
        text: 'Stand in a doorway',
        correct: false,
        explanation: 'Modern doorways are not stronger than other parts of the house.',
      },
      {
        id: 'eq-basics-drop-cover-3',
        text: 'Drop, cover, and hold on under a sturdy table',
        correct: true,
        explanation: 'Best practice endorsed by earthquake-safety agencies worldwide.',
      },
    ],
  },
  {
    id: 'eq-basics-gas-wrench',
    type: 'scenario',
    title: 'Gas Shut-Off: Where Should Your Wrench Live?',
    xpValue: 10,
    options: [
      {
        id: 'eq-basics-gas-wrench-1',
        text: 'In your bedroom nightstand',
        correct: false,
        explanation: 'You might not reach it if the bedroom is blocked.',
      },
      {
        id: 'eq-basics-gas-wrench-2',
        text: 'Zip-tied to the gas meter',
        correct: true,
        explanation: 'Fast access exactly where you need it during an emergency.',
      },
      {
        id: 'eq-basics-gas-wrench-3',
        text: 'In the backyard shed',
        correct: false,
        explanation: 'Could be inaccessible after quake or fire.',
      },
    ],
  },
  {
    id: 'eq-basics-first-check',
    type: 'scenario',
    title: 'After the Shaking Stops, First Action?',
    xpValue: 10,
    options: [
      {
        id: 'eq-basics-first-check-1',
        text: 'Check yourself and family for injuries',
        correct: true,
        explanation: 'Life safety comes before property or social media.',
      },
      {
        id: 'eq-basics-first-check-2',
        text: 'Turn on all lights to inspect damage',
        correct: false,
        explanation: 'Could spark gas leaks and waste battery power.',
      },
      {
        id: 'eq-basics-first-check-3',
        text: 'Post on social media',
        correct: false,
        explanation: "Information can wait until you're safe.",
      },
    ],
  },

  /* ───────── HURRICANE CHECKLIST QUEST ───────── */
  {
    id: 'hurricane-prep-power-water',
    type: 'checklist',
    title: 'Hurricane Prep: Power & Water',
    xpValue: 25,
    steps: [
      'Store at least 3 gal of water per person',
      'Set fridge & freezer to their coldest setting',
      'Charge all power banks to 100%',
      'Locate and test your manual can-opener'
    ],
  },

  /* ───────── WILDFIRE MINI-QUIZ (2 scenario quests) ───────── */
  {
    id: 'wildfire-mask-choice',
    type: 'scenario',
    title: 'Which Mask Protects You From Smoke?',
    xpValue: 10,
    options: [
      { 
        id: 'wildfire-mask-choice-1',
        text: 'Bandana',          
        correct: false, 
        explanation: 'Provides minimal filtration.' 
      },
      { 
        id: 'wildfire-mask-choice-2',
        text: 'Surgical Mask',    
        correct: false, 
        explanation: 'Blocks droplets, not fine smoke particles.' 
      },
      { 
        id: 'wildfire-mask-choice-3',
        text: 'N95 Respirator',   
        correct: true,  
        explanation: 'Filters ≥95 % of fine particulates.' 
      }
    ],
  },
  {
    id: 'wildfire-embers',
    type: 'scenario',
    title: 'Embers Are Falling — Your First Move?',
    xpValue: 10,
    options: [
      {
        id: 'wildfire-embers-1',
        text: 'Spray roof and gutters with water',
        correct: true,
        explanation: 'Keeps embers from igniting dry leaves and wood.',
      },
      {
        id: 'wildfire-embers-2',
        text: 'Open windows for fresh air',
        correct: false,
        explanation: 'Invites smoke—and embers—inside.',
      },
      {
        id: 'wildfire-embers-3',
        text: 'Leave the lawn sprinkler running',
        correct: false,
        explanation: 'Wastes water and may reduce pressure for firefighters.',
      },
    ],
  },

  /* ───────── MILESTONE QUESTS ───────── */
  {
    id: 'flood-milestone-1',
    type: 'scenario',
    title: 'Flood Preparedness: Emergency Kit',
    xpValue: 50,
    options: [
      {
        id: 'flood-kit-1',
        text: 'Pack only food and water',
        correct: false,
        explanation: 'A complete kit needs more than just basics.',
      },
      {
        id: 'flood-kit-2',
        text: 'Include food, water, first aid, documents, and a radio',
        correct: true,
        explanation: 'A comprehensive kit covers all essential needs.',
      },
      {
        id: 'flood-kit-3',
        text: 'Wait until flood warning to prepare',
        correct: false,
        explanation: 'Always prepare in advance - warnings may come too late.',
      },
    ],
  },
  {
    id: 'flood-milestone-2',
    type: 'checklist',
    title: 'Flood Safety: Home Preparation',
    xpValue: 50,
    steps: [
      'Install flood sensors in basement',
      'Elevate electrical outlets',
      'Create digital copies of important documents',
      'Learn your area\'s flood risk level'
    ],
  },
  {
    id: 'wildfire-milestone-1',
    type: 'scenario',
    title: 'Wildfire Evacuation Plan',
    xpValue: 50,
    options: [
      {
        id: 'wildfire-evac-1',
        text: 'Have one main escape route planned',
        correct: false,
        explanation: 'Always plan multiple escape routes.',
      },
      {
        id: 'wildfire-evac-2',
        text: 'Plan multiple routes and a meeting point',
        correct: true,
        explanation: 'Multiple routes and a meeting point ensure family safety.',
      },
      {
        id: 'wildfire-evac-3',
        text: 'Wait for official evacuation order',
        correct: false,
        explanation: 'Plan ahead - don\'t wait for the last moment.',
      },
    ],
  },
  {
    id: 'wildfire-milestone-2',
    type: 'checklist',
    title: 'Wildfire Home Defense',
    xpValue: 50,
    steps: [
      'Clear 30ft defensible space around home',
      'Install ember-resistant vents',
      'Store firewood away from house',
      'Maintain emergency water supply'
    ],
  },
  {
    id: 'earthquake-milestone-1',
    type: 'scenario',
    title: 'Earthquake Structural Safety',
    xpValue: 50,
    options: [
      {
        id: 'eq-struct-1',
        text: 'Ignore small cracks in walls',
        correct: false,
        explanation: 'Small cracks can indicate structural issues.',
      },
      {
        id: 'eq-struct-2',
        text: 'Have a structural engineer assess your home',
        correct: true,
        explanation: 'Professional assessment ensures safety.',
      },
      {
        id: 'eq-struct-3',
        text: 'Only check foundation',
        correct: false,
        explanation: 'Need to check all structural elements.',
      },
    ],
  },
  {
    id: 'earthquake-milestone-2',
    type: 'checklist',
    title: 'Earthquake Home Safety',
    xpValue: 50,
    steps: [
      'Secure heavy furniture to walls',
      'Install latches on cabinets',
      'Anchor water heater',
      'Practice family earthquake drills'
    ],
  },
  {
    id: 'cyclone-milestone-1',
    type: 'scenario',
    title: 'Cyclone Shelter Planning',
    xpValue: 50,
    options: [
      {
        id: 'cyclone-shelter-1',
        text: 'Use any room without windows',
        correct: false,
        explanation: 'Need a properly reinforced safe room.',
      },
      {
        id: 'cyclone-shelter-2',
        text: 'Identify or build a FEMA-compliant safe room',
        correct: true,
        explanation: 'FEMA standards ensure maximum protection.',
      },
      {
        id: 'cyclone-shelter-3',
        text: 'Stay in the garage',
        correct: false,
        explanation: 'Garages are not safe during cyclones.',
      },
    ],
  },
  {
    id: 'cyclone-milestone-2',
    type: 'checklist',
    title: 'Cyclone Preparedness',
    xpValue: 50,
    steps: [
      'Install storm shutters',
      'Trim trees near house',
      'Prepare emergency communication plan',
      'Stock 3-day supply of essentials'
    ],
  },
  {
    id: 'master-milestone-1',
    type: 'scenario',
    title: 'Emergency Response Leadership',
    xpValue: 50,
    options: [
      {
        id: 'master-lead-1',
        text: 'Handle everything yourself',
        correct: false,
        explanation: 'Effective leadership involves delegation.',
      },
      {
        id: 'master-lead-2',
        text: 'Coordinate with community and authorities',
        correct: true,
        explanation: 'Community coordination is key to effective response.',
      },
      {
        id: 'master-lead-3',
        text: 'Focus only on immediate family',
        correct: false,
        explanation: 'Community-wide preparedness is essential.',
      },
    ],
  },
  {
    id: 'master-milestone-2',
    type: 'checklist',
    title: 'Master Preparedness Plan',
    xpValue: 50,
    steps: [
      'Create comprehensive family emergency plan',
      'Join community emergency response team',
      'Maintain advanced first aid certification',
      'Conduct regular emergency drills'
    ],
  }
];