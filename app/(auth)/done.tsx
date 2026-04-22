import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from '@/constants';

const { width } = Dimensions.get('window');

const STEPS = ['Profile', 'Bank', 'Budget', 'Done!'];

const FEATURES = [
  {
    key: 'alerts',
    bold: 'Smart alerts',
    rest: ' when you overspend',
  },
  {
    key: 'mood',
    bold: 'Weekly Money',
    rest: '\nMood score',
  },
  {
    key: 'sync',
    bold: 'Auto-sync',
    rest: ' from SBI\nevery day',
  },
];

export default function DoneScreen() {
  const router = useRouter();
  const { profile, setOnboardingComplete } = useAuthStore();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const firstName = profile?.name?.split(' ')[0] || 'friend';

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 55,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  const handleDone = () => {
    setOnboardingComplete();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Progress tab bar */}
      <View style={styles.tabBar}>
        {STEPS.map((step, i) => {
          const isActive = i === STEPS.length - 1;
          return (
            <View key={step} style={styles.tabItem}>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {step}
              </Text>
              <View style={[styles.tabUnderline, isActive && styles.tabUnderlineActive]} />
            </View>
          );
        })}
      </View>

      <View style={styles.content}>
        {/* Concentric rings + check */}
        <Animated.View style={[styles.outerRing, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.innerRing}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>
            {"You're all set,\n"}
            <Text style={styles.titleName}>{firstName}!</Text>
            <Text style={styles.titleEmoji}> 🎉</Text>
          </Text>
          <Text style={styles.subtitle}>
            FlowWise is ready to help you{'\n'}take control of your money.
          </Text>

          {/* Feature rows */}
          <View style={styles.featureList}>
            {FEATURES.map(f => (
              <View key={f.key} style={styles.featureRow}>
                <View style={styles.featureCheckCircle}>
                  <Text style={styles.featureCheck}>✓</Text>
                </View>
                <Text style={styles.featureText}>
                  <Text style={styles.featureBold}>{f.bold}</Text>
                  <Text style={styles.featureRest}>{f.rest}</Text>
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleDone} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Take me to dashboard →</Text>
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
  tabBar: {
    flexDirection: 'row',
    paddingTop: SPACING.screenTop,
    paddingHorizontal: SPACING.screenHorizontal,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2230',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
  },
  tabLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: '#9AA0B2',
    marginBottom: 10,
  },
  tabLabelActive: {
    color: COLORS.primary,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'transparent',
    borderRadius: 100,
  },
  tabUnderlineActive: {
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: 40,
    alignItems: 'center',
  },
  // Concentric rings
  outerRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1.5,
    borderColor: 'rgba(42,255,214,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  innerRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: 'rgba(42,255,214,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(42,255,214,0.15)',
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    fontSize: 36,
    color: COLORS.primary,
    fontWeight: 'bold',
    lineHeight: 44,
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: 28,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 10,
  },
  titleName: {
    color: COLORS.textPrimary,
  },
  titleEmoji: {
    fontSize: 26,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: '#9AA0B2',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  featureList: {
    width: '100%',
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181B26',
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: '#232736',
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 14,
  },
  featureCheckCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(42,255,214,0.15)',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureCheck: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  featureText: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: '#9AA0B2',
    lineHeight: 20,
  },
  featureBold: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textPrimary,
  },
  featureRest: {
    color: '#9AA0B2',
  },
  footer: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: 40,
    paddingTop: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 100,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 17,
    color: '#0D0F14',
    letterSpacing: 0.2,
  },
});
