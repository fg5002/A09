<script>
  import { fade , fly} from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  
  export let showModal = false;
  export let backdropClasses = "items-center z-2000";
  export let modalClass = "baseModal";
  export let mainClasses= "";
  export let inFly = {y: -500, duration: 500};
  export let outFly = {y: -500, duration: 500};

  const dispatch = createEventDispatcher();

  function closeOnOutclick(e) {
    if (e.target.classList.contains(modalClass)) {
      dispatch('modalClose')
      showModal = false;
    }
  }

</script>


{#if showModal}
  <div 
    class="fixed inset-0 flex bg-transparent bg-opacity-90 mt-12 {modalClass} {backdropClasses}"
    on:pointerdown={closeOnOutclick} 
    in:fly={inFly}
    out:fly={outFly}
    on:introend={()=> dispatch('introEnd')}
    on:outroend={()=> dispatch('outroEnd')}
  >
    <div 
      class="flex shadow-2xl rounded-sm max-h-[100vh] bg-red-200 {mainClasses}" 
    >
      <slot/>
    </div>
  </div>
{/if}