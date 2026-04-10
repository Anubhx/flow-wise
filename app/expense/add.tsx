import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, EXPENSE_CATEGORIES, CURRENCY, STRINGS } from '@/constants';

export default function AddExpenseScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const MAX_PAISE = 100000000; // 10,00,000 rupees in paise

  const handlePressNumpad = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (key === 'backspace') {
      setAmountStr(s => s.slice(0, -1));
    } else if (key === '.') {
      if (!amountStr.includes('.')) {
        setAmountStr(s => s + (s.length === 0 ? '0.' : '.'));
      }
    } else {
      // If adding this digit exceeds the limit, block it
      const newStr = amountStr + key;
      const numRupees = parseFloat(newStr);
      if (numRupees * 100 > MAX_PAISE) return;
      
      // Limit to 2 decimal places
      if (amountStr.includes('.')) {
        const decimalPart = amountStr.split('.')[1];
        if (decimalPart && decimalPart.length >= 2) return;
      }
      
      setAmountStr(newStr);
    }
  };

  const handleSave = async () => {
    const amountRupees = parseFloat(amountStr) || 0;
    const amountPaise = Math.round(amountRupees * 100);

    if (amountPaise <= 0 || !category) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // V1.1 Budget Logic Mock: Check if category spend > 80%
    const categoryLimit = 500000; // Mock ₹5,000 limit for all categories
    try {
      const result = await db.getFirstAsync<{total: number}>(
        `SELECT SUM(amount) as total FROM transactions WHERE category = ? AND type = 'expense'`,
        [category]
      );
      const currentSpend = result?.total || 0;

      if (currentSpend + amountPaise > categoryLimit * 0.8) {
        Alert.alert(
          "⚠️ Budget Warning",
          "You have reached over 80% of your budget for this category. Do you still want to proceed?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Yes, Save", onPress: () => performSave(amountPaise) }
          ]
        );
      } else {
        await performSave(amountPaise);
      }
    } catch (e) {
      console.error('Failed to check budget', e);
      await performSave(amountPaise);
    }
  };

  const performSave = async (amountPaise: number) => {
    try {
      await db.runAsync(
        `INSERT INTO transactions (amount, category, note, transaction_date, type) VALUES (?, ?, ?, ?, ?)`,
        [amountPaise, category, note, new Date().toISOString(), 'expense']
      );
      router.replace('/expense/success');
    } catch (e) {
      console.error('Failed to add transaction', e);
    }
  };

  const isValid = parseFloat(amountStr) > 0 && category !== null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{STRINGS.expense.addTitle}</Text>
        <View style={{width: 32}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.amountDisplay}>
          <Text style={styles.currencyPrefix}>₹</Text>
          <Text style={[styles.amountText, !amountStr && styles.amountTextPlaceholder]}>
            {amountStr || '0'}
          </Text>
          <View style={styles.blinkingCursor} />
        </View>

        <Text style={styles.dateTimeSubtext}>Today · {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {EXPENSE_CATEGORIES.map(c => {
            const isSelected = category === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.categoryChip,
                  isSelected && { backgroundColor: c.color, borderColor: c.color }
                ]}
                onPress={() => setCategory(c.id)}
              >
                <Text style={styles.categoryIcon}>{c.icon}</Text>
                <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.noteContainer}>
          <TextInput
            style={styles.noteInput}
            placeholder={STRINGS.expense.noteOptional}
            placeholderTextColor={COLORS.textTertiary}
            value={note}
            onChangeText={setNote}
            maxLength={100}
          />
        </View>

      </ScrollView>

      <View style={styles.keyboardArea}>
        <View style={styles.numpad}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['.', '0', 'backspace']
          ].map((row, rIdx) => (
            <View key={rIdx} style={styles.numRow}>
              {row.map(key => (
                <TouchableOpacity key={key} style={styles.numKey} onPress={() => handlePressNumpad(key)}>
                  {key === 'backspace' ? (
                    <Text style={styles.numText}>⌫</Text>
                  ) : (
                    <Text style={styles.numText}>{key}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isValid}
        >
          <Text style={styles.saveButtonText}>{STRINGS.expense.addButton}</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.screenTop,
    paddingBottom: SPACING.md,
  },
  backButton: { padding: SPACING.xs },
  backIcon: { color: COLORS.textPrimary, fontSize: 24 },
  title: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h3,
    color: COLORS.textPrimary,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  amountDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xxxl,
    paddingHorizontal: SPACING.screenHorizontal,
  },
  currencyPrefix: {
    fontFamily: FONTS.displayBold,
    fontSize: 48,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
  amountText: {
    fontFamily: FONTS.displayBold,
    fontSize: 56,
    color: COLORS.textPrimary,
  },
  amountTextPlaceholder: {
    color: COLORS.textTertiary,
  },
  blinkingCursor: {
    width: 3,
    height: 48,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  dateTimeSubtext: {
    textAlign: 'center',
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xxxl,
  },
  categoryScroll: {
    paddingHorizontal: SPACING.screenHorizontal,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  categoryIcon: {
    marginRight: SPACING.xs,
    fontSize: 16,
  },
  categoryLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
  },
  categoryLabelSelected: {
    color: COLORS.background,
  },
  noteContainer: {
    paddingHorizontal: SPACING.screenHorizontal,
    marginBottom: SPACING.md,
  },
  noteInput: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  keyboardArea: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: SPACING.huge,
    paddingTop: SPACING.lg,
  },
  numpad: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  numRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  numKey: {
    width: '30%',
    aspectRatio: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  numText: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h2,
    color: COLORS.textPrimary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.surfaceHover,
  },
  saveButtonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.background,
  }
});
