import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, STORAGE_KEYS, NOTIFICATION } from '@/constants';

export default function NotificationsScreen() {
  const router = useRouter();
  const [prefs, setPrefs] = useState(NOTIFICATION.defaults);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFS).then(raw => {
      if (raw) setPrefs(JSON.parse(raw));
    });
  }, []);

  const toggle = async (key: keyof typeof prefs, value: boolean) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFS, JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>ALERTS</Text>
        <View style={styles.card}>
          <ToggleRow
            label="Spending Alerts"
            subtitle="At 75% and 100% of budget"
            value={prefs.spendingAlerts}
            onToggle={v => toggle('spendingAlerts', v)}
          />
          <ToggleRow
            label="Goal Milestones"
            subtitle="When you hit 50%, 75%, 100%"
            value={prefs.goalMilestones}
            onToggle={v => toggle('goalMilestones', v)}
          />
          <ToggleRow
            label="Weekly Insight"
            subtitle="Sunday evening summary"
            value={prefs.weeklyInsight}
            onToggle={v => toggle('weeklyInsight', v)}
            last
          />
        </View>

        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.card}>
          <ToggleRow
            label="Quiet Hours"
            subtitle={`${NOTIFICATION.quietHours.start}:00 – ${NOTIFICATION.quietHours.end}:00`}
            value={prefs.quietHours}
            onToggle={v => toggle('quietHours', v)}
            last
          />
        </View>
      </ScrollView>
    </View>
  );
}

function ToggleRow({ label, subtitle, value, onToggle, last = false }: {
  label: string;
  subtitle: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.toggleRow, last && { borderBottomWidth: 0 }]}>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.surfaceHover, true: COLORS.primaryBg }}
        thumbColor={value ? COLORS.primary : COLORS.textTertiary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.screenTop,
    paddingBottom: SPACING.md,
  },
  backBtn: { padding: SPACING.xs, width: 40 },
  backIcon: { color: COLORS.textPrimary, fontSize: 22 },
  title: { fontFamily: FONTS.displayMedium, fontSize: FONT_SIZE.h3, color: COLORS.textPrimary },
  scrollContent: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.huge,
  },
  sectionLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.label,
    color: COLORS.textTertiary,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  toggleInfo: { flex: 1, paddingRight: SPACING.md },
  toggleLabel: { fontFamily: FONTS.bodyMedium, fontSize: FONT_SIZE.body, color: COLORS.textPrimary, marginBottom: 2 },
  toggleSubtitle: { fontFamily: FONTS.body, fontSize: FONT_SIZE.caption, color: COLORS.textSecondary },
});
