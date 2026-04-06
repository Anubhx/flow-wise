import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, STRINGS, ONBOARDING } from '@/constants';
import { Image } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { setProfile } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [persona, setPersona] = useState<any>(ONBOARDING.personas[0].id);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    if (!name.trim()) return;
    
    setProfile({
      name,
      email,
      persona,
      avatarUri
    });
    
    router.push('/(auth)/bank');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.stepLabel}>Step 1 of 3</Text>
        </View>

        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>

        <Text style={styles.title}>{STRINGS.onboarding.profileTitle}</Text>
        <Text style={styles.subtitle}>{STRINGS.onboarding.profileSubtitle}</Text>

        <View style={styles.form}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handlePickImage}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarIcon}>👤</Text>
              </View>
            )}
            <Text style={styles.avatarLabel}>Tap to add photo</Text>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Rahul Sharma"
              placeholderTextColor={COLORS.textTertiary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="rahul@example.com"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>What best describes you?</Text>
            <View style={styles.personaContainer}>
              {ONBOARDING.personas.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.personaChip,
                    persona === p.id && styles.personaChipActive
                  ]}
                  onPress={() => setPersona(p.id)}
                >
                  <Text style={[
                    styles.personaText,
                    persona === p.id && styles.personaTextActive
                  ]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.continueButton, !name.trim() && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!name.trim()}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  dots: {
    flexDirection: 'row',
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
  form: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.borderEmphasized,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    marginBottom: SPACING.sm,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: SPACING.sm,
  },
  avatarIcon: {
    fontSize: 32,
  },
  avatarLabel: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  },
  personaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  personaChip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  personaChipActive: {
    backgroundColor: COLORS.primaryBg || 'rgba(42,255,214,0.10)',
    borderColor: COLORS.primaryBorder || 'rgba(42,255,214,0.22)',
  },
  personaText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
  },
  personaTextActive: {
    color: COLORS.primary,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.xl,
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
