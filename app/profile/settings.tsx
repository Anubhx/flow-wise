import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS, APP, ONBOARDING } from '@/constants';

export default function SettingsScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const persona = ONBOARDING.personas.find(p => p.id === profile?.persona);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.card}>
          <InfoRow label="Full Name" value={profile?.name ?? '—'} />
          <InfoRow label="Email" value={profile?.email || '—'} />
          <InfoRow label="Persona" value={persona?.label ?? '—'} last />
        </View>

        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.card}>
          <InfoRow label="Currency" value="INR (₹)" />
          <InfoRow label="Theme" value="Dark (default)" last />
        </View>

        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.card}>
          <InfoRow label="App Name" value={APP.name} />
          <InfoRow label="Version" value={APP.version} />
          <InfoRow label="Support" value={APP.supportEmail} last />
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.screenTop,
    paddingBottom: SPACING.md,
  },
  backBtn: { padding: SPACING.xs, width: 40 },
  backIcon: { color: COLORS.textPrimary, fontSize: 22 },
  title: { fontFamily: FONTS.displayMedium, fontSize: FONT_SIZE.h3, color: COLORS.textPrimary },
  scrollContent: {
    paddingHorizontal: SPACING.screenHorizontal,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.huge,
  },
  sectionLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.label,
    color: COLORS.textTertiary,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderEmphasized,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  rowLabel: { fontFamily: FONTS.body, fontSize: FONT_SIZE.body, color: COLORS.textSecondary },
  rowValue: { fontFamily: FONTS.bodyMedium, fontSize: FONT_SIZE.body, color: COLORS.textPrimary, maxWidth: '60%', textAlign: 'right' },
});
