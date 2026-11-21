# BUILD glass design system: visual spec

Code: `src/theme/glass/` (tokens, capability, provider) and `src/ui/glass/` (components).
Gallery (development builds only): route `/dev/gallery`.
Figma inventory and extracted tokens: [UI_DESIGN_BRIEF.md](UI_DESIGN_BRIEF.md).

## 1. Principle: progressive enhancement

Glass is decoration, never information. Every screen works the same with effects off: same layout, same hierarchy, same hit targets, same text. The device gets the richest treatment it can afford, and the student can always choose another.

| Treatment | Live blur | Surfaces | Shadows | Who gets it automatically |
|---|---|---|---|---|
| **Full** | up to 2 layers per screen, intensity 60 | translucent (card 58%, chrome 82% white) | soft, wide | Android 12+ with 7 GiB RAM or more |
| **Reduced** | 1 layer per screen, intensity 30 | more opaque (card 80%, chrome 92%) | softer | Android 12+ with 5 to 7 GiB RAM |
| **Off** (opaque) | none | fully opaque tinted surfaces | minimal | under 5 GiB RAM, Android below 12, unknown RAM, or OS reduce motion / reduce transparency on |

The treatment is chosen in one place, `GlassThemeProvider`. Components read `useGlassTheme()` and never inspect the device.

## 2. How the treatment is chosen (capability heuristic)

`src/theme/glass/capability.ts`, unit tested in `__tests__/capability.test.ts`. First match wins:

1. The student's choice in Settings ("Visual effects": Automatic, Full, Reduced, Off). Stored on the device, applied on next launch.
2. OS reduce transparency, or OS remove animations (Android reports it as reduce motion): **Off**.
3. Android API below 31, or unknown: **Off** (live blur before Android 12 is a slow software path).
4. Total RAM unknown: **Off**.
5. Total RAM under 5 GiB: **Off**. 4 GB phones report about 3.5 to 3.8 GiB.
6. Total RAM under 7 GiB: **Reduced**. 6 GB phones report about 5.4 to 5.8 GiB.
7. Otherwise **Full**. 8 GB phones report about 7.2 to 7.6 GiB.

Signals are measured only: `expo-device` `totalMemory` (Android `ActivityManager.MemoryInfo.totalMem`, which is physical memory and does **not** include swap or Samsung "RAM Plus" virtual memory) and `platformApiLevel`, plus `AccessibilityInfo`. Never brand, model, price or marketing category. Until the OS settings are read, the app renders Off (the cheapest), so a slow phone never starts with full blur.

A startup frame-time probe was considered and left out: every phone stutters in its first second, so it would mostly downgrade good devices. Revisit with frame data from real low-end phones.

Primary low-resource reference device: Samsung Galaxy A06, 4 GB physical RAM (+4 GB RAM Plus). Expected: **Off**. To verify: open `/dev/gallery` on the phone and read the "Device signals" card (RAM reported with RAM Plus on and off, API level, automatic tier). Not yet done; see section 8.

## 3. Anatomy of a glass surface

`GlassSurface`, bottom to top:

1. **Soft shadow**: CSS `boxShadow` (React Native new architecture). It is drawn outside the shape only, so it never shows through a translucent fill (Android `elevation` would).
2. **Live blur** (optional, budgeted): `expo-blur` `BlurView`. On Android it blurs the screen's `BlurTargetView` (the content) with the Dimezis method on API 31+.
3. **Tinted fill**: the surface colour for the treatment. This is what guarantees contrast, not the blur.
4. **Inner highlight**: a 1dp edge, brighter on the top side, like light catching the rim of glass.

Border widths and padding are identical in all treatments, so switching effects moves nothing (tested: the layout tree of a screen is equal across all three).

Surface kinds: `card` (never blurs, safe in lists), `chrome` (header, tab bar), `sheet` (bottom sheet, dialog), `input`.

## 4. Blur budget

* At most `maxLayers` live blur layers per screen: 2 (Full), 1 (Reduced), 0 (Off). Enforced by `BlurScope` in `GlassScreen`: slots go to surfaces in mount order; the rest render their tinted fill (a development warning names the overflow).
* Only chrome and sheets may ask for blur. Cards, rows and anything in a scrolling list never blur; their glass look comes from translucency over the ambient background.
* Blur intensity is never animated.
* Modals open in their own Android window, which the screen's blur target cannot reach, so modal sheets use a strong fill over a tinted scrim instead of blur.
* Outside a `GlassScreen`, nothing blurs.

## 5. Contrast (WCAG AA in every treatment)

`src/theme/glass/__tests__/contrast.test.ts` composites each translucent fill over the **worst** background it can sit on and checks the result:

