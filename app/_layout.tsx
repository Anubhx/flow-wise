import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { 
  Syne_600SemiBold, 
  Syne_700Bold, 
  Syne_800ExtraBold 
} from '@expo-google-fonts/syne';
import { 
  DMSans_400Regular, 
  DMSans_500Medium 
} from '@expo-google-fonts/dm-sans';
import { SQLiteProvider } from 'expo-sqlite';

import { COLORS } from '@/constants';
import { SCHEMA } from '@/db/schema';
import { useAuthStore } from '@/store/useAuthStore';

/** Token cache for Clerk using Expo SecureStore */
const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) return item;
      return null;
    } catch (error) {
      console.error('clerk tokenCache error', error);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

/** Run migrations inside SQLiteProvider's onInit callback */
async function migrateDb(db: import('expo-sqlite').SQLiteDatabase) {
  let currentVersion = 0;
  try {
    const result = await db.getFirstAsync<{ version: number }>(
      'SELECT version FROM schema_version ORDER BY version DESC LIMIT 1'
    );
    if (result) currentVersion = result.version;
  } catch (_) {
    // table doesn't exist yet — fresh install
  }

  if (currentVersion === 0) {
    await db.execAsync(`
      BEGIN TRANSACTION;
      ${SCHEMA.profile}
      ${SCHEMA.transactions}
      ${SCHEMA.budget_categories}
      ${SCHEMA.goals}
      ${SCHEMA.mood_entries}
      ${SCHEMA.schema_version}
      INSERT INTO schema_version (version) VALUES (1);
      COMMIT;
    `);
    console.log('DB Initialized: Version 1 applied');
  } else {
    console.log('DB already initialized. Version:', currentVersion);
  }
}

/** Auth gate component to handle routing based on sign-in status */
function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { hasCompletedOnboarding } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isSignedIn && !inAuthGroup) {
      // Redirect to sign-in if not signed in and not in auth group
      router.replace('/(auth)/sign-in');
    } else if (isSignedIn && inAuthGroup) {
      // Redirect to onboarding if signed in but not completed, otherwise to tabs
      if (!hasCompletedOnboarding) {
        router.replace('/(auth)/profile');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [isSignedIn, isLoaded, segments, hasCompletedOnboarding]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
  
  const [fontsLoaded] = useFonts({
    Syne_600SemiBold,
    Syne_700Bold,
    Syne_800ExtraBold,
    DMSans_400Regular,
    DMSans_500Medium,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <SQLiteProvider databaseName="flowwise.db" onInit={migrateDb}>
          <AuthGate>
            <StatusBar style="light" />
            <Stack 
              screenOptions={{ 
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background }
              }}
            >
              <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
              <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
              <Stack.Screen name="expense" options={{ presentation: 'modal' }} />
              <Stack.Screen name="goal" options={{ presentation: 'modal' }} />
              <Stack.Screen name="transaction" />
              <Stack.Screen name="profile" />
            </Stack>
          </AuthGate>
        </SQLiteProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

