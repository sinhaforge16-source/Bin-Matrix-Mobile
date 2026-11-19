# Bin Matrix Mobile

<p align="center">
  <strong>IoT-Powered Smart Waste Management & Segregation Platform</strong><br>
  Built with React Native CLI & TypeScript
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.88.1-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Platforms-Android%20%7C%20iOS-brightgreen?style=flat-square" alt="Platforms" />
  <img src="https://img.shields.io/badge/Localization-English%20%7C%20සිංහල-1E513A?style=flat-square" alt="Localization" />
  <img src="https://img.shields.io/badge/Graphics-2D%20Vector%20SVG-EA580C?style=flat-square" alt="SVG" />
  <img src="https://img.shields.io/badge/Maintained%20by-SinhaForge-2D6A4F?style=flat-square" alt="SinhaForge" />
</p>

---

## 📌 Overview

**Bin Matrix Mobile** is an eco-centric, intelligent waste management and route optimization mobile application. It connects municipal waste management infrastructure with smart IoT-enabled segregation bins and sanitation collection vehicles.

The application features a complete **dual-persona workflow** tailored for both **Citizens (Household / Commercial Users)** and **Municipal Collection Drivers**, rendered with modern 2D vector illustrations (`react-native-svg`), edge-to-edge safe area layouts, and full bilingual localization (**English** and **Sinhala (සිංහල)**).

---

## 🚀 Key Features

### 👤 Citizen / User Portal
1. **Language Onboarding**: One-tap selection between English and Sinhala (සිංහල) with instant UI adaptation.
2. **User Authentication**:
   - Sign in with **Username** and **Password** (or quick demo credentials `admin` / `admin123` or `user` / `1234`).
   - Sign up / Register account with Name, Location, Email, and Password.
   - Social login entrypoints (Google Sign-In integration via OAuth).
3. **Smart Bin IoT Dashboard**:
   - Category monitoring: **Plastic** (Orange), **Paper** (Blue), and **Organic** (Green).
   - Smooth animated fill level gauge with cubic easing and warning thresholds.
   - Clean 2D metallic vector bin with mathematically symmetrical 3-arrow Möbius recycling loop.
   - Dynamic pickup schedule card (*"Upcoming Pickup: Tomorrow at 8:00 AM"*).
4. **AI Cleaning Chatbot**:
   - Report overflowing waste with camera captures and GPS location pinning.
   - Automated dispatch notifications (*"Cleaning truck TR-09 dispatched"*).
5. **Account Management**:
   - Profile overview, email, bin key tracking, multi-account linking, and instant app-wide language switching.

---

### 🚛 Driver Portal
1. **Driver Landing Experience**:
   - Custom 2D vector hero illustration featuring a municipal compactor truck, IoT route waypoints, smart segregation bin, and eco foliage.
   - Direct shortcuts to driver authentication or immediate route start.
2. **Driver Login (`DLogin`)**:
   - Clean minimal aesthetic matching user authentication.
   - Minimal 2D vector truck with glowing steering wheel badge.
   - Quick demo driver autofill (`driver` / `1234`).
3. **Route Readiness (`Driver home page1`)**:
   - Daily route briefing with date tracking and one-tap **START** activation.
4. **Interactive Route Checklist (`Driver home page2 & page3`)**:
   - Numbered stop list (`BIN -BIN22546` | `Tamil, Sangam Institute, Wellawatte`).
   - Real-time status toggling between pending (red `?`) and collected (green `✔`).
   - Dynamic collection counter (e.g. `3/6 Collected`).
   - Route termination action (**END**) with summary confirmation dialogs.
5. **Dual-Mode Route Map & Google Maps Navigation (`DriverMapViewScreen`)**:
   - **Mode Switcher**: Easily toggle between **2D Vector Blueprint** street grid and live **Google Map View**.
   - **Google Maps Turn-by-Turn Navigation**: Deep-links natively to Google Maps driving navigation (`google.navigation:q=` on Android, `comgooglemaps://` on iOS) for individual stops or entire multi-stop routes.
   - **Real GPS Coordinates**: Waypoint pins for Colombo, Dehiwala, Wellawatte, and Mount Lavinia.
   - **Real-Time Telemetry Sync**: Marking a stop completed updates both mobile UI and triggers instant `PATCH /api/bins/:id` backend updates.
   - **Interactive BINS Sidebar**: Vertical numbered circular badges for rapid status checking and collection confirmation.
6. **Driver Account (`Driver account`)**:
   - Driver profile (*Hashibara inosuke* | `DRI-AA123`).
   - Truck registration indicator (`CAN-2258`).
   - Live language selector and secure sign-out.

---

## 🌐 Full Bilingual Localization (English & සිංහල)

