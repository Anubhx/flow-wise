/**
 * constants.js — FlowWise Design System Tokens
 *
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL DESIGN VALUES.
 *
 * Rules:
 * - Never hardcode a color, font size, spacing, or radius in a component.
 * - Always import from this file.
 * - If you change a value here, it updates everywhere in the app.
 * - All monetary amounts in the app are stored in PAISE. Use CURRENCY utils to display.
 *
 * Usage:
 *   import { COLORS, FONTS, SPACING, RADIUS } from '@/constants';
 */

// ─────────────────────────────────────────────
// APP INFO
// ─────────────────────────────────────────────
export const APP = {
  name: 'FlowWise',
  tagline: 'Money for real life',
  version: '1.0.0',
  currency: 'INR',
  currencySymbol: '₹',
  locale: 'en-IN',
  supportEmail: 'support@flowwise.app',
};

// ─────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────

/**
 * Base palette — raw hex values.
 * Use COLORS semantic aliases in components, not these directly.
 */
const PALETTE = {
  // Brand
  mint: '#2AFFD6',
  amber: '#FFB547',
  coral: '#FF6B6B',
  blue: '#5B9BFF',
  purple: '#A78BFF',
  slate: '#8B8FA8',

  // Surfaces (dark theme — OLED safe)
  surface00: '#0D0F14',  // Page background (pure base)
  surface01: '#161920',  // Card background
  surface02: '#1E222C',  // Input background, nested card
  surface03: '#252A36',  // Hover state, pressed state bg
  surface04: '#2E3444',  // Active pressed state

  // Text
  text100: '#F0F2F7',    // Primary text (white)
  text55: '#8B8FA8',     // Secondary text (muted)
  text34: '#555A70',     // Tertiary text (hints)
  text22: '#353848',     // Disabled text

  // Borders
  border07: 'rgba(255,255,255,0.07)',   // Default border
  border12: 'rgba(255,255,255,0.12)',   // Emphasized border
  border18: 'rgba(255,255,255,0.18)',   // Strong border

  // Pure
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
};

/**
 * Semantic color aliases — USE THESE in components.
 * Named by meaning, not by visual appearance.
 */
