# AGENT.md — FlowWise Development Agent

> This file is the single source of truth for any AI agent, LLM, or developer working on the FlowWise codebase. Read this entire file before writing a single line of code. No exceptions.

---

## 1. What is FlowWise?

FlowWise is a **mobile-first personal finance app** for young Indian professionals (age 22–28, first-jobbers, freelancers, students). It is built with **React Native + Expo** on the frontend and **FastAPI** on the backend.

The core thesis: most finance apps are built for people who already understand money. FlowWise is built for everyone else. It makes financial awareness approachable, low-anxiety, and habit-forming.

**Owner:** Anubhav Raj  
**Stack:** React Native (Expo) · FastAPI · SQLite (local) · Gemini 1.5 Flash (AI nudges)  
**Design system:** See `constants.js` for all tokens. See `PLAN.md` for full IA and screen specs.

---

## 2. Agent Purpose

You are a **senior full-stack mobile developer** assistant working on FlowWise. Your job is to:

- Write clean, production-quality React Native code
- Follow the design system exactly as defined in `constants.js`
- Implement screens exactly as specified in `PLAN.md`
- Never invent features, colors, or flows not defined in these files
- Ask for clarification before building anything ambiguous

---

## 3. Tech Stack — Memorise This

| Layer | Technology | Why |
|---|---|---|
| Mobile framework | React Native + Expo (SDK 51+) | Free, cross-platform, MacBook-friendly |
| Navigation | Expo Router (file-based) | Clean, recommended by Expo team |
| State management | Zustand | Lightweight, no boilerplate |
| Local database | expo-sqlite | Free, on-device, no server needed |
| Backend | FastAPI (Python) | Lightweight, Anubhav knows it |
| AI nudges | Google Gemini 1.5 Flash | Free tier, key rotation supported |
| Charts | Victory Native XL | Best React Native chart lib |
| Icons | Custom SVG (see design system) + @expo/vector-icons fallback |
| Styling | StyleSheet API (NO NativeWind unless asked) | Predictable, performant |
| Storage (non-DB) | expo-secure-store (sensitive) + AsyncStorage (preferences) |
| Fonts | expo-google-fonts (Syne + DM Sans) |

**Never suggest or use:**
- Redux (overkill)
- Firebase (not free at scale)
- Supabase (unnecessary for v1)
- Tailwind/NativeWind (unless explicitly asked)
- React Navigation v5 (use Expo Router)
- Any paid API or service

---

## 4. Project Structure

```
flowwise/
├── app/                        # Expo Router screens (file-based routing)
│   ├── (auth)/                 # Onboarding flow
│   │   ├── index.tsx           # Welcome screen
│   │   ├── features.tsx        # Feature highlight
│   │   ├── profile.tsx         # Profile setup
│   │   ├── bank.tsx            # Bank linking (manual entry)
│   │   ├── budget.tsx          # Budget setup
│   │   └── done.tsx            # Success / You're all set
│   ├── (tabs)/                 # Main app tabs
│   │   ├── index.tsx           # Home / Dashboard
│   │   ├── spend.tsx           # Spending analytics
│   │   ├── goals.tsx           # Goals tracking
│   │   └── insights.tsx        # Money Mood + AI insights
│   ├── expense/
│   │   ├── add.tsx             # Add expense screen
│   │   └── success.tsx         # Expense success state
│   ├── transaction/
│   │   ├── [id].tsx            # Transaction detail
│   │   └── all.tsx             # All transactions
│   ├── profile/
│   │   ├── index.tsx           # Profile overview
│   │   ├── settings.tsx        # Settings
│   │   ├── notifications.tsx   # Notification settings
│   │   └── budget-edit.tsx     # Budget editing
│   └── _layout.tsx             # Root layout
├── components/                 # Shared components
│   ├── ui/                     # Base UI elements
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Toggle.tsx
│   │   └── Input.tsx
│   ├── home/                   # Home screen components
│   ├── spend/                  # Spending screen components
│   ├── goals/                  # Goals screen components
│   └── insights/               # Insights + Money Mood components
├── store/                      # Zustand stores
│   ├── useAuthStore.ts         # Auth + onboarding state
│   ├── useTransactionStore.ts  # Transactions CRUD
│   ├── useGoalStore.ts         # Goals CRUD
│   ├── useBudgetStore.ts       # Budget state
│   └── useMoodStore.ts         # Money Mood state
├── db/                         # SQLite layer
│   ├── schema.ts               # Table definitions
│   ├── migrations.ts           # DB migrations
│   └── queries/                # Per-entity queries
│       ├── transactions.ts
│       ├── goals.ts
│       ├── budget.ts
│       └── mood.ts
├── services/                   # External service calls
│   ├── gemini.ts               # Gemini AI nudge generation
│   └── notifications.ts        # Expo notifications
├── hooks/                      # Custom React hooks
│   ├── useTransactions.ts
│   ├── useGoals.ts
│   ├── useBudget.ts
│   └── useMoodScore.ts
├── utils/                      # Pure utility functions
│   ├── currency.ts             # Format INR amounts
│   ├── date.ts                 # Date formatting helpers
│   ├── mood.ts                 # Mood score calculation
│   └── budget.ts               # Budget percentage helpers
├── constants.js                # ALL design tokens (colors, fonts, spacing)
├── PLAN.md                     # Full project plan and screen specs
└── AGENT.md                    # This file
```

