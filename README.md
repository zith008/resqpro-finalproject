# 🚨 ResQ Pro - Emergency Preparedness App

<div align="center">
  <div style="display: inline-block; background: linear-gradient(135deg, #dd0436, #b8002a); border-radius: 25px; padding: 20px; box-shadow: 0 8px 20px rgba(221, 4, 54, 0.3); margin-bottom: 20px;">
    <img src="./assets/images/resqpro-logo.png" alt="ResQ Pro Logo" width="100" height="100" style="border-radius: 15px;">
  </div>
  
  <h1 style="margin: 0; color: #dd0436; font-size: 2.5em; font-weight: bold;">🚨 ResQ Pro</h1>
  <p style="font-size: 1.2em; color: #666; margin: 10px 0 20px 0;">Your AI-Powered Emergency Preparedness Companion</p>
  
  [![Expo](https://img.shields.io/badge/Expo-53.0.22-blue.svg)](https://expo.dev/)
  [![React Native](https://img.shields.io/badge/React%20Native-0.79.5-61DAFB.svg)](https://reactnative.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.57.4-green.svg)](https://supabase.com/)
</div>

## 📱 Overview

ResQ Pro is a comprehensive emergency preparedness mobile application that gamifies disaster readiness through interactive quests, AI-powered coaching, and real-time emergency alerts. Built with React Native and Expo, it provides users with essential knowledge and tools to stay safe during natural disasters and emergencies.

## ✨ Key Features

### 🎮 Gamified Learning System

- **Interactive Quests**: Scenario-based and checklist quests covering various disaster types
- **XP System**: Earn experience points for completing preparedness activities
- **Achievement Badges**: Unlock badges for milestones and consistency
- **Progress Tracking**: Visual progress rings and streak counters

### 🤖 AI-Powered Emergency Coach

#### **🔄 Hybrid AI System (Online + Offline)**

- **Online AI (OpenRouter)**: Real-time emergency advice using Grok-4-fast model
- **Offline AI (Qwen 2.5 1.5B)**: Local on-device AI for privacy and offline scenarios
- **Automatic Fallback**: Seamlessly switches between online/offline modes
- **Privacy-First**: Sensitive conversations stay on-device with local AI

#### **📱 Smart Chat Interface**

- **Contextual Responses**: AI understands emergency preparedness context
- **Multi-turn Conversations**: Maintains conversation history for better advice
- **Emergency-Specific Guidance**: Tailored responses for different disaster types
- **Real-time Processing**: Fast response times with both AI modes

#### **📸 Real-Time Room Safety Scanning**

- **Camera Integration**: Use device camera to scan your environment
- **AI-Powered Analysis**: Advanced computer vision to identify safety hazards
- **Risk Assessment**: Automatic risk level classification (Low/Medium/High)
- **Actionable Suggestions**: Specific recommendations to improve safety
- **Scan History**: Track and review previous safety assessments
- **Offline Capability**: Works without internet using local AI models

### 🚨 Real-Time Emergency Alerts

- **Location-Based Alerts**: Get notified of emergencies in your area
- **Multiple Disaster Types**: Floods, earthquakes, wildfires, hurricanes, tornadoes
- **Severity Levels**: Warning, Watch, Advisory, and Emergency classifications
- **Actionable Instructions**: Step-by-step guidance for each alert type

### 🏠 Emergency Kit Management

- **Interactive Checklists**: Build and maintain your emergency supplies
- **Disaster-Specific Kits**: Tailored recommendations for different scenarios
- **Progress Tracking**: Visual indicators for kit completeness
- **Smart Suggestions**: AI-powered recommendations for missing items

### 🗺️ Journey Map & Progress

- **Visual Progress Tracking**: See your preparedness journey unfold
- **Milestone Achievements**: Celebrate major preparedness accomplishments
- **Community Features**: Share progress and learn from others

## 🛠️ Technology Stack

### Frontend

- **React Native 0.79.5** - Cross-platform mobile development
- **Expo 53.0.22** - Development platform and tools
- **TypeScript 5.8.3** - Type-safe JavaScript
- **React Native Paper** - Material Design components
- **Expo Router** - File-based navigation

### Backend & Services

- **Supabase** - Backend-as-a-Service (Database, Auth, Real-time)
- **Cactus LLM** - Local AI inference with Qwen 2.5 1.5B model
- **OpenRouter** - AI model API access (Grok-4-fast for online mode)
- **Hugging Face** - Transformers and AI models for computer vision

### Key Libraries

- **@xenova/transformers** - Local AI model execution
- **expo-camera** - Camera functionality for safety scanning
- **expo-location** - GPS and location services
- **expo-notifications** - Push notifications
- **zustand** - State management
- **react-native-confetti-cannon** - Celebration animations

## 🤖 AI Capabilities Deep Dive

### **Online AI Mode (OpenRouter)**

- **Model**: Grok-4-fast (Free tier)
- **Features**: Real-time emergency advice, contextual responses
- **Use Cases**: General emergency preparedness, disaster planning
- **Response Time**: ~2-3 seconds
- **Internet Required**: Yes

### **Offline AI Mode (Cactus LLM)**

- **Model**: Qwen 2.5 1.5B Instruct (GGUF format)
- **Size**: ~1.2GB download
- **Features**: Privacy-focused, on-device inference
- **Use Cases**: Sensitive conversations, offline scenarios
- **Response Time**: ~2-3 seconds first token, ~200-500ms subsequent
- **Internet Required**: No (after initial download)

### **Room Safety Scanning**

- **Technology**: Computer Vision + AI Analysis
- **Capabilities**:
  - Hazard identification (blocked exits, fire risks, accessibility issues)
  - Risk level assessment (Low/Medium/High)
  - Specific safety recommendations
  - Scan history tracking
- **Offline Support**: Works with local AI models
- **Storage**: Results saved to Supabase with image uploads

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android)

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/zith008/resqpro-finalproject.git
   cd resqpro-finalproject
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**

   ```bash
   # Create .env file with your API keys
   cp .env.example .env
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Run on device/simulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## 🔧 Configuration

### AI Services Setup

#### Cactus LLM (Local AI)

```bash
# Install Cactus LLM
npm install cactus-react-native
```

#### OpenRouter API

```typescript
// Add to your .env file
OPENROUTER_API_KEY = your_api_key_here;
```

#### Supabase Setup

```typescript
// Add to your .env file
SUPABASE_URL = your_supabase_url;
SUPABASE_ANON_KEY = your_supabase_anon_key;
```

### Camera Permissions

The app requires camera permissions for safety scanning. These are configured in `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow ResQ Pro to access your camera for safety scanning and emergency preparedness analysis."
        }
      ]
    ]
  }
}
```

## 📱 App Structure

```
app/
├── (tabs)/                 # Main tab navigation
│   ├── home.tsx           # Dashboard and overview
│   ├── coach.tsx          # AI chat interface
│   ├── alerts.tsx         # Emergency alerts
│   ├── badges.tsx         # Achievement system
│   ├── kit/               # Emergency kit management
│   └── settings.tsx       # App settings
├── auth/                  # Authentication screens
├── quest/                 # Individual quest screens
└── index.tsx              # App entry point

