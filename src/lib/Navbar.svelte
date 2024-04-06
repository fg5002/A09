<script>
  import { base } from '$app/paths';
  import Calendar from "$lib//Calendar.svelte";
  import {currDate} from "$lib/store"

  let showCalendar = false;


</script>

<div class="flex justify-between items-center bg-lime-300 p-2 border border-slate-500 text-lg font-bold shadow-xl">
  <nav class="flex items-center gap-4">
    <a href="{base}/">Home</a>
    <a href="{base}/map">Map</a>
  </nav>
  <div on:pointerup={()=>showCalendar = true}>{$currDate}</div>
</div>
<Calendar
  bind:showCalendar
  bind:calDate={$currDate}
/>