export const COLORS = {
  // Backgrounds
  background: PALETTE.surface00,
  surface: PALETTE.surface01,
  surfaceElevated: PALETTE.surface02,
  surfaceHover: PALETTE.surface03,
  surfacePressed: PALETTE.surface04,

  // Text
  textPrimary: PALETTE.text100,
  textSecondary: PALETTE.text55,
  textTertiary: PALETTE.text34,
  textDisabled: PALETTE.text22,

  // Borders
  border: PALETTE.border07,
  borderEmphasized: PALETTE.border12,
  borderStrong: PALETTE.border18,

  // Brand semantic
  primary: PALETTE.mint,          // Primary CTA, positive values, income
  warning: PALETTE.amber,         // Budget alerts, caution states
  danger: PALETTE.coral,          // Expenses, errors, delete actions
  info: PALETTE.blue,             // Goals, insights, informational
  special: PALETTE.purple,        // Money Mood, premium features
  neutral: PALETTE.slate,         // Labels, disabled, neutral states

  // Tinted backgrounds (for badges, chips, cards)
  primaryBg: 'rgba(42,255,214,0.10)',
  primaryBorder: 'rgba(42,255,214,0.22)',
  warningBg: 'rgba(255,181,71,0.10)',
  warningBorder: 'rgba(255,181,71,0.22)',
  dangerBg: 'rgba(255,107,107,0.10)',
  dangerBorder: 'rgba(255,107,107,0.22)',
  infoBg: 'rgba(91,155,255,0.10)',
  infoBorder: 'rgba(91,155,255,0.22)',
  specialBg: 'rgba(167,139,255,0.10)',
  specialBorder: 'rgba(167,139,255,0.22)',

  // Category-specific colors (used in transaction icons and charts)
  category: {
    housing: PALETTE.amber,
    food: PALETTE.blue,
    transport: PALETTE.coral,
    leisure: PALETTE.purple,
    health: PALETTE.coral,
    learning: PALETTE.blue,
    groceries: PALETTE.mint,
    salary: PALETTE.mint,
    fuel: PALETTE.amber,
    bills: PALETTE.amber,
    savings: PALETTE.mint,
    other: PALETTE.slate,
  },

  // Category tinted backgrounds
  categoryBg: {
    housing: 'rgba(255,181,71,0.10)',
    food: 'rgba(91,155,255,0.10)',
    transport: 'rgba(255,107,107,0.10)',
    leisure: 'rgba(167,139,255,0.10)',
    health: 'rgba(255,107,107,0.10)',
    learning: 'rgba(91,155,255,0.10)',
    groceries: 'rgba(42,255,214,0.10)',
    salary: 'rgba(42,255,214,0.10)',
    fuel: 'rgba(255,181,71,0.10)',
    bills: 'rgba(255,181,71,0.10)',
    savings: 'rgba(42,255,214,0.10)',
    other: 'rgba(139,143,168,0.10)',
  },

  // Chart colors (used in donut and bar charts)
  chart: [
    PALETTE.amber,    // Housing — always first (usually largest)
    PALETTE.blue,     // Food
    PALETTE.mint,     // Transport
    PALETTE.coral,    // Leisure
    PALETTE.purple,   // Health
    PALETTE.slate,    // Other
  ],

  // Mood colours (for Money Mood day indicators)
  mood: {
    great: PALETTE.mint,          // 😊 Great day
    good: PALETTE.blue,           // 😊 Good day
    okay: PALETTE.amber,          // 😐 Okay day
    rough: PALETTE.coral,         // 😬 Rough day
    greatBg: 'rgba(42,255,214,0.15)',
    goodBg: 'rgba(91,155,255,0.15)',
    okayBg: 'rgba(255,181,71,0.15)',
    roughBg: 'rgba(255,107,107,0.15)',
  },

  // Status badge colors
  status: {
    onTrack: PALETTE.mint,
    onTrackBg: 'rgba(42,255,214,0.10)',
    onTrackBorder: 'rgba(42,255,214,0.22)',
    inProgress: PALETTE.blue,
    inProgressBg: 'rgba(91,155,255,0.10)',
    inProgressBorder: 'rgba(91,155,255,0.22)',
    priority: PALETTE.amber,
    priorityBg: 'rgba(255,181,71,0.10)',
    priorityBorder: 'rgba(255,181,71,0.22)',
    atRisk: PALETTE.coral,
    atRiskBg: 'rgba(255,107,107,0.10)',
    atRiskBorder: 'rgba(255,107,107,0.22)',
  },

  // Navigation tab
  tabActive: PALETTE.mint,
  tabActiveBg: 'rgba(42,255,214,0.10)',
  tabInactive: PALETTE.text34,
};

// ─────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────

/**
 * Font families — loaded via expo-google-fonts
 * Display: Syne — for headings, numbers, high-impact text
 * Body: DM Sans — for all body text, labels, descriptions
 */
export const FONTS = {
  display: 'Syne_700Bold',          // Headlines, large numbers
  displayBold: 'Syne_800ExtraBold', // Hero numbers, app name
  displayMedium: 'Syne_600SemiBold',// Sub-headings
  body: 'DMSans_400Regular',        // Body text, descriptions
  bodyMedium: 'DMSans_500Medium',   // Emphasized body, labels
  mono: 'SpaceMono_400Regular',     // UPI refs, hex codes, monospace data
};

/**
 * Font sizes — 8-step scale
 * All values in pixels for React Native StyleSheet
 */
export const FONT_SIZE = {
  display: 36,   // Hero numbers (balance, large amounts)
  h1: 28,        // Page titles, onboarding headlines
  h2: 22,        // Section titles, screen headings
  h3: 18,        // Sub-section headings, card titles
  h4: 15,        // Card sub-headings, emphasized text
  body: 14,      // Default body text
  bodySmall: 13, // Secondary body, list items
  caption: 11,   // Timestamps, meta info
  label: 10,     // Section labels, badges, ALL CAPS tags
};

/**
 * Line heights — paired with font sizes
 */
export const LINE_HEIGHT = {
  display: 40,
  h1: 34,
  h2: 28,
  h3: 24,
  h4: 20,
  body: 22,
  bodySmall: 20,
  caption: 16,
  label: 14,
};

/**
 * Letter spacing — for labels and tags
 */
export const LETTER_SPACING = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1.0,
  widest: 1.5,  // Used for ALL CAPS labels
};

// ─────────────────────────────────────────────
// SPACING — 4pt base grid
// ─────────────────────────────────────────────

/**
 * All spacing must be a multiple of 4.
 * Never use raw pixel values for margins/padding in components.
 */