---

## 5. DO's — Always Follow These

### Code quality
- **DO** read `constants.js` before writing any color, spacing, or font value
- **DO** use TypeScript for all new files (`.tsx` / `.ts`)
- **DO** write one component per file
- **DO** keep components under 200 lines — extract sub-components if longer
- **DO** handle loading and error states for every async operation
- **DO** format currency with the `formatINR()` util — never hardcode `₹` + number
- **DO** use the Zustand store for all state that is shared across screens
- **DO** use `expo-sqlite` for all persistent data — transactions, goals, budget
- **DO** comment every function with a one-line JSDoc description
- **DO** test on both iOS simulator and Android emulator before marking done

### Design fidelity
- **DO** use exact hex values from `constants.js` — never approximate
- **DO** use `FONTS.display` (Syne) for headings and numbers, `FONTS.body` (DM Sans) for body text
- **DO** follow the spacing grid — all spacing values must be from `SPACING` in `constants.js`
- **DO** use semantic color names (`COLORS.success`, `COLORS.danger`) not raw hex in components
- **DO** apply border radius from `RADIUS` constants, not hardcoded pixel values

### Architecture
- **DO** keep business logic in stores and hooks, NOT in screen components
- **DO** use `db/queries/` for all database operations — never write SQL inline in components
- **DO** keep the Gemini API key in `.env` — never commit it to the repo
- **DO** handle offline state gracefully — the app must work with no internet

---

## 6. DON'Ts — Never Do These

### Hard rules
- **DON'T** use any color not defined in `constants.js`
- **DON'T** hardcode any string that should be in constants (currency symbol, app name, etc.)
- **DON'T** write business logic inside screen files (`app/` directory)
- **DON'T** use `useState` for data that needs to persist — use the store + DB
- **DON'T** make API calls directly from components — use hooks or services
- **DON'T** commit `.env` files, API keys, or any secrets
- **DON'T** use `any` type in TypeScript — always type properly
- **DON'T** skip error handling — every `try/catch` must log and show user feedback
- **DON'T** use `console.log` in production code — use a logger utility
- **DON'T** build features not in `PLAN.md` without explicit approval from Anubhav

### Design rules
- **DON'T** use white or light backgrounds — this is a dark-theme app
- **DON'T** use colors not in the design system for new UI elements
- **DON'T** use `font-weight: 600` or `700` for DM Sans body text — only 400 and 500
- **DON'T** use pixel values for spacing — always use `SPACING.*` constants
- **DON'T** add animations not specified — keep motion intentional and minimal

### AI/Gemini rules
- **DON'T** send raw transaction data to Gemini — only send aggregated summaries
- **DON'T** make Gemini calls more than once per insight refresh (cache results)
- **DON'T** show Gemini responses without a loading state
- **DON'T** make the app dependent on Gemini being available — all core features work offline

---

## 7. Key Flows — Understand These Before Coding

### Onboarding flow
```
Welcome → Features → Profile Setup → Bank Link (optional skip) → Budget Setup → Done → (tabs)
```
- Onboarding state stored in `useAuthStore`
- `hasCompletedOnboarding` boolean in AsyncStorage gates the flow
- Once onboarding is done, user goes directly to `(tabs)` on next open

### Add Expense flow
```
Home "Add Expense" chip → add.tsx → (select category + enter amount + optional note) → submit → success.tsx → Home
```
- Amount validation: must be > 0 and <= 10,00,000
- Category is required before submission
- On success: update `useTransactionStore` + `useBudgetStore` + trigger insight refresh

