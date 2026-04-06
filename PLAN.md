# PLAN.md — FlowWise Full Project Plan

> Complete technical and product specification for the FlowWise personal finance app. Every screen, every flow, every data model. Read this before building anything.

---

## 1. Project Overview

| Field | Value |
|---|---|
| App name | FlowWise |
| Tagline | Money for real life |
| Platform | iOS + Android (React Native + Expo) |
| Target user | Indian professionals aged 22–28, first job or freelancing |
| Core problem | Finance apps are anxiety-inducing and technical — FlowWise makes them approachable |
| MVP goal | Working app with expense tracking, budget monitoring, goals, and Money Mood Score |
| Monetisation | Free for now — no ads, no premium tier in v1 |

---

## 2. Tech Stack Decision

### Why React Native + Expo (not Flutter, not native)?
- Anubhav knows JavaScript/React from existing projects (CompanyLens, LexAI, OrbitResume)
- Expo handles camera, notifications, fonts, SQLite without native config
- Single codebase for iOS and Android
- Expo Go app allows testing on real phone without building
- Free — no paid licenses

### Why FastAPI backend?
- Anubhav already uses LangGraph + FastAPI pattern across projects
- Python is familiar — reuse patterns from HireLoop and CompanyLens
- Lightweight — runs locally on MacBook for development
- In v1, the backend is minimal (mainly Gemini proxy + future bank sync)

### Why SQLite (expo-sqlite)?
- 100% offline — no server needed for core features
- Data stays on device — better privacy
- Zero cost — no database hosting
- Fast enough for personal finance data volumes (< 10,000 transactions)

### Why Gemini 1.5 Flash?
- Free tier with generous limits
- Anubhav already has multiple Google accounts for key rotation
- Works inside Antigravity IDE via Google ADC (no key needed in dev)
- Flash model is fast and cheap — perfect for short nudge generation

### Why Zustand (not Redux, not Context)?
- Zero boilerplate — 10 lines vs 100 lines with Redux
- Works perfectly with TypeScript
- Easy to persist with `zustand/middleware` + AsyncStorage
- Anubhav is already building agentic systems — simple state management frees mental bandwidth

---

## 3. Information Architecture

### Navigation Structure

```
App
├── (auth) — Onboarding (shown only on first launch)
│   ├── / — Welcome screen
│   ├── /features — Feature highlight
│   ├── /profile — Profile setup
│   ├── /bank — Bank linking
│   ├── /budget — Budget setup
│   └── /done — Success / All set
│
└── (tabs) — Main app (4 tabs)
    ├── Home (tab 1)
    │   ├── Balance card
    │   ├── Budget indicator
    │   ├── Quick actions
    │   └── Recent transactions
    │       └── → /transaction/[id] (detail)
    │       └── → /transaction/all (full list)
    │
    ├── Spend (tab 2)
    │   ├── Period selector (Week / Month / Quarter)
    │   ├── Donut chart
    │   └── Category breakdown cards
    │
    ├── Goals (tab 3)
    │   ├── Active goals list
    │   │   └── → goal detail modal (inline)
    │   └── Add goal → /goals/add
    │
    └── Insights (tab 4)
        ├── Money Mood Score card
        ├── Day-by-day mood dots
        ├── Smart nudges (Gemini)
        └── Weekly check-in widget

Modals / Push screens (accessible from anywhere)
├── /expense/add — Add expense
├── /expense/success — Expense added confirmation
├── /transaction/[id] — Transaction detail
├── /transaction/all — All transactions
├── /profile — Profile overview
├── /profile/settings — Settings
├── /profile/notifications — Notification preferences
└── /profile/budget-edit — Edit category budgets
```

---

## 4. Screen Specifications

### SCREEN 1 — Welcome (auth/index.tsx)

**Purpose:** First impression. Communicate value, reduce intimidation.

