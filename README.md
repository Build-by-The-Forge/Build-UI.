# BUILD mobile app

The Expo / React Native application is in `mobile-app-main`.

```sh
cd mobile-app-main
npm ci
npm run web
```

Open `/dashboard/mapscreen` to review the FUTA campus explorer.

The map uses bundled OpenStreetMap building footprints, roads and named places from a FUTA-area extract downloaded on 28 October 2026. Search, category filters, selection, 2D/3D and campus reset are implemented. Most building heights are illustrative, not surveyed. This is an exploration map, not a routing service.

Native maps require an Expo development build with MapLibre; Expo Go does not include this native module. Use `npx expo run:android` with an Android development environment, or an EAS development build. iOS builds require macOS or EAS.

See `mobile-app-main/docs/campus-map.md` for provenance and limitations.
