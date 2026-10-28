import { Fonts } from '@/constants/theme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function PreAuthScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Background - Whitish blue */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#F0F5FF' }]} />

      {/* Animated Blur Effect Placeholder (using absolute circles for a soft gradient feel) */}
      <View style={styles.blurCircle1} />
      <View style={styles.blurCircle2} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.topText}>AI_POWERED LEARNING PLATFORM</Text>
        </View>

        <Image
          source={require('@/assets/images/preauth.png')}
          style={styles.mainImage}
          contentFit="cover"
        />

        <View style={styles.featureColumn}>
          <Text style={styles.featureText}>AI-Powered</Text>
          <Text style={styles.featureText}>Learn</Text>
          <Text style={styles.featureText}>Connect</Text>
        </View>

        <View style={styles.textSection}>
          <Text style={styles.heroText}>
            Let's build your{'\n'}perfect learning{'\n'}experience.
          </Text>
          <Text style={styles.subText}>
            We'll personalize your courses, AI tutor,{'\n'}
            study planner, and recommendations in less{'\n'}
            than one minute.
          </Text>
        </View>

        <View style={styles.actionSection}>
          <Pressable onPress={() => router.push('/(auth)/signup')}>
            <LinearGradient
              colors={['#2563EB', '#1D4ED8']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.signInRow}>
            <Text style={styles.alreadyText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={styles.signInLink}>Sign In</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
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
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 140,
    height: 60,
  },
  topText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: '#1F54DD',
    letterSpacing: 1.2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  mainImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginVertical: 16,
  },
  featureColumn: {
    gap: 5,
    marginVertical: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  featureText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#3B82F6',
  },
  textSection: {
    gap: 12,
  },
  heroText: {
    fontFamily: Fonts.extraBold,
    fontSize: 32,
    color: '#111827',
    lineHeight: 38,
    textAlign: 'center',
  },
  subText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
  },
  actionSection: {
    gap: 16,
    marginTop: 20,
  },
  button: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: '#ffffff',
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alreadyText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#6B7280',
  },
  signInLink: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#1D4ED8',
  },
});