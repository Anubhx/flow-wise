import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, CURRENCY, CATEGORIES } from '@/constants';

export default function BudgetEditScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [budgets, setBudgets] = useState<{ category: string; monthly_limit: number; edited: string }[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      async function load() {
        const rows = await db.getAllAsync<{ category: string; monthly_limit: number }>(
          `SELECT category, monthly_limit FROM budget_categories`
        );
        if (isMounted) {
          setBudgets(rows.map(r => ({
            ...r,
            edited: (r.monthly_limit / 100).toString(),
          })));
        }
      }
      load();
      return () => { isMounted = false; };
    }, [])
  );

  const handleChange = (category: string, value: string) => {
    setBudgets(prev => prev.map(b => b.category === category ? { ...b, edited: value } : b));
  };

  const handleSave = async () => {
    try {
      for (const b of budgets) {
        const rupees = parseFloat(b.edited) || 0;
        const paise = Math.round(rupees * 100);
        await db.runAsync(
          `UPDATE budget_categories SET monthly_limit = ? WHERE category = ?`,
          [paise, b.category]
        );
      }
      Alert.alert('Saved', 'Budget limits updated successfully.');
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Could not save budget. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Budget</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Update your monthly category limits below.</Text>

        {budgets.map(b => {
          const cat = CATEGORIES.find(c => c.id === b.category);
          return (
            <View key={b.category} style={styles.budgetRow}>
              <View style={[styles.catIcon, { backgroundColor: cat?.bgColor ?? COLORS.surfaceHover }]}>
                <Text style={styles.catIconText}>{cat?.icon ?? '📦'}</Text>
              </View>
              <View style={styles.catInfo}>
                <Text style={styles.catName}>{cat?.label ?? b.category}</Text>
                <Text style={styles.catCurrent}>Current: {CURRENCY.format(b.monthly_limit)}/mo</Text>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.rupeePrefix}>₹</Text>
                <TextInput
                  style={styles.input}
                  value={b.edited}
                  onChangeText={v => handleChange(b.category, v)}
                  keyboardType="number-pad"
                  maxLength={7}
                />
              </View>
            </View>
          );
        })}

        {budgets.length === 0 && (
          <Text style={styles.emptyText}>No budget categories found. Complete onboarding first.</Text>
        )}
      </ScrollView>

      {budgets.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Budget</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingTop: SPACING.md,
    paddingBottom: SPACING.huge,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  catIconText: { fontSize: 22 },
  catInfo: { flex: 1 },
  catName: { fontFamily: FONTS.bodyMedium, fontSize: FONT_SIZE.body, color: COLORS.textPrimary, marginBottom: 2 },
  catCurrent: { fontFamily: FONTS.body, fontSize: FONT_SIZE.caption, color: COLORS.textSecondary },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
    minWidth: 90,
  },
  rupeePrefix: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    marginRight: 2,
  },
  input: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
    minWidth: 60,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingTop: SPACING.xxxl,
  },
  footer: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: SPACING.huge,
    paddingTop: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.background,
  },
});
