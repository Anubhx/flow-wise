import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState, useMemo } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, CURRENCY, EXPENSE_CATEGORIES } from '@/constants';

type Period = 'Week' | 'Month' | 'Quarter';

// ─── Pure SVG Donut Chart (works in Expo Go — no native build required) ───────

interface DonutSlice {
  color: string;
  value: number; // percentage 0-100
}

function DonutChart({ slices, size = 220, thickness = 36 }: {
  slices: DonutSlice[];
  size?: number;
  thickness?: number;
}) {
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const paths: { d: string; color: string }[] = [];
  let startAngle = -Math.PI / 2; // 12 o'clock

  slices.forEach(slice => {
    if (slice.value <= 0) return;
    const sweep = (slice.value / 100) * 2 * Math.PI;
    const endAngle = startAngle + sweep;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = sweep > Math.PI ? 1 : 0;
    paths.push({ d: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`, color: slice.color });
    startAngle = endAngle;
  });

  return (
    <Svg width={size} height={size}>
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.surfaceHover} strokeWidth={thickness} />
      {paths.map((p, i) => (
        <Path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth={thickness} strokeLinecap="butt" />
      ))}
    </Svg>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SpendScreen() {
  const db = useSQLiteContext();
  const [period, setPeriod] = useState<Period>('Month');
  const [rawTx, setRawTx] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      async function loadData() {
        try {
          const txs = await db.getAllAsync(
            `SELECT * FROM transactions WHERE type='expense' ORDER BY transaction_date DESC`
          );
          if (isMounted) setRawTx(txs);
        } catch (e) {
          console.error(e);
        }
      }
      loadData();
      return () => { isMounted = false; };
    }, [])
  );

  const chartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    let total = 0;
    rawTx.forEach(tx => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      total += tx.amount;
    });
    const aggregated = Object.keys(categoryTotals).map(catId => {
      const details = EXPENSE_CATEGORIES.find(c => c.id === catId);
      return {
        label: details?.label ?? catId,
        color: details?.color ?? COLORS.neutral,
        id: catId,
        rawPaise: categoryTotals[catId],
        percentage: total > 0 ? (categoryTotals[catId] / total) * 100 : 0,
      };
    });
    aggregated.sort((a, b) => b.rawPaise - a.rawPaise);
    return { totalPaise: total, data: aggregated };
  }, [rawTx]);

  const donutSlices: DonutSlice[] = chartData.data.map(d => ({
    color: d.color,
    value: d.percentage,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spending</Text>
        <View style={styles.periodSelector}>
          {(['Week', 'Month', 'Quarter'] as Period[]).map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.periodTab, period === p && styles.periodTabActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stat Cards */}
        <View style={styles.statsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.statsScrollContent}
          >
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Avg. Daily</Text>
              <Text style={styles.statValue}>
                {CURRENCY.format(chartData.totalPaise / Math.max(1, rawTx.length ? 30 : 1), true)}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Biggest Spend</Text>
              <Text style={styles.statValue}>
                {CURRENCY.format(Math.max(...rawTx.map(t => t.amount), 0), true)}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Top Category</Text>
              <Text style={styles.statValue}>
                {chartData.data[0]?.label || 'None'}
              </Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Spent</Text>
          <Text style={styles.totalAmount}>{CURRENCY.format(chartData.totalPaise)}</Text>
        </View>

        {/* Donut chart */}
        <View style={styles.chartContainer}>
          {chartData.data.length > 0 ? (
            <View style={styles.chartWrapper}>
              <DonutChart slices={donutSlices} size={220} thickness={36} />
              <View style={styles.chartCenterOverlay}>
                <Text style={styles.chartCenterLabel}>Total</Text>
                <Text style={styles.chartCenterValue}>
                  {CURRENCY.format(chartData.totalPaise, true)}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartEmoji}>📊</Text>
              <Text style={styles.emptyChartText}>No expenses yet</Text>
              <Text style={styles.emptyChartSub}>Add your first expense to see analytics</Text>
            </View>
          )}
        </View>

        {/* Legend */}
        {chartData.data.length > 0 && (
          <View style={styles.legendRow}>
            {chartData.data.slice(0, 4).map(item => (
              <View key={item.id} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Breakdown list */}
        {chartData.data.length > 0 && (
          <>
            <Text style={styles.breakdownTitle}>Breakdown</Text>
            <View style={styles.breakdownList}>
              {chartData.data.map(item => {
                const pct = Math.round(item.percentage);
                return (
                  <View key={item.id} style={styles.breakdownRow}>
                    <View style={styles.bdTop}>
                      <View style={[styles.bdDot, { backgroundColor: item.color }]} />
                      <Text style={styles.bdLabel}>{item.label}</Text>
                      <Text style={styles.bdPercent}>{pct}%</Text>
                      <Text style={styles.bdAmount}>{CURRENCY.format(item.rawPaise)}</Text>
                    </View>
                    <View style={styles.bdBarTrack}>
                      <View style={[styles.bdBarFill, { width: `${pct}%`, backgroundColor: item.color }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.screenTop,
    paddingBottom: SPACING.md,
  },
  title: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  periodTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADIUS.pill,
  },
  periodTabActive: { backgroundColor: COLORS.surfaceHover },
  periodText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
  },
  periodTextActive: { color: COLORS.textPrimary },
  scrollContent: {
    paddingHorizontal: 0,
    paddingBottom: SPACING.huge,
  },
  statsContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statsScrollContent: {
    paddingHorizontal: SPACING.screenHorizontal,
    gap: SPACING.md,
  },
  statCard: {
    backgroundColor: COLORS.surfaceElevated,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
    minWidth: 140,
  },
  statLabel: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h4,
    color: COLORS.textPrimary,
  },
  totalBox: { alignItems: 'center', paddingVertical: SPACING.xl },
  totalLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalAmount: {
    fontFamily: FONTS.displayBold,
    fontSize: 42,
    color: COLORS.textPrimary,
  },
  chartContainer: { alignItems: 'center', marginBottom: SPACING.xl },
  chartWrapper: {
    position: 'relative',
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterLabel: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  chartCenterValue: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h3,
    color: COLORS.textPrimary,
  },
  emptyChart: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyChartEmoji: { fontSize: 48, marginBottom: SPACING.md },
  emptyChartText: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  emptyChartSub: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
  },
  breakdownTitle: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  breakdownList: { gap: SPACING.sm },
  breakdownRow: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  bdTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  bdDot: { width: 10, height: 10, borderRadius: 5, marginRight: SPACING.sm },
  bdLabel: {
    flex: 1,
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  },
  bdPercent: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  bdAmount: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  },
  bdBarTrack: {
    height: 4,
    backgroundColor: COLORS.surfaceHover,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },
  bdBarFill: {
    height: 4,
    borderRadius: RADIUS.pill,
  },
});
