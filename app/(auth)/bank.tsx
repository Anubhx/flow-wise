import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, ONBOARDING } from '@/constants';

export default function BankScreen() {
  const router = useRouter();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const handleContinue = () => {
    // In V1 we don't save bank preference anywhere persistent except simple navigations.
    router.push('/(auth)/budget');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.stepLabel}>Step 2 of 3</Text>
        </View>

        <Text style={styles.title}>Link your bank</Text>
        <Text style={styles.subtitle}>Auto-sync transactions · 256-bit secure</Text>

        <View style={styles.bankGrid}>
          {ONBOARDING.banks.map(b => (
            <TouchableOpacity
              key={b.id}
              style={[
                styles.bankCard,
                selectedBank === b.id && styles.bankCardActive
              ]}
              onPress={() => setSelectedBank(b.id)}
            >
              <Text style={styles.bankEmoji}>{b.emoji}</Text>
              <Text style={[
                styles.bankName,
                selectedBank === b.id && styles.bankNameActive
              ]}>
                {b.name}
              </Text>
              {selectedBank === b.id && (
                <View style={styles.checkIcon}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => router.push('/(auth)/budget')}
        >
          <Text style={styles.skipText}>Or enter manually — skip for now</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.continueButton, !selectedBank && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedBank}
        >
          <Text style={styles.continueButtonText}>
            {selectedBank ? `Connect ${ONBOARDING.banks.find(b => b.id === selectedBank)?.name} →` : 'Select a bank'}
          </Text>
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
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  bankCard: {
    width: '47%',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    aspectRatio: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  bankCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryBg || 'rgba(42,255,214,0.10)',
  },
  bankEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  bankName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  },
  bankNameActive: {
    color: COLORS.primary,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: 'bold',
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
