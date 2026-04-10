# UPDATE.md — FlowWise v1.1 Agent Instructions

> Read AGENT.md and PLAN.md first. This file extends them — do not contradict them.
> Every decision here is final. Do not improvise. Do not add features not listed.
> Complete tasks in the ORDER they are listed. Do not skip ahead.

---

## CONTEXT — What exists, what's broken, what we're adding

### What's working in v1.0
- Expo Router navigation shell (auth + tabs)
- SQLite DB initialised (version 1, all tables exist)
- Home screen: balance card, budget bar, recent transactions
- Gemini AI nudges (fixed, working with 2.5 Flash)
- Custom SVG tab bar (Home, Spend, Goals, Insights)

### What's broken / missing
1. No authentication — anyone who opens app goes straight to home
2. No profile icon on home screen header
3. Profile screen exists but is incomplete / doesn't match design
4. App not shareable — only runs locally in Expo Go
5. Several UX gaps (listed in Task 5 below)

---

## TASK 1 — Authentication with Clerk

### Decision
Use **Clerk** for auth. Free tier is generous (10,000 MAU free). It handles:
- Email + password sign up / sign in
- Google OAuth (one tap sign in)
- Session management
- Secure token storage

### Why Clerk over Firebase Auth / Supabase Auth
- Clerk has a first-class Expo SDK (`@clerk/clerk-expo`)
- Handles token refresh, session persistence, and secure storage automatically
- Pre-built UI hooks — we write the screens ourselves using Clerk hooks
- Free tier is enough for a portfolio/recruiter demo

### DO NOT
- Do not use Firebase Auth
- Do not use Supabase Auth
- Do not build custom JWT auth
- Do not store passwords anywhere in the app
- Do not skip auth — every screen behind tabs must require a signed-in user

### Install
```bash
npx expo install @clerk/clerk-expo expo-secure-store
```

Clerk uses `expo-secure-store` internally for token storage. It is already installed.

### Environment variables — add to .env
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
```

Get this from dashboard.clerk.com → Create application → Expo → copy publishable key.

### Implementation steps

#### Step 1A — Wrap root layout with ClerkProvider

In `app/_layout.tsx`, wrap everything with ClerkProvider:

```typescript
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

const tokenCache = {
  async getToken(key: string) {
    try { return await SecureStore.getItemAsync(key); } catch { return null; }
  },
  async saveToken(key: string, value: string) {
    try { await SecureStore.setItemAsync(key, value); } catch {}
  },
  async clearToken(key: string) {
    try { await SecureStore.deleteItemAsync(key); } catch {}
  },
};

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        {/* existing font loading + DB init + navigator */}
      </ClerkLoaded>
    </ClerkProvider>
  );
}
```

#### Step 1B — Auth gate using Clerk's useAuth hook

Replace the current `hasCompletedOnboarding` gate with Clerk's `isSignedIn`:

```typescript
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

// Inside root layout, after ClerkLoaded:
const { isSignedIn, isLoaded } = useAuth();

if (!isLoaded) return <LoadingScreen />;
if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;
// else show tabs
```

Keep `hasCompletedOnboarding` in `useAuthStore` for tracking onboarding completion
SEPARATE from auth. User can be signed in but not have completed onboarding.

Flow:
```
App opens
  → Clerk not loaded → show splash
  → Clerk loaded, not signed in → /(auth)/sign-in
  → Clerk loaded, signed in, onboarding incomplete → /(auth)/profile (onboarding)
  → Clerk loaded, signed in, onboarding complete → /(tabs)
```

#### Step 1C — Sign In screen (app/(auth)/sign-in.tsx)

Design spec:
- Full screen dark background (#0D0F14)
- FlowWise logo + "Money for real life" tagline at top (centered)
- Email input (styled to match design system — dark surface, mint focus border)
- Password input (with show/hide toggle)
- "Sign In" primary button (full width, mint)
- Divider: "or continue with"
- "Continue with Google" button (surface02 background, white text, Google icon SVG)
- "Don't have an account? Sign up" text link at bottom → sign-up.tsx

Clerk hooks to use:
```typescript
import { useSignIn } from '@clerk/clerk-expo';
const { signIn, setActive, isLoaded } = useSignIn();

