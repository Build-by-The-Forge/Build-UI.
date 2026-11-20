# BUILD mobile: UI design brief (glassmorphism)

Status: step 1 of the UI lane. Figma was read **read-only** (no write tool was used).
Source: Figma file `i6TfotdjfxGXlEZiKySeED` ("Build"), read through the Figma MCP on 2026-11-20.
Direction from the product owner: the Figma file is a guide for colour, UI and feel, not a spec. We want an iOS-like glass look ("Glassmorphism"), the best modern UX, and we design the screens that Figma does not have.

## 1. What was and was not read

| Method | Result |
|---|---|
| `get_metadata` on page `0:1` | Full node tree: 1 page, 32 top-level nodes, 5,571 lines of XML. All 32 names and sizes are inventoried below. |
| `get_screenshot` | Rendered and looked at 4 frames: Dashboard Screen, Sign In Mobile, CBT Mode Screen, Chat Section Screen. |
| `get_design_context` | Exact values read for 2 frames: Dashboard Screen (`98:1520`) and Sign In Mobile (`64:285`). Token tables in section 4 come from these two plus the screenshots. |
| `get_variable_defs` | Returned nothing usable: the tool needs a selection in the Figma desktop app. No evidence either way that the file defines Figma variables or styles. |
| Not yet read in detail | The other 28 frames are known by name and size only. Their colours are assumed to follow the same palette and are marked "unverified" where it matters. Each screen PR re-reads its own Figma frame before building. |

Nothing in this brief is invented about the unread frames. Where I infer, it says so.

## 2. Figma inventory

One page (`Page 1`). 32 top-level nodes: 28 screens/frames, plus 4 stray vector or text nodes (`Ellipse 5/10`, `Vibrant Blue Folded Ribbon Logo 2/3/4`, `Rectangle 24`, `Vector`, `Home` text) that are leftovers of the logo and chart work and are not screens. Frame width is 375 (small phone) or 412 (Android compact); heights vary with content. There are no component sets, no variants and no states pages: components exist only as repeated layers inside screens.

| Figma frame (node id) | Size | Group |
|---|---|---|
| Landing Page (`89:2726`, `98:2751`) | 412x917 | Marketing / entry |
| Build Skills Show, Practice With People Show, Interactive Video Show (`98:2724`, `98:2712`, `98:2697`) | 412x917 | Intro carousel |
| Sign In (`98:2660`), Sign In Screen (`98:1401`), Sign In Mobile (`64:285`) | 412x917, 375x987, 375x846 | Auth (three iterations of one screen) |
| Sign Up Screen (`98:1458`) | 375x1118 | Auth |
| Sign Up Step 1 Personal Info, Step 2 Academic Info, Step 3 Account Security (`64:655`, `64:744`, `64:837`) | 375x~1022-1044 | Auth, 3-step sign-up |
| BUILD Onboarding: Screen 1 Welcome (`32:4`) | 375x840 | Onboarding |
| BUILD Personalization (`32:180`) | 375x922 | Onboarding |
| BUILD Onboarding: Courses (`83:337`), Learning Goals (`83:498`), Learning Preferences (`83:628`), You're All Set (`83:749`) | 375 wide | Onboarding |
| BUILD Home Dashboard, Small Phone (`86:847`); Dashboard Screen (`98:1520`) | 375x1210, 375x1360 | Dashboard (two iterations) |
| Study Section Screen (`98:1729`) | 375x1184 | Study / courses |
| CBT Mode Screen (`98:1849`) | 375x918 | CBT attempt |
| Read Mode Screen (`98:1950`) | 375x1935 | Reader |
| Video Mode Screen (`98:2138`) | 375x978 | Video (not Release 1) |
| Group Section Screen (`98:2327`), Chat Section Screen (`98:2475`) | 375x1071, 375x927 | Groups and chat (not Release 1) |
| Map (`98:2601`) | 412x917 | Campus map (already built in app) |
| Android Compact - 1 (`98:2762`) | 412x917 | Blank/base frame |

Observed repeated components (from the four frames viewed): large rounded cards with soft shadow; quick-access tiles with a pastel icon chip; gradient hero card with a progress bar; search field with a filter icon; circular progress ring; chart card; floating bottom nav with a raised centre "Home" and a floating BUILD logo button; pill timer; option card with lettered badge and selected state with check; question palette (numbered squares, done/current/pending); previous/next buttons; chat bubbles; input bar with attach and send.
States found in Figma: selected option, done/current/pending palette squares, online dot, "Hard" tag. **No** empty, loading, error, disabled, focus, offline or not-covered states exist anywhere.

## 3. Observations that shape the design

