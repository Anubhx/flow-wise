import { useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
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

export default function RootLayout() {
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
    <SQLiteProvider databaseName="flowwise.db" onInit={migrateDb}>
      <StatusBar style="light" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background }
        }}
      >
        <Stack.Screen name="expense" options={{ presentation: 'modal' }} />
        <Stack.Screen name="goal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="transaction" />
        <Stack.Screen name="profile" />
      </Stack>
    </SQLiteProvider>
  );
}