// On submit:
const result = await signIn.create({ identifier: email, password });
if (result.status === 'complete') {
  await setActive({ session: result.createdSessionId });
  router.replace('/(tabs)');
}
```

Error handling:
- Show inline error below the input that failed
- "Invalid email or password" — never reveal which one
- Loading state on button while request is in flight

#### Step 1D — Sign Up screen (app/(auth)/sign-up.tsx)

Fields:
- Full name (stored in Clerk profile + local SQLite profile table)
- Email
- Password (min 8 chars)
- "Create Account" primary button
- "Already have an account? Sign in" link

After successful sign up → go to onboarding profile screen (not tabs).

```typescript
import { useSignUp } from '@clerk/clerk-expo';
const { signUp, setActive, isLoaded } = useSignUp();

const result = await signUp.create({ emailAddress: email, password });
await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
// → go to verification screen
```

#### Step 1E — Email verification screen (app/(auth)/verify.tsx)

- 6-digit OTP input (single row of 6 boxes, mint border on focused box)
- "Verify Email" button
- "Resend code" text link (with 60 second cooldown)

```typescript
const result = await signUp.attemptEmailAddressVerification({ code: otp });
if (result.status === 'complete') {
  await setActive({ session: result.createdSessionId });
  router.replace('/(auth)/profile'); // → onboarding
}
```

#### Step 1F — Google OAuth (optional but impressive for recruiters)

```typescript
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

const onGooglePress = async () => {
  const { createdSessionId, setActive } = await startOAuthFlow({
    redirectUrl: Linking.createURL('/(tabs)', { scheme: 'flowwise' }),
  });
  if (createdSessionId) await setActive({ session: createdSessionId });
};
```

Add to .env:
```
# In Clerk dashboard → Social Connections → Google → enable
# No extra env var needed — Clerk handles OAuth redirect
```

#### Step 1G — Sign Out

In profile screen, sign out button:
```typescript
import { useClerk } from '@clerk/clerk-expo';
const { signOut } = useClerk();

await signOut();
router.replace('/(auth)/sign-in');
```

---

## TASK 2 — Profile Icon on Home Screen Header

### Current state
Header shows: "Hi there 👋" on left, bell icon on right.

### Target state
Header shows: "Hi there 👋" on left, [profile avatar] + [bell icon] on right (in a row).

### Implementation

In the home screen header component, add a profile avatar circle to the left of the bell:

```typescript
// HomeHeader component
<View style={styles.header}>
  <View>
    <Text style={styles.greeting}>{greeting}</Text>
    <Text style={styles.name}>{userName}</Text>
  </View>
  <View style={styles.headerRight}>
    {/* Profile avatar — tappable, navigates to profile */}
    <TouchableOpacity
      onPress={() => router.push('/profile')}
      style={styles.avatarBtn}
    >
      {user?.imageUrl ? (
        <Image source={{ uri: user.imageUrl }} style={styles.avatarImg} />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarInitial}>
            {userName?.charAt(0)?.toUpperCase() ?? 'A'}
          </Text>
        </View>
      )}
    </TouchableOpacity>

    {/* Bell icon */}
    <TouchableOpacity style={styles.bellBtn} onPress={onBellPress}>
      <BellIcon color={COLORS.textSecondary} size={20} />
      {hasUnreadNotifications && <View style={styles.notifDot} />}
    </TouchableOpacity>
  </View>
</View>
```

Styles:
```typescript
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: SPACING.screenHorizontal,
  paddingTop: SPACING.screenTop,
  paddingBottom: SPACING.lg,
},
headerRight: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: SPACING.sm,
},
avatarBtn: {
  width: 38,
  height: 38,
  borderRadius: 19,
  overflow: 'hidden',
},
avatarImg: {
  width: 38,
  height: 38,
  borderRadius: 19,
},
avatarFallback: {
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: COLORS.primaryBg,
  borderWidth: 1,
  borderColor: COLORS.primaryBorder,
  alignItems: 'center',
  justifyContent: 'center',
},
avatarInitial: {
  fontFamily: FONTS.display,
  fontSize: FONT_SIZE.bodySmall,
  color: COLORS.primary,
},
bellBtn: {
  width: 38,
  height: 38,
  borderRadius: 12,
  backgroundColor: COLORS.surfaceElevated,
  borderWidth: 0.5,
  borderColor: COLORS.borderEmphasized,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
},
notifDot: {
  position: 'absolute',
  top: 8,
  right: 8,
  width: 7,
  height: 7,
  borderRadius: 3.5,
  backgroundColor: COLORS.danger,
  borderWidth: 1.5,
  borderColor: COLORS.background,
},
```

Get user data from Clerk:
```typescript
import { useUser } from '@clerk/clerk-expo';
const { user } = useUser();
const userName = user?.firstName ?? user?.fullName ?? 'there';
```

---

## TASK 3 — Make App Shareable for Recruiters

### Options (choose based on time)

#### Option A — Expo Go shareable link (fastest, 10 minutes)
Anyone with Expo Go app installed can scan a QR code or tap a link.

```bash
npx expo start --tunnel
```

This generates a URL like `exp://u.expo.dev/xxxx`. Share this link.
Recruiter installs Expo Go → opens link → sees your app.