1. The Figma is two visual languages: a clean white/blue app shell (dashboard, CBT, chat) and a saturated indigo card on sign-in. We unify them into one glass language over a blue-indigo ambient background.
2. Typography is inconsistent in Figma (Roboto on dashboard, Inter on sign-in, Font Awesome glyphs for icons). The app currently ships **Nunito** (`@expo-google-fonts/nunito`, five weights) and `@expo/vector-icons`. Decision for step 2: keep one family only; propose system font (Roboto on Android) for body and drop Nunito if the size win is worthwhile; this is recorded as an open question below.
3. Figma contains fictional data ("Hello, Alex", 85% completed, 70% progress, "Sarah Jenkins"). That is placeholder copy only. It must never appear as data in the app; every figure renders from the API or shows an honest empty state.
4. The dashboard nav in Figma is already glass-like (`rgba(255,255,255,0.1)`, 34px blur-like shadow, 12px radius) but over a flat background, so the glass cannot be seen. We give it something to blur.

## 4. Extracted tokens (verified from Dashboard Screen and Sign In Mobile)

### Colour
| Role | Value | Where |
|---|---|---|
| Page background | `#F5F7FA` (light) | Dashboard |
| Surface | `#FFFFFF` | Cards, header, inputs |
| Brand blue (primary) | `#1976D2` | Links, active nav, progress ring |
| Brand blue light | `#2196F3` | Hero gradient end |
| Hero gradient | 156deg `#1976D2` to `#2196F3` | Daily goal card |
| Brand blue (logo, titles) | `#1F54DD` | Sign-in title and logo word |
| Indigo card | `#4648E7`, border `rgba(255,255,255,0.2)` | Sign-in card |
| Primary button gradient | left to right `#3B82F6` to `#6366F1`, shadow `rgba(99,102,241,0.4)` | Sign In |
| Text primary | `#212121` (dashboard), `#1E2650` (sign-in input) | |
| Text secondary | `#757575`, `#80889A`, `#798093` | |
| Text placeholder / icon idle | `#9CA3AF`, nav idle `#64748B` | |
| Link on indigo | `#C5E0FF`; accent link `#4A90E2` | |
| Pastel icon chips | blue `#EFF6FF`/`#1976D2`, orange `#FFF7ED`/`#F97316`, purple `#FAF5FF`, green `#F0FDF4`/`#16A34A` | Quick-access tiles |
| Online / success | `#22C55E` | Presence dot |
| Border hairline | `#F3F4F6`, `#F9FAFB` | Header, search |
| Glass fill on indigo | `rgba(95,104,241,0.2)`, border `rgba(255,255,255,0.2)` | Social buttons |

Note: the existing app palette (`src/theme/colors.ts`) uses `#2563EB`, which is close to but not the Figma `#1976D2`. The brand blue must be reconciled once in step 2.

### Type (as drawn)
Dashboard (Roboto): 36/40 bold (hero figure), 24/32 bold (greeting), 18/28 medium, 17/25.5 bold (section titles), 16/24 bold (card titles), 15 regular (inputs), 14/20 medium or semibold, 12/16 regular (captions), 10/15 medium (nav labels).
Sign-in (Inter): 40 bold logo, 30/35 bold title, 16/24 bold button, 15/22.5 inputs, 14/21 light subtitle, 13/19.5 medium link, 12 medium.
Scale to adopt (step 2): 11, 12, 14, 16, 18, 22, 28, 36, all via `fontScale`-aware text, minimum body 14 (16 for reading and tutor text).

### Spacing and layout
Page gutter 24. Card padding 16 to 20 (28 on the sign-in card). Gaps 2, 4, 8, 12, 16. Section spacing 24 to 32. Header height 99. Search height 48. Input height 56. Button height 56. Nav 108 tall including safe area. Base unit is 4.

### Radius
8 (logo tile), 12 (thumbnails, nav), 16 (icon chips, search, small cards), 20 (inputs, outline buttons), 24 (cards, primary button), 32 (sign-in card), 9999 (avatar, progress, dots).

### Elevation
Card: `0 2 2 rgba(0,0,0,.08)` plus `0 1 1 rgba(0,0,0,.12)`. Hero: `0 10 15 -3 rgba(0,0,0,.1)` plus `0 4 6 -4 rgba(0,0,0,.1)`. Sign-in card: `0 10 20 rgba(0,0,0,.2)`. Nav: `0 4 34 rgba(0,0,0,.25)`. Primary button: `0 8 12` tinted.

### Motion
None defined in Figma. Step 2 defines it (see the design system PR). Reduced motion must be honoured.

