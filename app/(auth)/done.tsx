import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, STRINGS } from '@/constants';

export default function DoneScreen() {
  const router = useRouter();
  const { profile, setOnboardingComplete } = useAuthStore();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handleDone = () => {
    setOnboardingComplete();
    router.replace('/(tabs)');
  };

  const renderSummaryRow = (label: string, done: boolean, info?: string) => (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryBullet, done && styles.summaryBulletDone]}>
        {done ? '✓' : '○'}
      </Text>
      <Text style={styles.summaryLabel}>{label}</Text>
      {info && <Text style={styles.summaryInfo}>{info}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.iconText}>✓</Text>
        </Animated.View>

        <Text style={styles.title}>You're all set,{"\n"}{profile?.name?.split(' ')[0] || 'friend'}! 🎉</Text>
        <Text style={styles.subtitle}>{STRINGS.onboarding.doneSubtitle}</Text>

        <View style={styles.summaryCard}>
          {renderSummaryRow('Profile created', true)}
          {renderSummaryRow('Bank linked', true)}
          {renderSummaryRow('Budget set', true)}
          {renderSummaryRow('Goals linked', false, '(Add later)')}
        </View>

        <View style={styles.featuresBox}>
           <Text style={styles.featurePill}>✨ Smart alerts</Text>
           <Text style={styles.featurePill}>🧠 Weekly Money Mood</Text>
           <Text style={styles.featurePill}>🔄 Auto-sync</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleDone}>
          <Text style={styles.buttonText}>{STRINGS.onboarding.takeToDashboard}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.screenTop + SPACING.xxxl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryBg || 'rgba(42,255,214,0.10)',
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  iconText: {
    fontSize: 40,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZE.h1,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.lg,
  },
  summaryCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    width: '100%',
    marginBottom: SPACING.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  summaryBullet: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textTertiary,
    marginRight: SPACING.sm,
  },
  summaryBulletDone: {
    color: COLORS.primary,
  },
  summaryLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  },
  summaryInfo: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  featuresBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'center',
  },
  featurePill: {
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.pill,
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
  },
  footer: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: SPACING.huge,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.background,
  }
});
