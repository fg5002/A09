<script>
  import {setContext, onMount} from 'svelte';
  import {currData, currDate} from "./store";
  import Modal from "./Modal.svelte";
  import {birds} from "./taxon"
  import {attributes, observers} from "./attributes"
  import TaxonList from "./TaxonList.svelte";
	import AttributeList from "./AttributeList.svelte";
  import ObserverList from "./ObserverList.svelte";
  import TaxonNotes from "./TaxonNotes.svelte";
  import TaxonEditorItem from "./TaxonEditorItem.svelte";
  
  export let showEditor = false;

  let showTaxonList = false;
  let showAttributeList = false;
  let showObserverList = false;
  let showEditorNotes = false
  let searchText = "";
  let promptRef = null;
  
  export const getInput = () => promptRef;

  if(showEditor){
      setContext('input', {inputFocus, getInputValue});
  }

  $: searchText = promptRef && promptRef.value; 
  
  /*
  Fekete gólya (Ciconia nigra)
  3pd átrepülő dk-felé
  https://www.google.com/maps/search/?api=1&query=47.5,19.25
  */

  //setContext('mainInput', {inputFocus, getInputValue});

  const inputFocus = ()=> promptRef.focus();
  const getInputValue = ()=> searchText;
  
  const addAttribute = ()=> {
    let res = null;
    let idx;
    let s = searchText.trim();

    idx = attributes.findIndex(d=> (s===d.abr && d.rep === null) || (s.includes(d.abr) && s.length > d.abr.length && d.rep != null));
    if(idx>-1){
      res = attributes[idx];
      res.value =  res.rep === null ? null : s.replace(res.abr,"");
      res.dis = res.rep === null ? res.nam : res.rep.replace("*", res.value);
      $currData.attributes = $currData.attributes.filter(f=> f.id !=res.id);
      $currData.attributes.push(res);
      $currData.attributes = $currData.attributes.sort((a, b) => a.ord-b.ord);
    }else{
      if(s.match(/^[a-z]{4}$/)){
        addTaxon();
      }
    }
    promptRef.value = "";
  }

  const addTaxon = ()=>{
    let s = searchText.trim();
    let idx = birds.findIndex(f=> f.abr.indexOf(s)>-1);
    if(idx>-1){
      $currData.taxon = birds[idx];
    }
    promptRef.value = "";
  }

  const promptEnter = (e)=>{
    if (e.key == 'Enter'){
      addAttribute();
      promptRef.value = "";
    }
    if (e.key == ' '){
      console.log('lefutott')
      promptRef.blur();
      console.log('lefutott2')
      inputFocus();
      console.log(getInputValue());

    }
  }
  
  const submitTaxonEditor = ()=> {
    $currData.id = Math.random().toString(36).substring(2, 10);
    console.log(JSON.stringify($currData));
    showEditor = false;
    $currData.taxon = null;
    $currData.attributes = [];
    $currData.note = null;
    $currData.files = [];
  }

  const focusInput = ()=>{
    promptRef.focus();
  }

</script>
  
<Modal
  bind:showModal = {showEditor} 
  modalClass = "taxon_editor" 
  backdropClasses = "items-start justify-center z-2000"
  mainClasses = "gap-2 w-full mt-1.5 md:w-2/3 xl:w-1/3"
  on:introEnd = {focusInput}
  on:modalClose = {()=>promptRef.value = ""}
>
  <TaxonList
    bind:showTaxonList
    source={birds}
    bind:result = {$currData.taxon}
    on:outroEnd = {focusInput}
  />

  <AttributeList
    bind:showAttributeList
    source = {attributes}
    bind:result = {$currData.attributes}
    on:outroEnd = {focusInput}
  />

  <TaxonNotes 
    bind:showEditorNotes
    placeHolder="Notes"
    on:outroEnd = {focusInput}
  />

  <ObserverList
    bind:showObserverList
    source = {observers}
    bind:result = {$currData.observer}
    on:outroEnd = {focusInput}
    on:itemSelected = {focusInput}
  />

  <div class="flex flex-col w-full border-slate-500 border rounded-sm h-1/2 text-lg xl:text-base">
    <div class="flex justify-between items-center border-b border-slate-500 bg-yellow-200 divide-x divide-gray-400 font-bold">
      <input
        class="px-2 py-1 w-3/4 h-auto outline-none bg-yellow-200 te" 
        type="text" 
        on:keydown|stopPropagation = {promptEnter}
        bind:value = {searchText}
        bind:this={promptRef}
        placeholder="Abbrevations"
      >
      <button 
        class="px-2 py-1 w-1/4 text-center bg-yellow-300" on:pointerup = {submitTaxonEditor}>
        <!--img src={'images/edit.svg'} alt="No" class="w-auto h-auto"-->Submit
      </button>      
    </div>

    <div class="flex flex-col w-full divide-y divide-gray-400 justify-center bg-yellow-100 h-full overflow-y-auto">      

      <TaxonEditorItem name="Taxon" data={$currData.taxon} editor={()=> showTaxonList=true}>
        <span class="font-bold select-none" on:pointerup|stopPropagation={()=> $currData.taxon=null}>{$currData.taxon.hun}</span>
        <span class="italic select-none" on:pointerup|stopPropagation={()=> $currData.taxon=null}>{$currData.taxon.ltn}</span>
      </TaxonEditorItem>

      <TaxonEditorItem name="Attributes" data={$currData.attributes} editor={()=> showAttributeList=true}>
        {#each $currData.attributes as item, i (item.id)}
          <span class="select-none px-1 bg-lime-100 border border-slate-500 rounded-md shadow-lg" 
            on:pointerup|stopPropagation={()=> $currData.attributes = $currData.attributes.filter(f=> f.id != item.id)}
          >{item.dis}</span>
        {/each}
      </TaxonEditorItem>

      <TaxonEditorItem name="Note" data={$currData.note} editor={()=> showEditorNotes=true}>
        <span class="select-none my-1 basis-full">{$currData.note}</span>
      </TaxonEditorItem>

      <TaxonEditorItem name="Observer" data={$currData.observer} needed={true} editor={()=> showObserverList=true}>
        <span class="select-none my-1 font-bold">{$currData.observer.map(f=>f.nam).join(', ')}</span>
      </TaxonEditorItem>

      <TaxonEditorItem name="Files" data={$currData.files} editor=null>
        {#each $currData.files as item, i (item.id)}
          <span class="select-none my-1" on:pointerup={()=> $currData.files = $currData.files.filter(f=> f.id != item.id)}>{item.nam}</span>
        {/each}
      </TaxonEditorItem>

      <TaxonEditorItem name="Geometry" data={$currData.geometry} needed={true} editor=null>
        <span class="select-none my-1 font-bold basis-full" on:pointerup={()=> showEditor=false}>
          {$currData.geometry.type} ({$currData.geometry.id})
        </span>
      </TaxonEditorItem>

    </div>

  </div>
</Modal>