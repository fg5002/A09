<script>
    import { createEventDispatcher } from 'svelte';

    export let classes;

    const dispatch = createEventDispatcher();

    const selectItem = ()=> {
      dispatch('selectItem');
    }

</script>

<div 
  class=" flex flex-wrap h-auto gap-2 p-2 select-none text-lg snap-end {classes}"
  on:pointerup = {selectItem}
  role = "link"
  tabindex = 0
>
  <slot/>
</div>