export const SPACING = {
  xxs: 4,    // Micro — icon-to-label gap
  xs: 8,     // Extra small — internal component gap
  sm: 12,    // Small — tight row gaps
  md: 16,    // Base — standard component padding
  lg: 20,    // Large — screen horizontal padding
  xl: 24,    // Extra large — section spacing
  xxl: 32,   // 2X large — major section gaps
  xxxl: 40,  // 3X large — screen vertical padding top
  huge: 48,  // Status bar + header clearance
  massive: 56, // Large decorative spacing

  // Semantic spacing aliases
  screenHorizontal: 20,  // Left/right padding for all screens
  screenTop: 44,         // Top padding (below status bar)
  cardPadding: 18,       // Internal card padding
  rowGap: 10,            // Gap between list rows
  sectionGap: 24,        // Gap between major sections
  componentGap: 12,      // Gap between related components
  iconToText: 10,        // Gap between icon and label
  chipPadding: 9,        // Internal chip horizontal padding
};

// ─────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────

export const RADIUS = {
  xs: 4,    // Tags, small badges
  sm: 8,    // Small buttons
  md: 12,   // Inputs, standard components
  lg: 14,   // Chips, medium buttons
  xl: 16,   // Large buttons, CTA
  xxl: 20,  // Cards
  xxxl: 24, // Hero cards, onboarding cards
  card: 20, // Standard card radius
  hero: 24, // Hero/feature card radius
  pill: 999, // Fully rounded (badges, pills)
  circle: 999, // Avatars, icon circles
};

// ─────────────────────────────────────────────
// SHADOWS (for iOS — Android uses elevation)
// ─────────────────────────────────────────────

export const SHADOWS = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
  },
};

// ─────────────────────────────────────────────
// ANIMATION / MOTION
// ─────────────────────────────────────────────

export const ANIMATION = {
  // Durations in milliseconds
  duration: {
    micro: 120,       // Button press, toggle, chip select
    reveal: 240,      // Card appear, badge show, toast
    screen: 320,      // Screen transition
    data: 600,        // Progress bar fill, chart draw
    ambient: 3000,    // Pulse animations, breathing
  },

  // Easing curves
  easing: {
    default: 'ease-out',
    screen: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    data: 'ease-in-out',
    spring: { damping: 15, stiffness: 150 },
  },

  // Stagger delay for list animations
  stagger: 80, // ms per item
};

// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────

export const CATEGORIES = [
  { id: 'housing',    label: 'Housing',   icon: '🏠', color: COLORS.category.housing,   bgColor: COLORS.categoryBg.housing   },
  { id: 'food',       label: 'Food',      icon: '🍱', color: COLORS.category.food,      bgColor: COLORS.categoryBg.food      },
  { id: 'transport',  label: 'Transport', icon: '🚌', color: COLORS.category.transport,  bgColor: COLORS.categoryBg.transport  },
  { id: 'leisure',    label: 'Leisure',   icon: '🎮', color: COLORS.category.leisure,   bgColor: COLORS.categoryBg.leisure   },
  { id: 'health',     label: 'Health',    icon: '💊', color: COLORS.category.health,    bgColor: COLORS.categoryBg.health    },
  { id: 'learning',   label: 'Learning',  icon: '📚', color: COLORS.category.learning,  bgColor: COLORS.categoryBg.learning  },
  { id: 'groceries',  label: 'Groceries', icon: '🛒', color: COLORS.category.groceries, bgColor: COLORS.categoryBg.groceries },
  { id: 'salary',     label: 'Salary',    icon: '💼', color: COLORS.category.salary,    bgColor: COLORS.categoryBg.salary    },
  { id: 'fuel',       label: 'Fuel',      icon: '⛽', color: COLORS.category.fuel,      bgColor: COLORS.categoryBg.fuel      },
  { id: 'bills',      label: 'Bills',     icon: '📄', color: COLORS.category.bills,     bgColor: COLORS.categoryBg.bills     },
  { id: 'savings',    label: 'Savings',   icon: '🐷', color: COLORS.category.savings,   bgColor: COLORS.categoryBg.savings   },
  { id: 'other',      label: 'Other',     icon: '📦', color: COLORS.category.other,     bgColor: COLORS.categoryBg.other     },
];

// Income categories (shown in income flow)
export const INCOME_CATEGORIES = ['salary', 'freelance', 'gift', 'other'];

// Expense categories (shown in add expense)
export const EXPENSE_CATEGORIES = CATEGORIES.filter(c =>
  !['salary', 'savings'].includes(c.id)
);

