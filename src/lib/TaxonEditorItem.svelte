<script>
  export let name;
  export let data = null;
  export let needed = false;
  export let editor;

</script>

<div class="flex flex-wrap items-start justify-start basis-full text-lg px-2 py-1 gap-2" on:pointerup={editor}>
  {#if data === null || data.length === 0}
    <span class="font-bold w-1/4 select-none {needed ? 'text-red-600' : 'text-green-600'}">{name}</span>
  {:else}
    <slot/>
  {/if}
</div>