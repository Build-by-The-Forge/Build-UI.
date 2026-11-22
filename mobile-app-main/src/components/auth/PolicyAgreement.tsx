import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Fonts } from '@/constants/theme';

type Props = {
  /** The published documents. Null only in a development build with none configured. */
  readonly termsUrl: string | null;
  readonly privacyUrl: string | null;
  readonly agreed: boolean;
  readonly onToggle: () => void;
};

/**
 * The agreement to the Terms of Service and Privacy Policy. Both are real,
 * openable links from build configuration; without them (development builds
 * only) there is no checkbox at all, so nothing here can look like a recorded
 * acceptance of a document nobody can read.
 */
export function PolicyAgreement({ termsUrl, privacyUrl, agreed, onToggle }: Props) {
  const [failed, setFailed] = useState(false);

  if (!termsUrl || !privacyUrl) {
    return (
      <View style={styles.devNotice} accessibilityRole="alert">
        <Text style={styles.devText}>
          Development build: the Terms of Service and Privacy Policy are not yet published, so there is nothing to
          agree to here.
        </Text>
      </View>
    );
  }

  const open = async (url: string) => {
    setFailed(false);
    try {
      await Linking.openURL(url);
    } catch {
      setFailed(true);
    }
  };

  return (
    <View>
      <View style={styles.row}>
        <Pressable
          style={[styles.checkbox, agreed && styles.checkboxActive]}
          onPress={onToggle}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
          accessibilityLabel="I have read and agree to the Terms of Service and Privacy Policy"
        >
          {agreed && <Feather name="check" size={14} color="#fff" />}
        </Pressable>
        <Text style={styles.text}>
          I have read and agree to the{' '}
          <Text style={styles.link} accessibilityRole="link" accessibilityLabel="Open the Terms of Service" onPress={() => open(termsUrl)}>
            Terms of Service
          </Text>{' '}
          and the{' '}
          <Text style={styles.link} accessibilityRole="link" accessibilityLabel="Open the Privacy Policy" onPress={() => open(privacyUrl)}>
            Privacy Policy
          </Text>
          .
        </Text>
      </View>
      {failed && (
        <Text style={styles.error} accessibilityRole="alert">
          Could not open the page. Check your connection and try again.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingRight: 10 },
  checkbox: { width: 24, height: 24, borderRadius: 4, borderWidth: 1.5, borderColor: '#4B5563', marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  text: { fontFamily: Fonts.regular, fontSize: 13, color: '#374151', flex: 1, lineHeight: 20 },
  link: { color: '#1D4ED8', fontFamily: Fonts.medium, textDecorationLine: 'underline' },
  error: { fontFamily: Fonts.medium, fontSize: 13, color: '#7F1D1D', backgroundColor: '#FEE2E2', borderRadius: 12, padding: 10, marginTop: 8 },
  devNotice: { backgroundColor: '#FEF3C7', borderRadius: 12, padding: 10, marginTop: 12 },
  devText: { fontFamily: Fonts.medium, fontSize: 12, color: '#92400E', lineHeight: 18 },
});
