<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from "./Modal.svelte";
  //import {inputField} from "./ListSelect.svelte";
  
  export let showTextModal = false;
  export let placeHolder = "None";
  export let type = 'text';
  export let inputData = null;

  let inputRef = null;

  const dispatch = createEventDispatcher();

  const inputKeyDown = (e)=> {
    if(e.key == 'Enter') {
      submitTextModal();
    }
  }

  const submitTextModal = ()=> {
    dispatch('submitTextModal', inputData);
    inputData = "";
    placeHolder = "";
    showTextModal = false;   
  }
  
</script>

<Modal
  bind:showModal = {showTextModal} 
  modalClass = "text-input-modal" 
  backdropClasses = "items-start justify-center z-3000 bg-lime-100/90 w-full"
  mainClasses = "w-full h-auto mt-1.5 md:w-1/2 xl:w-1/3"
  on:introEnd = {()=> inputRef.focus()}
  >
    {#if type === "text"}
      <input 
        class="h-full w-full bg-yellow-200 border-2 border-zinc-500 rounded-sm p-2 text-lg" 
        type= text
        placeholder= {placeHolder}
        on:keydown = {inputKeyDown}
        bind:this={inputRef}
        bind:value={inputData}
      />
    {:else}  
      <input 
        class="h-full w-full bg-yellow-200 border-2 border-zinc-500 rounded-sm p-2 text-lg" 
        type= tel
        placeholder= {placeHolder}
        bind:this={inputRef}
        on:keydown|stopPropagation = {inputKeyDown}
        bind:value={inputData}
      />
    {/if}
</Modal>