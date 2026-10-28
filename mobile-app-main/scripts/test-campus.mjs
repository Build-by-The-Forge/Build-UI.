import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=name=>JSON.parse(fs.readFileSync(new URL(`../src/data/campus/${name}.json`,import.meta.url)));
const geometry=read('geometry'), places=read('places'), meta=read('metadata');
assert.equal(geometry.type,'FeatureCollection');
assert.equal(new Set(geometry.features.map(f=>f.id)).size,geometry.features.length,'Geometry IDs must be unique');
assert.equal(new Set(places.map(p=>p.id)).size,places.length,'Place IDs must be unique');
for(const feature of geometry.features){
  const coords=feature.geometry.type==='Polygon'?feature.geometry.coordinates.flat():feature.geometry.coordinates;
  assert(coords.length>=2);
  for(const [lon,lat] of coords){assert(Number.isFinite(lon)&&Number.isFinite(lat));assert(lon>4&&lon<6&&lat>6&&lat<9,'Unexpected geography');}
  if(feature.geometry.type==='Polygon')assert.deepEqual(coords[0],coords.at(-1),'Polygon must be closed');
  if(feature.properties.kind==='building'){assert(feature.properties.height>=2&&feature.properties.height<=150);assert(feature.properties.heightSource);}
}
for(const p of places){assert(p.name.trim());assert(p.sourceUrl===`https://www.openstreetmap.org/${p.id}`);assert(p.coordinate[0]>=meta.bounds[0]&&p.coordinate[0]<=meta.bounds[2]);assert(p.coordinate[1]>=meta.bounds[1]&&p.coordinate[1]<=meta.bounds[3]);}
assert.equal(meta.buildings,geometry.features.filter(f=>f.properties.kind==='building').length);
assert.equal(meta.roads,geometry.features.filter(f=>f.properties.kind==='road').length);
assert.equal(meta.places,places.length);
assert(places.some(p=>/library/i.test(p.name)),'Expected a mapped library');
console.log(`Campus data checks passed: ${meta.buildings} buildings, ${meta.roads} roads, ${meta.places} places.`);
