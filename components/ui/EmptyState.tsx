import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from '@/constants';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon?: 'transactions' | 'goals' | 'insights' | 'mood';
}

const Icons = {
  transactions: () => (
    <Svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="16" rx="2" stroke={COLORS.textTertiary} strokeWidth="1.5" />
      <Path d="M7 12H17M7 8H13M7 16H10" stroke={COLORS.textTertiary} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  ),
  goals: () => (
    <Svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={COLORS.textTertiary} strokeWidth="1.5" />
      <Path d="M12 8V12L15 15" stroke={COLORS.textTertiary} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="12" cy="12" r="2" fill={COLORS.textTertiary} />
    </Svg>
  ),
  insights: () => (
    <Svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <Path d="M3 18V9M8 18V12M13 18V6M18 18V15" stroke={COLORS.textTertiary} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M3 21H21" stroke={COLORS.textTertiary} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  ),
  mood: () => (
    <Svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={COLORS.textTertiary} strokeWidth="1.5" />
      <Path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke={COLORS.textTertiary} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="9" cy="9" r="1.5" fill={COLORS.textTertiary} />
      <Circle cx="15" cy="9" r="1.5" fill={COLORS.textTertiary} />
    </Svg>
  ),
};

export default function EmptyState({ title, subtitle, icon = 'transactions' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        {Icons[icon]()}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxxl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.lg,
  },
  iconWrapper: {
    marginBottom: SPACING.xl,
    opacity: 0.5,
  },
  title: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
