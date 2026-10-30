import type { StyleSpecification } from 'maplibre-gl';
import geometry from '@/data/campus/geometry.json';
import places from '@/data/campus/places.json';

export type CampusPlace = typeof places[number];
export const CAMPUS_CENTER: [number, number] = [5.134, 7.3035];
export interface CampusMapProps {
  threeD: boolean;
  selected: CampusPlace | null;
  resetKey: number;
  onSelect: (id: string) => void;
  onReady: () => void;
  onError: () => void;
  tracking: boolean;
  userLocation: [number, number] | null;
  heading: number | null;
}

const featuredNames = new Set([
  'Center for Continuing Education Lecture hall (CCE)',
  'FUTA MULTIPURPOSE HALL',
  'New Senate Building',
  'Old Senate Building',
  'SAAT Library',
  'School of Computing (SCOM)',
  'School of Computing (SOC)',
  'SEET Library',
]);

export function campusPlacesGeoJSON(selectedId?: string): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: places.filter(p => p.id === selectedId || featuredNames.has(p.name) || p.category === 'Libraries' || p.category === 'Health')
      .map(p => ({ type: 'Feature', geometry: { type: 'Point', coordinates: p.coordinate }, properties: { id: p.id, name: p.name, category: p.category, featured: featuredNames.has(p.name) } })),
  };
}

export const buildingColor = (selectedId?: string) => [
  'match', ['get', 'osmId'], selectedId || '', '#2563eb',
  ['match', ['get', 'category'],
    'Academic', '#a9c8e4',
    'Libraries', '#91b3dc',
    'Hostels', '#d9c4ad',
    'Food', '#dfbc9b',
    'Health', '#a9cdbd',
    '#d8d0c3',
  ],
] as any;

export const visiblePlaceFilter = (selectedId?: string) => [
  'any',
  ['==', ['get', 'id'], selectedId || ''],
  ['==', ['get', 'featured'], true],
  ['in', ['get', 'category'], ['literal', ['Libraries', 'Health']]],
] as any;

// Bundled OSM geometry: no tile server or API key is needed for the campus layer.
export function campusStyle(threeD: boolean, selectedId?: string, userLocation?: [number, number] | null): StyleSpecification {
  return {
    version: 8,
    glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sources: {
      campus: { type: 'geojson', data: geometry as GeoJSON.FeatureCollection },
      places: { type: 'geojson', data: campusPlacesGeoJSON(selectedId) },
      user: { type: 'geojson', data: { type: 'FeatureCollection', features: userLocation ? [{ type: 'Feature', geometry: { type: 'Point', coordinates: userLocation }, properties: {} }] : [] } },
    },
    layers: [
      { id: 'ground', type: 'background', paint: { 'background-color': '#f3f1e9' } },
      { id: 'land', type: 'fill', source: 'campus', filter: ['==', ['get','kind'], 'land'], paint: { 'fill-color': ['match', ['get','land'], ['water','reservoir'], '#a8d4df', ['forest','wood'], '#b7d3b4', ['grass','meadow','scrub'], '#cee0c2', '#e6e9db'], 'fill-opacity': 0.92 } },
      { id: 'boundary', type: 'line', source: 'campus', filter: ['==',['get','kind'],'boundary'], paint: { 'line-color':'#88aa99', 'line-width':1.2, 'line-dasharray':[3,3], 'line-opacity':0.48 } },
      { id: 'road-edge', type:'line', source:'campus', filter:['==',['get','kind'],'road'], layout:{'line-cap':'round','line-join':'round'}, paint:{'line-color':'#d7d7cb','line-width':['interpolate',['linear'],['zoom'],13,2,17,13,19,24]} },
      { id: 'roads', type:'line', source:'campus', filter:['==',['get','kind'],'road'], layout:{'line-cap':'round','line-join':'round'}, paint:{'line-color':'#fffdf8','line-width':['interpolate',['linear'],['zoom'],13,1,17,9,19,19]} },
      { id:'buildings-flat', type:'fill', source:'campus', filter:['==',['get','kind'],'building'], paint:{'fill-color':buildingColor(selectedId),'fill-outline-color':'#aab7b8'} },
      { id:'buildings-3d', type:'fill-extrusion', source:'campus', filter:['==',['get','kind'],'building'], layout:{visibility:threeD?'visible':'none'}, paint:{'fill-extrusion-color':buildingColor(selectedId),'fill-extrusion-height':['get','height'],'fill-extrusion-base':0,'fill-extrusion-opacity':0.97,'fill-extrusion-vertical-gradient':true} },
      { id:'place-halos', type:'circle', source:'places', filter:visiblePlaceFilter(selectedId), minzoom:14, paint:{'circle-radius':['case',['==',['get','id'],selectedId||''],13,10],'circle-color':'#ffffff','circle-opacity':0.85} },
      { id:'place-dots', type:'circle', source:'places', filter:visiblePlaceFilter(selectedId), minzoom:14, paint:{'circle-radius':['case',['==',['get','id'],selectedId||''],7,5],'circle-color':['case',['==',['get','id'],selectedId||''],'#2563eb',['match',['get','category'],'Libraries','#6c69b8','Health','#2c9a83','#2563eb']],'circle-stroke-width':1.5,'circle-stroke-color':'#ffffff'} },
      { id:'place-labels', type:'symbol', source:'places', filter:visiblePlaceFilter(selectedId), minzoom:16, layout:{'text-field':['get','name'],'text-font':['Open Sans Regular'],'text-size':11,'text-max-width':12,'text-offset':[0,1.35],'text-anchor':'top'}, paint:{'text-color':'#29445b','text-halo-color':'#fffdf8','text-halo-width':2} },
      { id:'user-halo', type:'circle', source:'user', paint:{'circle-radius':12,'circle-color':'#1685ee','circle-opacity':0.18} },
      { id:'user-dot', type:'circle', source:'user', paint:{'circle-radius':6,'circle-color':'#1685ee','circle-stroke-width':3,'circle-stroke-color':'#ffffff'} },
    ],
  };
}