* Text on cards and inputs: over the darkest (light mode) or lightest (dark mode) colour the ambient background can reach, including two overlapping colour fields.
* Text on chrome and sheets (which float over arbitrary content): over pure black (light mode) or pure white (dark mode).
* Every text tone (primary, secondary, accent, danger, success, warning) must reach 4.5:1 on every surface, in both schemes and all three treatments. White on both primary-button gradient stops, status text on its tint, and accent on the selected-chip tint must reach 4.5:1. Icon glyphs on their tiles must reach 3:1.

Figma colours that failed were darkened: Figma's link blue `#1976D2` stays the brand fill, but small accent text uses `#1E40AF` (light) / `#93C5FD` (dark); the Figma button gradient `#3B82F6 → #6366F1` became `#2563EB → #4F46E5` so white text passes.

## 6. Tokens

`src/theme/glass/tokens.ts`. Light and dark palettes; surfaces per treatment; blur; elevation; spacing (4-point, 24 gutter from Figma); radius (8 / 12 / 16 / 20 / 24 / 32 / pill, from Figma); type scale (display 34, title 28 / 22 / 18, body 16, reading 17/28, callout 15, label 14, caption 12, overline 12, tab 11); motion (120 / 200 / 320 ms, standard easing, all 0 under reduce motion).

Font: one family, Nunito (already bundled). Switching to the system font is a one-line change (open question in the brief).

Background: a static three-stop gradient with three soft radial colour fields, drawn natively. No images, nothing to download, never animated.

## 7. Components

| Component | Notes |
|---|---|
| `GlassScreen` | Root: ambient background, blur target, floating `header` and `footer` chrome. `useChromeInsets()` gives the chrome heights for scroll padding. |
| `GlassHeader` | Chrome bar, safe-area aware, large or compact title, 48dp side slots. |
| `GlassTabBar` | Floating chrome tab bar. `tablist`/`tab` roles, selected state, badge announced ("CBT, 2 new"). |
| `GlassCard` | List-safe card; optional whole-card press with a label. |
| `GlassButton` | primary (gradient), secondary (glass), ghost, danger. 56dp tall; loading and disabled states announced. |
| `GlassIconButton` | 48dp; `accessibilityLabel` required. |
| `GlassInput` | Visible label (never placeholder-only), hint, error announced politely, focus ring, show/hide for secrets. |
| `GlassChip` | 36dp pill in a 48dp target. Selection shown by fill, check icon and border, not colour alone. Radio or checkbox role. |
| `GlassModal` | Bottom sheet or centred dialog over a scrim; can block dismissal (e.g. while a CBT submits). |
| `EffectsSettingControl` | The Settings control for the treatment, with the automatic decision explained. |
| `AppText` | All text: type scale plus tones proven to pass AA. Titles are headers for screen readers. Display sizes cap font scaling (1.4x to 1.8x) so 200% text still fits. |

Accessibility in every component: 48dp minimum targets, roles and states, labels on icon-only controls, dynamic type, reduced motion (press feedback drops its scale animation; modals appear without animation).

## 8. Verification status

| Check | Status |
|---|---|
| Unit tests: contrast (140 checks), capability heuristic, blur budget, identical layout across treatments, accessibility roles and states, provider and persisted override, missing-API fallback | Pass (`npm test`) |
| Typecheck, lint on new code | Pass |
| Web render (react-native-web) of the gallery in all treatments, light and dark | Done, **stand-in only**: `docs/ui/screenshots/web-standin/`. The browser's blur and font rendering are not Android's. |
| Android emulator | Not available: this laptop has no Android SDK, JDK or emulator, and installing them is not approved. |
| Physical Samsung Galaxy A06 (Expo Go over USB) | **Required, not yet done.** Record: RAM reported with RAM Plus on and off, API level, automatic tier, scroll smoothness with header and tab bar in each forced treatment, contrast in sunlight. The phone is shared with the offline-benchmark lane; book a slot. |
| Release APK/AAB size | Needs the GitHub Actions Android build (next PR). Not measured here. |

The emulator (or a browser) proves behaviour, not low-end phone performance. Physical low-end testing is a required later step.

## 9. Dependency added

| Package | Why | Size |
|---|---|---|
| `expo-blur` ~57.0.3 | The only Expo-supported native blur on Android (BlurTargetView + Dimezis method). Included in Expo Go, so the phone check needs no custom build. | npm package 140 KB unpacked (JS, types and native sources). Its native Android library adds to the APK; the real delta comes from the Android release build job. |

No fonts, images or other dependencies were added. `expo-linear-gradient` and `expo-device` were already in the app.
