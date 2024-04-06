<script>
  import L from 'leaflet';
  import {onDestroy, getContext, setContext, onMount} from 'svelte';

  export let position = 'topright';
  export let options = {};

  let controlLayers;

  const map = getContext(L.Map);
  
  setContext(L.Control.Layers, ()=> controlLayers);

  onMount(()=> {
    controlLayers = L.control.layers({}, {}, options);
    controlLayers.setPosition(position);
    controlLayers.addTo(map());
  });

  onDestroy(() => {
    controlLayers.remove();
    controlLayers = undefined;
  });

</script>

{#if controlLayers }
    <slot/>
{/if}