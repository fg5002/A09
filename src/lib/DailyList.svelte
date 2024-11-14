<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from "./Modal.svelte";
  import {items} from '$lib/store';
  import {flip} from 'svelte/animate';

  export let showDailyList = false;

  const dispatch = createEventDispatcher();

  let container;
  let draggedItem = null;
  let overItem = null;
  let overElement = null;

  let open = false;
  
  const handleTouchStart = (item)=> {
    draggedItem = item;
  }

  const handleTouchMove = (e)=> {
    overItem = null
    overElement && overElement.classList.remove('bg-yellow-300');  
    const touch = e.touches[0];
    let z = document.elementFromPoint(touch.clientX, touch.clientY);
    if(z.classList.contains('lis')){
      overElement = z;
      overItem = $items.filter(item => item.id == overElement.dataset.id)[0];
      overElement.classList.add('bg-yellow-300');
    }

    handleScroll(e);
  }
  
  const handleTouchEnd = ()=> {
    if(overItem && draggedItem != overItem){
      $items = $items.filter((item) => item.id !== draggedItem.id);
      const targetIndex = overItem && $items.findIndex((item) => item == overItem);
      $items.splice(targetIndex, 0, draggedItem);
      overItem = null;
    }
    overElement && overElement.classList.remove('bg-yellow-300');
    overElement = null;
    draggedItem = null;
    activeItem = null;
  }
  
  const handleScroll = (e)=> {
    const touch = e.touches[0];
    const { top, bottom } = container.getBoundingClientRect();
    const scrollSpeed = 5;
    if (touch.clientY - top < 50) {
      container.scrollBy(0, -scrollSpeed);
    }
    if (bottom - touch.clientY < 50) {
      container.scrollBy(0, scrollSpeed);
    }
  }

  //-------------------------------------------------------------------

  let activeItem = null;
  
  function handleSwipeStart(event, item) {
    activeItem = item;
    item.startX = event.touches[0].clientX;
    item.translateX = 0;
    console.log('start', item.translateX)
  }

  function handleSwipeMove(event, item) {
    if (activeItem === item) {
      const currentX = event.touches[0].clientX;
      const deltaX = currentX - item.startX;
      if (deltaX < 0 || deltaX > 0) {
        item.translateX = deltaX;
        console.log('move', item.translateX)
        //item.translateX = 0;
      }
    }
  }

  function handleSwipeEnd(item) {
    if (activeItem === item) {
      //item.translateX = 0;
      // Swipe threshold to activate button actions
      if (item.translateX < -100) {
        item.translateX = -150; // Show right buttons
      } else if (item.translateX > 100) {
        item.translateX = 150; // Show left buttons
      } else {
        item.translateX = 0; // Reset to original position
      }
      console.log('end', item.translateX)
    }
    activeItem = null;
  }

  function leftButtonAction(item) {
    console.log(`Left button clicked for ${item.nam}`);
  }

  function rightButtonAction(item) {
    console.log(`Right button clicked for ${item.nam}`);
  }


</script>

<Modal
  bind:showModal = {showDailyList} 
  modalClass = "daily-list" 
  backdropClasses = "items-start justify-center z-2000"
  mainClasses = "w-full h-3/4 flex-col mt-1.5 md:w-2/3 xl:w-1/3"

  inFly = {{x: 500, duration: 500}}
  outFly = {{x: 500, duration: 500}}
>

  <div bind:this={container} class="px-2 bg-lime-200 overflow-y-auto border border-gray-300 rounded divide-y-2 divide-slate-400">

    {#each $items as item (item.id)}

      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="lis flex justify-between items-center select-none {draggedItem === item ? 'bg-yellow-300' : 'bg-lime-200'}"
        data-id = {item.id}
        animate:flip={{duration: 300}}
        on:contextmenu|preventDefault={()=> activeItem = item}
      >

        <div class="lis h-full px-2 py-1 select-none" data-id = {item.id}>{item.nam}</div>

        {#if activeItem && activeItem.id === item.id}
          
          <button
            on:click={() => rightButtonAction(item)}
            on:touchstart|preventDefault={handleTouchStart(item)}
            on:touchmove={(e)=> handleTouchMove(e)}
            on:touchend={handleTouchEnd}         
          >
            <img src='images/flower-tulip-outline.svg' alt="No" class="w-auto h-6">
          </button>

        {/if}

      </div>

    {/each}

  </div>

</Modal>