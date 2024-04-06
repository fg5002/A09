<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from "./Modal.svelte";
  import MenuItem from "./MenuItem.svelte";

  export let showDrawingMenu = false;

  const dispatch = createEventDispatcher();

  const selectNewShape = (p)=> {
    dispatch('selectNewShape', p)
    showDrawingMenu = false;
  }

</script>

<Modal 
  bind:showModal={showDrawingMenu}
  modalClass = "drawingmenu"
  backdropClasses = "items-end justify-center z-2000"
  mainClasses = "mb-8"
  inFly = {{y: 500, duration: 500}}
  outFly = {{y: 500, duration: 500}}
>
  <div class="flex flex-col divide-y divide-slate-500 shadow-2xl">

    <MenuItem title={"Point"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} img={'images/circle-medium.svg'} on:click={()=> selectNewShape('point')}/> 
    <MenuItem title={"Circle"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} img={'images/vector-circle-variant.svg'} on:click={()=> selectNewShape('circle')}/> 
    <MenuItem title={"Ellipse"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} img={'images/vector-ellipse.svg'} on:click={()=> selectNewShape('ellipse')}/> 
    <MenuItem title={"Line"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} img={'images/vector-polyline.svg'} on:click={()=> selectNewShape('line')}/> 
    <MenuItem title={"Polygon"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} img={'images/vector-triangle.svg'} on:click={()=> selectNewShape('polygon')}/> 
    <MenuItem title={"Multipolygon"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} img={'images/vector-polygon.svg'} on:click={()=> selectNewShape('multipolygon')}/>

  </div>
</Modal>