// ─────────────────────────────────────────────
// BUDGET
// ─────────────────────────────────────────────

export const BUDGET = {
  // Suggested allocation percentages (of monthly income)
  suggestedAllocation: {
    housing: 0.30,    // 30%
    food: 0.15,       // 15%
    transport: 0.10,  // 10%
    leisure: 0.10,    // 10%
    health: 0.05,     // 5%
    savings: 0.30,    // 30%
  },

  // Alert thresholds
  alertThresholds: {
    caution: 0.50,    // 50% — show amber indicator
    warning: 0.75,    // 75% — send notification
    danger: 1.00,     // 100% — send urgent notification
  },

  // Status labels based on usage
  statusLabel: {
    onTrack: 'On track',
    watchOut: 'Watch out',
    overBudget: 'Over budget',
  },

  // Default monthly budget (used if user skips budget setup)
  defaultMonthlyBudget: 2000000, // ₹20,000 in paise

  // Max single transaction amount (₹10 lakh)
  maxTransactionAmount: 100000000, // in paise
};

// ─────────────────────────────────────────────
// MONEY MOOD SCORE
// ─────────────────────────────────────────────

export const MOOD = {
  // Score calculation weights (must sum to 100)
  weights: {
    daysInBudget: 70,   // 10 points per day under budget (7 days max)
    goalDeposit: 10,    // Bonus for making any goal deposit this week
    noSpikeDay: 10,     // Bonus for no day being > 2x daily average
    selfReport: 10,     // User's own rating adjusts ±10
  },

  // Self-report options
  selfReportOptions: [
    { id: 'rough', label: 'Rough',  emoji: '😫', scoreModifier: -10 },
    { id: 'okay',  label: 'Ok-ish', emoji: '😐', scoreModifier: 0   },
    { id: 'good',  label: 'Good',   emoji: '😊', scoreModifier: 5   },
    { id: 'great', label: 'Great',  emoji: '🥳', scoreModifier: 10  },
  ],

  // Score ranges and labels
  scoreRanges: [
    { min: 0,  max: 39, label: 'Needs attention', color: COLORS.danger   },
    { min: 40, max: 59, label: 'Getting there',   color: COLORS.warning  },
    { min: 60, max: 79, label: 'Doing well',      color: COLORS.info     },
    { min: 80, max: 100,label: 'Excellent',        color: COLORS.primary  },
  ],

  // Spike day definition
  spikeDayMultiplier: 2.0, // A day is a "spike" if spend > 2x daily average

  // Check-in day (0 = Sunday, 1 = Monday...)
  checkInDay: 0, // Sunday
};

// ─────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────

export const ONBOARDING = {
  totalSteps: 3,      // Profile, Bank, Budget (not counting welcome/features/done)
  steps: [
    { id: 'profile', label: 'Profile', stepNumber: 1 },
    { id: 'bank',    label: 'Bank',    stepNumber: 2 },
    { id: 'budget',  label: 'Budget',  stepNumber: 3 },
  ],
  banks: [
    { id: 'sbi',   name: 'SBI',   fullName: 'State Bank of India', emoji: '🏦' },
    { id: 'hdfc',  name: 'HDFC',  fullName: 'HDFC Bank',           emoji: '🔵' },
    { id: 'icici', name: 'ICICI', fullName: 'ICICI Bank',          emoji: '🟡' },
    { id: 'axis',  name: 'Axis',  fullName: 'Axis Bank',           emoji: '🔴' },
    { id: 'kotak', name: 'Kotak', fullName: 'Kotak Mahindra Bank', emoji: '🟠' },
    { id: 'pnb',   name: 'PNB',   fullName: 'Punjab National Bank',emoji: '🟣' },
  ],
  personas: [
    { id: 'first_jobber', label: 'First jobber' },
    { id: 'freelancer',   label: 'Freelancer'   },
    { id: 'student',      label: 'Student'      },
  ],
};

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────

export const TABS = [
  { name: 'index',    label: 'Home',     icon: 'home'     },
  { name: 'spend',    label: 'Spend',    icon: 'wallet'   },
  { name: 'goals',    label: 'Goals',    icon: 'target'   },
  { name: 'insights', label: 'Insights', icon: 'trending' },
];

export const TAB_BAR = {
  height: 72,
  paddingBottom: 16,
  borderTopWidth: 0.5,
};

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────

