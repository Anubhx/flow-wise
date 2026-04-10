import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from '@/constants';

interface StreakChipProps {
  streakCount: number;
}

export default function StreakChip({ streakCount }: StreakChipProps) {
  if (streakCount === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔥</Text>
      <Text style={styles.count}>{streakCount}</Text>
      <Text style={styles.label}>day streak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 14,
    marginRight: 4,
  },
  count: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    color: COLORS.danger,
    marginRight: 4,
  },
  label: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
