<script>
  import { fade , fly} from 'svelte/transition';
  import Marker from './Marker.svelte';
  import DivIcon from './DivIcon.svelte';
  
  export let showContextMenu = false;
  export let cor;

  let markerElement;

  const markerOptions =  {draggable: true}

  const iconOptions = {
    iconSize: null,
    className: "w-auto h-auto bg-transparent",
    iconAnchor: [-20, 20]
  }

</script>

{#if showContextMenu}
  <Marker
    latLng = {cor}
    options = {markerOptions}
    bind:this={markerElement}
  >
    <DivIcon options={iconOptions}>
      <div
        class="w-auto h-auto flex flex-col shadow-2xl bg-transparent"
        in:fade={{duration: 200}} 
        out:fade={{duration: 300}} 
      >  
        <slot/>  
      </div>
    </DivIcon>
  </Marker>
{/if}