import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from '@/constants';

export default function FeaturesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Airplane icon box */}
        <View style={styles.iconBox}>
          <Text style={styles.iconEmoji}>✈️</Text>
        </View>

        {/* Headline */}
        <Text style={styles.title}>
          {'Smart goals\nthat '}
          <Text style={styles.titleAccent}>adapt.</Text>
        </Text>
        <Text style={styles.body}>
          Set a goal — Goa trip, new laptop, emergency fund. FlowWise watches your spending and tells you if you're on track in real time.
        </Text>

        {/* Goal cards */}
        <View style={styles.previewContainer}>
          {/* Goa Trip - active/selected style */}
          <View style={styles.goalCardActive}>
            <View style={styles.goalCardRow}>
              <View style={styles.goalIconBoxActive}>
                <Text style={styles.goalIconEmoji}>🏖️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.goalNameActive}>Goa Trip</Text>
              </View>
              <View style={styles.onTrackBadge}>
                <Text style={styles.onTrackText}>On track</Text>
              </View>
            </View>
            <Text style={styles.goalAmountActive}>₹ 8,000</Text>
            <View style={styles.goalProgressRow}>
              <View style={styles.progressTrackActive}>
                <View style={[styles.progressFill, { width: '53%', backgroundColor: COLORS.primary }]} />
              </View>
              <Text style={styles.goalOfText}>of ₹ 15,000</Text>
            </View>
          </View>

          {/* MacBook Pro */}
          <View style={styles.goalCard}>
            <View style={styles.goalCardRow}>
              <View style={styles.goalIconBox}>
                <Text style={styles.goalIconEmoji}>💻</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.goalName}>MacBook Pro</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: '17%', backgroundColor: '#5E8BFF' }]} />
                </View>
              </View>
              <Text style={styles.goalPercent}>17%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/sign-up')}
          activeOpacity={0.85}
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
    backgroundColor: '#0D0F14',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.screenTop + 16,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#1B2E3C',
    borderWidth: 1.5,
    borderColor: 'rgba(42,255,214,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 26,
  },
  iconEmoji: {
    fontSize: 36,
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: 36,
    color: COLORS.textPrimary,
    lineHeight: 44,
    marginBottom: 14,
  },
  titleAccent: {
    color: COLORS.primary,
  },
  body: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: '#9AA0B2',
    lineHeight: 24,
    marginBottom: 32,
  },
  previewContainer: {
    gap: 14,
  },
  // ACTIVE goal card (Goa Trip)
  goalCardActive: {
    backgroundColor: '#1C2530',
    borderRadius: RADIUS.card,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(42,255,214,0.18)',
  },
  goalCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  goalIconBoxActive: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F5F5F522',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalNameActive: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  },
  onTrackBadge: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  onTrackText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.primary,
  },
  goalAmountActive: {
    fontFamily: FONTS.displayBold,
    fontSize: 28,
    color: COLORS.primary,
    marginBottom: 10,
  },
  goalProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrackActive: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 100,
  },
  goalOfText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: '#9AA0B2',
  },
  // Regular goal card (MacBook Pro)
  goalCard: {
    backgroundColor: '#181B26',
    borderRadius: RADIUS.card,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2A2F40',
  },
  goalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#252A3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalIconEmoji: {
    fontSize: 22,
  },
  goalName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  progressTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 100,
    overflow: 'hidden',
  },
  goalPercent: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: '#5E8BFF',
  },
  footer: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: 40,
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
});
