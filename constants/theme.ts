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
};