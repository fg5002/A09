<script>
  import { base } from '$app/paths';
  import Calendar from "$lib//Calendar.svelte";
  import ImageViewer from '$lib/ImageViewer.svelte';
  import {currDate} from "$lib/store"

  let showCalendar = false;
  let showImageViewer = false;


</script>

<div class="flex justify-between items-center bg-lime-300 p-2 border border-slate-500 text-lg font-bold shadow-xl">
  <nav class="flex items-center gap-4">
    <a href="{base}/">Home</a>
    <a href="{base}/map">Map</a>
    <a href="{base}/editor">Editor</a>
  </nav>
  <div on:pointerup={()=>showImageViewer = true}>Image</div>
  <div on:pointerup={()=>showCalendar = true}>{$currDate}</div>
</div>
<Calendar
  bind:showCalendar
  bind:calDate={$currDate}
/>
<ImageViewer
  bind:showImageViewer
/>