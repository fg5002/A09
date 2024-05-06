<script>
  import Leaflet from "$lib/Leaflet.svelte";
  import Scale from '$lib/Scale.svelte';
  import Layers from "$lib/Layers.svelte";
  import TileLayer from "$lib/TileLayer.svelte";
  import MarkerCluster from "$lib/MarkerCluster.svelte";
  import GeoJson from "$lib/GeoJson.svelte";
  import Cursor from '$lib/Cursor.svelte';

  import Control from "$lib/Control.svelte";
  import LeafletContextMenu from "$lib/LeafletContextMenu.svelte";
  import {tempGeo, mapState, dailyData, geoData, queryData, gpsGeo, controlGeo, selectedShape, tempIndex, pointIndex, currData, quadrat} from '$lib/store';
  import { drawControlPoints, getCoords, drawShape } from '$lib/GeoDrawing.js';
  import MenuItem from "$lib/MenuItem.svelte";
  import SubGroup from "$lib/SubGroup.svelte";
  import Modal from "$lib/Modal.svelte";
  import CoordInput from "$lib/CoordInput.svelte";
  import TaxonEditor from "$lib/TaxonEditor.svelte";
	import DailyList from "$lib/DailyList.svelte";
  import DrawingMenu from "$lib/DrawingMenu.svelte";
	import TextInput from "../../lib/TextInput.svelte";

  let showCursor = false;
  let cursorPos;
  let showModal = false;
  let showContextMenu = false;
  let showCoordInput = false
  let showEditor = false;
  let showDailyList = false;
  let showDrawingMenu = false;
  let quickPoint = false;
  let map;
  
  $: cursorPos = $mapState.center;
  
  const toggleModal = ()=> showModal=!showModal;
  const toggleEditor = ()=> showEditor=!showEditor;
  const toggleCoordInput = ()=> showCoordInput=!showCoordInput;
  
  const openEditing = (e)=>{
    cursorPos = e.detail.pos;
    showContextMenu = false;
    showContextMenu = true;
    $tempIndex = $tempGeo.features.findIndex(f=> f.properties.id === e.detail.id);
  }

  const beginEdit = ()=>{
    $controlGeo = drawControlPoints($tempGeo.features[$tempIndex]);
    showCursor = true;
    showContextMenu = false;
  }

  const copyToClipboard = async()=> {
    try {
      let geo = $tempGeo.features[$tempIndex].geometry;
      let text = geo.param ? [...geo.coordinates, ...geo.param] : geo.coordinates;
      //console.log(JSON.stringify(text));
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      showContextMenu = false;
    } catch (err) {
      console.error(err);
    }
  }


  const openInTaxonEditor = ()=>{
    let f = $tempGeo.features[$tempIndex];
    $currData.geometry.type = f.geometry.type;
    $currData.geometry.id = f.properties.id;
    showContextMenu = false;
    showEditor = true;
  }

  const closeEverything = ()=>{
    $controlGeo.features = [];
    $pointIndex = null;
    showContextMenu = false;
    showCursor= false;
    quickPoint = false;
  }

  const selectNewShape = (e)=> {
    $selectedShape = e;
    showCursor = true;
  }

  const deleteShape= ()=>{
    $tempGeo.features = [...$tempGeo.features.filter(f=> f != $tempGeo.features[$tempIndex])];
    $tempIndex = null;
    showContextMenu = false;
  }
  
  const drawQuickPoint = ()=>{
    if(showCursor) return;
    quickPoint = true;
    selectNewShape('point');
  }

  const drawNewShape=(e)=>{ //cursorClick
    let sh = drawShape($selectedShape, e.detail);
    console.log(e.detail, $selectedShape, sh.properties.id)
    $tempGeo.features = [...$tempGeo.features, sh];
    
    if(quickPoint === true){
      $currData.geometry = {type: $selectedShape, id: $tempGeo.features[$tempGeo.features.length-1].properties.id};
      showEditor = true;
      quickPoint = false;
    }
    $selectedShape = 'point';
    showCursor = false;
  }

  const mapClick = ()=>{
    closeEverything();
  }

  const getGPS = async()=>{
    let g = await getCoords();
    if(g.geometry){
      $gpsGeo.features=[g];
      let cor = g.geometry.coordinates;
      g.geometry.param[0]>1000 ? map.getMap().flyTo([cor[1], cor[0]], 13) : map.getMap().flyTo([cor[1], cor[0]]);
    }else{
      alert(g);
    }
  }

  const setCoord = (e)=>{
    console.log('e', e.detail);
    map.getMap().getZoom()<16 ? map.getMap().flyTo(e.detail, 16) : map.getMap().flyTo(e.detail);
    $mapState.center = e.detail;
    //cursorPos =  e.detail;
    //showCursor = true;
    let cor = e.detail;
    [cor[0],cor[1]] = [cor[1],cor[0]]
    let sh = drawShape('point', cor);
    $tempGeo.features = [...$tempGeo.features, sh];
  }

  const editDailyItem = (e)=>{
    console.log(e.detail);
    toggleEditor();
  } 

  const openwDrawingMenu = ()=> {
    showContextMenu = false;
    showDrawingMenu = true;
  }

