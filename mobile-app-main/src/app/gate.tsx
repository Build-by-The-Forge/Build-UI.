import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useSession } from '@/auth/SessionProvider';

/**
 * Shown while the session is restored or the tenant is checked, and when
 * either can't finish. It never shows app content.
 */
export default function GateScreen() {
  const { status, access, retry, signOut } = useSession();

  const unreachable = status === 'unreachable';
  const failed = access === 'error';
  const denied = access === 'denied';

  if (denied) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>No access to this campus</Text>
        <Text style={styles.body}>
          Your account isn&apos;t able to join this university on BUILD. If you think this is a mistake, contact your department.
        </Text>
        <Pressable style={styles.button} onPress={() => void signOut()} accessibilityRole="button">
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
      </View>
    );
  }

  if (unreachable || failed) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>Can&apos;t reach BUILD</Text>
        <Text style={styles.body}>Check your connection and try again. You are still signed in.</Text>
        <Pressable style={styles.button} onPress={retry} accessibilityRole="button">
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
        <Pressable onPress={() => void signOut()} accessibilityRole="button" style={styles.link}>
          <Text style={styles.linkText}>Sign out</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root} accessibilityLabel="Loading">
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0F5FF', alignItems: 'center', justifyContent: 'center', padding: 28, gap: 14 },
  title: { fontFamily: Fonts.bold, fontSize: 22, color: '#1F54DD', textAlign: 'center' },
  body: { fontFamily: Fonts.regular, fontSize: 15, color: '#475569', textAlign: 'center', lineHeight: 22, maxWidth: 340 },
  button: { height: 50, borderRadius: 20, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, marginTop: 6 },
  buttonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
  link: { padding: 8 },
  linkText: { fontFamily: Fonts.medium, fontSize: 14, color: '#1D4ED8' },
});
