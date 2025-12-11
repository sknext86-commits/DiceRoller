import { Stack } from 'expo-router';
import { DiceProvider } from '@/contexts/DiceContext';

export default function RootLayout() {
  return (
    <DiceProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="edit-config" options={{ headerShown: false }} />
      </Stack>
    </DiceProvider>
  );
}