</script>

<TaxonEditor bind:showEditor/>

<DrawingMenu
  bind:showDrawingMenu
  on:selectNewShape = {(e)=> selectNewShape(e.detail)}
/>

<DailyList 
  bind:showDailyList
  on:editDailyItem = {editDailyItem}
/>

<CoordInput bind:showCoordInput on:setCoord={setCoord}/>

<Modal 
  bind:showModal
  modalClass = "audio" 
  backdropClasses = "items-center z-2000 justify-center"
  inFly = {{x: -500, duration: 500}}
  outFly = {{x: -500, duration: 500}}
>
  <audio controls loop>
    <source src="sounds/Coturnix coturnix.mp3" type="audio/mpeg">
      Your browser does not support the audio element
    </audio>
  </Modal>
  
<Leaflet on:mapClick={mapClick } bind:this={map}>

  <Cursor 
    bind:showCursor 
    cor={cursorPos}
    on:cursorClick = {drawNewShape}
  />

  <Control position={'topleft'}>
    <MenuItem img={'images/svgviewer-output.svg'} on:click={toggleCoordInput}/>       
  </Control>
  
  <Control position={'topright'}>
    <MenuItem img={'images/edit.svg'} on:click={toggleModal}/>
  </Control>

  <Control position={'topright'}>      
    <MenuItem img={'images/flower-tulip-outline.svg'} on:click={()=> showDailyList = true}/>  
  </Control>
  
  <Control position={'bottomleft'}>
    <MenuItem img={'images/map-marker.svg'} on:click={drawQuickPoint}/>
  </Control>

  <Control position={'bottomleft'}>
    <MenuItem img={'images/map-marker.svg'} on:click={getGPS}/>
  </Control>

  <LeafletContextMenu bind:showContextMenu cor={cursorPos}>
    <div class="flex flex-col divide-y divide-slate-500 shadow-2xl">
      <MenuItem  title={"Edit"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} on:click={beginEdit}/> 
      <MenuItem  title={"Copy"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} on:click={copyToClipboard}/> 
      <MenuItem  title={"Taxoneditor"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} on:click={openInTaxonEditor}/> 
      <MenuItem  title={"Geoeditor"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} on:click={()=> console.log('Empty')}/> 
      <MenuItem  title={"Delete"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} on:click={deleteShape}/> 
    </div>
  </LeafletContextMenu>
      
  <Control position='bottomright'>
    <MenuItem img={'images/lead-pencil.svg'} on:click={openwDrawingMenu}/>
  </Control>

  <Control position={'bottomright'}>      
    <MenuItem img={'images/flower-tulip-outline.svg'} on:click={toggleEditor}/>  
  </Control>
                  
  <Layers>      
    <TileLayer
      name={'OSM'}
      url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
      options={{ minZoom: 7, maxZoom: 19, attribution: '&copy; OpenstreetMap', crossOrigin : true}}
      selected
    />        
    <TileLayer
      name={'Google'}
      url={'https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga'}
      options={{ minZoom: 7, maxZoom: 21, attribution: '&copy; Google Maps', crossOrigin : true}}
    />  
    <TileLayer
      name={'Esri'}
      url={'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'}
      options={{ minZoom: 7, maxZoom: 19, attribution: '&copy; ESRI', crossOrigin : true}}
    />
    <TileLayer
      name={'Túristautak'}
      url={'http://{s}.map.turistautak.hu/tiles/turistautak/{z}/{x}/{y}.png'}
      options={{ minZoom:7, maxZoom:18, attribution: '&copy; Túristautak.hu', crossOrigin : true}}
    />   

    <GeoJson name={'CT55B2'} data={$quadrat}/>    

    <MarkerCluster>
      <!--SubGroup  name={'Taxon'}>
        <GeoJson name={'Taxon'} data={$dailyData}/>
      </SubGroup-->
      <SubGroup name={"Geo"}>
        <GeoJson name={"Geo"} data={$geoData}/>
      </SubGroup>
      <!--SubGroup name={"Query"}>
        <GeoJson name={"Query"} data={$queryData}/>
      </SubGroup-->

    </MarkerCluster>


    <GeoJson name={"Temp"} data={$tempGeo} on:openContextMenu={openEditing}/>
    <GeoJson name={"GPS"} data={$gpsGeo}/>
    <GeoJson name={"ControlPoints"} data={$controlGeo}/>
    
  </Layers>
    
  <Scale/>
    
</Leaflet>
  