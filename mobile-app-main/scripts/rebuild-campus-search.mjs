import fs from 'node:fs';
const root = new URL('../src/data/campus/', import.meta.url);
const geometry = JSON.parse(fs.readFileSync(new URL('geometry.json', root), 'utf8'));
const places = JSON.parse(fs.readFileSync(new URL('places.json', root), 'utf8'));
const index = new Map(places.map(place => [place.id, place]));
let unnamed = 0;
for (const feature of geometry.features) {
  if (feature.properties.kind !== 'building' || index.has(feature.id)) continue;
  const ring = feature.geometry.coordinates[0];
  const coordinate = [
    ring.reduce((total, point) => total + point[0], 0) / ring.length,
    ring.reduce((total, point) => total + point[1], 0) / ring.length,
  ];
  const name = feature.properties.name?.trim() || `Unlabelled building ${String(++unnamed).padStart(3, '0')}`;
  index.set(feature.id, { id: feature.id, name, category: 'Buildings', kind: 'building', coordinate });
}
for (const place of index.values()) {
  const feature = geometry.features.find(item => item.id === place.id);
  if (feature?.properties.kind === 'building') place.kind = 'building';
}
const merged = [...index.values()].sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(new URL('places.json', root), JSON.stringify(merged, null, 2));
console.log(`Search index contains ${merged.length} places, including ${unnamed} newly indexed unnamed buildings.`);
