import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Polyline, Rect } from 'react-native-svg';
import { COLORS, FONT_SIZE, SPACING } from '@/constants';

// ─── SVG Icon Components ────────────────────────────────────────────────────

interface IconProps {
  color: string;
  size?: number;
}

/** Home — house with door */
function HomeIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5L12 3l9 7.5V21H15v-5H9v5H3V10.5z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Spend — wallet with card slot */
function SpendIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="6"
        width="20"
        height="13"
        rx="3"
        stroke={color}
        strokeWidth={1.6}
      />
      <Path
        d="M2 10h20"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Circle cx="16.5" cy="15" r="1.5" fill={color} />
    </Svg>
  );
}

/** Goals — target / bullseye */
function GoalsIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.6} />
      <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={1.6} />
      <Circle cx="12" cy="12" r="1.5" fill={color} />
    </Svg>
  );
}

/** Insights — trending line chart going up */
function InsightsIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline
        points="3,17 8,11 12,14 16,7 21,4"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M17 4h4v4"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Tab Config ─────────────────────────────────────────────────────────────

const TAB_CONFIG = [
  { name: 'index',    label: 'Home',     Icon: HomeIcon    },
  { name: 'spend',    label: 'Spend',    Icon: SpendIcon   },
  { name: 'goals',    label: 'Goals',    Icon: GoalsIcon   },
  { name: 'insights', label: 'Insights', Icon: InsightsIcon },
];

// ─── FlowWise Tab Bar ────────────────────────────────────────────────────────

export function FlowWiseTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || SPACING.md }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tabConfig = TAB_CONFIG.find(t => t.name === route.name);
        if (!tabConfig) return null;

        const { label, Icon } = tabConfig;
        const color = isFocused ? COLORS.primary : COLORS.textTertiary;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
            style={[
              styles.tab,
              isFocused && styles.tabActive,
            ]}
          >
            <Icon color={color} size={22} />
            <Text style={[styles.label, { color }]}>
              {label}
            </Text>
            {isFocused && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,          // #161920
    borderTopWidth: 0.5,
    borderTopColor: COLORS.borderEmphasized,  // rgba(255,255,255,0.12)
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    borderRadius: 14,
    position: 'relative',
  },
  tabActive: {
    backgroundColor: COLORS.primaryBg, // rgba(42,255,214,0.10)
  },
  label: {
    fontSize: FONT_SIZE.label,          // 10px
    fontFamily: 'DMSans_500Medium',
    letterSpacing: 0.2,
  },
  activeDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,   // mint
  },
});