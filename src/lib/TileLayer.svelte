<script>
  import L from 'leaflet';
  import {onDestroy, onMount, getContext} from 'svelte';

  export let name;
  export let url;
  export let options = {};
  export let selected = false;

  let tileLayer;

  const map = getContext(L.Map);
  const controlLayers = getContext(L.Control.Layers);

  onMount(()=> {
    tileLayer = L.tileLayer(url, options);
    controlLayers().addBaseLayer(tileLayer, name);
    selected && tileLayer.addTo(map());
  });

  onDestroy(() => {
    tileLayer.remove();
    tileLayer = undefined;
  });

</script>