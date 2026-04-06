import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, CURRENCY, EXPENSE_CATEGORIES } from '@/constants';

export default function HomeScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { profile } = useAuthStore();
  
  const [balancePaise, setBalancePaise] = useState(0);
  const [recentTx, setRecentTx] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      async function loadData() {
        try {
          // Fetch balance (in a real app this would sum incomes vs expenses, for now we mock based on transactions)
          // Since we only do expenses right now, balance will be negative of sum. Wait, let's just show mock balance minus expenses.
          const expResult = await db.getAllAsync<{total: number}>(`SELECT SUM(amount) as total FROM transactions WHERE type='expense'`);
          const totalExpenses = expResult[0]?.total || 0;
          
          const startingBalance = 15000000; // Mock 1.5L starting balance for V1
          const currentBalance = startingBalance - totalExpenses;

          const txs = await db.getAllAsync(`
            SELECT * FROM transactions 
            ORDER BY transaction_date DESC 
            LIMIT 3
          `);

          if (isMounted) {
            setBalancePaise(currentBalance);
            setRecentTx(txs);
          }
        } catch (e) {
          console.error(e);
        }
      }
      loadData();
      return () => { isMounted = false };
    }, [])
  );

  const renderTransaction = (tx: any) => {
    const category = EXPENSE_CATEGORIES.find(c => c.id === tx.category);
    return (
      <View key={tx.id} style={styles.txRow}>
        <View style={[styles.txIconBox, { backgroundColor: category?.color + '22' }]}>
          <Text style={styles.txIcon}>{category?.icon || '📝'}</Text>
        </View>
        <View style={styles.txInfo}>
          <Text style={styles.txTitle}>{category?.label || tx.category}</Text>
          <Text style={styles.txDate}>
            {new Date(tx.transaction_date).toLocaleDateString([], { month: 'short', day: 'numeric' })} 
            {tx.note ? ` · ${tx.note}` : ''}
          </Text>
        </View>
        <Text style={styles.txAmount}>
          -{CURRENCY.format(tx.amount)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi {profile?.name?.split(' ')[0] || 'there'} 👋</Text>
          <TouchableOpacity style={styles.bellBtn}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{CURRENCY.format(balancePaise)}</Text>
          <Text style={styles.safeToSpend}>Safe to spend: {CURRENCY.format(balancePaise * 0.4)}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
               <View style={[styles.progressFill, { width: '40%' }]} />
            </View>
            <Text style={styles.progressText}>Budget 40% spent</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => router.push('/expense/add')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: COLORS.primaryBg || 'rgba(42,255,214,0.1)' }]}>
              <Text style={styles.actionIcon}>➕</Text>
            </View>
            <Text style={styles.actionLabel}>Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIconBox, { backgroundColor: COLORS.warningBg || 'rgba(255,191,0,0.1)' }]}>
              <Text style={styles.actionIcon}>🧠</Text>
            </View>
            <Text style={styles.actionLabel}>Money Mood</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(56,189,248,0.1)' }]}>
              <Text style={styles.actionIcon}>🎯</Text>
            </View>
            <Text style={styles.actionLabel}>Set Goal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/spend')}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.txList}>
          {recentTx.length === 0 ? (
            <Text style={styles.emptyText}>No recent transactions</Text>
          ) : (
            recentTx.map(renderTransaction)
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
  scrollContent: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.screenTop,
    paddingBottom: SPACING.huge,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  greeting: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h2,
    color: COLORS.textPrimary,
  },
  bellBtn: {
    padding: SPACING.sm,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.circle,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  bellIcon: {
    fontSize: 20,
  },
  balanceCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  balanceLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  balanceAmount: {
    fontFamily: FONTS.displayBold,
    fontSize: 40,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  safeToSpend: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  progressContainer: {
    marginTop: SPACING.sm,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.surfaceHover,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxxl,
  },
  actionBtn: {
    alignItems: 'center',
    width: '30%',
  },
  actionIconBox: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h3,
    color: COLORS.textPrimary,
  },
  viewAll: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.primary,
  },
  txList: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  txIconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  txIcon: {
    fontSize: 20,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  txDate: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
  },
  txAmount: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    padding: SPACING.lg,
  }
});
