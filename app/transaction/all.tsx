import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState, useMemo } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, CURRENCY, CATEGORIES } from '@/constants';

type FilterMode = 'all' | 'expense' | 'income';

export default function AllTransactionsScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      async function load() {
        const txs = await db.getAllAsync(
          `SELECT * FROM transactions ORDER BY transaction_date DESC`
        );
        if (isMounted) setTransactions(txs);
      }
      load();
      return () => { isMounted = false; };
    }, [])
  );

  const filtered = useMemo(() => {
    let list = transactions;
    if (filter !== 'all') list = list.filter(t => t.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.category.toLowerCase().includes(q) ||
        (t.note && t.note.toLowerCase().includes(q))
      );
    }
    return list;
  }, [transactions, filter, search]);

  // Group by month
  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    filtered.forEach(tx => {
      const d = new Date(tx.transaction_date);
      const key = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      if (!map[key]) map[key] = [];
      map[key].push(tx);
    });
    return Object.entries(map);
  }, [filtered]);

  const renderRow = (tx: any) => {
    const cat = CATEGORIES.find(c => c.id === tx.category);
    const isExpense = tx.type === 'expense';
    return (
      <TouchableOpacity
        key={tx.id}
        style={styles.txRow}
        onPress={() => router.push(`/transaction/${tx.id}`)}
      >
        <View style={[styles.txIcon, { backgroundColor: cat?.bgColor ?? COLORS.surfaceHover }]}>
          <Text style={styles.txIconText}>{cat?.icon ?? '📝'}</Text>
        </View>
        <View style={styles.txInfo}>
          <Text style={styles.txName}>{cat?.label ?? tx.category}</Text>
          <Text style={styles.txDate}>
            {new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            {tx.note ? ` · ${tx.note}` : ''}
          </Text>
        </View>
        <Text style={[styles.txAmount, { color: isExpense ? COLORS.danger : COLORS.primary }]}>
          {isExpense ? '-' : '+'}{CURRENCY.format(tx.amount)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>All Transactions</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by category or note…"
          placeholderTextColor={COLORS.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.filterRow}>
        {(['all', 'expense', 'income'] as FilterMode[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {grouped.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        ) : (
          grouped.map(([month, txs]) => (
            <View key={month}>
              <Text style={styles.monthHeader}>{month}</Text>
              <View style={styles.txList}>
                {txs.map(renderRow)}
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
  title: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h3,
    color: COLORS.textPrimary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.screenHorizontal,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
    marginBottom: SPACING.md,
  },
  searchIcon: { fontSize: 16, marginRight: SPACING.sm },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  },
  clearIcon: { fontSize: 14, color: COLORS.textSecondary, paddingLeft: SPACING.sm },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.screenHorizontal,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  filterChip: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  filterChipActive: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primaryBorder,
  },
  filterText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
  },
  filterTextActive: { color: COLORS.primary },
  scrollContent: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: SPACING.huge,
  },
  monthHeader: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  txList: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  txIconText: { fontSize: 20 },
  txInfo: { flex: 1 },
  txName: {
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
  },
  empty: { alignItems: 'center', paddingTop: SPACING.xxxl * 2 },
  emptyEmoji: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
  },
});