export const NOTIFICATION = {
  types: {
    BUDGET_WARNING:   'budget_warning',
    BUDGET_EXCEEDED:  'budget_exceeded',
    GOAL_MILESTONE:   'goal_milestone',
    GOAL_COMPLETE:    'goal_complete',
    WEEKLY_MOOD:      'weekly_mood',
    SALARY_REMINDER:  'salary_reminder',
  },

  // Quiet hours (no notifications sent during these hours)
  quietHours: {
    start: 22, // 10 PM
    end: 8,    // 8 AM
  },

  // Default notification preferences
  defaults: {
    spendingAlerts: true,
    goalMilestones: true,
    weeklyInsight: true,
    billReminders: false,
    quietHours: true,
  },
};

// ─────────────────────────────────────────────
// API / SERVICES
// ─────────────────────────────────────────────

export const API = {
  gemini: {
    model: 'gemini-1.5-flash',
    maxOutputTokens: 500,
    temperature: 0.7,
    cacheDurationHours: 24,  // Re-generate nudges every 24 hours
    maxNudges: 3,
  },
  backend: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
    timeout: 10000, // 10 seconds
  },
};

// ─────────────────────────────────────────────
// STORAGE KEYS (AsyncStorage + SecureStore)
// ─────────────────────────────────────────────

export const STORAGE_KEYS = {
  // AsyncStorage (non-sensitive)
  HAS_COMPLETED_ONBOARDING: '@flowwise/onboarding_complete',
  USER_PROFILE: '@flowwise/user_profile',
  NOTIFICATION_PREFS: '@flowwise/notification_prefs',
  GEMINI_NUDGES_CACHE: '@flowwise/gemini_nudges',
  GEMINI_NUDGES_TIMESTAMP: '@flowwise/gemini_nudges_ts',
  SELECTED_PERIOD: '@flowwise/selected_period',
  MOOD_CHECK_IN_SUBMITTED: '@flowwise/mood_checkin_',  // + week_start date

  // SecureStore (sensitive)
  GEMINI_API_KEY: 'flowwise_gemini_key',
};

// ─────────────────────────────────────────────
// STRINGS — UI copy (change once, updates everywhere)
// ─────────────────────────────────────────────

export const STRINGS = {
  app: {
    name: APP.name,
    tagline: APP.tagline,
  },
  onboarding: {
    welcomeTitle: 'Money that\nworks for you.',
    welcomeBody: 'Stop dreading your bank app. FlowWise makes personal finance feel like a conversation, not a spreadsheet.',
    getStarted: 'Get Started — It\'s Free',
    alreadyHaveAccount: 'I already have an account',
    featuresTitle: 'Smart goals\nthat adapt.',
    featuresBody: 'Set a goal — Goa trip, new laptop, emergency fund. FlowWise watches your spending and tells you if you\'re on track in real time.',
    profileTitle: 'Set up profile',
    profileSubtitle: 'Personalize your experience',
    bankTitle: 'Link your bank',
    bankSubtitle: 'Auto-sync transactions · 256-bit secure',
    bankSkip: 'Or enter manually — skip for now',
    budgetTitle: 'Set your budget',
    budgetSubtitle: 'Tell us your income and we\'ll suggest smart category limits.',
    doneTitle: 'You\'re all set,\n',  // + name appended
    doneSubtitle: 'FlowWise is ready to help you take control of your money.',
    takeToDashboard: 'Take me to my dashboard →',
  },
  home: {
    greeting: {
      morning: 'Good morning 🌤',
      afternoon: 'Good afternoon ☀️',
      evening: 'Good evening 🌙',
    },
    totalBalance: 'Total Balance',
    income: 'Income',
    spent: 'Spent',
    saved: 'Saved',
    budgetLabel: 'budget',
    recentLabel: 'Recent',
    seeAll: 'See all',
    quickActions: {
      addExpense: 'Add Expense',
      setGoal: 'Set Goal',
      report: 'Report',
      insights: 'Insights',
    },
  },
  expense: {
    addTitle: 'Add Expense',
    noteOptional: 'Note (optional)',
    dateTime: 'Date & time',
    addButton: 'Add Expense',
    successTitle: 'Expense Added!',
    addAnother: 'Add Another',
    backToHome: 'Back to Home',
  },
  goals: {
    title: 'Goals',
    addGoal: 'Add New Goal',
    daysLeft: 'days left',
    ongoing: 'Ongoing',
    complete: 'Complete',
  },
  insights: {
    title: 'Insights',
    subtitle: 'Your money story this week',
    moodScore: 'Money Mood Score',
    smartNudges: 'Smart Nudges',
    weeklyCheckIn: 'Weekly Check-in',
    checkInQuestion: 'How did money feel this week?',
    checkInSubtitle: 'Takes 30 seconds. Helps us personalize your insights.',
    checkInButton: 'Submit Check-in',
    checkInDone: 'Saved! See you next week ✓',
  },
  errors: {
    amountRequired: 'Please enter an amount',
    amountTooLow: 'Amount must be greater than ₹0',
    amountTooHigh: 'Amount cannot exceed ₹10,00,000',
    categoryRequired: 'Please select a category',
    nameRequired: 'Please enter your name',
    genericError: 'Something went wrong. Please try again.',
    offlineError: 'You\'re offline. This feature needs internet.',
  },
};

