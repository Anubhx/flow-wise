import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, STRINGS, CURRENCY } from '@/constants';
import { useEffect, useRef } from 'react';

export default function WelcomeScreen() {
  const router = useRouter();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [floatAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logoText}>FlowWise</Text>
        <Text style={styles.tagline}>{STRINGS.app.tagline}</Text>

        <Animated.View style={[styles.card, { transform: [{ translateY: floatAnim }] }]}>
          <Text style={styles.cardLabel}>Balance</Text>
          <Text style={styles.cardAmount}>{CURRENCY.format(7000000)}</Text>
          <View style={styles.cardProgressTrack}>
            <View style={styles.cardProgressFill} />
          </View>
        </Animated.View>

        <Text style={styles.title}>{STRINGS.onboarding.welcomeTitle}</Text>
        <Text style={styles.body}>{STRINGS.onboarding.welcomeBody}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/features')}
        >
          <Text style={styles.primaryButtonText}>{STRINGS.onboarding.getStarted}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.ghostButton}
          onPress={() => router.push('/(auth)/profile')}
        >
          <Text style={styles.ghostButtonText}>{STRINGS.onboarding.alreadyHaveAccount}</Text>
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
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZE.h2,
    color: COLORS.primary,
  },
  tagline: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxxl,
  },
  card: {
    backgroundColor: COLORS.surfaceElevated,
    padding: SPACING.cardPadding,
    borderRadius: RADIUS.card,
    marginBottom: SPACING.xxxl,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
    alignSelf: 'center',
    width: '85%',
  },
  cardLabel: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxs,
  },
  cardAmount: {
    fontFamily: FONTS.display,
    fontSize: FONT_SIZE.h1,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  cardProgressTrack: {
    height: 6,
    backgroundColor: COLORS.surfaceHover,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },
  cardProgressFill: {
    width: '65%',
    height: '100%',
    backgroundColor: COLORS.primary,
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
    marginBottom: SPACING.sm,
  },
  primaryButtonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.background,
  },
  ghostButton: {
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  ghostButtonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  }
});
