# BUILD Mobile App 👋

AI-Powered Learning Platform built with Expo SDK 57, Expo Router, TypeScript, and React Native.

---

## 📱 App Architecture & Routing

### 1. Welcome & Onboarding
- **Welcome Splash (`/` - `src/app/index.tsx`)**: Intro splash screen with auto-redirect.
- **Pre-Authentication (`/preauth` - `src/app/(auth)/preauth.tsx`)**: Feature highlights, Get Started, and Sign In entry points.
- **Login (`/login` - `src/app/(auth)/login.tsx`)**: Glassmorphism authentication form with credentials and recovery.
- **Sign Up (`/signup` - `src/app/(auth)/signup.tsx`)**: 3-step registration wizard (Personal Info, Academic Details, Security).
- **Onboarding (`/(onboarding)`)**: 5-step interactive curriculum and study style setup.

### 2. Dashboard & Study Hub (`/dashboard`)
- **Dashboard Home (`/dashboard/home`)**: Today's schedule, active courses, quick study launchers, and AI insights.
- **CBT Practice Mode (`/dashboard/cbtquiz`)**: Interactive timed exam simulator with question palette and score evaluation.
- **Study Groups (`/dashboard/studygroup`)**: Browse and filter study circles, view active member stacks, and join discussions.
- **Study Chat (`/dashboard/chatscreen`)**: Real-time peer and group messaging with code preview snippets.
- **Campus Map (`/dashboard/mapscreen`)**: Interactive campus building finder, 3D layer, and study location tracker.
- **Place Details (`/dashboard/placdetailscreen`)**: Location check-in, distance calculation, and amenity badges.
- **Reading Mode (`/dashboard/readmode`)**: Distraction-free reader with font size scaling, bookmarking, and AI summaries.
- **Study Modes (`/dashboard/studymode`)**: Hub for Read, CBT, and Video learning paths with AI customized study planner.
- **Video Player (`/dashboard/videoplayer`)**: Video lecture player with playback controls, chapter playlist, and offline caching.

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Run TypeScript check:**
   ```bash
   npx tsc --noEmit
   ```