**Elements:**
- FlowWise logo + tagline "Money for real life"
- Hero headline: "Money that works for you." (Syne 28px bold)
- Subheading: "Stop dreading your bank app..." (DM Sans 14px, muted)
- Floating balance preview card (animated, shows ₹70,000 + mini progress bar)
- 3-dot progress indicator (dot 1 active)
- Primary CTA: "Get Started" button (full width, Mint)
- Ghost CTA: "I already have an account" (border button)

**State:** None — static screen

**Navigation:** "Get Started" → /features | "I already have an account" → /profile (skip onboarding)

---

### SCREEN 2 — Feature Highlight (auth/features.tsx)

**Purpose:** Build desire before asking for information.

**Elements:**
- Icon: 🎯 in mint accent box
- Headline: "Smart goals that adapt."
- Body: explanation of goal tracking
- Live preview: Goa trip goal card (53% progress)
- MacBook Pro goal card (17% progress)
- 3-dot progress (dot 2 active)
- CTA: "Next" button

**State:** None — static

**Navigation:** "Next" → /profile

---

### SCREEN 3 — Profile Setup (auth/profile.tsx)

**Purpose:** Collect minimum info needed to personalise the app.

**Elements:**
- Back button + "Step 1 of 3" label
- 3-dot progress (dot 3 active)
- Avatar circle (dashed border, tap to pick emoji or photo via expo-image-picker)
- "Tap to add photo" label
- Full Name input (required)
- Email input (optional)
- Persona picker: "First jobber" | "Freelancer" | "Student" (tap to select, only one)
- "Continue" CTA

**State:**
```typescript
{
  name: string,
  email: string,
  persona: 'first_jobber' | 'freelancer' | 'student',
  avatarUri: string | null
}
```

**Validation:** name must not be empty

**Navigation:** "Continue" → /bank

---

### SCREEN 4 — Bank Linking (auth/bank.tsx)

**Purpose:** Connect income source. Manual entry only in v1 (no Plaid/bank API).

**Elements:**
- Back button + "Step 2 of 3"
- Title: "Link your bank"
- Subtitle: "Auto-sync transactions · 256-bit secure"
- Bank options (tap to select): SBI · HDFC · ICICI · Axis
- Selected state: mint border + check icon
- "Or enter manually — skip for now" text link
- "Connect [Bank] →" primary CTA

**Note:** In v1, "connecting" just saves bank name preference. No actual API integration. Mark clearly with a "Coming soon: auto-sync" note in the UI.

**State:**
```typescript
{
  selectedBank: 'sbi' | 'hdfc' | 'icici' | 'axis' | null
}
```

**Navigation:** CTA → /budget | Skip → /budget

---

### SCREEN 5 — Budget Setup (auth/budget.tsx)

**Purpose:** Set monthly income and category spending limits.

**Elements:**
- Back button + "Step 3 of 3" + dot row (all done)
- Title: "Set your budget"
- Monthly income input (large ₹ numpad input, Syne font)
- "Suggested limits" section (auto-calculated from income):
  - Housing: 30% of income
  - Food: 15% of income
  - Transport: 10% of income
  - Leisure: 10% of income
- Each category row: icon + name + mini bar + editable amount
- Unallocated amount note: "₹X unallocated — goes to savings automatically"
- "Looks good, let's go →" CTA (Mint)
- "I'll set this later" ghost button

**Auto-calculation logic:**
```typescript
const suggestedBudgets = (income: number) => ({
  housing: Math.round(income * 0.30),
  food: Math.round(income * 0.15),
  transport: Math.round(income * 0.10),
  leisure: Math.round(income * 0.10),
  health: Math.round(income * 0.05),
  savings: Math.round(income * 0.30),  // remainder goes here
})
```

**Navigation:** CTA → /done

---

### SCREEN 6 — You're All Set (auth/done.tsx)

**Purpose:** Celebrate completion, set expectations.

**Elements:**
- Progress bar (all 4 steps complete: Profile · Bank · Budget · Done!)
- Large check icon in mint ring (animated scale-in)
- "You're all set, [Name]! 🎉" headline (Syne 22px)
- Subtext: "FlowWise is ready to help you take control of your money."
- Summary card: Profile ✓ · Bank linked ✓ · Budget set ✓ · Goals (Add later)
- Feature confirmation pills: Smart alerts · Weekly Money Mood · Auto-sync
- "Take me to my dashboard →" primary CTA

