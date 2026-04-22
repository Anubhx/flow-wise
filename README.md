<div align="center">
  <img src="./assets/icon.png" alt="FlowWise Logo" width="120" />

  # FlowWise 💸

  **Your Intelligent, Agent-Powered Financial Companion**

  <p align="center">
    <a href="https://expo.dev/"><img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" /></a>
    <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" /></a>
    <a href="https://clerk.com/"><img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk Auth" /></a>
    <a href="https://deepmind.google/technologies/gemini/"><img src="https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini AI" /></a>
    <a href="https://www.behance.net/gallery/247562999/Flow-Wise-Case-Study"><img src="https://img.shields.io/badge/Behance-Case_Study-1769FF?style=for-the-badge&logo=behance&logoColor=white" alt="Behance Case Study" /></a>
  </p>

  <p align="center">
    FlowWise is a modern personal finance application built with React Native and Expo. Experience seamless expense tracking, secure authentication, and AI-driven insights to master your financial flow.
  </p>
</div>

<br />

## 📸 Screenshots

> **Note:** These links point to your local `../SCREENIMAGES/` folder. If you intend to push this to GitHub, it is highly recommended to move the screenshots inside a `screenshots` folder within this repository and update the links accordingly.

| Dashboard | Transactions | Add Expense | Insights |
| :---: | :---: | :---: | :---: |
| <img src="../SCREENIMAGES/Home.png" alt="Dashboard" width="200"/> | <img src="../SCREENIMAGES/All tansactions.png" alt="Transactions" width="200"/> | <img src="../SCREENIMAGES/Add expense.png" alt="Add Expense" width="200"/> | <img src="../SCREENIMAGES/Insights.png" alt="Insights" width="200"/> |
| **Spending** | **Goals** | **Profile** | **Onboarding** |
| <img src="../SCREENIMAGES/Spending.png" alt="Spending" width="200"/> | <img src="../SCREENIMAGES/Goal.png" alt="Goals" width="200"/> | <img src="../SCREENIMAGES/Profile.png" alt="Profile" width="200"/> | <img src="../SCREENIMAGES/Ounboarding flow 2.png" alt="Onboarding" width="200"/> |

---

## ✨ Key Features

- **🛍️ Expense & Transaction Tracking:** Log, categorize, and monitor your expenses seamlessly.
- **🤖 AI-Powered Assistant:** Leverage Google's Gemini to analyze your spending and get smart financial advice.
- **🔐 Secure Authentication:** Enterprise-grade security handling identity management via [Clerk](https://clerk.com).
- **🗃️ Local First SQLite:** Fast and reliable persistent local database using Expo SQLite.
- **🎨 Modern UI/UX:** Smooth animations powered by Reanimated, Bottom Sheets, and custom Google Fonts (`DM Sans`, `Syne`).
- **📱 Cross-Platform:** Write once, run seamlessly on Android, iOS, and Web.

---

## 🛠️ Tech Stack

- **Framework:** [Expo](https://expo.dev/) & [React Native](https://reactnative.dev/)
- **Routing:** Expo Router (`app/` directory)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Authentication:** Clerk Expo (`@clerk/clerk-expo`)
- **Database:** Expo SQLite
- **AI Integration:** Google Gemini API
- **Animations:** React Native Reanimated & React Native Gesture Handler

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running on your machine, whether you are on **macOS** or **Windows**.

### Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js**: (v18 or newer recommended). Download from [Node.js Official Site](https://nodejs.org/).
- **npm** or **yarn** or **bun**: Node package managers.
- **Git**: Version control system.

#### 🍏 For macOS Users (iOS & Android)
- **Xcode:** Required for iOS simulation. Download from the Mac App Store.
  - *Setup:* Open Xcode -> Settings -> Locations -> Ensure Command Line Tools are selected.
  - Install the iOS Simulator inside Xcode.
- **Android Studio:** Required for Android emulation. Download from the [Android Developer Site](https://developer.android.com/studio).
  - *Setup:* Follow Android Studio prompts to install the Android SDK and create an Android Virtual Device (AVD).

#### 🪟 For Windows Users (Android Only)
- *Note:* You cannot run an iOS simulator natively on Windows. To test on iOS, you must use the Expo "Go" app on a physical iPhone.
- **Android Studio:** Required for running the Android emulator. Download from the [Android Developer Site](https://developer.android.com/studio).
  - Ensure you set up your `ANDROID_HOME` Environment Variable to point to your Android SDK.
  - Create a Virtual Device in the Device Manager.

### 1️⃣ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/flowwise.git
   cd flowwise
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or yarn install
   ```

### 2️⃣ Environment Setup

You need to set up environment variables for Authentication (Clerk) and AI (Gemini).

1. Create a `.env` file at the root of your project:
   ```bash
   # On macOS/Linux
   touch .env
   
   # On Windows (Command Prompt)
   type nul > .env
   ```

2. Add the following keys to your `.env` (obtain your API keys from [Clerk](https://dashboard.clerk.com/) and [Google AI Studio](https://aistudio.google.com/app/apikey)):

   ```env
   # Clerk Authentication Keys
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Gemini AI Key
   EXPO_PUBLIC_GEMINI_KEY=your_gemini_api_key
   ```

### 3️⃣ Running the App

Once setup is complete, you can start the development server.

```bash
# Start the Expo Metro Bundler
npx expo start
```

From the terminal prompt, you can press:
- `i` to open the iOS simulator (**macOS only**).
- `a` to open the Android emulator (**macOS & Windows**).
- `w` to open it in a web browser.
- Or scan the QR code with the **Expo Go** app on your physical iOS/Android device!

---

## 📂 Folder Structure

```text
flowwise/
├── app/               # Expo Router pages and layouts (Navigations)
│   ├── (auth)/        # Authentication screens (Sign In, etc.)
│   ├── expense/       # Expense management screens
│   ├── transaction/   # Transaction detailed views
│   └── index.tsx      # Main application entry point
├── assets/            # Images, icons, and fonts
├── components/        # Reusable UI React components
├── constants.js       # App-wide constants (themes, configurations)
├── db/                # SQLite database schemas and queries
├── store/             # Zustand state management slices
├── services/          # API calls (e.g., Gemini integration)
└── utils/             # Helper functions and hooks
```

---

## 🎨 Design Case Study

The full UI/UX design process, wireframes, and visual design decisions for FlowWise are documented on Behance.

> **[📐 View the FlowWise Case Study on Behance →](https://www.behance.net/gallery/247562999/Flow-Wise-Case-Study)**

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  <b>Built with ❤️ by the FlowWise Team</b>
</div>
