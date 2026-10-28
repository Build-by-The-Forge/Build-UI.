# FUTA campus explorer

## Data and provenance

The bundled map was generated from the OpenStreetMap API bounding box `5.1141,7.2924,5.1499,7.3163` on 28 October 2026. It covers the campus area and nearby streets, not exclusively university-owned land. OpenStreetMap data is community maintained and has not been independently field verified. Source names are preserved, including inconsistencies and duplicates.

Source: https://api.openstreetmap.org/api/0.6/map?bbox=5.1141,7.2924,5.1499,7.3163

OSM-derived geometries and place data are available under the Open Database License: https://www.openstreetmap.org/copyright . Attribution is visible in the app. Each place links to its original OSM object.

The dashed reference boundary comes from the user-supplied `futa_clip` WGS84 shapefile. Its ownership, accuracy and redistribution permission must be established before public release of that layer. It is not asserted to be an official boundary. The OSM database and supplied boundary have separate provenance.

This extract contains 1,906 building polygons, 752 road/path ways and 401 named places. Only five buildings have explicit height tags. Heights use valid OSM metres first, estimated height from storeys second (3 metres per storey), otherwise an illustrative 7 metres. Display heights are bounded to 2–150 metres. These are schematic extrusions, not architectural models. Multipolygon relations are not imported in this first pass. Roads are display geometry, not a routable graph.

## Rendering

MapLibre Native renders Android/iOS. MapLibre GL JS renders web. Both consume the same bundled GeoJSON and style. Campus geometry does not require map tile requests. Label glyphs currently come from `fonts.openmaptiles.org`, so fully offline labels are not yet guaranteed. There are no requests to the public OSM raster tile server and no paid map keys.

Search and categories operate on the local named-place index. Place coordinates for polygon features are vertex averages, suitable for exploration but not verified entrances. There are no fabricated opening hours, GPS position, distance estimates or turn-by-turn directions.

## Verification and next work

Run `npm run typecheck`, `npm run test:campus`, and `npx expo export --platform web`.

First-pass validation on 28 October 2026: TypeScript and campus geometry tests passed; production web export generated all 29 routes. Browser checks at desktop and 390 × 844 verified visible 3D geometry, 2D switching, library search, category filtering, place selection, reset, and empty results. Native Android/iOS rendering has not yet been device-tested. The web bundle is about 5 MB before transfer compression and should be split and profiled before release.

Test Android and iOS development builds on real devices before release. Verify campus landmarks and entrances, deduplicate the named-place index, refine categories, acquire heights, bundle glyphs for offline use, add permission-based user location, and build a verified walking network before adding directions.

`scripts/import-campus.mjs` imports normalized OSM JSON (`elements` containing type, id, tags and coordinate arrays) plus the supplied single-ring shapefile. Generated data lives in `src/data/campus`. Do not pass a raw Overpass response to that script.
