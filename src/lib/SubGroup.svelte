<script>
  import L from 'leaflet';
  import "leaflet.featuregroup.subgroup";
  import {getContext, setContext, onMount, onDestroy} from 'svelte';

  export let name="";
  
  let subgroup;
  
  const controlLayers = getContext(L.Control.Layers);
  const markerCluster = getContext(L.FeatureGroup);

  setContext('subGroup', ()=> subgroup);

  onMount(()=> {
    subgroup = L.featureGroup.subGroup(markerCluster());
    controlLayers().addOverlay(subgroup, name);
  });

  onDestroy(()=> {
    subgroup.remove();
  });

</script>

{#if subgroup }
    <slot></slot>
{/if}