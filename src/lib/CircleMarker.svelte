<script>
  import { onMount, onDestroy, getContext, setContext } from 'svelte'
  import L from 'leaflet';

  const map = getContext(L.Map);

  export let latLng;

  let circleMarker;
  let circleMarkerElement;

  setContext(L.Layer, ()=> circleMarker);

  let options = {
          fillColor: 'yellow',
          radius: 7,
          color: 'red',
          weight: 1,
          opacity: 1.0,
          fillOpacity: 1.0
        };

  onMount(()=>{
    circleMarker = map() && L.circleMarker(latLng, options).addTo(map());
  });

  onDestroy(()=>{
    circleMarker?.remove();
    circleMarker = undefined
  });

  setContext('layer', ()=> circleMarker);

</script>

<div bind:this={circleMarkerElement}>
  {#if circleMarker}
    <slot/>
  {/if}
</div>