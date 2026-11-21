# Release size baseline

Target: a release download under **100 MB** (Android 14+, arm64-v8a, Hermes).

## What is measured, and what is not

Measured on 2026-11-20 with `npx expo export --platform android` at the head of
the `m5/typed-api-client` branch (typed API client added, no screens changed):

| Part | Size |
|---|---|
| Hermes bytecode bundle (`.hbc`) | 5.5 MB |
| Bundled assets (72 files: images, fonts, map and campus data) | 9.2 MB |
| Whole export folder | 15.2 MB |

**Not measured: the APK or app bundle.** This laptop has no JDK or Android SDK,
so no release build ran. The export holds the JavaScript and assets only. The
native side (Hermes runtime, MapLibre, Reanimated, the Expo modules) is added
by the Android build and is not in these numbers. Treat 15.2 MB as a floor, not
the download size.

Largest assets: six images between 0.3 and 1.3 MB each (`assets/images`), and
`src/data/campus` at 1.7 MB.

## How to take the real number

On a machine with the Android SDK:

```bash
npx expo prebuild --platform android
cd android && ./gradlew bundleRelease   # then bundletool build-apks --mode=universal, or check the arm64-v8a split
```

Record the arm64-v8a split size here, replacing the floor above. A CI job for
this is a follow-up; it needs the SDK and is heavy for the current runners.

## Rules to keep it down

- Dependencies stay lean. Added so far: `openapi-fetch` (small, no native code).
  The generator and test tooling are dev-only.
- Model weights and content packs are never bundled; they are separate downloads
  if they ever ship.
- Re-measure after each lane that adds a native module (`expo-secure-store` is
  next).
