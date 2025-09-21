import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#d32f2f', // Emergency red
    primaryContainer: '#ffebee',
    secondary: '#ff6f00', // Warning orange
    secondaryContainer: '#fff3e0',
    tertiary: '#2e7d32', // Success green
    tertiaryContainer: '#e8f5e8',
    surface: '#ffffff',
    surfaceVariant: '#f5f5f5',
    background: '#fafafa',
    outline: '#e0e0e0',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    default: {
      fontFamily: 'Poppins_400Regular',
      fontWeight: '400' as const,
    },
    regular: {
      fontFamily: 'Poppins_400Regular',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Poppins_500Medium',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'Poppins_300Light',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'Poppins_200ExtraLight',
      fontWeight: '200' as const,
    },
    bold: {
      fontFamily: 'Poppins_700Bold',
      fontWeight: '700' as const,
    },
    black: {
      fontFamily: 'Poppins_900Black',
      fontWeight: '900' as const,
    },
    displayLarge: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 57,
      fontWeight: '400' as const,
      lineHeight: 64,
      letterSpacing: -0.25,
    },
    displayMedium: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 45,
      fontWeight: '400' as const,
      lineHeight: 52,
      letterSpacing: 0,
    },
    displaySmall: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 36,
      fontWeight: '400' as const,
      lineHeight: 44,
      letterSpacing: 0,
    },
    headlineLarge: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 32,
      fontWeight: '500' as const,
      lineHeight: 40,
      letterSpacing: 0,
    },
    headlineMedium: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 28,
      fontWeight: '500' as const,
      lineHeight: 36,
      letterSpacing: 0,
    },
    headlineSmall: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 24,
      fontWeight: '500' as const,
      lineHeight: 32,
      letterSpacing: 0,
    },
    titleLarge: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 22,
      fontWeight: '500' as const,
      lineHeight: 28,
      letterSpacing: 0,
    },
    titleMedium: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    titleSmall: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    bodyLarge: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    bodyMedium: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    bodySmall: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
    labelLarge: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelMedium: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    labelSmall: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 11,
      fontWeight: '500' as const,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
  },
};