LIMITATION: Requires recruiter to install Expo Go first. Not ideal.

#### Option B — EAS Build (Internal Distribution) — RECOMMENDED
Generates a real .ipa (iOS) or .apk (Android) that anyone can install without Expo Go.

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure
```

In eas.json (auto-generated, modify):
```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    }
  }
}
```

Build Android APK (free, no Apple dev account needed):
```bash
eas build --profile preview --platform android
```

This gives you a QR code link. Anyone with an Android phone can scan → install → use.
Build takes ~10-15 minutes on EAS servers. Free tier = 30 builds/month.

For iOS:
- Requires Apple Developer account ($99/year) for real device
- OR use simulator build: `eas build --profile preview --platform ios --local`
- Simulator build runs in Xcode only

#### Option C — Expo Snack (web preview, zero install)
Upload code to snack.expo.dev — runs in browser or Expo Go.
Good for showing basic flows but doesn't support SQLite or secure-store.
NOT recommended for FlowWise because of SQLite dependency.

### RECOMMENDATION FOR RECRUITERS
Do Option A first (immediate, works today) AND Option B for Android APK.
Android APK is the cleanest recruiter experience:
- Send them the EAS build link
- They tap → download → install (allow unknown sources on Android)
- Full native app, no Expo Go needed

### Clerk setup for shareable build
In Clerk dashboard → Allowed Redirect URLs → add:
```
flowwise://
exp+flowwise://
```

---

## TASK 4 — Full Profile Screen (matching design)

### Design reference
The designed profile screen has these sections. Build ALL of them.

### Screen: app/(tabs)/profile.tsx (add as 5th tab) OR app/profile/index.tsx (push screen)

DECISION: Make profile accessible from the home header avatar (push screen, not a tab).
This keeps the 4-tab nav clean (Home, Spend, Goals, Insights).

### Screen structure

#### Section A — Profile Header
```
[Avatar — 72px circle, gradient border mint→blue]
[Name — Syne 700 20px]
[Email · City — DM Sans 12px muted]
[Badge — "Pro Member" amber pill]  ← decorative for now, V2 feature
```

Avatar logic:
- If Clerk has profile image → show it
- If no image → show initials in mint gradient circle
- Tap avatar → expo-image-picker → upload to Clerk via user.setProfileImage()

```typescript
import { useUser } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';

const { user } = useUser();

const pickAndUploadAvatar = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
  if (!result.canceled) {
    const file = {
      uri: result.assets[0].uri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    };
    await user?.setProfileImage({ file });
  }
};
```

#### Section B — Stats Row (3 cards)
```
[Total Saved ₹X]  [Active Goals X]  [Mood Score X]
```
Pull data from:
- Total Saved: `useBudgetStore` → income - totalSpent
- Active Goals: `useGoalStore` → count of active goals
- Mood Score: `useMoodStore` → latest week's score

Style: 3 equal cards, surface01 bg, mint/blue/amber colored values, muted labels.

#### Section C — Account Settings
Card group with rows:

```
Personal Info         →    (name, email — edit inline)
Linked Accounts       →    (shows bank name from onboarding)
Notifications         ⟨toggle⟩
```

Personal Info row → opens a modal/sheet with editable name field.
Update name via: `await user.update({ firstName: newName })`

#### Section D — Preferences
```
Dark Mode             ⟨toggle⟩  (always on for now — FEATURES.darkModeToggle is false)
Currency              →  (shows INR — tappable but shows "Coming soon")
```

#### Section E — Sign Out
Full-width coral danger button at bottom:
```
[🚪 Sign Out]
```

```typescript
import { useClerk } from '@clerk/clerk-expo';
const { signOut } = useClerk();

