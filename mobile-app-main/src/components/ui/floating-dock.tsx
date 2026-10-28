import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Fonts } from '@/constants/theme';

export interface FloatingDockItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onPress?: () => void;
  isActive?: boolean;
  badge?: string | number;
  isSpecial?: boolean;
}

export interface FloatingDockProps {
  items: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  showTooltips?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function DockIconItem({
  item,
  showTooltips = true,
}: {
  item: FloatingDockItem;
  showTooltips?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const tooltipOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  const animatedTooltipStyle = useAnimatedStyle(() => {
    return {
      opacity: tooltipOpacity.value,
      transform: [
        {
          translateY: interpolate(
            tooltipOpacity.value,
            [0, 1],
            [6, -8],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(1.22, { damping: 12, stiffness: 220 });
    translateY.value = withSpring(-6, { damping: 12, stiffness: 220 });
    if (showTooltips) {
      tooltipOpacity.value = withTiming(1, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 180 });
    translateY.value = withSpring(0, { damping: 14, stiffness: 180 });
    if (showTooltips && !isHovered) {
      tooltipOpacity.value = withTiming(0, { duration: 200 });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.value = withSpring(1.25, { damping: 12, stiffness: 200 });
    translateY.value = withSpring(-8, { damping: 12, stiffness: 200 });
    if (showTooltips) {
      tooltipOpacity.value = withTiming(1, { duration: 150 });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    scale.value = withSpring(1, { damping: 14, stiffness: 180 });
    translateY.value = withSpring(0, { damping: 14, stiffness: 180 });
    if (showTooltips) {
      tooltipOpacity.value = withTiming(0, { duration: 180 });
    }
  };

  const webProps = Platform.OS === 'web' ? {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  } : {};

  return (
    <View style={styles.itemWrapper}>
      {/* Floating Tooltip */}
      {showTooltips && (
        <Animated.View
          style={[styles.tooltipContainer, animatedTooltipStyle]}
          pointerEvents="none"
        >
          <View style={styles.tooltipPill}>
            <Text style={styles.tooltipText}>{item.title}</Text>
          </View>
        </Animated.View>
      )}

      {/* Dock Icon Button */}
      <AnimatedTouchable
        activeOpacity={0.85}
        onPress={item.onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...webProps}
        style={[
          styles.iconButton,
          item.isActive && styles.iconButtonActive,
          item.isSpecial && styles.iconButtonSpecial,
          animatedStyle,
        ]}
      >
        {item.icon}

        {/* Active indicator dot */}
        {item.isActive && !item.isSpecial && (
          <View style={styles.activeDot} />
        )}

        {/* Optional Badge */}
        {item.badge !== undefined && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </AnimatedTouchable>
    </View>
  );
}

export function FloatingDock({
  items,
  style,
  containerStyle,
  showTooltips = true,
}: FloatingDockProps) {
  return (
    <View style={[styles.dockContainer, containerStyle]}>
      <View style={[styles.dockBar, style]}>
        {items.map((item, index) => (
          <DockIconItem
            key={`${item.title}-${index}`}
            item={item}
            showTooltips={showTooltips}
          />
        ))}
      </View>
    </View>
  );
}

export function FloatingDockDesktop(props: FloatingDockProps) {
  return <FloatingDock {...props} />;
}

export function FloatingDockMobile(props: FloatingDockProps) {
  return <FloatingDock {...props} />;
}

const styles = StyleSheet.create({
  dockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  dockBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#0F172A',
    borderRadius: 32,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  itemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tooltipContainer: {
    position: 'absolute',
    top: -34,
    alignSelf: 'center',
    zIndex: 50,
  },
  tooltipPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  tooltipText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Fonts.bold,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  iconButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#60A5FA',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  iconButtonSpecial: {
    backgroundColor: '#1D4ED8',
    borderColor: '#93C5FD',
    borderWidth: 1.5,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  activeDot: {
    position: 'absolute',
    bottom: -5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#60A5FA',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    fontFamily: Fonts.extraBold,
  },
});

export default FloatingDock;