The application provides a comprehensive bilingual translation dictionary in [`src/utils/translations.ts`](src/utils/translations.ts). When **Sinhala (සිංහල)** is selected, all headings, buttons, category labels, inputs, alerts, and navigation items across all screens immediately adapt:

| English | Sinhala (සිංහල) |
|---|---|
| Continue as user | පරිශීලකයෙකු ලෙස ඉදිරියට යන්න |
| Continue as Driver | රියදුරෙකු ලෙස ඉදිරියට යන්න |
| Plastic / Paper / Organic | ප්ලාස්ටික් / කඩදාසි / කාබනික |
| Upcoming Pickup | ඉදිරි අපද්‍රව්‍ය එකතු කිරීම |
| Route Plan | ගමන් මාර්ග සැලැස්ම |
| Truck Number | ට්‍රක් රථ අංකය |

---

## 🛠 Tech Stack

- **Framework**: [React Native 0.88.1](https://reactnative.dev/) (Pure React Native CLI)
- **Runtime**: React 19.3.0
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing)
- **Vector Graphics**: [`react-native-svg`](https://github.com/software-mansion/react-native-svg)
- **Safe Area**: [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context) (Dynamic Android edge-to-edge support)
- **Bundler**: Metro
- **Testing**: Jest + React Test Renderer

---

## 📂 Project Structure

```text
Bin-Matrix-Mobile/
├── android/                 # Android native project files
├── ios/                     # iOS native project files
├── assets/                  # App icon and launch assets
├── __tests__/               # Jest test suites
└── src/
    ├── components/          # Reusable 2D vector graphics and icons
    │   ├── AuthHeroIllustration.tsx      # User hero illustration (phone + smart bins)
    │   ├── DriverHeroIllustration.tsx    # Driver hero illustration (truck + route)
    │   ├── SmartBinVector.tsx            # Animated 2D metallic bin + Möbius recycle icon
    │   ├── MinimalAuthVectors.tsx        # Minimal auth vector graphics & badges
    │   ├── CommonIcons.tsx               # Navigation, Map, and Social brand icons
    │   ├── ChatIcons.tsx                 # Chatbot camera, pin, send, avatar icons
    │   ├── FlagIcons.tsx                 # UK and Sri Lanka vector flag icons
    │   └── CornerLines.tsx               # Subtle radiating background corner lines
    ├── screens/             # Application screens
    │   ├── SplashScreen.tsx              # Animated launch splash screen
    │   ├── LanguageSelectScreen.tsx      # Language & role onboarding screen
    │   ├── AuthHomeScreen.tsx            # User landing screen
    │   ├── RegisterUserScreen.tsx        # User registration form
    │   ├── LoginScreen.tsx               # User sign-in screen
    │   ├── DashboardScreen.tsx           # Smart bin status & telemetry dashboard
    │   ├── ChatbotScreen.tsx             # AI waste reporting chatbot
    │   ├── AccountScreen.tsx             # User account settings
    │   ├── DriverAuthHomeScreen.tsx      # Driver landing screen
    │   ├── DriverLoginScreen.tsx         # Driver sign-in screen (DLogin)
    │   ├── DriverHomeScreen.tsx          # Driver route readiness screen
    │   ├── DriverRouteScreen.tsx         # Route stop checklist (page 2 / page 3)
    │   ├── DriverMapViewScreen.tsx       # Live city route map view
    │   └── DriverAccountScreen.tsx       # Driver account settings & truck details
    └── utils/
        └── translations.ts  # English & Sinhala localization dictionary
```

---

## ⚡ Getting Started

### Prerequisites

Ensure your environment is set up according to the [React Native CLI Environment Setup](https://reactnative.dev/docs/set-up-your-environment) guide:
- **Node.js**: >= 18
- **JDK**: OpenJDK 17
- **Android Studio**: Android SDK, Platform-Tools, and an Android Emulator / connected device

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:sinhaforge16-source/Bin-Matrix-Mobile.git
   cd Bin-Matrix-Mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

1. **Start the Metro Bundler**:
   ```bash
   npm start
   ```

2. **Launch on Android**:
   ```bash
   npm run android
   ```

3. **Launch on iOS** (macOS only):
   ```bash
   npm run ios
   ```

### Code Quality & Testing

- **TypeScript Typecheck**:
  ```bash
  npx tsc --noEmit
  ```

- **ESLint**:
  ```bash
  npm run lint
  ```

- **Jest Unit Tests**:
  ```bash
  npm test
  ```

---

## 🔑 Demo Credentials

For quick evaluation and testing, predefined demo credentials are provided directly in the UI:

| Role | Username / ID | Password | Destination |
|---|---|---|---|
| **Citizen / User** | `user` | `1234` | Smart Bin Dashboard |
| **Collection Driver** | `driver` | `1234` | Route Briefing & Map View |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Developed & Maintained by <strong><a href="https://github.com/sinhaforge16-source">SinhaForge</a></strong>
</p>
