<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from "./Modal.svelte";
  import MenuItem from "./MenuItem.svelte";

  export let showContextMenu = false;
  export let shiftIndex = -1;

  const dispatch = createEventDispatcher();

  const insertItem = ()=> {
    dispatch('insertItem');
    showContextMenu = false;
  }

  const selectToMove = ()=> {
    dispatch('selectToMove');
    showContextMenu = false;
  }

  const editItem = ()=>{
    dispatch('editItem')
  }

  const deleteItem = ()=>{
    dispatch('deleteItem')
  }

</script>

<Modal
  bind:showModal = {showContextMenu}
  on:modalClose
  modalClass = "context_menu" 
  backdropClasses = "z-2000 h-full w-full items-center justify-center"
  mainClasses = ""
>
  <div class="flex flex-col w-full divide-y divide-slate-500 shadow-2xl">
    {#if shiftIndex != null}
      <MenuItem  title={"Paste before"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} on:click={insertItem}/>
    {:else} 
      <MenuItem  title={"Edit item"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} on:click={editItem}/>
      <MenuItem  title={"Move item"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} on:click={selectToMove}/>
      <MenuItem  title={"Delete item"} border={false} appearance = {'py-1 px-2 bg-yellow-200'} on:click={deleteItem}/>
    {/if}
  </div>
</Modal>