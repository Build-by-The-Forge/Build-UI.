import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SessionProvider, useSession } from '@/auth/SessionProvider';
import { OnboardingProvider } from '@/context/Onboardingcontext';
import { ThemeProvider } from '@/context/ThemeContext';

SplashScreen.preventAutoHideAsync();

/**
 * Which screens exist depends on the session. A guarded screen is removed from
 * the navigator, so a signed-out student can't reach it by deep link or by the
 * back button. The backend still authorises every request.
 */
function Routes() {
  const { gate } = useSession();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={gate === 'auth'}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={gate === 'app'}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="dashboard" />
      </Stack.Protected>
      <Stack.Protected guard={gate === 'verify-email'}>
        <Stack.Screen name="verify-email" />
      </Stack.Protected>
      <Stack.Protected guard={gate === 'wait' || gate === 'denied'}>
        <Stack.Screen name="gate" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <SessionProvider>
        <OnboardingProvider>
          <Routes />
        </OnboardingProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
