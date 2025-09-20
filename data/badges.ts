export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: any; // For require() image
  requirement: number;
  type: 'xp' | 'streak' | 'quests';
}

export const badges: Badge[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first quest',
    icon: require('@/assets/badges/first-steps.png'),
    requirement: 1,
    type: 'quests'
  },
  {
    id: 'dedicated-learner',
    title: 'Dedicated Learner',
    description: 'Earn 100 XP',
    icon: require('@/assets/badges/dedicated-learner.png'),
    requirement: 100,
    type: 'xp'
  },
  {
    id: 'streak-starter',
    title: 'Streak Starter',
    description: 'Maintain a 3-day streak',
    icon: require('@/assets/badges/streak-starter.png'),
    requirement: 3,
    type: 'streak'
  },
  {
    id: 'quest-master',
    title: 'Quest Master',
    description: 'Complete 5 different quests',
    icon: require('@/assets/badges/quest-master.png'),
    requirement: 5,
    type: 'quests'
  },
  {
    id: 'experience-seeker',
    title: 'Experience Seeker',
    description: 'Earn 250 XP',
    icon: require('@/assets/badges/experience-seeker.png'),
    requirement: 250,
    type: 'xp'
  },
  {
    id: 'streak-champion',
    title: 'Streak Champion',
    description: 'Maintain a 7-day streak',
    icon: require('@/assets/badges/streak-champion.png'),
    requirement: 7,
    type: 'streak'
  },
  {
    id: 'preparedness-expert',
    title: 'Preparedness Expert',
    description: 'Earn 500 XP',
    icon: require('@/assets/badges/preparedness-expert.png'),
    requirement: 500,
    type: 'xp'
  },
  {
    id: 'consistency-master',
    title: 'Consistency Master',
    description: 'Maintain a 14-day streak',
    icon: require('@/assets/badges/consistency-master.png'),
    requirement: 14,
    type: 'streak'
  }
];