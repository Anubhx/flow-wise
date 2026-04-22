import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from '@/constants';
import { useEffect, useRef } from 'react';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -12, duration: 2200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    ).start();
  }, [floatAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* FlowWise pill badge */}
        <View style={styles.badgePill}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Flow Wise</Text>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          {'Money that\nworks for'}
          <Text style={styles.headlineAccent}>{' you.'}</Text>
        </Text>
        <Text style={styles.subheadline}>
          Stop dreading your bank app. FlowWise makes personal finance feel like a conversation, not a spreadsheet.
        </Text>

        {/* Concentric circles + balance card */}
        <View style={styles.circlesContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Animated.View style={[styles.card, { transform: [{ translateY: floatAnim }] }]}>
                <Text style={styles.cardLabel}>Balance · April</Text>
                <Text style={styles.cardAmount}>₹ 70,000</Text>
                <View style={styles.progressTrack}>
                  <View style={styles.progressFill} />
                </View>
                <Text style={styles.progressLabel}>62% budget used · On track</Text>
              </Animated.View>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/features')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ghostButton}
          onPress={() => router.push('/(auth)/sign-in')}
          activeOpacity={0.7}
        >
          <Text style={styles.ghostButtonText}>I have an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0F14',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.screenTop + 16,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(42,255,214,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(42,255,214,0.28)',
    borderRadius: 100,
    paddingVertical: 7,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  badgeText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.primary,
  },
  headline: {
    fontFamily: FONTS.displayBold,
    fontSize: 38,
    color: COLORS.textPrimary,
    lineHeight: 46,
    marginBottom: 14,
  },
  headlineAccent: {
    color: COLORS.primary,
  },
  subheadline: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: '#9AA0B2',
    lineHeight: 24,
    marginBottom: 32,
  },
  circlesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  outerCircle: {
    width: width * 0.82,
    height: width * 0.82,
    borderRadius: width * 0.41,
    borderWidth: 1.5,
    borderColor: 'rgba(42,255,214,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: width * 0.62,
    height: width * 0.62,
    borderRadius: width * 0.31,
    borderWidth: 1.5,
    borderColor: 'rgba(180,140,60,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1C1F2A',
    borderRadius: RADIUS.card,
    padding: 20,
    width: width * 0.52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  cardLabel: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: '#9AA0B2',
    marginBottom: 4,
  },
  cardAmount: {
    fontFamily: FONTS.displayBold,
    fontSize: 26,
    color: COLORS.primary,
    marginBottom: 12,
  },
  progressTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    width: '62%',
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 100,
  },
  progressLabel: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: '#9AA0B2',
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: 40,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 100,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 17,
    color: '#0D0F14',
    letterSpacing: 0.2,
  },
  ghostButton: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E3347',
  },
  ghostButtonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 16,
    color: '#B0B6CC',
  },
});
