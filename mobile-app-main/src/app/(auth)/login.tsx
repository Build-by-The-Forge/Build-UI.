import { Fonts } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

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
            />
          </View>

          <View style={[styles.inputContainer, { marginTop: 5 }]}>
            <Feather name="lock" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
          </View>

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotText}>forgot password?</Text>
          </Pressable>

          <Pressable style={styles.buttonWrapper} onPress={() => router.replace('/(onboarding)/step-one')}>
            <LinearGradient
              colors={['#3B82F6', '#6366F1']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Sign In</Text>
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
