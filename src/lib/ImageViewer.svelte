<script>
  import { onMount } from 'svelte';
  import Modal from "./Modal.svelte";

  export let showImageViewer = false;


    let scale = 50;
    let translateX = 0;
    let translateY = 0;

    let isDragging = false;
    let startX, startY;

    function handleWheel(event) {
      event.preventDefault();
      const delta = event.deltaY * -0.001;
      scale = Math.min(Math.max(scale + delta, 1), 3);
    }

    function handleMouseDown(event) {
      isDragging = true;
      startX = event.clientX - translateX;
      startY = event.clientY - translateY;
    }

    function handleMouseMove(event) {
      if (isDragging) {
        translateX = event.clientX - startX;
        translateY = event.clientY - startY;
      }
    }

    function handleMouseUp() {
      isDragging = false;
    }

    function handleDoubleClick(event) {
        scale = scale < 200 ? 200 : 50;
        translateX = event.clientX - startX;
        translateY = event.clientY - startY;
    }

    function handleTouchStart(event) {
      if (event.touches.length === 1) {
        isDragging = true;
        startX = event.touches[0].clientX - translateX;
        startY = event.touches[0].clientY - translateY;
        scale = scale < 200 ? 200 : 50;
        translateX = event.touches[0].clientX - startX;
        translateY = event.touches[0].clientY - startY;
      }
    }

    function handleTouchMove(event) {
      if (isDragging && event.touches.length === 1) {
        translateX = event.touches[0].clientX - startX;
        translateY = event.touches[0].clientY - startY;
        console.log(translateX, translateY)
      }
    }

    function handleTouchEnd() {
      isDragging = false;
    }
</script>

<Modal
  bind:showModal = {showImageViewer} 
  modalClass = "image-viewer" 
  backdropClasses = "items-start justify-center z-2000"
  mainClasses = "w-full h-3/4 mt-1.5 md:w-2/3 xl:w-1/3"
  inFly = {{x: 500, duration: 500}}
  outFly = {{x: 500, duration: 500}}
>

  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    class="h-auto w-auto overflow-hidden bg-slate-200"
    on:wheel={handleWheel}
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
    on:mouseleave={handleMouseUp}
    on:dblclick={handleDoubleClick}

    on:touchend={handleTouchEnd}
    >
    <img 
      src="images/dragonfly.jpg" 
      alt="Zoomable and Pannable" 
      class=" overflow-hidden relative scale-{scale} translate-x-[{translateX}px] translate-y-[{translateY}px]"
      on:touchstart={handleTouchStart}
      on:touchmove={handleTouchMove}
    >
  </div>

</Modal>
