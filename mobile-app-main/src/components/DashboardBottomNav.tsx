import React from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingDock, FloatingDockItem } from '@/components/ui/floating-dock';

export type DashboardTab = 'map' | 'study' | 'home' | 'groups' | 'chat' | 'profile';

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
  const insets = useSafeAreaInsets();

  const currentTab: DashboardTab =
    activeTab ||
    (pathname.includes('mapscreen') || pathname.includes('placdetailscreen')
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
        router.push('/dashboard/home');
        break;
      default:
        router.push('/dashboard/home');
    }
  };

  const handleFab = () => {
    if (onFabPress) {
      onFabPress();
    } else {
      router.push('/dashboard/studymode');
    }
  };

  const dockItems: FloatingDockItem[] = [
    {
      title: 'Home',
      icon: (
        <Ionicons
          name={currentTab === 'home' ? 'home' : 'home-outline'}
          size={20}
          color={currentTab === 'home' ? '#FFFFFF' : '#94A3B8'}
        />
      ),
      isActive: currentTab === 'home',
      onPress: () => navigateTo('home'),
    },
    {
      title: 'Map',
      icon: (
        <Feather
          name="map-pin"
          size={19}
          color={currentTab === 'map' ? '#FFFFFF' : '#94A3B8'}
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
          color={currentTab === 'study' ? '#FFFFFF' : '#94A3B8'}
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
      onPress: handleFab,
    },
    {
      title: 'Groups',
      icon: (
        <Ionicons
          name={currentTab === 'groups' ? 'people' : 'people-outline'}
          size={21}
          color={currentTab === 'groups' ? '#FFFFFF' : '#94A3B8'}
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
          color={currentTab === 'chat' ? '#FFFFFF' : '#94A3B8'}
        />
      ),
      isActive: currentTab === 'chat',
      onPress: () => navigateTo('chat'),
    },
  ];

  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 16);

  return (
    <View style={[styles.container, { bottom: bottomInset }]} pointerEvents="box-none">
      <FloatingDock items={dockItems} showTooltips={showTooltips} />
    </View>
  );
}

const styles = StyleSheet.create({
  aiLogo: { width: 28, height: 30 },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
});
