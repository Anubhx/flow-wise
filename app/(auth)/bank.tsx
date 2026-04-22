import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from '@/constants';

const BANKS = [
  { id: 'sbi', name: 'SBI', subtitle: 'State bank of India', color: '#1A3F7A', dot: '#2979FF' },
  { id: 'hdfc', name: 'HDFC', subtitle: 'HDFC bank', color: '#1A2B5E', dot: '#4D8BF5' },
  { id: 'icic', name: 'ICIC', subtitle: 'ICIC bank', color: '#3B2A0E', dot: '#F5A623' },
  { id: 'axis', name: 'AXIS', subtitle: 'Axis bank', color: '#381520', dot: '#FF5C6A' },
];

export default function BankScreen() {
  const router = useRouter();
  const [selectedBank, setSelectedBank] = useState<string>('sbi');

  const selected = BANKS.find(b => b.id === selectedBank);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.stepLabel}>Step 2 of 3</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/budget')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.skipRight}>Skip for now</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>Link your bank</Text>
        <Text style={styles.subtitle}>Auto-sync transactions · 256-bit secure</Text>

        {/* Bank list */}
        <View style={styles.bankList}>
          {BANKS.map(b => {
            const isSelected = selectedBank === b.id;
            return (
              <TouchableOpacity
                key={b.id}
                style={[styles.bankCard, isSelected && styles.bankCardActive]}
                onPress={() => setSelectedBank(b.id)}
                activeOpacity={0.75}
              >
                {/* Icon */}
                <View style={[styles.bankIconBox, { backgroundColor: b.color }]}>
                  <View style={[styles.bankDot, { backgroundColor: b.dot }]} />
                </View>

                {/* Info */}
                <View style={styles.bankInfo}>
                  <Text style={styles.bankName}>{b.name}</Text>
                  <Text style={styles.bankSubtitle}>{b.subtitle}</Text>
                </View>

                {/* Radio */}
                <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Manual link */}
        <View style={styles.manualRow}>
          <Text style={styles.manualText}>Or </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/budget')}>
            <Text style={styles.manualLink}>enter manually</Text>
          </TouchableOpacity>
          <Text style={styles.manualText}> — skip for now</Text>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedBank && styles.continueButtonDisabled]}
          onPress={() => router.push('/(auth)/budget')}
          disabled={!selectedBank}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>
            {selected ? `Connect ${selected.name} →` : 'Select a bank'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 32,
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
    marginBottom: 28,
  },
  bankList: {
    gap: 12,
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181B26',
    borderRadius: RADIUS.card,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#2A2F40',
    gap: 14,
  },
  bankCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(42,255,214,0.06)',
  },
  bankIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  bankSubtitle: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: '#9AA0B2',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(42,255,214,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0D0F14',
  },
  manualRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  manualText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: '#9AA0B2',
  },
  manualLink: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.primary,
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
