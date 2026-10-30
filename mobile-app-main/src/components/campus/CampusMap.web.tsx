import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CAMPUS_CENTER, buildingColor, campusPlacesGeoJSON, campusStyle, visiblePlaceFilter, type CampusMapProps } from './mapStyle';

export default function CampusMap({threeD, selected, resetKey, onSelect, onReady, onError, tracking, userLocation, heading}: CampusMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const callbacks = useRef({onSelect,onReady,onError});
  callbacks.current = {onSelect,onReady,onError};
  useEffect(() => {
    if (!container.current) return;
    let instance: maplibregl.Map;
    try {
      maplibregl.setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');
      maplibregl.setWorkerCount(2);
      instance = new maplibregl.Map({container:container.current,style:campusStyle(true),center:CAMPUS_CENTER,zoom:15.8,pitch:52,bearing:-15,maxZoom:20,minZoom:13,attributionControl:false});
      map.current = instance;
      instance.on('load',()=>callbacks.current.onReady());
      instance.on('error', event => {
        console.warn('Campus map:',event.error);
        if (/worker|webgl|source|style/i.test(event.error.message)) callbacks.current.onError();
      });
      instance.on('click',event=>{
        const hit=instance.queryRenderedFeatures(event.point,{layers:['place-dots','buildings-3d','buildings-flat']})[0];
        const id=hit?.properties?.id || hit?.properties?.osmId;
        if(id) callbacks.current.onSelect(id);
      });
      instance.on('mouseenter','place-dots',()=>{instance.getCanvas().style.cursor='pointer';});
      instance.on('mouseleave','place-dots',()=>{instance.getCanvas().style.cursor='';});
    } catch { callbacks.current.onError(); return; }
    const observer = new ResizeObserver(()=>instance.resize()); observer.observe(container.current);
    return ()=>{observer.disconnect();instance.remove();map.current=null;};
  },[]);
  useEffect(()=>{
    const instance=map.current;if(!instance)return;
    const update=()=>{
      instance.setLayoutProperty('buildings-3d','visibility',threeD?'visible':'none');
      instance.setPaintProperty('buildings-flat','fill-color',buildingColor(selected?.id));
      instance.setPaintProperty('buildings-3d','fill-extrusion-color',buildingColor(selected?.id));
      (instance.getSource('places') as maplibregl.GeoJSONSource|undefined)?.setData(campusPlacesGeoJSON(selected?.id));
      for(const layer of ['place-halos','place-dots','place-labels'])instance.setFilter(layer,visiblePlaceFilter(selected?.id));
      instance.setPaintProperty('place-halos','circle-radius',['case',['==',['get','id'],selected?.id||''],13,10]);
      instance.setPaintProperty('place-dots','circle-radius',['case',['==',['get','id'],selected?.id||''],7,5]);
      instance.easeTo({pitch:threeD?52:0,...(selected?{center:selected.coordinate as [number,number],zoom:17}:{}),duration:650});
    };
    // isStyleLoaded() becomes false during glyph requests after a camera move.
    // The one-shot load event has already fired then; use layer availability.
    if(instance.getLayer('buildings-3d'))update();else instance.once('style.load',update);
    return ()=>{instance.off('style.load',update);};
  },[threeD,selected]);
  useEffect(()=>{const instance=map.current;if(!instance)return;const source=instance.getSource('user') as maplibregl.GeoJSONSource|undefined;if(source)source.setData({type:'FeatureCollection',features:userLocation?[{type:'Feature',geometry:{type:'Point',coordinates:userLocation},properties:{}}]:[]});if(tracking&&userLocation)instance.easeTo({center:userLocation,bearing:heading??instance.getBearing(),duration:700});},[tracking,userLocation,heading]);
  useEffect(()=>{map.current?.easeTo({center:CAMPUS_CENTER,zoom:15.8,bearing:-15,duration:650});},[resetKey]);
  return <div ref={container} style={{position:'absolute',inset:0}} aria-label="Interactive FUTA campus map" />;
}
