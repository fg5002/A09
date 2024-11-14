<script>
import {afterUpdate, createEventDispatcher} from 'svelte';

  export let label = '';
  export let value = '';
  export let typ = 'text';

  let itemValue = value;
  let promptRef = null;

  afterUpdate(()=> {
    promptRef && promptRef.focus();
  });

  const dispatch = createEventDispatcher();

  const submit = ()=> {
    value = itemValue;
    dispatch(value ? 'submit' : 'delete', value)
    close();
  }

  const enterKey = (e)=> {
    if(e.key === "Enter"){
      submit();
    }
  }

  const close = ()=> {
    dispatch('close');
  }
  

</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="w-{typ === 'tel' ? '1/2' : 'full'} h-fit p-2 bg-yellow-100 border-2 border-slate-400 rounded-md shadow-2xl"
  on:click={close}
>
  <label class="font-bold text-lg" for="input">    
    {label}
  </label>
  <div class="flex flex-col gap-2 w-auto mt-1">
    {#if typ === 'note'}
      <textarea
        rows="6"
        class="w-full px-2 py-1 bg-yellow-300 border-2 border-gray-700 rounded-sm"
        on:click|stopPropagation
        bind:value = {itemValue}
        bind:this = {promptRef}
      />        
    {:else}
      <input
        class=" w-full px-2 py-1 bg-yellow-300 max-h-9 border-2 border-gray-700 rounded-sm" 
        type = {typ}   
        bind:this = {promptRef}      
        on:keydown={(e)=> enterKey(e)}
        on:input = {(e)=> itemValue = e.target.value}
        on:click|stopPropagation
        value = {itemValue}
      />
    {/if}
    <button 
      class="max-h-9 w-fit p-1 flex justify-center items-center bg-orange-300 border-2 border-slate-400 rounded-md" 
      on:click = {submit}
    >
      <img src={'images/edit.svg'} alt="No" class="w-4 h-4 m-1">
    </button>
  </div>
</div>