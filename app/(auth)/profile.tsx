import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, ScrollView, Platform, Image, ActivityIndicator
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useAuthStore } from '@/store/useAuthStore';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from '@/constants';

const PERSONAS = [
  { id: 'first_jobber', label: 'First jobber' },
  { id: 'freelancer', label: 'Freelancer' },
  { id: 'student', label: 'Student' },
] as const;

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { setProfile } = useAuthStore();

  // Pre-fill from Clerk user if available
  const [name, setName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || '');
  const [persona, setPersona] = useState<string>('first_jobber');
  const [avatarUri, setAvatarUri] = useState<string | null>(
    user?.imageUrl || null
  );
  const [uploading, setUploading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    if (!name.trim()) return;
    setProfile({ name: name.trim(), email, persona: persona as any, avatarUri });
    router.push('/(auth)/bank');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.stepLabel}>Step 1 of 3</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Set up profile</Text>
        <Text style={styles.subtitle}>Personalize your experience</Text>

        {/* Avatar */}
        <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickImage} activeOpacity={0.8}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarEmoji}>🧑</Text>
            </View>
          )}
          <Text style={styles.avatarLabel}>Tap to add photo</Text>
        </TouchableOpacity>

        {/* Full Name */}
        <Text style={styles.inputLabel}>FULL NAME</Text>
        <TextInput
          style={[styles.input, styles.inputActive]}
          placeholder="e.g. Anubhav Raj"
          placeholderTextColor="#4A5068"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        {/* Email */}
        <Text style={styles.inputLabel}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="anubhav@gmail.com"
          placeholderTextColor="#4A5068"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!user?.primaryEmailAddress}
        />

        {/* Persona */}
        <Text style={styles.inputLabel}>I AM A...</Text>
        <View style={styles.personaRow}>
          {PERSONAS.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.personaChip, persona === p.id && styles.personaChipActive]}
              onPress={() => setPersona(p.id)}
              activeOpacity={0.75}
            >
              <Text style={[styles.personaText, persona === p.id && styles.personaTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={[styles.continueButton, !name.trim() && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!name.trim() || uploading}
          activeOpacity={0.85}
        >
          {uploading ? (
            <ActivityIndicator color="#0D0F14" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 48,
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
    marginBottom: 30,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1C2A26',
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    marginBottom: 10,
  },
  avatarEmoji: {
    fontSize: 38,
  },
  avatarLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    color: COLORS.primary,
  },
  inputLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 18,
  },
  input: {
    backgroundColor: '#1C1F2A',
    borderRadius: RADIUS.lg,
    paddingVertical: 15,
    paddingHorizontal: 18,
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
    borderWidth: 1.5,
    borderColor: '#2A2F40',
  },
  inputActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(42,255,214,0.06)',
  },
  personaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  personaChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#1C1F2A',
    borderWidth: 1.5,
    borderColor: '#2A2F40',
    alignItems: 'center',
  },
  personaChipActive: {
    backgroundColor: 'rgba(42,255,214,0.10)',
    borderColor: COLORS.primary,
  },
  personaText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: '#9AA0B2',
    textAlign: 'center',
  },
  personaTextActive: {
    color: COLORS.primary,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 32,
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
