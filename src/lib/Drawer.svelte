<script>
  import { fade, slide } from 'svelte/transition';

  export let showDrawer = false;

  function closeOnOutclick(event) {
    if (event.target.classList.contains('drawer-background')) {
      showDrawer = false;
    }
  }
</script>


{#if showDrawer}
  <div class="fixed z-2000 inset-0 bg-black bg-opacity-30 flex items-center justify-start drawer-background"  transition:fade={{duration: 300}} on:pointerdown={closeOnOutclick}>
    <div class="flex flex-col bg-lime-500 p-5 h-full w-92  items-center justify-top gap-2 transform translate-x-0" transition:slide={{duration: 300,  axis: 'x'}}>
      <h1 class="font-bold">Calendar</h1>
      <slot></slot>
    </div>
  </div>
{/if}