### Money Mood Score calculation
```
Every Sunday → useMoodScore hook → calculate score from:
  - Days in budget this week (max 70 points, 10 per day)
  - Goal deposit made this week (10 points bonus)
  - No spike day (no single day > 2x daily average) (10 points bonus)
  - Self-report weight applied: user rating adjusts score ±10
→ Store in mood table → show on Insights screen
```

### Budget tracking
```
Monthly budget set during onboarding → useBudgetStore tracks:
  - totalBudget (from setup)
  - spentAmount (sum of this month's transactions)
  - remaining (totalBudget - spentAmount)
  - percentUsed (spentAmount / totalBudget * 100)
→ Home screen shows budget bar
→ Alert triggered at 75% and 100%
```

---

## 8. Database Schema (SQLite)

```sql
-- Users / profile
CREATE TABLE profile (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  persona TEXT,           -- 'first_jobber' | 'freelancer' | 'student'
  monthly_income INTEGER,
  currency TEXT DEFAULT 'INR',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Transactions
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER NOT NULL,        -- stored in paise (multiply by 100)
  category TEXT NOT NULL,
  note TEXT,
  transaction_date TEXT NOT NULL, -- ISO 8601
  type TEXT DEFAULT 'expense',    -- 'expense' | 'income'
  created_at TEXT DEFAULT (datetime('now'))
);

-- Budget categories
CREATE TABLE budget_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL UNIQUE,
  monthly_limit INTEGER NOT NULL  -- stored in paise
);

-- Goals
CREATE TABLE goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  target_amount INTEGER NOT NULL,  -- paise
  saved_amount INTEGER DEFAULT 0,  -- paise
  deadline TEXT,                   -- ISO 8601 date
  icon TEXT,
  color TEXT,
  status TEXT DEFAULT 'active',    -- 'active' | 'completed' | 'paused'
  created_at TEXT DEFAULT (datetime('now'))
);

-- Money Mood weekly entries
CREATE TABLE mood_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  week_start TEXT NOT NULL,       -- Monday of the week (ISO 8601)
  score INTEGER NOT NULL,         -- 0-100
  self_report TEXT,               -- 'rough' | 'okay' | 'good' | 'great'
  summary TEXT,                   -- AI-generated or computed summary
  created_at TEXT DEFAULT (datetime('now'))
);
```

> **All monetary amounts are stored in paise (₹1 = 100 paise).** Always convert before display using `formatINR(paise)` from `utils/currency.ts`.

---

## 9. Gemini Integration

```typescript
// services/gemini.ts pattern
// Input: aggregated weekly summary (NO raw transaction data)
// Output: 1-3 plain-language nudges

const prompt = `
You are a friendly, non-judgmental personal finance coach for a young Indian professional.
Based on this week's summary, give 1-3 short, actionable insights.
Each insight must be under 30 words. Use simple language. No jargon.
Never be preachy or scary. Always end with one positive observation.

Weekly summary:
- Total spent: ₹${totalSpent}
- Budget used: ${percentUsed}%
- Highest category: ${topCategory} (₹${topCategoryAmount})
- Days within budget: ${daysInBudget}/7
- Goals progress: ${goalsOnTrack} of ${totalGoals} on track

Respond as JSON: { "nudges": ["...", "...", "..."] }
`;
```

- Use `gemini-1.5-flash` model (free tier)
- Cache nudges for 24 hours in AsyncStorage — do not regenerate on every open
- Rotate API keys via env vars if hitting rate limits: `GEMINI_KEY_1`, `GEMINI_KEY_2`, etc.

---

## 10. Environment Setup (Mac)

```bash
# Prerequisites (run once)
brew install node
npm install -g expo-cli eas-cli

# Clone and install
git clone <repo>
cd flowwise
npm install

# Environment variables
cp .env.example .env
# Fill in: GEMINI_KEY_1, GEMINI_KEY_2 (get from aistudio.google.com)

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Backend (separate terminal)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 11. What Anubhav Cares About (Priorities)

1. **It works offline** — core CRUD (add expense, view balance, goals) must work with zero internet
2. **It's fast** — home screen loads in < 1 second, no janky animations
3. **It looks exactly like the design** — pixel fidelity to `constants.js` and `PLAN.md`
4. **Free to run** — no paid APIs, no paid services, Gemini free tier only
5. **Easy to extend** — clean architecture so new features can be added without breaking existing ones

---

## 12. When You're Stuck

1. Check `PLAN.md` for the screen/flow specification
2. Check `constants.js` for the correct token value
3. Check this file for the pattern to follow
4. If still unclear — **ask Anubhav before guessing**

**Never hallucinate a solution. Never invent a feature. Never use a value not in constants.**
