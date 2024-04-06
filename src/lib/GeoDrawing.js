  import {get} from 'svelte/store';
  import {metersPerPixel} from '$lib/store';
  import bearing from '@turf/bearing';  // npm.install @turf/bearing
  import destination from '@turf/destination';  // npm.install @turf/destination
  import distance from '@turf/distance';  // npm.install @turf/distance
  import midpoint from '@turf/midpoint';  // npm.install @turf/midpoint
  import pointOnFeature from '@turf/point-on-feature';  // npm.install @turf/point-on-feature
  import nearestPointOnLine from '@turf/nearest-point-on-line'; // npm.install @turf/nearest-point-on-line
  import explode from '@turf/explode';  // npm.install @turf/explode
  import {point, lineString, polygon, multiPoint, multiPolygon} from '@turf/helpers'; // npm.install @turf/helpers 

  /**
  * @typedef LatLng
  * @type {Object}
  * @property {number} lat
  * @property {number} lng
  */

  /** @typedef LngLatArr
   * @type {[number, number]}
  */

  export const randomId = ()=> Math.random().toString(36).substring(2, 10);

  export const pxToMeter=(pixel=1)=> parseFloat((pixel * (get(metersPerPixel))).toFixed(2));

 /** @param {LngLatArr} a @returns {LngLatArr} */
  export const trimCoordArray=(a)=> a.map(c=> parseFloat(c.toFixed(6)));

  /** @param {LatLng} cor @return {LngLatArr} */
  export const latLngToLatLngArray=(cor)=> trimCoordArray([cor.lat, cor.lng]);

  /** @param {LatLng} cor @return {LngLatArr} */
  export const latLngToLngLatArray=(cor)=> trimCoordArray([cor.lng, cor.lat]);

  /** @param {LngLatArr} arr @return {LatLng} */
  export const lngLatArrayToLatLng=(arr)=> {return {lat: parseFloat(arr[1]).toFixed(6), lng: parseFloat(arr[0]).toFixed(6)}}

  export const explodeFeatureToArray=(ft)=> explode(ft).features.map(f=> trimCoordArray(f.geometry.coordinates));

  export const getNearestPointOnLine=(line, pt)=> trimCoordArray(nearestPointOnLine(lineString(line), point(pt), {units: 'kilometers'}).geometry.coordinates);

  const addPoint=(pt, dis, ang)=> trimCoordArray(destination(point(pt), pxToMeter(dis), ang, {units: 'meters'}).geometry.coordinates);

  export const pointsToEllipse=(f)=>{
    return [
      [parseFloat(distance(point(f.geometry.coordinates), point(f.geometry.ellipse[0]), {units:'meters'}).toFixed(1)),
      parseFloat(distance(point(f.geometry.coordinates), point(f.geometry.ellipse[1]), {units:'meters'}).toFixed(1))],
      bearing(point(f.geometry.coordinates), point(f.geometry.ellipse[0]))-90
    ]
  }

  export const pointToCircle=(f)=>{
    return parseFloat(distance(point(f.geometry.coordinates), point(f.geometry.circle), {units:'meters'}).toFixed(1));
  }

  const findDistCoord = (pt, dis, rot)=>{
    return destination(pt, dis, rot, {units: 'meters'}).geometry.coordinates  // returns a point coord
      .map(c=> parseFloat(c.toFixed(6)));
  }

  export const drawShape=(shape, cor)=> {
    let sh = point(cor);
    switch (shape) {
      case 'circle':
        sh.geometry.param = [pxToMeter(50)];
        break;
      case 'ellipse':
        sh.geometry.param = [pxToMeter(75), pxToMeter(25), 180];
        break;
      case 'line':
        sh = lineString([
          addPoint(cor, 75, 80),
          //addPoint(cor, 150, 105),
          addPoint(cor, 250, 15)]);
        break;        
      case 'polygon':
        sh = polygon([
          [
            addPoint(cor, 175, 0),
            addPoint(cor, 175, 120),
            addPoint(cor, 175, 240),
            addPoint(cor, 175, 0)
          ]
        ]);
        break;
      case 'multipolygon':
        sh = multiPolygon([
          [
            [
              addPoint(cor, 175, 0),
              addPoint(cor, 175, 120),
              addPoint(cor, 175, 240),
              addPoint(cor, 175, 0)
            ],
            [
              addPoint(cor, 70, 25),
              addPoint(cor, 50, 120),
              addPoint(cor, 45, 240),
              addPoint(cor, 70, 25)
            ]
          ],
          [
            [
              addPoint(cor, 275, 180),
              addPoint(cor, 190, 120),
              addPoint(cor, 190, 240),
              addPoint(cor, 275, 180)
            ]
          ]
        ]);
        break;
      default:
        break;
    }
    sh.properties.id = Math.random().toString(36).substring(2, 10);
    sh.properties.type = 0;
    sh.properties.data = 'TestData';
    sh.geometry.center = trimCoordArray(pointOnFeature(sh).geometry.coordinates);
    return sh;
  }

  const featureToMultiPoint=(ft)=>{
    let coords = ft.geometry.coordinates
    let pta = [];
    let par = ft.geometry.param;
    switch (ft.geometry.type) {
      case 'Point':
        pta = [coords];
        if(par){
          if(par.length===1){
            pta = [coords, findDistCoord(ft, par[0], 90)]
          }
          else{
            pta = [coords, findDistCoord(ft, par[0], par[2]-90), findDistCoord(ft, par[1], par[2])];          
          }
        }
        break;
      case 'LineString':
        pta = coords;
        break;
      case 'Polygon':
        pta = [...new Set(coords.flat().map(f=> JSON.stringify(f)))].map(s=> JSON.parse(s));
        break;        
        case 'MultiPolygon':
        pta = [...new Set(coords.flat(2).map(f=> JSON.stringify(f)))].map(s=> JSON.parse(s));
        break;    
      default:
        break;
    }
    return multiPoint(pta);
  }

  const arrayToMidPointArray=(a)=>{
    let mpa = a.map((f,i)=> i<a.length-1 && trimCoordArray(midpoint(point(f), point(a[i+1])).geometry.coordinates)).slice(0,-1);
    mpa = new Set([...a[0], ...a[a.length-1]]).size===2 ? [...mpa, mpa[0]] : mpa;
    return mpa;
  }
  
  const convertFeatureToMidPointFeature=(ft)=>{  // Ez tárolja a midpointokat
    let coords = ft.geometry.coordinates
    let mpa = [];
    let tmpFeature;
    switch (ft.geometry.type) {
      case 'LineString':
        mpa = arrayToMidPointArray(coords);
        tmpFeature = mpa.length>1 ? lineString(mpa) : point(mpa[0]);
        break;
      case 'Polygon':
        mpa = coords.map(f=>arrayToMidPointArray(f))
        tmpFeature = polygon(mpa);
        break;
      case 'MultiPolygon':
        mpa = coords.map(f=> f.map(f2=> arrayToMidPointArray(f2)));
        tmpFeature = multiPolygon(mpa);
        break;    
      default:
        break;
    }
    return tmpFeature;
  }
  
  export const drawControlPoints = (f)=>{
    let fc = {"type": "FeatureCollection", "features": []}
    let cp = featureToMultiPoint(f);
    cp.properties.type = 5;
    fc.features = [...fc.features, cp];

    if(f.geometry.type != 'Point'){
      let mp = convertFeatureToMidPointFeature(f);
      let cp = featureToMultiPoint(mp);
      cp.properties.type = 6;
      fc.features = [...fc.features, cp];
    }
    return fc;    
  }

  export const findIndexOfCoordArray = (arr, cor)=>{
    return arr.findIndex(f=> new Set([...f, ...cor]).size===2);
  }

  export const findIndexOfShape=(f, cor)=>{ // az temp rajzon keresi
    let coords = f.geometry.coordinates;
    let pti = null;
    let w;
    switch (f.geometry.type) {
        case 'MultiPoint':
        case 'LineString':
          w = findIndexOfCoordArray(coords, cor);
          pti =  w>-1 ? [w] : pti;
        break;
      case 'Polygon':
        coords.forEach((v,i)=>{
          w = findIndexOfCoordArray(v, cor);
          pti = w>-1 ? [i,w] : pti;
        })
        break;
      case 'MultiPolygon':
        coords.forEach((v,i)=>{
          v.forEach((z,j)=>{
            w = findIndexOfCoordArray(z, cor);
            pti = w>-1 ? [i,j,w] : pti;
          })
        })
        break;   
      default:
        break;
      }
    return pti;
  }

  export const addNewControlPoint=(f, cor)=>{
    let i = findIndexOfShape(convertFeatureToMidPointFeature(f), cor);
    let fc = f.geometry.coordinates;
    if(i){ 
      switch (f.geometry.type) {
        case 'LineString':
          fc.splice(i[0] + 1, 0, cor)
          break;
        case 'Polygon':
          fc[i[0]].splice(i[1] + 1, 0, cor)
          break;
        case 'MultiPolygon':
          fc[i[0]][i[1]].splice(i[2] + 1, 0, cor)
          break;   
        default:
          break;
        }
      }
    return f;
  }

  export const removeControlPoint =(f, cor)=>{
    let i = findIndexOfShape(f, cor);
    if(i){
      let fc = f.geometry.coordinates;
      switch (f.geometry.type) {
        case 'LineString':
          if(fc.length>2){
            fc.splice(i[0],1)
          }
          break;
        case 'Polygon':
          if(fc[i[0]].length>4){
            if(i[1]===0 ){
              fc[i[0]].splice(fc[i[0]].length-1,1);
              fc[i[0]][0] = fc[i[0]][fc[i[0]].length-1];
            }
            else{
              fc[i[0]].splice(i[1],1);
            }          
          }
          break;
        case 'MultiPolygon':
          if(fc[i[0]][i[1]].length>4){
            if(i[2]===0 ){
              fc[i[0]][i[1]].splice(fc[i[0]][i[1]].length-1,1);
              fc[i[0]][i[1]][0] = fc[i[0]][i[1]][fc[i[0]][i[1]].length-1];
            }
            else{
              fc[i[0]][i[1]].splice(i[2],1);
            }
          }        
          break;   
        default:
          break;
        }
    }
      return f;
  }

  export const updateSimpleShape = (f, c, i, cor)=>{
    let p = f.geometry.param;
    let mp = c.geometry.coordinates;
    switch (i[0]) {
      case 0:
        f.geometry.coordinates = cor;
        break;
      case 1:
        mp[1] = cor
        p[0] = parseFloat((distance(mp[0], mp[1], {units:'meters'})).toFixed(1));
        if(p.length>1){
          p[2] = parseFloat((bearing(mp[0], mp[1]) + 90).toFixed(1));
        }
        break;
      case 2:
        mp[2] = cor;
        p[1] = parseFloat((distance(mp[0], mp[2], {units:'meters'})).toFixed(1));
        break;
      default:
        return false
    }
    return f;
  }

  export const updateComplexShape = (f, i, cor)=>{
    if(!i) return
    let coords = f.geometry.coordinates;
    switch (f.geometry.type) {
      case 'LineString':
        coords[i[0]] = cor;
        break;
      case 'Polygon':
        coords[i[0]][i[1]] = cor;
        if(i[1] === 0){
          coords[i[0]][coords[i[0]].length-1] = cor;
        }
        break;
      case 'MultiPolygon':
        coords[i[0]][i[1]][i[2]] = cor;
        if(i[2] === 0){
          coords[i[0]][i[1]][coords[i[0]][i[1]].length-1] = cor;
        }        
        break;    
      default:
        break;
    }
    return f
  }

  export const getCoords= async()=>{
    try{
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject,{
          timeout: 15000,
          maximumAge: 1000,
          enableHighAccuracy: true
        });
      });

      let cor = [ position.coords.longitude, position.coords.latitude ];
      cor = cor.map(s=>parseFloat(s.toFixed(6)));
      let tmpPoint =
      {
        "type": "Feature",
        "properties": {
          data: "GPS",
          type: 3,
          id: 'G15'
        },
        "geometry": {
          "type": "Point",
          "param": [parseFloat(position.coords.accuracy.toFixed(1))],
          "coordinates": cor
        }
      } 
      return tmpPoint;
    } catch(e) {
      return locationError(e)
    }
  }
    
  const locationError = (error)=> {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        return "User denied the request for geolocation.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is currently unavailable.";
      case error.TIMEOUT:
        return "Request for user location timed out.";
      case error.UNKNOWN_ERROR:
        return "An unknown error occurred.";
    }
  
  }
  
  /*const getMaxId=(gjs)=> {
    return gjs.features.reduce((a,b)=> b.properties.id > a ? b.properties.id : a, 50);
  }*/