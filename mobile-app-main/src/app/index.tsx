import { Fonts } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/(auth)/preauth');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.root}>
      {/* Background image */}
      <Image
        source={require('@/assets/images/begin.avif')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      {/* Blue overlay */}
      <View style={styles.overlay} />

      {/* Logo + tagline pinned to the bottom */}
      <View style={styles.bottom}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.tagline}>Learn, practice and excel</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#2563EB',
    opacity: 0.25,
  },
  bottom: {
    position: 'absolute',
    bottom: 64,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 180,
    height: 80,
  },
  tagline: {
    fontFamily: Fonts.medium,
    color: '#ffffff',
    fontSize: 17,
    letterSpacing: 0.3,
    opacity: 0.95,
  },
});
