import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, CURRENCY, CATEGORIES } from '@/constants';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const [tx, setTx] = useState<any>(null);

  useEffect(() => {
    async function loadTx() {
      if (!id) return;
      const result = await db.getFirstAsync(`SELECT * FROM transactions WHERE id = ?`, [parseInt(id)]);
      setTx(result);
    }
    loadTx();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await db.runAsync(`DELETE FROM transactions WHERE id = ?`, [parseInt(id)]);
            router.back();
          },
        },
      ]
    );
  };

  if (!tx) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      </View>
    );
  }

  const category = CATEGORIES.find(c => c.id === tx.category);
  const isExpense = tx.type === 'expense';
  const amountColor = isExpense ? COLORS.danger : COLORS.primary;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Transaction</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Icon + Amount hero */}
        <View style={styles.hero}>
          <View style={[styles.iconBox, { backgroundColor: (category?.bgColor ?? COLORS.surfaceElevated) }]}>
            <Text style={styles.iconText}>{category?.icon ?? '📝'}</Text>
          </View>
          <Text style={[styles.amount, { color: amountColor }]}>
            {isExpense ? '-' : '+'}{CURRENCY.format(tx.amount)}
          </Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </View>

        {/* Detail rows */}
        <View style={styles.detailCard}>
          {[
            { label: 'Category', value: category?.label ?? tx.category },
            { label: 'Date', value: new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'Time', value: new Date(tx.transaction_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
            { label: 'Type', value: tx.type === 'expense' ? 'Expense' : 'Income' },
            ...(tx.note ? [{ label: 'Note', value: tx.note }] : []),
          ].map((row, i, arr) => (
            <View key={row.label} style={[styles.detailRow, i === arr.length - 1 && styles.detailRowLast]}>
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={styles.detailValue}>{row.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action row */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>🗑 Delete</Text>
        </TouchableOpacity>
      </View>
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
  backButton: { padding: SPACING.xs, width: 40 },
  backIcon: { color: COLORS.textPrimary, fontSize: 22 },
  title: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h3,
    color: COLORS.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: SPACING.huge,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  iconText: { fontSize: 36 },
  amount: {
    fontFamily: FONTS.displayBold,
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  statusPill: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.xxs,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  statusText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.caption,
    color: COLORS.primary,
  },
  detailCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  detailRowLast: { borderBottomWidth: 0 },
  detailLabel: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
    maxWidth: '60%',
    textAlign: 'right',
  },
  footer: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: SPACING.huge,
    paddingTop: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  deleteButton: {
    backgroundColor: COLORS.dangerBg,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
  },
  deleteText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.danger,
  },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: FONTS.body, color: COLORS.textSecondary },
});
