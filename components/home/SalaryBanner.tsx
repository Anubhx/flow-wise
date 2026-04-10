import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from '@/constants';

export default function SalaryBanner() {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - today.getDate();

  // Only show if it's the last 7 days of the month
  if (daysLeft > 7) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>💰</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Salary coming soon!</Text>
          <Text style={styles.subtitle}>Only {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left until payday. Stay strong!</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.actionBtn}>
        <Text style={styles.actionText}>View Budget</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    marginBottom: SPACING.xl,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h4,
    color: '#0EA5E9',
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  actionBtn: {
    backgroundColor: '#0EA5E9',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  actionText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.white,
  },
});
