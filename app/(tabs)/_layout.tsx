import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDice } from '@/hooks/useDice';

export default function TabLayout() {
  const { theme } = useDice();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.primary,
          borderTopWidth: 1,
          height: Platform.select({
            ios: insets.bottom + 60,
            android: insets.bottom + 60,
            default: 70,
          }),
          paddingTop: 8,
          paddingBottom: Platform.select({
            ios: insets.bottom + 8,
            android: insets.bottom + 8,
            default: 8,
          }),
          paddingHorizontal: 16,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ROLL',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="casino" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="configs"
        options={{
          title: 'CONFIGS',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'HISTORY',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
