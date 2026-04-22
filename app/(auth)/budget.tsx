import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from '@/constants';

const BUDGET_CATEGORIES = [
  {
    id: 'housing',
    label: 'Housing',
    icon: '🏠',
    bgColor: '#2E1F06',
    barColor: '#F5A623',
    pct: 0.15,
    pctLabel: '15%',
  },
  {
    id: 'food',
    label: 'Food & Dining',
    icon: '🍴',
    bgColor: '#0A1E3A',
    barColor: '#5E8BFF',
    pct: 0.075,
    pctLabel: '7.5%',
  },
  {
    id: 'transport',
    label: 'Transport',
    icon: '🧳',
    bgColor: '#0D2420',
    barColor: COLORS.primary,
    pct: 0.05,
    pctLabel: '5%',
  },
  {
    id: 'leisure',
    label: 'Leisure',
    icon: '🛍️',
    bgColor: '#2A0D10',
    barColor: '#FF5C6A',
    pct: 0.05,
    pctLabel: '5%',
  },
];

export default function BudgetScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [incomeInput, setIncomeInput] = useState('40000');

  const income = parseInt(incomeInput.replace(/\D/g, '')) || 0;

  const budgets = income > 0
    ? BUDGET_CATEGORIES.map(c => ({
        ...c,
        amount: Math.round(income * c.pct),
      }))
    : [];

  const handleSave = async () => {
    if (budgets.length > 0) {
      try {
        await db.withTransactionAsync(async () => {
          for (const b of budgets) {
            await db.runAsync(
              'INSERT OR REPLACE INTO budget_categories (category, monthly_limit) VALUES (?, ?)',
              [b.id, b.amount * 100]
            );
          }
        });
      } catch (e) {
        console.error('Failed to save budget', e);
      }
    }
    router.push('/(auth)/done');
  };

  const formatINR = (n: number) =>
    `₹${n.toLocaleString('en-IN')}`;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.stepLabel}>Step 3 of 3</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/done')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.skipRight}>I'll set this later</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>Set your budget</Text>
        <Text style={styles.subtitle}>
          Tell us your income and we'll suggest smart category limits.
        </Text>

        {/* Monthly income label */}
        <Text style={styles.sectionLabel}>MONTHLY TAKE-HOME</Text>

        {/* Income input box */}
        <View style={styles.incomeBox}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.incomeInput}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor="#4A5068"
            value={incomeInput}
            onChangeText={setIncomeInput}
            maxLength={8}
          />
          <Text style={styles.editLabel}>Edit{'\n'}amount</Text>
        </View>

        {/* Suggested limits */}
        {budgets.length > 0 && (
          <>
            <View style={styles.suggestionsHeader}>
              <Text style={styles.sectionLabel}>SUGGESTED LIMITS</Text>
              <Text style={styles.editIcon}>✏️</Text>
            </View>

            <View style={styles.categoriesList}>
              {budgets.map(b => (
                <View key={b.id} style={styles.catRow}>
                  <View style={[styles.catIconBox, { backgroundColor: b.bgColor }]}>
                    <Text style={styles.catIcon}>{b.icon}</Text>
                  </View>
                  <View style={styles.catInfo}>
                    <Text style={styles.catName}>{b.label}</Text>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${b.pct * 100 * 2}%`, backgroundColor: b.barColor }
                        ]}
                      />
                    </View>
                    <Text style={styles.catPct}>{b.pctLabel}</Text>
                  </View>
                  <Text style={[styles.catAmount, { color: b.barColor }]}>
                    {formatINR(b.amount)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, budgets.length === 0 && styles.continueButtonDisabled]}
          onPress={handleSave}
          disabled={budgets.length === 0}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Looks good, let's go</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0F14',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.screenTop,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1C1F2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.textPrimary,
    lineHeight: 32,
    marginTop: -2,
  },
  stepLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: '#9AA0B2',
  },
  skipRight: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: '#9AA0B2',
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: 30,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: '#9AA0B2',
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 10,
  },
  incomeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181B26',
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 26,
  },
  currencySymbol: {
    fontFamily: FONTS.displayBold,
    fontSize: 32,
    color: COLORS.primary,
    marginRight: 6,
  },
  incomeInput: {
    flex: 1,
    fontFamily: FONTS.displayBold,
    fontSize: 32,
    color: COLORS.textPrimary,
  },
  editLabel: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: '#9AA0B2',
    textAlign: 'right',
    lineHeight: 16,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  editIcon: {
    fontSize: 16,
  },
  categoriesList: {
    gap: 10,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181B26',
    borderRadius: RADIUS.card,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#232736',
  },
  catIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catIcon: {
    fontSize: 22,
  },
  catInfo: {
    flex: 1,
  },
  catName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 100,
  },
  catPct: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: '#9AA0B2',
  },
  catAmount: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
  },
  footer: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: 40,
    paddingTop: 12,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 100,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#1E2330',
  },
  continueButtonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 17,
    color: '#0D0F14',
    letterSpacing: 0.2,
  },
});
