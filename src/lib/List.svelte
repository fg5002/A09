<script>
  import { createEventDispatcher } from 'svelte';

  export let items = [];
  export let width = 'full'
  
  const dispatch = createEventDispatcher();
  
</script>

{#if items.length>0}

    <ul 
      class="max-h-full w-{width} divide-y-2 divide-slate-400 overflow-y-auto snap-y snap-proximity
      border-2 rounded-sm border-slate-500 shadow-gray-400  drop-shadow-2xl"
    >
      {#each items as item, i}
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li 
          class="h-auto" 
          on:click={()=> dispatch('itemSelected', item)}
        >
          <slot {item}/>
        </li>
      {/each} 
    </ul>

{/if}