<script>
  import {afterUpdate, createEventDispatcher} from 'svelte';

  export let item = {};
  export let type = 'text'

  let promptRef = null;

  const dispatch = createEventDispatcher();

  afterUpdate(()=> {
    promptRef && promptRef.focus();
  });

  const enterKey = (e)=> {
    let it = item;
    if(e.key === "Enter"){
      it.value = e.target.value;
      dispatch('submit', it);
    }
    if(e.key === "Escape" || (e.key === "Backspace" && !e.target.value)){
      dispatch('close');
    } 
  }

</script>


<input
  class="px-2 py-1 w-full bg-yellow-300 max-h-9 placeholder-gray-700 
  placeholder-opacity-100 border-2 border-gray-900 rounded-sm my-2" 
  type = {type}
  value = {item.value}
  bind:this = {promptRef}
  on:keydown = {enterKey}
/>