<script>
  import '../app.pcss';
  import Navbar from '$lib/Navbar.svelte';

  /*if ("virtualKeyboard" in navigator) {
    navigator.virtualKeyboard.overlaysContent = true;
  }*/
  
</script>

<!--div class="min-h-screen grid grid-rows-[auto,1fr]">
	<Navbar/>
	<slot />
</div-->

<div class="flex flex-col justify-start h-screen w-screen">
  <Navbar/>
  <slot />
</div>