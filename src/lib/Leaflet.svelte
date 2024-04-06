<script>
  import { onMount, onDestroy, createEventDispatcher, setContext } from 'svelte'
  import 'leaflet/dist/leaflet.css';
  import L from 'leaflet';
  import {latLngToLatLngArray} from '$lib/GeoDrawing.js';
  import {mapState, controlGeo} from '$lib/store';

  let map;
  let mapElement;

  export const getMap = () => map;


  const dispatch = createEventDispatcher();

  onMount(()=> {
    map = L.map(mapElement, {
      center: $mapState.center,
      zoom: $mapState.zoom
    })
    .on('click',()=> {
      dispatch('mapClick');
    })    
    .on('dragend',()=> {
      $mapState.center = latLngToLatLngArray(map.getCenter());
    })
    .on('zoomend',()=> {
      $mapState.zoom = map.getZoom();
      $mapState.center = latLngToLatLngArray(map.getCenter());
    })
    .on('baselayerchange',(e)=> {
      $mapState.baselayer= e.name;
      console.log($mapState.baselayer);
    })
    .on('overlayadd',(e)=> {
      if($mapState.overlays.includes(e.name)) return;
      $mapState.overlays = [...$mapState.overlays, e.name];
      console.log($mapState.overlays);
    })
    .on('overlayremove',(e)=> {
      $mapState.overlays = $mapState.overlays.filter(d=> d!=e.name);
      console.log($mapState.overlays);
    });

  });

  onDestroy(()=> {
    map?.off('dragend zoomend baselayerchange overlayadd overlayremove');
    map?.remove();
    map = undefined;
    $controlGeo.features = [];
  });

  setContext(L.Map, ()=> map);

</script>

<div class="w-full h-full border border-slate-500 z-1000" bind:this={mapElement}>
  {#if map }
    <slot/>
  {/if}
</div>