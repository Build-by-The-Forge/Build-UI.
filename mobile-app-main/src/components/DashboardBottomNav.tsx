import React from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FloatingDock, FloatingDockItem } from '@/components/ui/floating-dock';
import { useTheme } from '@/context/ThemeContext';

export type DashboardTab = 'map' | 'study' | 'home' | 'ai' | 'groups' | 'chat' | 'profile';

interface DashboardBottomNavProps {
  activeTab?: DashboardTab;
  onFabPress?: () => void;
  showTooltips?: boolean;
}

export default function DashboardBottomNav({
  activeTab,
  onFabPress,
  showTooltips = true,
}: DashboardBottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { mode } = useTheme();
  const activeColor = mode === 'dark' ? '#8AB8FF' : '#2563EB';
  const inactiveColor = mode === 'dark' ? '#B5C3D5' : '#64748B';

  const currentTab: DashboardTab =
    activeTab ||
    (pathname.includes('buildai')
      ? 'ai'
      : pathname.includes('mapscreen') || pathname.includes('placdetailscreen')
      ? 'map'
      : pathname.includes('studygroup')
      ? 'groups'
      : pathname.includes('chatscreen')
      ? 'chat'
      : pathname.includes('studymode') ||
        pathname.includes('readmode') ||
        pathname.includes('cbtquiz') ||
        pathname.includes('videoplayer')
      ? 'study'
      : 'home');

  const navigateTo = (tab: DashboardTab) => {
    switch (tab) {
      case 'map':
        router.push('/dashboard/mapscreen');
        break;
      case 'study':
        router.push('/dashboard/studymode');
        break;
      case 'home':
        router.push('/dashboard/home');
        break;
      case 'groups':
        router.push('/dashboard/studygroup');
        break;
      case 'chat':
        router.push('/dashboard/chatscreen');
        break;
      case 'profile':
        router.push('/dashboard/settings');
        break;
      case 'ai':
        router.push('/dashboard/buildai');
        break;
      default:
        router.push('/dashboard/home');
    }
  };

  const handleFab = () => {
    if (onFabPress) {
      onFabPress();
    } else {
      router.push('/dashboard/buildai');
    }
  };

  const dockItems: FloatingDockItem[] = [
    {
      title: 'Home',
      icon: (
        <Ionicons
          name={currentTab === 'home' ? 'home' : 'home-outline'}
          size={20}
          color={currentTab === 'home' ? activeColor : inactiveColor}
        />
      ),
      isActive: currentTab === 'home',
      onPress: () => navigateTo('home'),
    },
    {
      title: 'Map',
      icon: (
        <Ionicons
          name={currentTab === 'map' ? 'location' : 'location-outline'}
          size={21}
          color={currentTab === 'map' ? activeColor : inactiveColor}
        />
      ),
      isActive: currentTab === 'map',
      onPress: () => navigateTo('map'),
    },
    {
      title: 'Study',
      icon: (
        <Ionicons
          name={currentTab === 'study' ? 'school' : 'school-outline'}
          size={21}
          color={currentTab === 'study' ? activeColor : inactiveColor}
        />
      ),
      isActive: currentTab === 'study',
      onPress: () => navigateTo('study'),
    },
    {
      title: 'BUILD AI',
      icon: (
        <Image
          source={require('@/assets/images/build-ai-logo.png')}
          resizeMode="contain"
          style={styles.aiLogo}
        />
      ),
      isSpecial: true,
      isActive: currentTab === 'ai',
      onPress: handleFab,
    },
    {
      title: 'Groups',
      icon: (
        <Ionicons
          name={currentTab === 'groups' ? 'people' : 'people-outline'}
          size={21}
          color={currentTab === 'groups' ? activeColor : inactiveColor}
        />
      ),
      isActive: currentTab === 'groups',
      onPress: () => navigateTo('groups'),
    },
    {
      title: 'Chat',
      icon: (
        <Ionicons
          name={currentTab === 'chat' ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
          size={20}
          color={currentTab === 'chat' ? activeColor : inactiveColor}
        />
      ),
      isActive: currentTab === 'chat',
      onPress: () => navigateTo('chat'),
    },
  ];

  return (
    <View style={[styles.container, { bottom: width >= 760 ? 16 : 0 }]} pointerEvents="box-none">
      <FloatingDock items={dockItems} showTooltips={showTooltips} />
    </View>
  );
}

const styles = StyleSheet.create({
  aiLogo: { width: 24, height: 25 },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
});
