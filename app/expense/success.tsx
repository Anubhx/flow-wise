import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, STRINGS } from '@/constants';

export default function SuccessScreen() {
  const router = useRouter();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(rotateAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-180deg', '0deg']
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, { transform: [{ rotate: spin }, { scale: rotateAnim }] }]}>
          <Text style={styles.iconText}>✓</Text>
        </Animated.View>
        
        {/* Placeholder text, should ideally fetch latest or pass params */}
        <Text style={styles.title}>Expense Added!</Text>
        <Text style={styles.subtitle}>Your budget has been updated.</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.doneButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.doneButtonText}>Done</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primaryBg || 'rgba(42,255,214,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  iconText: {
    fontSize: 48,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZE.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingBottom: SPACING.huge,
  },
  doneButton: {
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  doneButtonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  }
});
