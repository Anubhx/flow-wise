import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from '@/constants';

const GOAL_COLORS = [
  COLORS.primary,
  COLORS.warning,
  '#F472B6', // pink
  '#A78BFA', // purple
  '#60A5FA', // blue
];

export default function AddGoalScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  
  const [name, setName] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [selectedColor, setSelectedColor] = useState(GOAL_COLORS[0]);

  const handleSave = async () => {
    const targetAmountRupees = parseFloat(amountStr) || 0;
    const targetPaise = Math.round(targetAmountRupees * 100);

    if (!name.trim() || targetPaise <= 0) return;

    try {
      await db.runAsync(
        `INSERT INTO goals (name, target_amount, icon, color) VALUES (?, ?, ?, ?)`,
        [name.trim(), targetPaise, icon, selectedColor]
      );
      router.back();
    } catch (e) {
      console.error('Failed to add goal', e);
    }
  };

  const isValid = name.trim().length > 0 && parseFloat(amountStr) > 0;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New Goal</Text>
        <View style={{width: 32}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.card}>
          <Text style={styles.label}>Goal Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Goa Trip"
            placeholderTextColor={COLORS.textTertiary}
            value={name}
            onChangeText={setName}
            maxLength={30}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Target Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencyPrefix}>₹</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={COLORS.textTertiary}
              value={amountStr}
              onChangeText={setAmountStr}
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Icon Emoji</Text>
          <TextInput
            style={styles.input}
            value={icon}
            onChangeText={text => setIcon(text.slice(-2))} // limit to emoji length approximately
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Theme Color</Text>
          <View style={styles.colorRow}>
            {GOAL_COLORS.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.colorBubble, { backgroundColor: c }, selectedColor === c && styles.colorBubbleActive]}
                onPress={() => setSelectedColor(c)}
              >
                {selectedColor === c && <Text style={styles.colorCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isValid}
        >
          <Text style={styles.saveButtonText}>Create Goal</Text>
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
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.huge,
  },
  card: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  currencyPrefix: {
    fontFamily: FONTS.displayMedium,
    fontSize: 24,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  amountInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontFamily: FONTS.displayMedium,
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  colorRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  colorBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorBubbleActive: {
    borderColor: COLORS.textPrimary,
  },
  colorCheck: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footer: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: SPACING.huge,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
