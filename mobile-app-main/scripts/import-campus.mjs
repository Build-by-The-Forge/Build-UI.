import fs from 'node:fs';
import path from 'node:path';

// Usage: node scripts/import-campus.mjs <normalized OSM JSON> <boundary.shp>
const [input, boundaryPath] = process.argv.slice(2);
if (!input || !boundaryPath) throw new Error('Provide normalized OSM JSON and the supplied boundary shapefile.');
const raw = JSON.parse(fs.readFileSync(input, 'utf8').replace(/^\uFEFF/, ''));
const shp = fs.readFileSync(boundaryPath);
if (shp.readInt32LE(108) !== 5 || shp.readInt32LE(144) !== 1) throw new Error('Expected a single-ring polygon.');
const ring = Array.from({ length: shp.readInt32LE(148) }, (_, i) => [shp.readDoubleLE(156 + i * 16), shp.readDoubleLE(164 + i * 16)]);
const bounds = [shp.readDoubleLE(36), shp.readDoubleLE(44), shp.readDoubleLE(52), shp.readDoubleLE(60)];
const within = ([x, y]) => x >= bounds[0] && x <= bounds[2] && y >= bounds[1] && y <= bounds[3];
const feature = (id, geometry, properties) => ({ type: 'Feature', id, geometry, properties });
const features = [], places = [];
for (const e of raw.elements) {
  const t = e.tags, id = `${e.type}/${e.id}`;
  const coords = e.type === 'node' ? [e.coordinates] : e.coordinates.filter(Boolean);
  if (!coords.length || !coords.some(within)) continue;
  const center = e.type === 'node' ? e.coordinates : [coords.reduce((s,c)=>s+c[0],0)/coords.length, coords.reduce((s,c)=>s+c[1],0)/coords.length];
  const closed = coords.length > 3 && coords[0][0] === coords.at(-1)[0] && coords[0][1] === coords.at(-1)[1];
  let category = 'Places';
  if (t.amenity === 'library' || /library/i.test(t.name || '')) category = 'Libraries';
  else if (t.building === 'dormitory' || /hostel|hall of residence/i.test(t.name || '')) category = 'Hostels';
  else if (['restaurant','cafe','fast_food','food_court'].includes(t.amenity)) category = 'Food';
  else if (['school','university','college'].includes(t.amenity) || /lecture|school|department|laborator/i.test(t.name || '')) category = 'Academic';
  else if (['hospital','clinic','pharmacy'].includes(t.amenity)) category = 'Health';
  const props = { name: t.name || '', category, osmId: id, source: 'OpenStreetMap' };
  if (e.type === 'way' && closed && t.building) {
    const height = /^\d+(\.\d+)?( m)?$/.test(t.height || '') ? parseFloat(t.height) : null;
    const levels = /^\d+(\.\d+)?$/.test(t['building:levels'] || '') ? Number(t['building:levels']) : null;
    features.push(feature(id, { type: 'Polygon', coordinates: [coords] }, { ...props, kind: 'building', height: Math.min(150, Math.max(2, height ?? (levels ? levels * 3 : 7))), heightSource: height ? 'OSM height' : levels ? 'Estimated from OSM storeys' : 'Illustrative height' }));
  } else if (e.type === 'way' && t.highway && coords.length > 1) {
    features.push(feature(id, { type: 'LineString', coordinates: coords }, { ...props, kind: 'road', highway: t.highway }));
  } else if (e.type === 'way' && closed && (t.landuse || t.natural || t.leisure)) {
    features.push(feature(id, { type: 'Polygon', coordinates: [coords] }, { ...props, kind: 'land', land: t.natural || t.landuse || t.leisure }));
  }
  if (t.name && within(center) && !t.highway && (t.building || t.amenity || t.shop || t.tourism || t.leisure)) {
    places.push({ id, name: t.name, category, coordinate: center, sourceUrl: `https://www.openstreetmap.org/${id}` });
  }
}
places.sort((a,b)=>a.name.localeCompare(b.name));
features.push(feature('boundary', { type: 'Polygon', coordinates: [ring] }, { kind: 'boundary', source: 'User supplied futa_clip; boundary not independently verified' }));
const out = path.resolve('src/data/campus'); fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out,'geometry.json'), JSON.stringify({ type:'FeatureCollection', features }));
fs.writeFileSync(path.join(out,'places.json'), JSON.stringify(places,null,2));
const metadata = { downloadedAt: raw.downloadedAt, source: raw.source, bounds, buildings: features.filter(f=>f.properties.kind==='building').length, roads: features.filter(f=>f.properties.kind==='road').length, places: places.length, recordedHeights: features.filter(f=>f.properties.heightSource==='OSM height').length, attribution:'© OpenStreetMap contributors', license:'https://www.openstreetmap.org/copyright' };
fs.writeFileSync(path.join(out,'metadata.json'), JSON.stringify(metadata,null,2));
console.log(metadata);
