<script>

  import { createEventDispatcher } from 'svelte';

  export let title = undefined;
  export let img = undefined;
  export let border = true;
  export let appearance = '';

  const dispatch = createEventDispatcher();

  const clickHandler =()=> {
    dispatch('click');
  }

</script>

<button
  on:click|stopPropagation
  class="flex items-center justify-left gap-2 w-auto h-auto p-2 text-base shadow-xl bg-lime-300 {border && 'border border-slate-500 rounded-md'} {appearance}"
>
  {#if img}
    <img src={img} alt="No" class="w-auto h-6">
  {/if}
  {#if title}
    <span>{title}</span>
  {/if}
</button>