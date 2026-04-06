import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, CURRENCY, APP } from '@/constants';

export default function ProfileScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { profile } = useAuthStore();
  const [stats, setStats] = useState({ totalSaved: 0, activeGoals: 0, moodScore: 0 });

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      async function load() {
        const goalsRes = await db.getAllAsync<{ saved_amount: number }>(
          `SELECT saved_amount FROM goals WHERE status = 'active'`
        );
        const totalSaved = goalsRes.reduce((s, g) => s + (g.saved_amount ?? 0), 0);
        const moodRes = await db.getFirstAsync<{ score: number }>(
          `SELECT score FROM mood_entries ORDER BY created_at DESC LIMIT 1`
        );
        if (isMounted) {
          setStats({
            totalSaved,
            activeGoals: goalsRes.length,
            moodScore: moodRes?.score ?? 0,
          });
        }
      }
      load();
      return () => { isMounted = false; };
    }, [])
  );

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'This will reset the app and return to onboarding.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          useAuthStore.setState({ hasCompletedOnboarding: false, profile: null });
          router.replace('/(auth)');
        },
      },
    ]);
  };

  const persona = profile?.persona?.replace('_', ' ') ?? '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.name}>{profile?.name ?? 'You'}</Text>
          {profile?.email ? <Text style={styles.email}>{profile.email}</Text> : null}
          {persona ? (
            <View style={styles.personaBadge}>
              <Text style={styles.personaText}>{persona.charAt(0).toUpperCase() + persona.slice(1)}</Text>
            </View>
          ) : null}
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{CURRENCY.format(stats.totalSaved, true)}</Text>
            <Text style={styles.statLabel}>Total Saved</Text>
          </View>
          <View style={[styles.statItem, styles.statDivider]}>
            <Text style={styles.statValue}>{stats.activeGoals}</Text>
            <Text style={styles.statLabel}>Active Goals</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.special }]}>{stats.moodScore}</Text>
            <Text style={styles.statLabel}>Mood Score</Text>
          </View>
        </View>

        {/* Settings groups */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.settingsCard}>
          <NavRow label="Settings" onPress={() => router.push('/profile/settings')} />
          <NavRow label="Notifications" onPress={() => router.push('/profile/notifications')} />
          <NavRow label="Budget Edit" onPress={() => router.push('/profile/budget-edit')} last />
        </View>

        <Text style={styles.sectionLabel}>APP INFO</Text>
        <View style={styles.settingsCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>{APP.version}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Support</Text>
            <Text style={styles.infoValue}>{APP.supportEmail}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function NavRow({ label, onPress, last = false }: { label: string; onPress: () => void; last?: boolean }) {
  return (
    <TouchableOpacity style={[styles.navRow, last && { borderBottomWidth: 0 }]} onPress={onPress}>
      <Text style={styles.navLabel}>{label}</Text>
      <Text style={styles.navArrow}>›</Text>
    </TouchableOpacity>
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
    paddingBottom: SPACING.huge,
  },
  avatarSection: { alignItems: 'center', paddingVertical: SPACING.xxl },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.borderEmphasized,
  },
  avatarEmoji: { fontSize: 36 },
  name: { fontFamily: FONTS.displayMedium, fontSize: FONT_SIZE.h2, color: COLORS.textPrimary, marginBottom: SPACING.xxs },
  email: { fontFamily: FONTS.body, fontSize: FONT_SIZE.body, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  personaBadge: {
    backgroundColor: COLORS.specialBg,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.xxs,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.specialBorder,
  },
  personaText: { fontFamily: FONTS.bodyMedium, fontSize: FONT_SIZE.caption, color: COLORS.special },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.card,
    marginBottom: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: SPACING.lg },
  statDivider: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  statValue: { fontFamily: FONTS.displayMedium, fontSize: FONT_SIZE.h3, color: COLORS.textPrimary, marginBottom: SPACING.xxs },
  statLabel: { fontFamily: FONTS.body, fontSize: FONT_SIZE.caption, color: COLORS.textSecondary },
  sectionLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.label,
    color: COLORS.textTertiary,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  settingsCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
    marginBottom: SPACING.md,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  navLabel: { fontFamily: FONTS.bodyMedium, fontSize: FONT_SIZE.body, color: COLORS.textPrimary },
  navArrow: { fontFamily: FONTS.body, fontSize: 22, color: COLORS.textSecondary },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  infoLabel: { fontFamily: FONTS.body, fontSize: FONT_SIZE.body, color: COLORS.textSecondary },
  infoValue: { fontFamily: FONTS.bodyMedium, fontSize: FONT_SIZE.body, color: COLORS.textPrimary },
  signOutBtn: {
    marginTop: SPACING.xxl,
    backgroundColor: COLORS.dangerBg,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
  },
  signOutText: { fontFamily: FONTS.bodyMedium, fontSize: FONT_SIZE.body, color: COLORS.danger },
});