**Navigation:** CTA → /(tabs) (replace auth stack)

---

### SCREEN 7 — Home / Dashboard (tabs/index.tsx)

**Purpose:** Answer "am I okay this month?" in 3 seconds.

**Sections:**

**Header:**
- Greeting: "Good morning/evening 🌤/🌙 [Name]"
- Notification bell (with unread dot if notifications exist)

**Balance Card:**
- "Total Balance" label
- Large balance amount (Syne 36px, white)
- Three sub-metrics in a row: Income (mint) · Spent (coral) · Saved (blue)
- Background: dark navy gradient (#1E2A3A → #162130)

**Budget Indicator:**
- "April budget" label + "XX% used" (amber if >50%, coral if >80%)
- Progress bar (amber fill)
- "₹X left · On track / Watch out / Over budget"

**Quick Actions (horizontal scroll chips):**
- Add Expense (mint) → /expense/add
- Set Goal (amber) → /goals/add
- Report (coral) → /transaction/all
- Insights (blue) → /insights

**Recent Transactions (last 5):**
- "Recent" heading + "See all" link → /transaction/all
- Each row: icon · name · date+category · amount

**Data dependencies:**
- `useBudgetStore` → balance, income, spent, remaining
- `useTransactionStore` → recent 5 transactions
- `useAuthStore` → user name, greeting time logic

---

### SCREEN 8 — Spending Analytics (tabs/spend.tsx)

**Purpose:** Understand where money went this period.

**Elements:**
- Period tabs: Week | Month | Quarter (default: Month)
- Total spent for period
- Donut chart (Victory Native XL) — 4 categories
- Legend: each category with colour dot and amount
- Category breakdown cards (sorted by spend, highest first):
  - Icon · name · mini progress bar · % · amount

**Data calculations:**
```typescript
// For selected period
const transactions = filterByPeriod(allTransactions, period)
const byCategory = groupBy(transactions, 'category')
const total = sum(transactions.map(t => t.amount))
const categories = Object.entries(byCategory).map(([cat, txns]) => ({
  category: cat,
  amount: sum(txns.map(t => t.amount)),
  percentage: (sum / total) * 100
}))
```

---

### SCREEN 9 — Goals (tabs/goals.tsx)

**Purpose:** Track savings goals with progress and motivation.

**Elements:**
- Header: "Goals" + "X active · ₹X saved total"
- Goal cards (one per active goal):
  - Accent colour top-right triangle
  - Status badge: "On track" (mint) | "In progress" (blue) | "Priority" (amber) | "At risk" (coral)
  - Goal icon + name + monthly contribution + deadline
  - Saved amount (large, coloured) + "of ₹target" (small, muted)
  - Progress bar (colour matches status)
  - "X days left" + percentage
- "Add New Goal" dashed button (mint border)

**Goal status logic:**
```typescript
const getGoalStatus = (goal: Goal) => {
  const progress = goal.savedAmount / goal.targetAmount
  const daysLeft = getDaysUntil(goal.deadline)
  const expectedProgress = goal.deadline
    ? 1 - (daysLeft / getTotalDays(goal.createdAt, goal.deadline))
    : 0.5
  if (progress >= expectedProgress) return 'on_track'
  if (progress >= expectedProgress * 0.7) return 'in_progress'
  return 'at_risk'
}
```

---

### SCREEN 10 — Insights + Money Mood (tabs/insights.tsx)

**Purpose:** Show financial wellness score + AI nudges + weekly check-in.

**Sections:**

**Money Mood Score Card:**
- "Money Mood Score" label + week date range
- Score circle: large number (0-100) in blue ring
- Plain-language summary: "You spent within budget X out of 7 days."
- 7-day mood strip: Mon-Sun, each day a circle with emoji + background colour
  - 😊 = good day (mint bg)
  - 😐 = okay day (amber bg)
  - 😬 = rough day (coral bg)

**Smart Nudges (Gemini):**
- "Smart Nudges" section heading
- 2-3 insight cards: icon + title + body + action link
- Refresh only once per day (cached in AsyncStorage)

**Weekly Check-In Widget:**
- "How did money feel this week?" title
- "Rate your spending control:" prompt
- 4 emoji options: 😫 Rough | 😐 Ok-ish | 😊 Good | 🥳 Great
- "Submit Check-in" button (mint)
- After submit: "Saved! See you next week ✓" confirmation
- Only show if current week's check-in not submitted

---

### SCREEN 11 — Add Expense (expense/add.tsx)

**Purpose:** Log an expense in under 5 seconds.

**Elements:**
- Back button + "Add Expense" title
- Large amount display: "₹" prefix + number + blinking cursor (Syne 48px)
- Date/time subtext: "Today · HH:MM AM/PM"
- Category chips (horizontal scroll): Housing | Food | Transport | Leisure | Health | Learning | Groceries | Salary | Fuel | Bills | Other
- Note field (optional): text input
- Date field: defaults to today, tappable to change
- Custom numpad: 1-9, ., 0, ⌫
- "Add Expense" CTA (full width, mint)

**Validation:**
- Amount > 0 required
- Category required
- Amount max: ₹10,00,000 (10 lakh)

**Navigation:** Success → /expense/success

---

### SCREEN 12 — Expense Success (expense/success.tsx)

**Purpose:** Close the feedback loop — show impact of the expense logged.

**Elements:**
- Large ✓ in mint circle (animated)
- "Expense Added!" title
- "₹X logged under [Category]" subtitle
- Budget impact card: "Monthly budget" + remaining + progress bar
- Quick insight: "Food spend this week: ₹X. You're X% above your weekly average."
- "Back to Home" primary button
- "Add Another" ghost button

---

### SCREEN 13 — Transaction Detail (transaction/[id].tsx)

**Elements:**
- Back button
- Category icon (large, 64px, rounded square)
- Transaction name (Syne 18px bold)
- Date + time
- Amount (large, coral for expense, mint for income)
- "Completed" status pill
- Detail rows: Category · Account · Payment mode · Reference ID · % of budget
- Note card (if note exists)
- Action row: Edit · Share · Delete

---

### SCREEN 14 — All Transactions (transaction/all.tsx)

**Elements:**
- Back button + "All Transactions"
- Search bar (filters transactions by name or category)
- Filter chips: All | Income | Food | Housing | Transport | [other categories]
- Month group headers ("April 2026", "March 2026")
- Transaction rows: icon · name + date · amount

---

### SCREEN 15 — Profile (profile/index.tsx)

**Elements:**
- Avatar (emoji or photo)
- Name + email + city
- "Pro Member" badge (placeholder for future)
- Stats row: Total Saved · Active Goals · Mood Score
- Settings sections:
  - Account: Personal Info · Linked Accounts · Notifications toggle
  - Preferences: Dark Mode toggle · Currency selector
- "Sign Out" danger button

---

### SCREEN 16 — Notification Settings (profile/notifications.tsx)

**Elements:**
- Toggle rows: Spending Alerts · Goal Milestones · Weekly Insight · Bill Reminders
- Quiet Hours toggle + time range
- Budget alert threshold picker: 50% | 75% | 90% | 100%

---

### SCREEN 17 — Budget Edit (profile/budget-edit.tsx)

**Elements:**
- Monthly income edit input
- Category budget rows (editable amounts with progress bars)
- Unallocated amount nudge
- "Save Budget" CTA

---

## 5. MVP Feature Scope

### V1 — Must Have
- [x] Complete onboarding flow (6 screens)
- [x] Add / edit / delete transactions
- [x] Category-based expense tracking
- [x] Monthly budget monitoring with visual indicator
- [x] 3 active goals with progress tracking
- [x] Money Mood Score (calculated weekly, not AI yet)
- [x] Gemini-powered nudges on Insights screen
- [x] Notifications: budget alerts at 75% and 100%
- [x] Profile setup and settings
- [x] All Transactions with search and filter
- [x] Full offline support

### V2 — After MVP
- [ ] Recurring expense detection
- [ ] Bank statement import (CSV)
- [ ] Shared budgets (partner/flatmate)
- [ ] Investment tracking (SIP, mutual funds)
- [ ] Dark/light mode toggle
- [ ] Voice expense logging
- [ ] Annual money review screen
- [ ] Widget support (iOS/Android home screen)

---

## 6. Development Phases

### Phase 1 — Foundation (Week 1–2)
- Expo project setup with Expo Router
- SQLite schema + migrations
- Zustand stores setup
- Design system implementation (constants.js → StyleSheet)
- Font loading (Syne + DM Sans via expo-google-fonts)
- Navigation shell (auth stack + tabs)

### Phase 2 — Core Flows (Week 3–4)
- Complete onboarding flow (all 6 screens)
- Home screen with real data
- Add Expense flow (add + success)
- Spending analytics screen with Victory chart

### Phase 3 — Goals + Insights (Week 5–6)
- Goals CRUD (create, read, update, delete)
- Money Mood Score calculation engine
- Insights screen with mood strip
- Weekly check-in widget

### Phase 4 — Polish + AI (Week 7–8)
- Gemini integration for nudges
- Notifications (budget alerts, weekly mood reminder)
- All transactions screen with search/filter
- Profile + settings screens
- Offline handling + loading states

### Phase 5 — Testing + Launch (Week 9–10)
- Full flow testing on iOS + Android
- Edge case handling (no data, first launch, etc.)
- Performance audit (home screen < 1 second)
- Expo build + TestFlight / Play Store internal testing

---

## 7. Free Tools & Services

| Tool | Purpose | Cost |
|---|---|---|
| Expo (managed workflow) | Build + run React Native | Free |
| expo-sqlite | Local database | Free |
| Google Gemini 1.5 Flash | AI nudges | Free tier (60 req/min) |
| Google AI Studio | Gemini API keys | Free |
| expo-notifications | Push notifications | Free |
| Victory Native XL | Charts | Free, MIT |
| AsyncStorage | Local preferences | Free |
| GitHub | Version control | Free |
| Expo Go app | Live testing on phone | Free |
| EAS Build (free tier) | Build APK/IPA | Free (limited builds/month) |

**Monthly cost to run FlowWise: ₹0**

---

## 8. Folder Naming Conventions

- Screens: `PascalCase.tsx` inside `app/` directories
- Components: `PascalCase.tsx` inside `components/`
- Stores: `useCamelCase.ts` (Zustand convention)
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- DB queries: `camelCase.ts` inside `db/queries/`
- Constants: `SCREAMING_SNAKE_CASE` for values, `PascalCase` for objects

---

## 9. Git Workflow

```
main          — stable, tested code only
dev           — active development
feature/xxx   — individual features (e.g. feature/add-expense)
fix/xxx       — bug fixes
```

Commit message format:
```
feat: add expense success screen
fix: budget percentage calculation off by one
style: update home screen balance card colours
refactor: extract transaction formatting to utils
```

---

## 10. Environment Variables (.env)

```bash
# Gemini AI (get from aistudio.google.com)
GEMINI_KEY_1=your_key_here
GEMINI_KEY_2=your_backup_key_here

# App config
EXPO_PUBLIC_APP_NAME=FlowWise
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_API_URL=http://localhost:8000  # FastAPI backend

# Feature flags
EXPO_PUBLIC_ENABLE_AI_NUDGES=true
EXPO_PUBLIC_ENABLE_BANK_SYNC=false  # V2 feature, keep false
```

All `EXPO_PUBLIC_` prefixed vars are accessible in React Native code via `process.env.EXPO_PUBLIC_*`.
Sensitive keys (Gemini) stay backend-only — never expose in client code.
