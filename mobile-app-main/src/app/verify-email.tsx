import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { VerifyEmailPanel } from '@/components/auth/VerifyEmailPanel';
import { Fonts } from '@/constants/theme';
import { useSession } from '@/auth/SessionProvider';

/** A signed-in student whose email isn't confirmed yet can't use the campus. */
export default function VerifyEmailScreen() {
  const { email, retry, signOut } = useSession();
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.box}>
        <VerifyEmailPanel email={email ?? ''} onVerified={retry} />
      </View>
      <Pressable onPress={() => void signOut()} accessibilityRole="button" style={styles.link}>
        <Text style={styles.linkText}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0F5FF' },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 12 },
  box: { backgroundColor: 'rgba(131, 155, 255, 0.9)', borderRadius: 30, padding: 20 },
  link: { alignItems: 'center', padding: 8 },
  linkText: { fontFamily: Fonts.medium, fontSize: 14, color: '#1D4ED8' },
});
