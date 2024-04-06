<script>
  
  import L from 'leaflet';
  import {hasContext, getContext, onMount, onDestroy, createEventDispatcher} from 'svelte';
  import '$lib/l.ellipse.min';
  import {latLngToLatLngArray, pointToCircle, pointsToEllipse} from '$lib/GeoDrawing.js';
  import {mapState} from '$lib/store';
  
  export let name="";
  export let data = [];

  const dispatch = createEventDispatcher();
  
  let geojson;
  let geojsonElement;

  const map = getContext(L.Map);
  const subgroup = getContext('subGroup');
  const clustered = hasContext(L.FeatureGroup);

  const popupContent = (d)=>{
    if(d.data){
      return `<div class="p-2 w-auto flex flex-col select-none">
                <span>${d.id}</span>
                <!--span class="font-semobold text-lg">${d.data}</span-->
              </div>`
    }
  }

  const options = {
    onEachFeature: (feature, layer)=> {
      layer.bindPopup(popupContent(feature.properties),{
        closeButton: false,
        offset: L.point({x:0, y:-5}),
        maxWidth: 200       
      })      
      .on('contextmenu', (e)=> {
        dispatch('openContextMenu', {
          id: feature.properties.id,
          pos: latLngToLatLngArray(e.latlng)
        })
      })
    },

    pointToLayer: (feature, latlng)=>{
      let zindex = feature.properties.type === 0 ? 20000 : 1000
      if(feature.geometry.param){
        let p=feature.geometry.param;
        return p.length>1 ? L.ellipse(latlng, [p[0],p[1]],p[2]) : L.circle(latlng, parseFloat(p[0]));
    }else{
      return L.circleMarker(latlng, {zIndexOffset: zindex});
    }
    },

    style: (feature)=>{
      switch (feature.properties.type) {
        case 0: // Temp
          return {
            fillColor: 'red',
            radius: 7,
            color: 'black',
            weight: 1,
            opacity: 1.0,
            fillOpacity: 0.4
          };
        case 1:
          return {
            fillColor: 'yellow',
            radius: 7,
            color: 'red',
            weight: 1,
            opacity: 1.0,
            fillOpacity: 1.0
          };
        case 2:
          return {
            fillColor: 'yellowgreen',
            radius: 7,
            color: 'lime',
            weight: 5,
            opacity: 1.0,
            fillOpacity: 0.5
          };
        case 3:
          return {
            fillColor: 'cyan',
            radius: 7,
            color: 'red',
            weight: 1,
            opacity: 1.0,
            fillOpacity: 0.5
          };
        case 4:
          return {
            fillColor: 'red',
            radius: 7,
            color: 'black',
            weight: 1,
            opacity: 1.0,
            fillOpacity: 0.5
          };
        case 5:
          return {
            fillColor: 'cyan',
            radius: 5,
            color: 'blue',
            weight: 1,
            opacity: 1.0,
            fillOpacity: 1.0
          };
        case 6:
          return {
            fillColor: 'cyan',
            radius: 3,
            color: 'blue',
            weight: 1,
            opacity: 1.0,
            fillOpacity: 1.0
          };
        default:
          break;
      }
    }

  }

  onMount(()=> {
    if(map()){
      geojson = L.geoJSON(data, options);
      if(clustered){
        geojson.addTo(subgroup());
        if($mapState.overlays.includes(name)){
          subgroup().addTo(map());    
        }
      }else{
        geojson.addTo(map());
      }
    }
  });

  onDestroy(()=>{
    clustered && subgroup().remove();
    geojson.remove();
    geojson = undefined;
  });

  $: {
    clustered && geojson && subgroup().removeLayer(geojson);
    geojson && geojson.clearLayers().addData(data);
    clustered && geojson && subgroup().addLayer(geojson);
  }

</script>

<div bind:this={geojsonElement}>
  {#if geojson}
    <slot/>
  {/if}
</div>

<style>
  :global(.leaflet-popup-content-wrapper) {
    margin: 0px;
    padding: 0px;
    width:auto;
  }
  :global(.leaflet-popup-content) {
    border-radius: 5px;
    padding: 0px;
    margin: 0px;
    background-color: yellow;
  }
  :global(.leaflet-popup-tip) {
    background-color: yellow;
  }
</style>