import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="step-one" />
      <Stack.Screen name="step-two" />
      <Stack.Screen name="step-three" />
      <Stack.Screen name="step-four" />
      <Stack.Screen name="step-five" />
    </Stack>
  );
}