const handleSignOut = async () => {
  await signOut();
  // Clear local stores
  useAuthStore.getState().reset();
  useTransactionStore.getState().reset();
  useBudgetStore.getState().reset();
  useGoalStore.getState().reset();
  useMoodStore.getState().reset();
  router.replace('/(auth)/sign-in');
};
```

Add a `reset()` action to every Zustand store that clears all state.
This prevents data leakage between user sessions.

#### Section F — App Version (footer)
Below sign out, small centered muted text:
```
FlowWise v1.0.0 · Made with ♥ in Bengaluru
```

Pull version from: `import { APP } from '@/constants'; APP.version`

### Full profile screen DO NOTs
- Do NOT show Clerk userId or session token anywhere in the UI
- Do NOT allow editing email directly in app — Clerk handles email change via their dashboard
- Do NOT use a FlatList for settings rows — use plain ScrollView + View (too few items for FlatList)

---

## TASK 5 — Additional Features for This User Base

These are small, high-impact additions that make FlowWise feel real to recruiters.
Build them in this order after Tasks 1-4.

### 5A — Salary Day Reminder
**What:** A banner on the home screen between the 25th and end of month saying:
"Salary coming soon — set next month's budget?"

```typescript
const today = new Date().getDate();
const showSalaryBanner = today >= 25;
```

Shows above Quick Actions. Tappable → goes to /profile/budget-edit.
Dismiss button (×) stores dismissed date in AsyncStorage. Shows again next month.

### 5B — Spending Streak
**What:** A small streak counter on the home screen below the budget bar.
"🔥 3-day streak — logging every day!"

Logic:
- Check transactions table for entries on consecutive days ending today
- If user has logged at least 1 transaction per day for N consecutive days → show streak
- Store streak count in AsyncStorage, update on every new transaction

```typescript
const getStreak = async (): Promise<number> => {
  // Get distinct dates of transactions, sorted desc
  // Count how many consecutive days from today backwards
};
```

Display: small chip below budget indicator. Mint background, flame emoji + count.
If streak is 0 → don't show (no shame).

### 5C — Quick Stats on Spend Screen
**What:** 3 stat cards above the donut chart:
- Avg daily spend (this month)
- Biggest single transaction (this month)
- Most used category (this month)

Pull from existing transactions query. No new DB tables needed.

### 5D — Empty States
**What:** Every screen must have a proper empty state when there's no data.
Currently if there are no transactions, the home screen shows a blank card.

Empty state designs:
- Home (no transactions): illustration placeholder + "Add your first expense to get started" + "Add Expense" button
- Spend (no data): "Nothing to analyse yet" + "Start tracking to see your spending breakdown"
- Goals (no goals): "No goals yet" + "What are you saving for?" + "Set a Goal" button
- Insights (no mood data): "Complete your first week to see your Money Mood Score"

Each empty state should:
- Use a simple SVG illustration (build inline — no image assets)
- Have a headline in Syne font
- Have 1 line of muted body text
- Have 1 CTA button if an action makes sense

### 5E — Haptic Feedback on Key Actions
**What:** Light haptic on expense submit, goal completion, check-in submit.

```bash
npx expo install expo-haptics
```

```typescript
import * as Haptics from 'expo-haptics';

// On expense success:
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// On button press:
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
```

Add to:
- Add Expense → success
- Goal deposit made
- Check-in submitted
- Sign in success

### 5F — Spending Limit Warning Modal
**What:** When user adds an expense that will push them over 80% of monthly budget,
show a bottom sheet warning BEFORE confirming:

```
⚠️ Heads up
This will put you at 85% of your April budget.
₹2,400 left for the rest of the month.

