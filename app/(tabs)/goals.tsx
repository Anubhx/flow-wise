import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, CURRENCY } from '@/constants';

export default function GoalsScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [goals, setGoals] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      async function loadData() {
        try {
          const fetchedGoals = await db.getAllAsync(`SELECT * FROM goals ORDER BY created_at DESC`);
          if (isMounted) {
            setGoals(fetchedGoals);
          }
        } catch (e) {
          console.error(e);
        }
      }
      loadData();
      return () => { isMounted = false };
    }, [])
  );

  const totalSavedPaise = goals.reduce((sum, g) => sum + (g.saved_amount || 0), 0);
  const totalTargetPaise = goals.reduce((sum, g) => sum + g.target_amount, 0);

  const renderGoalCard = (g: any) => {
    const progress = g.target_amount > 0 ? (g.saved_amount / g.target_amount) * 100 : 0;
    const isCompleted = progress >= 100;
    const displayProgress = Math.min(Math.round(progress), 100);

    return (
      <View key={g.id} style={[styles.goalCard, isCompleted && styles.goalCardCompleted]}>
        <View style={styles.goalHeader}>
          <View style={[styles.iconBox, { backgroundColor: g.color + '22' }]}>
            <Text style={styles.iconText}>{g.icon}</Text>
          </View>
          <View style={styles.goalInfo}>
            <Text style={styles.goalName}>{g.name}</Text>
            <Text style={styles.goalAmount}>
              {CURRENCY.format(g.saved_amount, true)} / {CURRENCY.format(g.target_amount, true)}
            </Text>
          </View>
          {isCompleted ? (
            <View style={styles.celebrationBadge}>
              <Text style={styles.celebrationIcon}>🎉</Text>
            </View>
          ) : (
            <Text style={[styles.percentText, { color: g.color }]}>{displayProgress}%</Text>
          )}
        </View>

        <View style={styles.progressTrack}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${displayProgress}%`, backgroundColor: isCompleted ? COLORS.primary : g.color }
            ]} 
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Goals</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/goal/add')}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Saved</Text>
          <Text style={styles.summaryAmount}>{CURRENCY.format(totalSavedPaise)}</Text>
          <Text style={styles.summarySubtext}>across {goals.length} active goals</Text>
        </View>

        <View style={styles.goalsList}>
          {goals.length === 0 ? (
            <View style={styles.emptyState}>
               <Text style={styles.emptyEmoji}>🎯</Text>
               <Text style={styles.emptyTitle}>No goals yet</Text>
               <Text style={styles.emptySubtext}>Set a savings target to begin your journey.</Text>
               <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/goal/add')}>
                 <Text style={styles.emptyBtnText}>Create Goal</Text>
               </TouchableOpacity>
            </View>
          ) : (
            goals.map(renderGoalCard)
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.screenTop,
    paddingBottom: SPACING.md,
  },
  title: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h2,
    color: COLORS.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  addIcon: {
    fontFamily: FONTS.displayMedium,
    fontSize: 24,
    color: COLORS.textPrimary,
    marginTop: -2,
  },
  scrollContent: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: SPACING.huge,
  },
  summaryCard: {
    backgroundColor: COLORS.primaryBg || 'rgba(42,255,214,0.1)',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xxxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryBorder || 'rgba(42,255,214,0.3)',
  },
  summaryLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  summaryAmount: {
    fontFamily: FONTS.displayBold,
    fontSize: 40,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  summarySubtext: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
  },
  goalsList: {
    gap: SPACING.md,
  },
  goalCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  goalCardCompleted: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iconText: {
    fontSize: 24,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  goalAmount: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
  },
  percentText: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h3,
  },
  celebrationBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryBg || 'rgba(42,255,214,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationIcon: {
    fontSize: 18,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.surfaceHover,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.pill,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  emptyBtn: {
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  emptyBtnText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  }
});
