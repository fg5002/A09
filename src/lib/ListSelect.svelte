<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from "./Modal.svelte";
  
  export let showSelectList = false;
  export let source = [];
  export let minChars = 1;
  export let filterList = (f,s)=> f["nam"].toLowerCase().includes(s) === true;
  export let sortListField = "nam";
  export let placeHolder = "none";
  export let result = [];
  export let searchText = "";
  
  let promptRef = null;
  let items = [];
  
  const dispatch = createEventDispatcher();

  const updateList = ()=> {
    if(searchText.length < minChars ) {
      items = [];
    }else{
      items = searchText ? 
      source
        .filter(f=> filterList(f, searchText))
        .sort((a, b)=> a[sortListField].localeCompare(b[sortListField], 'hu')) : 
      [];
    }
  }

  const inputKeyDown = (e)=> {
    if(e.key == 'Enter' && items.length>0){
      dispatch('firstItemSelected', items[0]);
      searchText = "";
    }
  }

  const modalClose = ()=>{
    items = [];
    searchText = "";
  }

</script>

<Modal
  bind:showModal = {showSelectList} 
  modalClass = "list-select" 
  backdropClasses = "items-start justify-center z-2000 bg-yellow-100"
  mainClasses = "w-full max-h-[50%] h-auto mt-1.5 text-left sm:h-4/5 md:w-2/3 md:max-h-50% md:h-4/5 xl:h-4/5 xl:w-1/3 xl:text-base"
  on:introEnd = {()=> promptRef.focus()}
  on:outroEnd
  on:modalClose = {modalClose}
>

  <div class="flex flex-col text-lg bg-lime-200 w-full border border-slate-500 rounded-sm">
    <div class="flex justify-between bg-yellow-200 border-b border-slate-500 divide-x divide-gray-400">  
      <input 
        class="w-full px-2 py-1 m-0 bg-yellow-200 outline-none" 
        type="text"
        placeholder= {placeHolder}
        bind:value = {searchText}
        bind:this={promptRef}        
        on:input = {updateList}
        on:keydown|stopPropagation = {inputKeyDown}
      >  
    </div>
    <div class="h-full w-full flex flex-col overflow-y-auto snap-y snap-proximity">
      {#if searchText != ""}      
        {#each items as item, i}
          <slot name="item" {item}/>
        {/each}
      {:else}
        {#each result as item, i}
          <slot name="result" {item}/>        
        {/each}
      {/if}
    </div>
    
  </div>
    
</Modal>