// ─────────────────────────────────────────────
// CURRENCY — Formatting helpers
// ─────────────────────────────────────────────

export const CURRENCY = {
  symbol: APP.currencySymbol,
  locale: APP.locale,
  code: APP.currency,

  /**
   * Convert paise to rupees
   * @param {number} paise - Amount in paise
   * @returns {number} Amount in rupees
   */
  paiseToRupees: (paise) => paise / 100,

  /**
   * Convert rupees to paise
   * @param {number} rupees - Amount in rupees
   * @returns {number} Amount in paise
   */
  rupeesToPaise: (rupees) => Math.round(rupees * 100),

  /**
   * Format paise as INR display string
   * @param {number} paise - Amount in paise
   * @param {boolean} compact - Use compact format (₹1.2L instead of ₹1,20,000)
   * @returns {string} Formatted currency string
   */
  format: (paise, compact = false) => {
    const rupees = paise / 100;
    if (compact && rupees >= 100000) {
      return `₹${(rupees / 100000).toFixed(1)}L`;
    }
    if (compact && rupees >= 1000) {
      return `₹${(rupees / 1000).toFixed(1)}K`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rupees);
  },

  /**
   * Format as signed amount (+ for income, - for expense)
   * @param {number} paise - Amount in paise
   * @param {'income'|'expense'} type - Transaction type
   * @returns {string} Signed formatted string
   */
  formatSigned: (paise, type) => {
    const formatted = CURRENCY.format(paise);
    return type === 'income' ? `+${formatted}` : `-${formatted}`;
  },
};

// ─────────────────────────────────────────────
// DATES
// ─────────────────────────────────────────────

export const DATE_FORMAT = {
  display: 'DD MMM YYYY',        // "15 Apr 2026"
  displayShort: 'DD MMM',        // "15 Apr"
  displayWithTime: 'DD MMM · HH:mm', // "15 Apr · 08:30"
  monthYear: 'MMMM YYYY',        // "April 2026"
  monthShort: 'MMM YYYY',        // "Apr 2026"
  iso: 'YYYY-MM-DD',             // ISO 8601 date
  isoDateTime: "YYYY-MM-DDTHH:mm:ss", // ISO 8601 datetime
};

export const PERIODS = [
  { id: 'week',    label: 'Week'    },
  { id: 'month',   label: 'Month'   },
  { id: 'quarter', label: 'Quarter' },
];

// ─────────────────────────────────────────────
// FEATURE FLAGS
// ─────────────────────────────────────────────

export const FEATURES = {
  aiNudges: true,          // Gemini-powered insights
  bankSync: false,         // V2 — auto bank sync
  voiceExpense: false,     // V2 — voice logging
  investmentTracking: false, // V2 — mutual funds / SIP
  sharedBudgets: false,    // V2 — partner budgets
  darkModeToggle: false,   // V2 — light mode option (dark is default)
  exportCSV: false,        // V2 — export transactions
  biometricAuth: false,    // V2 — Face ID / fingerprint
};

// ─────────────────────────────────────────────
// DEFAULT EXPORT (for convenience)
// ─────────────────────────────────────────────

const Constants = {
  APP,
  COLORS,
  FONTS,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  SPACING,
  RADIUS,
  SHADOWS,
  ANIMATION,
  CATEGORIES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  BUDGET,
  MOOD,
  ONBOARDING,
  TABS,
  TAB_BAR,
  NOTIFICATION,
  API,
  STORAGE_KEYS,
  STRINGS,
  CURRENCY,
  DATE_FORMAT,
  PERIODS,
  FEATURES,
};

export default Constants;
