<script>
  import L from 'leaflet';
  import {getContext, setContext, onMount, onDestroy} from 'svelte';
  import 'leaflet.markercluster/dist/leaflet.markercluster.js';
  import 'leaflet.markercluster/dist/MarkerCluster.css';
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

  let markerCluster;
  let markerClusterElement;

  let options = {
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true
  }

  const map = getContext(L.Map);

  setContext(L.FeatureGroup, ()=> markerCluster);

  onMount(()=> {
      markerCluster = map() && L.markerClusterGroup(options).addTo(map());
  })

  onDestroy(()=> {
    markerCluster?.remove();
    markerCluster = undefined;
  });

</script>

<div bind:this={markerClusterElement}>
  {#if markerCluster}
    <slot/>
  {/if}
</div>