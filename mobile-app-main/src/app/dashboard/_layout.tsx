import { Stack } from 'expo-router';

export default function DashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="buildai" />
      <Stack.Screen name="cbtquiz" />
      <Stack.Screen name="courses" />
      <Stack.Screen name="chatscreen" />
      <Stack.Screen name="mapscreen" />
      <Stack.Screen name="placdetailscreen" />
      <Stack.Screen name="readmode" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="studygroup" />
      <Stack.Screen name="studymode" />
      <Stack.Screen name="videoplayer" />
    </Stack>
  );
}
