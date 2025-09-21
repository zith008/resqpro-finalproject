import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming,
  useDerivedValue
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface XPProgressRingProps {
  progress: number; // 0-1
  level: number;
  size?: number;
  strokeWidth?: number;
}

export const XPProgressRing: React.FC<XPProgressRingProps> = ({ 
  progress, 
  level, 
  size = 120, 
  strokeWidth = 8 
}) => {
  const theme = useTheme();
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  
  const animatedProgress = useSharedValue(0);
  
  React.useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 1000 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (animatedProgress.value * circumference);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.colors.surfaceVariant}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeLinecap="round"
          animatedProps={animatedProps}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={{ 
        position: 'absolute', 
        alignItems: 'center',
        justifyContent: 'center' 
      }}>
        <Text variant="headlineSmall" style={{ 
          fontFamily: 'Poppins_700Bold',
          fontWeight: '700',
          color: theme.colors.primary 
        }}>
          {level}
        </Text>
        <Text variant="bodySmall" style={{ 
          fontFamily: 'Poppins_400Regular',
          color: theme.colors.onSurfaceVariant 
        }}>
          Level
        </Text>
      </View>
    </View>
  );
};