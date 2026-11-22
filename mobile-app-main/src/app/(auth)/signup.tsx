import { Fonts } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useOnboarding } from '@/context/Onboardingcontext';
import { VerifyEmailPanel } from '@/components/auth/VerifyEmailPanel';
import { describeAuthError, noErrors, type FormErrors } from '@/auth/errorMessages';
import { useSession } from '@/auth/SessionProvider';
import { apiConfig } from '@/api/config';
import { PolicyAgreement } from '@/components/auth/PolicyAgreement';

export default function SignupScreen() {
  const router = useRouter();
  const { resetOnboarding } = useOnboarding();
  const { signUp } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const { termsUrl, privacyUrl } = apiConfig();
  // Acceptance is only asked for when both documents can be opened.
  const policiesLinked = !!termsUrl && !!privacyUrl;
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<FormErrors>(noErrors);
  // Registration answers a bodyless 202 whether or not the account is new, so
  // the next step is always "check your email".
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  async function submit() {
    if (busy) return;
    const fields: Record<string, string> = {};
    if (!email.trim()) fields.email = 'Enter your email address.';
    if (!password) fields.password = 'Choose a password.';
    else if (password !== confirm) fields.confirm = 'The two passwords do not match.';
    const needsAgreement = policiesLinked && !agreed;
    if (Object.keys(fields).length || needsAgreement) {
      setErrors({ fields, general: needsAgreement ? 'Agree to the Terms of Service and Privacy Policy to continue.' : null });
      return;
    }
    setBusy(true);
    setErrors(noErrors);
    try {
      await signUp(email.trim(), password);
      resetOnboarding();
      setRegisteredEmail(email.trim());
    } catch (error) {
      setErrors(describeAuthError(error));
    } finally {
      setBusy(false);
    }
  }

  const fieldError = (name: string) =>
    errors.fields[name] ? <Text accessibilityRole="alert" style={styles.error}>{errors.fields[name]}</Text> : null;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#F0F5FF' }]} />
      <View style={styles.blurCircle1} />
      <View style={styles.blurCircle2} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} contentFit="contain" />
            <Text style={styles.logoText}>BUILD</Text>
          </View>
          <Text style={styles.title}>Create your BUILD account</Text>
          <Text style={styles.subtitle}>Your programme and courses come next.</Text>
        </View>

        <View style={styles.glassBox}>
          {registeredEmail ? (
            <VerifyEmailPanel email={registeredEmail} onVerified={() => router.replace('/(auth)/login')} />
          ) : (
            <View style={styles.formContent}>
              <View style={styles.inputContainer}>
                <Feather name="mail" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none" autoComplete="email" autoCorrect={false} value={email} onChangeText={setEmail} editable={!busy} accessibilityLabel="Email address" />
              </View>
              {fieldError('email')}
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#9CA3AF" secureTextEntry autoComplete="new-password" value={password} onChangeText={setPassword} editable={!busy} accessibilityLabel="Password" />
              </View>
              {fieldError('password')}
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#9CA3AF" secureTextEntry autoComplete="new-password" value={confirm} onChangeText={setConfirm} editable={!busy} accessibilityLabel="Confirm password" />
              </View>
              {fieldError('confirm')}

              <PolicyAgreement termsUrl={termsUrl} privacyUrl={privacyUrl} agreed={agreed} onToggle={() => setAgreed(!agreed)} />
              {!!errors.general && <Text accessibilityRole="alert" style={styles.error}>{errors.general}</Text>}

              <Pressable style={styles.buttonWrapper} onPress={submit} disabled={busy} accessibilityRole="button" accessibilityState={{ busy }}>
                <LinearGradient colors={['#3B82F6', '#6366F1']} style={styles.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  {busy ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Create account</Text>}
                </LinearGradient>
              </Pressable>
              <Pressable onPress={() => router.replace('/(auth)/login')} accessibilityRole="link" style={styles.backLink}>
                <Text style={styles.linkText}>Already have an account? Sign in</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  blurCircle1: { position: 'absolute', top: -100, left: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: '#D6E4FF', opacity: 0.6 },
  blurCircle2: { position: 'absolute', bottom: -50, right: -100, width: 250, height: 250, borderRadius: 125, backgroundColor: '#E0EAFF', opacity: 0.6 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', paddingVertical: 40 },
  header: { alignItems: 'center', marginBottom: 16 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  logo: { width: 40, height: 40 },
  logoText: { fontFamily: Fonts.extraBold, fontSize: 24, color: '#1F54DD' },
  title: { fontFamily: Fonts.bold, fontSize: 22, color: '#1F54DD', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontFamily: Fonts.regular, fontSize: 14, color: '#80889A', textAlign: 'center' },

  glassBox: { backgroundColor: 'rgba(131, 155, 255, 0.9)', boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)', borderRadius: 30, padding: 20, paddingTop: 40, paddingBottom: 40 , marginTop: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.7)' },

  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255, 255, 255, 0.5)', alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: '#3B82F6' },
  stepNumber: { fontFamily: Fonts.bold, fontSize: 14, color: '#6B7280' },
  stepNumberActive: { color: '#ffffff' },
  stepLine: { width: 40, height: 2, backgroundColor: 'rgba(255, 255, 255, 0.5)', marginHorizontal: 4 },
  stepLineActive: { backgroundColor: '#3B82F6' },

  stepInfo: { alignItems: 'center', marginBottom: 12 },
  stepCount: { fontFamily: Fonts.medium, fontSize: 13, color: '#4B5563' },
  stepTitle: { fontFamily: Fonts.bold, fontSize: 16, color: '#1F2937', marginTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.4)', marginBottom: 16 },

  formContent: { gap: 10, marginTop: 5 },
  inputContainer: { flexDirection: 'row', boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 20, height: 50, paddingHorizontal: 12 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontFamily: Fonts.regular, fontSize: 15, color: '#111827' },

  passwordIndicator: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 6, paddingHorizontal: 4 },
  indicatorBar: { flex: 1, height: 4, borderRadius: 2 },
  indicatorText: { fontFamily: Fonts.medium, fontSize: 12, color: '#10B981', marginLeft: 4 },

  agreementRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingRight: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: '#4B5563', marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  agreementText: { fontFamily: Fonts.regular, fontSize: 13, color: '#374151', flex: 1, lineHeight: 18 },
  linkText: { color: '#1D4ED8', fontFamily: Fonts.medium },

  actions: { marginTop: 16 },
  error: { fontFamily: Fonts.medium, fontSize: 13, color: '#7F1D1D', backgroundColor: '#FEE2E2', borderRadius: 12, padding: 10 },
  backLink: { alignItems: 'center', paddingVertical: 8 },
  actionsRow: { flexDirection: 'row', marginTop: 16, gap: 12, alignItems: 'center' },
  backButton: { width: 50, height: 50, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.7)', borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  buttonWrapper: {},
  button: { height: 50, marginTop: 16, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
});