components/                # Reusable UI components
├── ChatInput.tsx          # AI chat input
├── ChatMessage.tsx        # Message display
├── QuestItem.tsx          # Quest cards
├── BadgeModal.tsx         # Badge display
└── JourneyMap/            # Progress visualization

data/                      # Static data and content
├── quests.ts              # Quest definitions
├── badges.ts              # Badge system
├── emergencyAlerts.ts     # Alert templates
└── milestones.ts          # Progress milestones

services/                  # External service integrations
├── cactusLLMService.ts    # Local AI service
├── openRouterService.ts   # OpenRouter API
└── safetyScanService.ts   # Safety analysis

hooks/                     # Custom React hooks
├── useAIChat.ts           # AI chat functionality
├── useAuth.ts             # Authentication
└── useGameSync.ts         # Progress synchronization
```

## 🎯 Quest System

### Quest Types

#### Scenario Quests

Interactive multiple-choice questions that test emergency preparedness knowledge:

```typescript
{
  id: 'water-shortage',
  type: 'scenario',
  title: 'Storm Incoming – What Do You Do?',
  xpValue: 15,
  options: [
    {
      text: 'Fill your bathtub with clean water',
      correct: true,
      explanation: 'Smart move! This gives you a safe backup water supply.'
    }
  ]
}
```

#### Checklist Quests

Step-by-step tasks for building emergency preparedness:

```typescript
{
  id: 'earthquake-kit',
  type: 'checklist',
  title: 'Build Your Earthquake Go-Bag',
  xpValue: 20,
  steps: [
    'Add flashlight to your bag',
    'Pack bottled water (1 L)',
    'Include a basic first-aid kit'
  ]
}
```

### Disaster Categories

- **Earthquakes**: Structural safety, drop-cover-hold, gas shut-off
- **Floods**: Water storage, evacuation routes, document protection
- **Wildfires**: Defensible space, evacuation planning, air quality
- **Hurricanes**: Storm preparation, power management, shelter planning
- **Tornadoes**: Safe room identification, warning systems, debris safety

## 🏆 Badge System

The app features 8 achievement badges:

| Badge               | Requirement       | Type   |
| ------------------- | ----------------- | ------ |
| First Steps         | Complete 1 quest  | Quests |
| Dedicated Learner   | Earn 100 XP       | XP     |
| Streak Starter      | 3-day streak      | Streak |
| Quest Master        | Complete 5 quests | Quests |
| Experience Seeker   | Earn 250 XP       | XP     |
| Streak Champion     | 7-day streak      | Streak |
| Preparedness Expert | Earn 500 XP       | XP     |
| Consistency Master  | 14-day streak     | Streak |

## 🚨 Emergency Alert System

### Alert Types

- **Flood Warnings**: Flash flood alerts with evacuation instructions
- **Tornado Watches/Warnings**: Shelter-in-place guidance
- **Wildfire Alerts**: Evacuation orders and air quality warnings
- **Hurricane Tracking**: Storm preparation and evacuation routes
- **Severe Weather**: Thunderstorm and wind advisories

### Alert Features

- **Geofencing**: Location-based alert delivery
- **Severity Levels**: Color-coded urgency indicators
- **Actionable Instructions**: Step-by-step response guidance
- **Expiration Tracking**: Automatic alert lifecycle management

## 🤖 AI Coach Features

### Chat Interface

- **Natural Language Processing**: Understands emergency preparedness questions
- **Contextual Responses**: Provides relevant, actionable advice
- **Multi-turn Conversations**: Maintains context across messages
- **Offline Support**: Works without internet using local AI models

### Safety Scanning

- **Room Analysis**: Camera-based hazard detection
- **Safety Recommendations**: AI-powered improvement suggestions
- **Visual Feedback**: Highlighted areas of concern
- **Progress Tracking**: Before/after comparison

## 📊 Data Management

### Local Storage

- **AsyncStorage**: User progress and preferences
- **SQLite**: Offline quest data and achievements
- **File System**: Camera images and safety scans

### Cloud Sync

- **Supabase**: User accounts and progress synchronization
- **Real-time Updates**: Live progress sharing
- **Backup & Restore**: Cross-device data consistency

## 🔒 Privacy & Security

- **Local AI Processing**: Sensitive data stays on device
- **Encrypted Storage**: Secure local data protection
- **Minimal Data Collection**: Only essential information stored
- **User Control**: Full control over data sharing and deletion

## 🚀 Deployment

### Development Build

```bash
# Create development build
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Production Build

