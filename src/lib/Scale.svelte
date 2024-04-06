<script>
  import { onMount, onDestroy, getContext } from 'svelte'
  import L from 'leaflet';

  export let position = 'bottomleft';
  export let imperial = false;

  let scale;
  let scaleElement;
  
  const map = getContext(L.Map);

  onMount(()=>{
    if (map){
      scale = L.control.scale({position, imperial, maxWidth: 200}).addTo(map());
    }
  })

  onDestroy(()=>{
    scale?.remove();
    scale = undefined
  })

</script>

<div bind:this={scaleElement}/>