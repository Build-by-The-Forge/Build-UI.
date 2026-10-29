import { Fonts } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useOnboarding } from '@/context/Onboardingcontext';

export default function SignupScreen() {
  const router = useRouter();
  const { resetOnboarding } = useOnboarding();
  const [step, setStep] = useState(1);

  // Form state (for visual purposes in the UI)
  const [agreed, setAgreed] = useState(false);

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const submit = () => {
    resetOnboarding();
    router.push('/(onboarding)/step-one');
  };

  const renderStepIndicator = () => (
    <View style={styles.stepperContainer}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.stepItem}>
          <View style={[styles.stepCircle, step >= i ? styles.stepCircleActive : null]}>
            <Text style={[styles.stepNumber, step >= i ? styles.stepNumberActive : null]}>{i}</Text>
          </View>
          {i < 3 && <View style={[styles.stepLine, step > i ? styles.stepLineActive : null]} />}
        </View>
      ))}
    </View>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.formContent}>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#9CA3AF" />
            </View>
            <View style={[styles.inputContainer, { marginTop: 5 }]}>
              <Feather name="user" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#9CA3AF" />
            </View>
            <View style={[styles.inputContainer, { marginTop: 5 }]}>
              <Feather name="mail" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={styles.actions}>
              <Pressable style={styles.buttonWrapper} onPress={nextStep}>
                <LinearGradient colors={['#3B82F6', '#6366F1']} style={styles.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.buttonText}>Continue</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.formContent}>
            <View style={styles.inputContainer}>
              <Feather name="book" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="University or Institution" placeholderTextColor="#9CA3AF" />
            </View>
            <View style={[styles.inputContainer, { marginTop: 5 }]}>
              <Feather name="briefcase" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Faculty" placeholderTextColor="#9CA3AF" />
            </View>
            <View style={[styles.inputContainer, { marginTop: 5 }]}>
              <Feather name="layers" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Department" placeholderTextColor="#9CA3AF" />
            </View>

            <View style={styles.actionsRow}>
              <Pressable style={styles.backButton} onPress={prevStep}>
                <Feather name="arrow-left" size={24} color="#1F54DD" />
              </Pressable>
              <Pressable style={[styles.buttonWrapper, { flex: 1 }]} onPress={nextStep}>
                <LinearGradient colors={['#3B82F6', '#6366F1']} style={styles.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.buttonText}>Continue</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.formContent}>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#9CA3AF" secureTextEntry />
            </View>
            <View style={styles.passwordIndicator}>
              <View style={[styles.indicatorBar, { backgroundColor: '#10B981' }]} />
              <View style={[styles.indicatorBar, { backgroundColor: '#10B981' }]} />
              <View style={[styles.indicatorBar, { backgroundColor: '#D1D5DB' }]} />
              <Text style={styles.indicatorText}>Good</Text>
            </View>
            <View style={[styles.inputContainer, { marginTop: 5 }]}>
              <Feather name="lock" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#9CA3AF" secureTextEntry />
            </View>

            <View style={styles.agreementRow}>
              <Pressable style={[styles.checkbox, agreed && styles.checkboxActive]} onPress={() => setAgreed(!agreed)}>
                {agreed && <Feather name="check" size={14} color="#fff" />}
              </Pressable>
              <Text style={styles.agreementText}>
                I agree to the <Text style={styles.linkText}>Terms of Service</Text> & <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </View>

            <View style={styles.actionsRow}>
              <Pressable style={styles.backButton} onPress={prevStep}>
                <Feather name="arrow-left" size={24} color="#1F54DD" />
              </Pressable>
              <Pressable style={[styles.buttonWrapper, { flex: 1 }]} onPress={submit}>
                <LinearGradient colors={['#3B82F6', '#6366F1']} style={styles.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.buttonText}>Complete Sign Up</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const stepTitles = ["Personal Information", "Academic Details", "Security & Setup"];

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#F0F5FF' }]} />
      <View style={styles.blurCircle1} />
      <View style={styles.blurCircle2} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} contentFit="contain" />
            <Text style={styles.logoText}>BUILD</Text>
          </View>
          <Text style={styles.title}>Create your BUILD account</Text>
          <Text style={styles.subtitle}>Let's set up your learning experience.</Text>
        </View>

        {/* Glassmorphism Box */}
        <View style={styles.glassBox}>

          {renderStepIndicator()}

          <View style={styles.stepInfo}>
            <Text style={styles.stepCount}>Step {step} of 3</Text>
            <Text style={styles.stepTitle}>{stepTitles[step - 1]}</Text>
          </View>

          <View style={styles.divider} />

          {renderStepContent()}

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
  actionsRow: { flexDirection: 'row', marginTop: 16, gap: 12, alignItems: 'center' },
  backButton: { width: 50, height: 50, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.7)', borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  buttonWrapper: {},
  button: { height: 50, marginTop: 16, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
});