### Iconography
Figma uses Font Awesome 5 glyphs. The app uses `@expo/vector-icons`. We keep the app's icon library (no new font) and match shapes loosely.

## 5. Screens in the app today (`src/app/`)

Auth: `(auth)/preauth`, `login`, `signup`. Onboarding: `(onboarding)/step-one` to `step-five`. Dashboard group: `home`, `courses`, `studymode`, `readmode`, `cbtquiz`, `buildai`, `chatscreen`, `studygroup`, `videoplayer`, `calendar`, `mapscreen`, `placdetailscreen`, `settings`. Entry: `index`.
Shared components: `DashboardBottomNav`, `PrimaryButton`, `ProgressHeader`, `ui/floating-dock`, calendar and campus-map components. Theme: `src/theme/colors.ts`, `src/constants/theme.ts`, `ThemeContext`.
Existing screens are static mockups (hardcoded content); the typed-client lane replaces data and state. We replace presentation only.

## 6. Coverage matrix and MISSING screens

Release 1 scope only (online-first). Out of scope for Release 1: groups, chat, video, offline, model manager, sync, flashcards, knowledge trees, study plans, agentic features. Those Figma frames (Group, Chat, Video, Interactive Video, Practice With People) are not built in this effort; existing app screens for them are left alone.

| Release 1 screen | In Figma | In app today | Action |
|---|---|---|---|
| Landing / intro | Yes (Landing, 3 "Show" frames) | `preauth` | Restyle |
| Login | Yes (3 iterations) | `login` | Restyle with glass |
| Sign-up (3 steps) | Yes | `signup` (single) | Restyle, keep step structure |
| Academic onboarding | Yes (Welcome, Personalization, Courses, Goals, Preferences, All Set) | `step-one..five` | Restyle; "learning preferences" kept only if the backend profile has the fields |
| Dashboard | Yes | `home` | Restyle; real data only |
| Courses | Partly (Study Section) | `courses`, `studymode` | Restyle |
| Document upload | **No** | **No** | **MISSING, design new** |
| Document shelf / list | **No** | `studyShelf` service only | **MISSING, design new** |
| Document reader | Yes (Read Mode) | `readmode` | Restyle |
| AI tutor, grounded answer with citations | **No** (only a chat between students) | `buildai` | **MISSING, design new** |
| Tutor "not covered" honest state | **No** | **No** | **MISSING, design new** |
| CBT list | **No** | `cbtquiz` partly | **MISSING, design new** |
| CBT instructions | **No** | **No** | **MISSING, design new** |
| CBT attempt | Yes (CBT Mode) | `cbtquiz` | Restyle, add timer, palette, confirm-exit |
| CBT submit and confirm | **No** | **No** | **MISSING, design new** |
| Results | **No** | **No** | **MISSING, design new** |
| Progress | Partial (dashboard chart and ring) | **No** | **MISSING, design new** |
| Settings (incl. reduced transparency toggle, AI-generated notice, account) | **No** | `settings` | **MISSING in Figma; restyle and extend** |
| Empty state | **No** | **No** | **MISSING, design new** |
| Loading (skeleton) state | **No** | **No** | **MISSING, design new** |
| Error state with retry | **No** | **No** | **MISSING, design new** |
| Lost-connection state (online-first notice, not an offline mode) | **No** | **No** | **MISSING, design new** |
| Design-system gallery (dev only) | n/a | **No** | New in step 2 |

## 7. Glass direction (summary; full spec lands in the design system PR)

Layered translucency over a calm blue-indigo ambient gradient (static, vector, no bundled images); thin 1px inner highlight border (top-left brighter); soft low-opacity shadow; subtle vibrancy by tinting the fill from the background. Text never sits directly on raw blur: every text block sits on a tinted scrim that guarantees WCAG AA against the worst background. At most one or two live blur layers per screen (the tab bar and one sheet or header); list rows are never blurred and use a pre-tinted translucent fill instead. Blur radius is never animated. A "reduced transparency" mode swaps all glass for opaque tinted surfaces with the same hierarchy; it is the default on low-memory devices and when the OS asks for fewer animations or transparency, and is user-selectable in Settings.

## 8. Open questions for the product owner

1. Font: keep Nunito (about 5 weight files bundled) or move to the system font to save size and match Android? Recommendation: system font.
2. Reconcile brand blue to Figma `#1976D2` (app uses `#2563EB`)? Recommendation: adopt Figma.
3. Social sign-in (Google, Apple) appears in Figma. Confirm whether Release 1 includes it; the backend contract decides. Not built until confirmed.
4. Dark mode: Figma has none. We design it as an extension of the same glass language.
