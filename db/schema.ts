export const SCHEMA = {
  profile: `
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      persona TEXT,
      monthly_income INTEGER,
      currency TEXT DEFAULT 'INR',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `,
  transactions: `
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount INTEGER NOT NULL,
      category TEXT NOT NULL,
      note TEXT,
      transaction_date TEXT NOT NULL,
      type TEXT DEFAULT 'expense',
      payment_mode TEXT DEFAULT 'upi',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `,
  budget_categories: `
    CREATE TABLE IF NOT EXISTS budget_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL UNIQUE,
      monthly_limit INTEGER NOT NULL
    );
  `,
  goals: `
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      target_amount INTEGER NOT NULL,
      saved_amount INTEGER DEFAULT 0,
      monthly_contribution INTEGER DEFAULT 0,
      deadline TEXT,
      icon TEXT,
      color TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `,
  mood_entries: `
    CREATE TABLE IF NOT EXISTS mood_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      week_start TEXT NOT NULL,
      score INTEGER NOT NULL,
      self_report TEXT,
      summary TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `,
  schema_version: `
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY,
      applied_at TEXT DEFAULT (datetime('now'))
    );
  `
};
