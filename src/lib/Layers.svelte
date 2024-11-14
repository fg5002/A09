<script>
  import L from 'leaflet';
  import {getContext, setContext, onMount} from 'svelte';

  export let position = 'topright';
  export let options = {};

  let controlLayers;

  const map = getContext(L.Map);
  
  setContext(L.Control.Layers, ()=> controlLayers);

  onMount(()=> {
    controlLayers = map() && L.control.layers({}, {}, options);
    controlLayers.setPosition(position);
    controlLayers.addTo(map());
    
    return ()=> {
      controlLayers.remove();
      controlLayers = undefined;
    };
  });

</script>

{#if controlLayers }
    <slot/>
{/if}