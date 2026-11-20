import { Fonts } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { describeAuthError, noErrors, type FormErrors } from '@/auth/errorMessages';
import { useSession } from '@/auth/SessionProvider';

export default function LoginScreen() {
  const { signIn, reason } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<FormErrors>(noErrors);

  async function submit() {
    if (busy) return;
    if (!email.trim() || !password) {
      setErrors({ fields: {}, general: 'Enter your email and password.' });
      return;
    }
    setBusy(true);
    setErrors(noErrors);
    try {
      // On success the navigator moves on by itself: this screen is only
      // reachable while signed out.
      await signIn(email.trim(), password);
    } catch (error) {
      setErrors(describeAuthError(error));
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#F0F5FF' }]} />
      <View style={styles.blurCircle1} />
      <View style={styles.blurCircle2} />

      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              contentFit="contain"
            />
            <Text style={styles.logoText}>BUILD</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Continue your learning journey.</Text>
        </View>

        {/* Glassmorphism Box */}
        <View style={styles.glassBox}>

          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!busy}
              accessibilityLabel="Email address"
            />
          </View>

          <View style={[styles.inputContainer, { marginTop: 5 }]}>
            <Feather name="lock" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoComplete="current-password"
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={submit}
              editable={!busy}
              accessibilityLabel="Password"
            />
          </View>

          {reason === 'expired' && !errors.general && (
            <Text style={styles.notice}>Your session ended. Sign in again to continue.</Text>
          )}
          {!!errors.general && <Text accessibilityRole="alert" style={styles.error}>{errors.general}</Text>}
          {Object.values(errors.fields).map((m) => (
            <Text key={m} accessibilityRole="alert" style={styles.error}>{m}</Text>
          ))}

          <Pressable style={styles.buttonWrapper} onPress={submit} disabled={busy} accessibilityRole="button" accessibilityState={{ busy }}>
            <LinearGradient
              colors={['#3B82F6', '#6366F1']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {busy ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Sign In</Text>}
            </LinearGradient>
          </Pressable>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Sign Up</Text>
            </Pressable>
          </Link>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  blurCircle1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#D6E4FF',
    opacity: 0.6,
  },
  blurCircle2: {
    position: 'absolute',
    bottom: -50,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#E0EAFF',
    opacity: 0.6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoText: {
    fontFamily: Fonts.extraBold,
    fontSize: 24,
    color: '#1F54DD',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: '#1F54DD',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: '#80889A',
  },
  glassBox: {
    backgroundColor: 'rgba(131, 155, 255, 0.9)',
    borderRadius: 30,
    padding: 20,
    marginTop: 10,
    // Add a slight border for the glass effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    height: 50,
    paddingHorizontal: 12,
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: '#111827',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginBottom: 10,
  },
  forgotText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#004EAA',
  },
  error: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#7F1D1D',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  notice: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#1E3A8A',
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  buttonWrapper: {
    marginTop: 8,
  },
  button: {
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  buttonText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#6B7280',
  },
  footerLink: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#4A90E2',
  },
});
