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
import { Text, View } from 'react-native';
import { ConfigError } from '@/api/config';
import { getSessionManager } from '@/auth';
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

/** A build with unsafe or missing configuration says so instead of crashing. */
function configProblem(): string | null {
  try {
    getSessionManager();
    return null;
  } catch (error) {
    return error instanceof ConfigError ? error.message : 'The app is not configured correctly.';
  }
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

  const problem = configProblem();
  if (problem) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: '#F0F5FF' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F54DD', textAlign: 'center' }}>BUILD can&apos;t start</Text>
        <Text style={{ marginTop: 10, color: '#475569', textAlign: 'center', lineHeight: 21 }}>{problem}</Text>
      </View>
    );
  }

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
