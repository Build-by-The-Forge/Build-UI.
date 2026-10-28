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
}

// Bundled OSM geometry: no tile server or API key is needed for the campus layer.
export function campusStyle(threeD: boolean, selectedId?: string): StyleSpecification {
  return {
    version: 8,
    glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sources: {
      campus: { type: 'geojson', data: geometry as GeoJSON.FeatureCollection, attribution: '© OpenStreetMap contributors' },
      places: { type: 'geojson', data: { type: 'FeatureCollection', features: places.map(p => ({ type: 'Feature', geometry: { type: 'Point', coordinates: p.coordinate }, properties: { id: p.id, name: p.name } })) } },
    },
    layers: [
      { id: 'ground', type: 'background', paint: { 'background-color': '#edf0e9' } },
      { id: 'land', type: 'fill', source: 'campus', filter: ['==', ['get','kind'], 'land'], paint: { 'fill-color': ['match', ['get','land'], ['water','reservoir'], '#b8dae9', ['forest','wood','grass','meadow','scrub'], '#cadcc4', '#dce5d4'], 'fill-opacity': 0.85 } },
      { id: 'boundary', type: 'line', source: 'campus', filter: ['==',['get','kind'],'boundary'], paint: { 'line-color':'#719b8c', 'line-width':1.5, 'line-dasharray':[3,3], 'line-opacity':0.6 } },
      { id: 'road-edge', type:'line', source:'campus', filter:['==',['get','kind'],'road'], layout:{'line-cap':'round','line-join':'round'}, paint:{'line-color':'#d2d8d2','line-width':['interpolate',['linear'],['zoom'],13,2,17,13,19,24]} },
      { id: 'roads', type:'line', source:'campus', filter:['==',['get','kind'],'road'], layout:{'line-cap':'round','line-join':'round'}, paint:{'line-color':'#ffffff','line-width':['interpolate',['linear'],['zoom'],13,1,17,9,19,19]} },
      { id:'buildings-flat', type:'fill', source:'campus', filter:['==',['get','kind'],'building'], paint:{'fill-color':'#c0cbd3','fill-outline-color':'#a8b8c3'} },
      { id:'buildings-3d', type:'fill-extrusion', source:'campus', filter:['==',['get','kind'],'building'], layout:{visibility:threeD?'visible':'none'}, paint:{'fill-extrusion-color':['case',['==',['get','osmId'],selectedId||''],'#2487ed','#c4d2df'],'fill-extrusion-height':['get','height'],'fill-extrusion-base':0,'fill-extrusion-opacity':0.96} },
      { id:'place-dots', type:'circle', source:'places', minzoom:14, paint:{'circle-radius':['case',['==',['get','id'],selectedId||''],8,4],'circle-color':['case',['==',['get','id'],selectedId||''],'#1266da','#6c91ad'],'circle-stroke-width':2,'circle-stroke-color':'#ffffff'} },
      { id:'place-labels', type:'symbol', source:'places', minzoom:16, layout:{'text-field':['get','name'],'text-font':['Open Sans Regular'],'text-size':11,'text-max-width':12,'text-offset':[0,1.2],'text-anchor':'top'}, paint:{'text-color':'#354b60','text-halo-color':'#ffffff','text-halo-width':1.5} },
    ],
  };
}