```bash
# Create production build
eas build --profile production --platform all
```

### App Store Submission

```bash
# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- Use TypeScript for type safety
- Follow React Native best practices
- Use Prettier for code formatting
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FEMA** - Emergency preparedness guidelines
- **Red Cross** - Disaster response protocols
- **Expo Team** - Amazing development platform
- **React Native Community** - Excellent documentation and support
- **Supabase** - Powerful backend infrastructure

## 📞 Support

- **Documentation**: [Wiki](https://github.com/zith008/resqpro-finalproject/wiki)
- **Issues**: [GitHub Issues](https://github.com/zith008/resqpro-finalproject/issues)
- **Discussions**: [GitHub Discussions](https://github.com/zith008/resqpro-finalproject/discussions)
- **Email**: support@resqpro.app

## 🔮 Roadmap

### Version 2.0

- [ ] Community features and leaderboards
- [ ] Advanced AI safety analysis
- [ ] Integration with smart home devices
- [ ] Multi-language support

### Version 2.1

- [ ] Wearable device integration
- [ ] Advanced weather tracking
- [ ] Emergency contact management
- [ ] Offline map support

---

<div align="center">
  <strong>Stay Safe, Stay Prepared! 🚨</strong>
  
  Made with ❤️ for emergency preparedness
  
  [Download on App Store](#) | [Get it on Google Play](#)
</div>
