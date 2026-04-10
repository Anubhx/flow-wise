import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser, useClerk } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, CURRENCY, APP } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useGoalStore } from '@/store/useGoalStore';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useMoodStore } from '@/store/useMoodStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: async () => {
            await signOut();
            // Reset all stores
            useAuthStore.getState().setProfile(null);
            // In a real app with more logic, we'd call a reset() on each store.
            // For now, these are the primary ones that need clearing.
            router.replace('/(auth)/sign-in');
          }
        }
      ]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && user) {
      try {
        const file = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        };
        // @ts-ignore - Clerk SDK might have slightly diff typing for file
        await user.setProfileImage({ file });
      } catch (err) {
        console.error('Failed to update profile image', err);
        Alert.alert('Error', 'Failed to update profile image');
      }
    }
  };

  const userName = user?.fullName || user?.firstName || 'User';

  return (
    <View style={styles.container}>
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Section A: Profile Header */}
        <View style={styles.profileInfo}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatarLarge} />
            ) : (
              <View style={[styles.avatarLarge, styles.avatarFallbackLarge]}>
                <Text style={styles.avatarInitialLarge}>{userName.charAt(0)}</Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileEmail}>{user?.primaryEmailAddress?.emailAddress}</Text>
          <View style={styles.proBadge}>
            <Text style={styles.proText}>PRO MEMBER</Text>
          </View>
        </View>

        {/* Section B: Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹70K</Text>
            <Text style={styles.statLabel}>Total Saved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Active Goals</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>82</Text>
            <Text style={styles.statLabel}>Mood Score</Text>
          </View>
        </View>

        {/* Section C: Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.cardGroup}>
            <TouchableOpacity style={styles.row}>
              <Text style={styles.rowLabel}>Personal Info</Text>
              <Text style={styles.rowValue}>{userName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
              <Text style={styles.rowLabel}>Linked Accounts</Text>
              <Text style={styles.rowValue}>SBI Bank</Text>
            </TouchableOpacity>
            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <Text style={styles.rowLabel}>Notifications</Text>
              <Switch 
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: COLORS.surfaceHover, true: COLORS.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Section D: Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.cardGroup}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Dark Mode</Text>
              <Switch 
                value={true}
                disabled
                trackColor={{ false: COLORS.surfaceHover, true: COLORS.primary }}
              />
            </View>
            <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]}>
              <Text style={styles.rowLabel}>Currency</Text>
              <Text style={styles.rowValue}>INR (₹)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section E: Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Section F: Version */}
        <Text style={styles.versionText}>
          {APP.name} v{APP.version} • Made with ♥ in Bengaluru
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.screenTop,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.h3,
    color: COLORS.textPrimary,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: COLORS.textPrimary,
    fontSize: 20,
  },
  scrollContainer: {
    paddingBottom: SPACING.huge,
  },
  profileInfo: {
    alignItems: 'center',
    marginVertical: SPACING.xxl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarFallbackLarge: {
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialLarge: {
    fontFamily: FONTS.displayBold,
    fontSize: 40,
    color: COLORS.primary,
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.surfaceElevated,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  editIcon: {
    fontSize: 14,
  },
  profileName: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZE.h2,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  proBadge: {
    backgroundColor: 'rgba(255, 191, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 191, 0, 0.2)',
  },
  proText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: '#FFBF00',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
    marginBottom: SPACING.xxxl,
  },
  statCard: {
    width: '31%',
    backgroundColor: COLORS.surfaceElevated,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  statValue: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZE.h3,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontFamily: FONTS.displayMedium,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardGroup: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  },
  rowValue: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
  },
  signOutBtn: {
    marginHorizontal: SPACING.lg,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
    marginTop: SPACING.xl,
  },
  signOutText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.body,
    color: '#FF6B6B',
  },
  versionText: {
    textAlign: 'center',
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: SPACING.xxl,
  }
});
