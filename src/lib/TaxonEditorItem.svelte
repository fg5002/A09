<script>
  export let name;
  export let data = null;
  export let needed = false;
  export let editor;

</script>

<div class="flex flex-wrap items-start justify-start text-lg px-2 gap-1 bg-yellow-300" on:pointerup={editor}>
  {#if !data || data.length === 0}
    {#if needed}
      <span class="font-bold w-1/4 select-none text-red-600">{name}</span>
    {/if}
  {:else}
    <slot/>
  {/if}
</div>