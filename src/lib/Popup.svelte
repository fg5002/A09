<script>
  import {getContext, onMount, onDestroy} from 'svelte';
  import L from 'leaflet';

  const layer = getContext(L.Layer);

  let popup;
  let popupElement;

  let options = {
    closeButton: false
  }

  onMount(()=>{
    popup = L.popup(options).setContent(popupElement);
    if (layer){
      layer().bindPopup(popup, options);
      layer().on('popupopen', ()=> {open=true});
      layer().on('popupclose', ()=> {open=false});
    }
  })

  onDestroy(() => {
    layer()?.off('popupopen', 'popupclose');
    layer()?.unbindPopup();
    popup?.remove();
    popup = undefined;  
  });

</script>

<div style="display: none;">
  <div bind:this={popupElement} class="border-2 bg-lime-400 p-4">
    XXXX
    <slot/>
  </div>
</div>