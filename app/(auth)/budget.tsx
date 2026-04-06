import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, CURRENCY, CATEGORIES } from '@/constants';

export default function BudgetScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [incomeInput, setIncomeInput] = useState('');
  
  // Category amounts in paise
  const [budgets, setBudgets] = useState<{ id: string; amount: number }[]>([]);

  useEffect(() => {
    // Auto-calculate on income change
    const incomePaise = (parseInt(incomeInput) || 0) * 100;
    
    if (incomePaise > 0) {
      setBudgets([
        { id: 'housing', amount: Math.round(incomePaise * 0.3) },
        { id: 'food', amount: Math.round(incomePaise * 0.15) },
        { id: 'transport', amount: Math.round(incomePaise * 0.1) },
        { id: 'leisure', amount: Math.round(incomePaise * 0.1) },
      ]);
    } else {
      setBudgets([]);
    }
  }, [incomeInput]);

  const allocated = budgets.reduce((sum, b) => sum + b.amount, 0);
  const incomePaise = (parseInt(incomeInput) || 0) * 100;
  const unallocated = incomePaise - allocated;

  const handleSave = async () => {
    if (budgets.length > 0) {
      try {
        await db.withTransactionAsync(async () => {
          for (const b of budgets) {
            await db.runAsync(
              'INSERT OR REPLACE INTO budget_categories (category, monthly_limit) VALUES (?, ?)',
              [b.id, b.amount]
            );
          }
          if (unallocated > 0) {
            await db.runAsync(
              'INSERT OR REPLACE INTO budget_categories (category, monthly_limit) VALUES (?, ?)',
              ['savings', unallocated]
            );
          }
        });
      } catch (e) {
        console.error('Failed to save budget', e);
      }
    }
    router.push('/(auth)/done');
  };

  const getCatDetails = (id: string) => CATEGORIES.find(c => c.id === id);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.stepLabel}>Step 3 of 3</Text>
        </View>

        <Text style={styles.title}>Set your budget</Text>
        <Text style={styles.subtitle}>Tell us your income and we'll suggest smart category limits.</Text>

        <View style={styles.incomeBox}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.incomeInput}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={COLORS.textTertiary}
            value={incomeInput}
            onChangeText={setIncomeInput}
            maxLength={8}
          />
        </View>

        {budgets.length > 0 && (
          <View style={styles.suggestionsBox}>
            <Text style={styles.suggestionsTitle}>Suggested limits</Text>
            
            {budgets.map((b) => {
              const details = getCatDetails(b.id);
              if (!details) return null;
              
              return (
                <View key={b.id} style={styles.catRow}>
                  <View style={[styles.iconBox, { backgroundColor: details.bgColor }]}>
                    <Text style={styles.catIcon}>{details.icon}</Text>
                  </View>
                  <Text style={styles.catName}>{details.label}</Text>
                  <Text style={styles.catAmount}>{CURRENCY.format(b.amount, true)}</Text>
                </View>
              );
            })}
            
            {unallocated > 0 && (
              <View style={styles.unallocatedBox}>
                <Text style={styles.unallocatedText}>
                  {CURRENCY.format(unallocated)} unallocated — goes to savings automatically
                </Text>
              </View>
            )}
          </View>
        )}

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => router.push('/(auth)/done')}
        >
          <Text style={styles.skipText}>I'll set this later</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.continueButton, budgets.length === 0 && styles.continueButtonDisabled]}
          onPress={handleSave}
          disabled={budgets.length === 0}
        >
          <Text style={styles.continueButtonText}>Looks good, let's go →</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.screenTop,
    paddingBottom: SPACING.huge,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backButton: {
    padding: SPACING.xs,
  },
  backIcon: {
    color: COLORS.textPrimary,
    fontSize: 24,
  },
  stepLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: FONT_SIZE.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
  },
  incomeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  currencySymbol: {
    fontFamily: FONTS.displayBold,
    fontSize: 36,
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  incomeInput: {
    flex: 1,
    fontFamily: FONTS.displayBold,
    fontSize: 36,
    color: COLORS.textPrimary,
  },
  suggestionsBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
  },
  suggestionsTitle: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  catIcon: {
    fontSize: 18,
  },
  catName: {
    flex: 1,
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  },
  catAmount: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  },
  unallocatedBox: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  unallocatedText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.caption,
    color: COLORS.primary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: SPACING.huge,
  },
  skipButton: {
    alignItems: 'center',
    marginBottom: SPACING.md,
    padding: SPACING.sm,
  },
  skipText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.surfaceHover,
  },
  continueButtonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.background,
  }
});