[Add Anyway]  [Cancel]
```

Show only once per day (store last shown date in AsyncStorage).

Use `@gorhom/bottom-sheet` for the sheet:
```bash
npx expo install @gorhom/bottom-sheet
```

### 5G — Transaction Search (already in All Transactions screen)
**What:** Ensure the search bar in /transaction/all.tsx actually filters.

```typescript
const filtered = transactions.filter(t =>
  t.category.toLowerCase().includes(query.toLowerCase()) ||
  (t.note ?? '').toLowerCase().includes(query.toLowerCase())
);
```

Debounce the search input by 300ms to avoid re-filtering on every keypress.

---

## VERIFICATION CHECKLIST — v1.1

Run through ALL of these before marking v1.1 complete:

### Auth (Task 1)
- [ ] Fresh install → sign-in screen appears (not tabs)
- [ ] Sign up with email → verification email received → can verify
- [ ] Sign in with email → goes to home tab
- [ ] Google OAuth works → goes to home tab
- [ ] Sign out → goes to sign-in screen
- [ ] Reopen app after sign in → stays signed in (session persists)
- [ ] All tab screens redirect to sign-in if not authenticated

### Profile Header (Task 2)
- [ ] Avatar circle visible next to bell on home screen
- [ ] Avatar shows initials if no Clerk profile image
- [ ] Avatar shows Clerk profile photo if set
- [ ] Tapping avatar navigates to /profile

### Shareability (Task 3)
- [ ] `npx expo start --tunnel` generates shareable link
- [ ] Android APK builds successfully via `eas build --profile preview --platform android`
- [ ] APK installs and runs on Android device without Expo Go
- [ ] Clerk auth works in production build (not just dev)

### Profile Screen (Task 4)
- [ ] All 6 sections render: header, stats row, account, preferences, sign out, version
- [ ] Stats show real data (not hardcoded)
- [ ] Tapping avatar opens image picker
- [ ] Image uploads to Clerk profile
- [ ] Sign out clears ALL local store state
- [ ] After sign out, signing in as different user shows fresh data

### Additional Features (Task 5)
- [ ] 5A: Salary banner shows on day 25+ of month
- [ ] 5B: Streak counter shows if 2+ consecutive days of transactions
- [ ] 5C: 3 stat cards appear above donut chart on Spend screen
- [ ] 5D: Empty states show on Home, Spend, Goals, Insights with no data
- [ ] 5E: Haptics fire on expense success and check-in submit
- [ ] 5F: Warning modal appears when expense would push budget over 80%
- [ ] 5G: Search in All Transactions filters results correctly

### TypeScript
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] No `any` types introduced

### Performance
- [ ] Home screen loads in < 1 second on device
- [ ] No white flash between screens
- [ ] Keyboard does not push content off screen on sign-in form

---

## PACKAGE ADDITIONS SUMMARY

Run this single command for all new dependencies:

```bash
npx expo install @clerk/clerk-expo expo-web-browser expo-image-picker @gorhom/bottom-sheet expo-haptics react-native-gesture-handler react-native-reanimated
```

Note: `react-native-reanimated` and `react-native-gesture-handler` are required by
`@gorhom/bottom-sheet`. If already installed, `npx expo install` will skip them.

Add to `babel.config.js` plugins (required for reanimated):
```javascript
plugins: ['react-native-reanimated/plugin']
```

---

## DO NOTs — Global for This Update

- Do NOT use any UI library (no NativeBase, no Gluestack, no Paper)
- Do NOT add a 5th tab to the navigation — profile is a push screen
- Do NOT use Clerk's pre-built UI components — build all screens manually
- Do NOT store Clerk session tokens in SQLite or AsyncStorage manually — Clerk handles this
- Do NOT call Clerk APIs directly with fetch — use Clerk SDK hooks only
- Do NOT show loading spinners for > 2 seconds — add timeout fallback messages
- Do NOT break existing functionality — test existing screens after each task
- Do NOT commit .env file — it contains the Clerk publishable key

---

## FILE CHANGES SUMMARY

```
NEW:
  app/(auth)/sign-in.tsx
  app/(auth)/sign-up.tsx
  app/(auth)/verify.tsx
  app/profile/index.tsx         ← full profile screen
  components/ui/EmptyState.tsx  ← reusable empty state component
  components/ui/BottomSheet.tsx ← warning modal wrapper
  components/home/SalaryBanner.tsx
  components/home/StreakChip.tsx

MODIFIED:
  app/_layout.tsx               ← add ClerkProvider
  app/(auth)/_layout.tsx        ← update auth flow routing
  app/(tabs)/index.tsx          ← add profile avatar to header, streak, salary banner
  app/(tabs)/spend.tsx          ← add 3 stat cards above chart
  app/(tabs)/goals.tsx          ← add empty state
  app/(tabs)/insights.tsx       ← add empty state
  app/expense/add.tsx           ← add 80% budget warning
  app/expense/success.tsx       ← add haptics
  app/transaction/all.tsx       ← wire up search filter
  store/useAuthStore.ts         ← add reset() action
  store/useTransactionStore.ts  ← add reset() action
  store/useBudgetStore.ts       ← add reset() action
  store/useGoalStore.ts         ← add reset() action
  store/useMoodStore.ts         ← add reset() action
  constants.js                  ← update APP.version to 1.1.0

UNCHANGED (do not touch):
  db/schema.ts
  db/migrations.ts
  services/gemini.ts
  utils/currency.ts
  components/ui/FlowWiseTabBar.tsx
```