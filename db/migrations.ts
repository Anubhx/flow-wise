import * as SQLite from 'expo-sqlite';
import { SCHEMA } from './schema';

export async function initDB() {
  try {
    const db = await SQLite.openDatabaseAsync('flowwise.db');

    let currentVersion = 0;
    try {
      const result = await db.getFirstAsync<{version: number}>('SELECT version FROM schema_version ORDER BY version DESC LIMIT 1');
      if (result) {
        currentVersion = result.version;
      }
    } catch (e) {
      // Table doesn't exist yet
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
    
    return db;
  } catch (error) {
    console.error('Failed to init DB:', error);
    throw error;
  }
}
