import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function KitLayout() {
  const theme = useTheme();

  return (
    <Stack 
      screenOptions={{ 
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerShadowVisible: true,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: theme.colors.onSurface,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="[slug]" 
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}