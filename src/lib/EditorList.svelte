<script>
  import {afterUpdate, createEventDispatcher} from 'svelte';
  import List from "$lib/List.svelte";
  import {sql} from '$lib/store.js';
  import PropsItemEditor from '$lib/PropsItemEditor.svelte';

  export let editorType = 'Tax';  
  export let storeData = [];
  export let multiple = false;
  export let listSortField = null;
  export let resSortField = null;
  
  let stxt = '';
  let promptRef = null;
  let items = [];
  let selectedItem = null;
  let keepState = {};
  //sanet.st@Mercurybooks

  const dispatch = createEventDispatcher();
  
  afterUpdate(()=> {
    promptRef && promptRef.focus();
  });

  const inputText = async(param)=> {

    if(param.length<1){
      items.length = 0;
      return;
    }

    try {
      
      let data = null;

      switch (editorType) {
        case 'Tax':
          data = await sql`select t.id, hun, ltn, abr, mon, true ord from taxons t, 
            json_each(replace(json_array(abr), ',', '","')) aa where aa.value = ${param}
            UNION
            select id, hun, ltn, abr, mon, false ord from taxons 
            WHERE (hun like ${`%${param}%`} or ltn like ${`%${param}%`}) 
            and (abr not like ${`%${param}%`} or abr is null)`;
          break
        case 'Obs':
          data = await sql`select id, nam, false ord from auctors where nam like ${`%${param}%`}`;
          break;
        case 'Props':
          data = await sql`select a.id, nam, abr, list, rep, typ, true ord from attributes a,
          json_each(replace(json_array(abr), ',', '","')) aa where aa.value = ${param}
          UNION
          select id, nam, abr, list, rep, typ, false ord from attributes
          where nam like ${`%${param}%`} 
          and (instr(abr,${param})<1 or abr is null)`;
          break;
        case 'Files':
          data = await sql`select f.id, f.nam nam, a.nam auc, false ord from files f join auctors a on a.id = f.auc where f.nam like ${`%${param}%`} limit 20`;
          break;              
        default:
          break;
        }
                                
      items = data.sort((a, b)=> (b.ord - a.ord || a[listSortField].localeCompare(b[listSortField], 'hu')));

    } catch (error) {
      console.log(error); 
      alert(error);
    }
  }  

  const selectListItem = (item)=> {
    item.value = '';
    if(item.typ){
      selectedItem = item;
    }else{
      submitItem(item)
    }
    items = [];
    stxt = '';
    promptRef.focus();
  }

  const deleteSelectedItem = (e)=>{
    if(e.keep){
      promptRef.focus();
      return;
    }
    storeData = storeData.filter(f=> f.id != e.id);
    dispatch('resultChanged', storeData);
    selectedItem = null;
  }

  const submitItem = (item)=> {
    storeData = storeData.filter(f=> f.id != item.id);
    storeData = multiple === true ? [...storeData, item] : [item];
    resSortField && storeData.sort((a, b)=> a[resSortField].localeCompare(b[resSortField], 'hu'));
    dispatch('resultChanged', storeData);
    selectedItem = null;
  }

  const enterKey = (e)=> {
    if(e.key === "Enter"){
      selectListItem(items[0])
    }
  }

  const itemKeep = (item)=> {
    item.keep = !item.keep;
    keepState = item;
    promptRef.focus();
  }


</script>

{#if selectedItem != null} 

  <PropsItemEditor
    item = {selectedItem}
    on:submit = {(e)=> submitItem(e.detail)}
    on:delete = {(e)=> deleteSelectedItem(e.detail)}
    on:close = {()=> selectedItem = null}
  />

{:else}

  <input
    class="px-2 py-1 w-full bg-yellow-300 h-9 border-2 border-gray-900 rounded-sm mb-2" 
    type = "text"
    bind:value = {stxt}
    bind:this = {promptRef}
    on:input={()=>inputText(stxt)}
    on:keydown = {enterKey}
  />

  {#if items.length>0}
    
    <List
      {items}
      width = 'fit'
      on:itemSelected={(e)=>selectListItem(e.detail)}
      let:item={item}
    >
      <div class="px-2 py-1 bg-lime-200">
        <slot name="item" {item}/>
      </div> 
    </List>

  {:else}

    <List
      items = {storeData}
      width = 'fit'
      on:itemSelected={(e)=> deleteSelectedItem(e.detail)}
      let:item={item}
    >
      <div class="flex gap-4 {item.nam === 'note'  && 'flex-col'} pl-2 pr-1 py-1 justify-between bg-amber-300">

        <slot name="result" {item}/>

        <div class="flex gap-1 self-end justify-end">
          
          {#if item.typ != null}
            <button class="bg-lime-100 border-2 border-slate-600 rounded-md" on:click = {()=> selectedItem = item}>
              <img src={'images/edit.svg'} alt="No" class="w-4 h-4 m-1">
            </button> 
          {/if}

          <button class="{keepState && item.keep ? 'bg-red-400' : 'bg-lime-300'} border-2 border-slate-600 rounded-md" on:click|stopPropagation = {itemKeep(item)}>
            <img src={keepState && item.keep ? 'images/lock-close.svg' : 'images/lock-open.svg'} alt="No" class="w-4 h-4 m-1">
          </button>

        </div>

      </div>
    </List>

  {/if}

{/if}