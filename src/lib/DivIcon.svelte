<script>
  import { onMount, onDestroy, getContext } from 'svelte'
  import L from 'leaflet';

  export let options = {};
  
  let divIcon;
  let html;

  const marker = getContext(L.Marker);

  onMount(()=>{
    if (marker){
      divIcon = L.divIcon({...{html}, ...options});
      marker().setIcon(divIcon);
    }
  })

  onDestroy(()=>{
    divIcon = undefined;
  })

</script>

<div bind:this={html}>
  <slot></slot>
</div>
