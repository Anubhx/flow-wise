import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, STRINGS, CURRENCY } from '@/constants';

export default function FeaturesScreen() {
  const router = useRouter();

  const renderGoalCard = (icon: string, name: string, progress: number, amount: number, color: string) => (
    <View style={styles.goalCard}>
      <View style={styles.goalCardHeader}>
        <View style={[styles.iconBox, { backgroundColor: color + '22' }]}>
          <Text style={styles.goalIcon}>{icon}</Text>
        </View>
        <View style={styles.goalInfo}>
          <Text style={styles.goalName}>{name}</Text>
          <Text style={styles.goalAmount}>of {CURRENCY.format(amount, true)}</Text>
        </View>
        <Text style={[styles.goalPercent, { color }]}>{progress}%</Text>
      </View>
      <View style={styles.cardProgressTrack}>
        <View style={[styles.cardProgressFill, { width: `${progress}%`, backgroundColor: color }]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerIconBox}>
          <Text style={styles.headerIcon}>🎯</Text>
        </View>
        
        <Text style={styles.title}>{STRINGS.onboarding.featuresTitle}</Text>
        <Text style={styles.body}>{STRINGS.onboarding.featuresBody}</Text>

        <View style={styles.previewContainer}>
          {renderGoalCard('🏖️', 'Goa trip', 53, 5000000, COLORS.primary)}
          {renderGoalCard('💻', 'MacBook Pro', 17, 12000000, COLORS.warning)}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/profile')}
        >
          <Text style={styles.primaryButtonText}>Next</Text>
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
    paddingTop: SPACING.screenTop + SPACING.xl,
  },
  headerIconBox: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primaryBg || 'rgba(42,255,214,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder || 'rgba(42,255,214,0.22)',
  },
  headerIcon: {
    fontSize: 28,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: FONT_SIZE.h1,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    lineHeight: 34,
  },
  body: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.xxl,
  },
  previewContainer: {
    gap: SPACING.md,
  },
  goalCard: {
    backgroundColor: COLORS.surfaceElevated,
    padding: SPACING.md,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  goalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  goalIcon: {
    fontSize: 20,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  },
  goalAmount: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
  },
  goalPercent: {
    fontFamily: FONTS.display,
    fontSize: FONT_SIZE.h3,
  },
  cardProgressTrack: {
    height: 6,
    backgroundColor: COLORS.surfaceHover,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },
  cardProgressFill: {
    height: '100%',
    borderRadius: RADIUS.pill,
  },
  footer: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: SPACING.huge,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    gap: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.surfaceHover,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.background,
  }
});
