<script>
	//import '../app.postcss';
  import '../app.pcss';
  import Navbar from '$lib/Navbar.svelte';
</script>

<body class=" bg-slate-800">
  
  <div class="flex flex-col justify-start h-screen w-screen bg-violet-100 md:w-2/3 md:mx-auto xl:w-2/3">
    <Navbar/>
    <slot />
  </div>
</body>