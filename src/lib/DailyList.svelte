<script>
  import { createEventDispatcher } from 'svelte';
  import { flip } from 'svelte/animate';
  import Modal from "./Modal.svelte";
  import ContextMenu from "./ContextMenu.svelte";

  export let showDailyList = false;

  let showContextMenu = false;

  const dispatch = createEventDispatcher();

  let activeIndex = null;
  let shiftIndex= null;
  let items = "alma, körte, szilva, kajszi, naspolya, málna, dió, mogyoró, berkenye, meggy, ribizke, egres, mandula, cseresznye".split(', ');
  //let items = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20".split(',');

  const selectItem = (i)=> {
    activeIndex = i;
    showContextMenu = true;
  }

  const insertItem = ()=>{
    if(activeIndex === shiftIndex){
      clearIndices();
      return
    }
    let item = items[shiftIndex];
		items.splice(shiftIndex, 1);
    items.splice(activeIndex>shiftIndex ? activeIndex-1 : activeIndex, 0, item);
		items = items;    
    clearIndices();
  }
  
  const selectToMove = ()=>{
    shiftIndex = activeIndex;
    activeIndex = null;
  }
  
  const clearIndices = ()=>{
    activeIndex = null;
    shiftIndex = null;
  }

  const editDailyItem = ()=>{
  }
  
  const editItem = ()=>{
    dispatch('editDailyItem', items[activeIndex]);
    clearIndices();
    showContextMenu = false;
    showDailyList = false;
  }

</script>

<Modal
  bind:showModal = {showDailyList} 
  modalClass = "daily-list" 
  backdropClasses = "items-start justify-center z-2000"
  mainClasses = "w-full h-3/4 mt-1.5 md:w-2/3 xl:w-1/3"
  on:modalClose = {clearIndices}
  inFly = {{x: 500, duration: 500}}
  outFly = {{x: 500, duration: 500}}
>
  <ContextMenu 
    bind:showContextMenu
    bind:shiftIndex
    on:selectToMove = {selectToMove}
    on:insertItem = {insertItem}
    on:modalClose = {clearIndices}
    on:editItem = {editItem}
  />

  <div class="h-full w-full flex flex-col font-semibold border-slate-500 border-2 rounded-sm overflow-y-auto snap-y snap-proximity divide-y divide-slate-400">
    {#each items as item, i (item)}
      <div 
        class="p-2 select-none text-lg font-bold snap-end 
        {activeIndex === i ? 'bg-lime-400' : shiftIndex === i ? 'bg-lime-400' : 'bg-yellow-100'}"
        animate:flip = "{{duration: 300}}"
        on:contextmenu|preventDefault = {()=> selectItem(i)}
        role="link"
        tabindex = 0
      >{item}</div>
    {/each}
  </div>

</Modal>