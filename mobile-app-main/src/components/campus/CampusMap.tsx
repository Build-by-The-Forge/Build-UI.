import React, { useEffect, useMemo, useRef } from 'react';
import { Map, Camera, GeoJSONSource, Layer, type CameraRef, type MapRef } from '@maplibre/maplibre-react-native';
import { CAMPUS_CENTER, campusStyle, type CampusMapProps } from './mapStyle';

export default function CampusMap({threeD,selected,resetKey,onReady,onError,onSelect,tracking,userLocation,heading}:CampusMapProps) {
  const map=useRef<MapRef>(null);
  const camera=useRef<CameraRef>(null);
  const style=useMemo(()=>campusStyle(threeD,selected?.id),[threeD,selected?.id]);
  useEffect(()=>{if(selected)camera.current?.easeTo({center:selected.coordinate as [number,number],zoom:17,duration:650});},[selected]);
  useEffect(()=>{camera.current?.easeTo({center:CAMPUS_CENTER,zoom:15.8,bearing:-15,duration:650});},[resetKey]);
  useEffect(()=>{if(tracking&&userLocation)camera.current?.easeTo({center:userLocation,zoom:17,bearing:heading??0,pitch:threeD?52:0,duration:650});},[tracking,userLocation,heading,threeD]);
  return <Map ref={map} mapStyle={style as React.ComponentProps<typeof Map>['mapStyle']} style={{flex:1}} attribution={false} onDidFinishLoadingMap={onReady} onDidFailLoadingMap={onError} onPress={async event=>{
    try {
      const hits=await map.current?.queryRenderedFeatures(event.nativeEvent.point,{layers:['place-dots','buildings-3d','buildings-flat']});
      const id=hits?.[0]?.properties?.id||hits?.[0]?.properties?.osmId;
      if(typeof id==='string')onSelect(id);
    } catch(error){console.warn('Could not select campus feature',error);}
  }}>
    <Camera ref={camera} pitch={threeD?52:0} initialViewState={{center:CAMPUS_CENTER,zoom:15.8,pitch:52,bearing:-15}} minZoom={13} maxZoom={20} />
    <GeoJSONSource id="user-location" data={{type:'FeatureCollection',features:userLocation?[{type:'Feature',geometry:{type:'Point',coordinates:userLocation},properties:{}}]:[]}}><Layer id="user-location-halo" type="circle" paint={{'circle-radius':13,'circle-color':'#1685ee','circle-opacity':0.2}}/><Layer id="user-location-dot" type="circle" paint={{'circle-radius':6,'circle-color':'#1685ee','circle-stroke-width':3,'circle-stroke-color':'#ffffff'}}/></GeoJSONSource>
  </Map>;
}
