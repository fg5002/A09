<script>
  import { onMount, onDestroy, getContext, setContext, createEventDispatcher } from 'svelte';
  import L from 'leaflet';

  export let latLng;
  export let options;

  let marker;
  let markerElement;

  const dispatch = createEventDispatcher();

  const map = getContext(L.Map);

  onMount(()=>{
    if (map){
      marker = L.marker(latLng, options)
      .on('click', (e)=> dispatch('cursorClick', e))
      .on('contextmenu', (e)=> dispatch('cursorContextMenu', e))
      .on('drag',(e)=> dispatch('cursorDrag', e))
      .on('dragend',()=> dispatch('cursorDragEnd'))
      .addTo(map());
    }
  })
  
  onDestroy(()=>{
    marker?.off('click contextmenu drag dragend');
    marker?.remove();
    marker = undefined
  })

  setContext(L.Marker, ()=> marker);

</script>

<div bind:this={markerElement}>
  {#if marker}
    <slot />
  {/if}
</div>