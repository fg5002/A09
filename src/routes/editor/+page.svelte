<script>
  import {currData } from '$lib/store';
  import EditorList from '$lib/EditorList.svelte';

  let editorType = "Res"

</script>

<div class="h-3/4 flex flex-col bg-yellow-200 p-2">

  <div class="flex flex-wrap justify-between p-2 border-2 border-slate-400 mb-2">

    {#each ["Res", "Tax", "Props", "Files", "Refs", "Obs" ] as nam}
      <label class="font-bold border-separate rounded-md px-1 justify-center  
      {nam === editorType ? 'bg-lime-400 border-2 border-slate-500' : 'bg-yellow-200'}"
      >
        <input
          style="display:none"
          type="radio"
          name="editorType"
          value={nam}
          bind:group={editorType}
        />
        {nam}
      </label>
    {/each}
          
  </div>

  {#if editorType === 'Res'}

    <div class="flex flex-col w-full h-ful overflow-y-auto p-2">

      {#if $currData.taxon.length>0}          
        <div>
          <span class="font-bold select-none">{$currData.taxon[0].hun} </span>
          <span class="italic select-none">({$currData.taxon[0].ltn})</span>
        </div>
      {/if}

      {#if $currData.attributes.length>0}          
        <div>
          {$currData.attributes
            .map(f=>f.value ? f.rep.replace('*', f.value) : f.nam)
            .sort((a, b)=> a.localeCompare(b,'hu'))
            .join(', ')
          }
        </div>
      {/if}

      {#if $currData.files.length>0}          
        <div>{$currData.files.map(f=>f.nam).join(', ')}</div>
      {/if}

      {#if $currData.observers.length>0}          
        <div>{$currData.observers.map(f=>f.nam).join(', ')}</div>
        <div>
          {@html $currData.observers.map(f=> `<span>${f.nam}</span>`)}
        </div>
      {/if}

      <div>
        {$currData.geo.type} ({$currData.geo.id ? $currData.geo.id : $currData.geo.tempId})
      </div>

    </div>

  {:else if editorType === 'Tax'}

    <EditorList
      editorType = 'Tax'
      storeData = {$currData.taxon}
      multiple = {false}
      listSortField = 'hun'
      on:resultChanged = {(e)=> $currData.taxon = e.detail}
    >
      <div slot='item' let:item={item}>
        <span class="font-semibold {item.mon.at(8)<2 ? 'text-red-300' : 'text-green-600'}">{item.hun}</span>
        <span class="italic">({item.ltn})</span>
        <span class="italic">({item.mon.at(8)})</span>
      </div>
      <div slot='result' let:item={item}>
        <span class="font-semibold">{item.hun}</span>
        <span class="italic">({item.ltn})</span>
      </div>
    </EditorList>

  {:else if editorType === 'Props'}

    <EditorList
      editorType = 'Props'
      storeData = {$currData.attributes}
      multiple = {true}
      listSortField = 'nam'
      on:resultChanged = {(e)=> $currData.attributes = e.detail}
    >
      <div slot='item' let:item={item}>
        <span class="font-semibold select-none">{item.nam}</span>
        <span class="italic select-none">({item.abr})</span>
      </div>
      <div slot='result' let:item={item}>
        <span class="font-semibold select-none">{item.nam}{item.value ? ':' : '' }</span>
        <span class="text-lime-900 select-none">{item.value ? item.value : '' }</span>
      </div>
    </EditorList>

  {:else if editorType === 'Obs'}

    <EditorList
      editorType = 'Obs'
      storeData = {$currData.observers}
      multiple = {true}
      listSortField = 'nam'
      resSortField = 'nam'
      on:resultChanged = {(e)=> $currData.observers = e.detail}
    >
      <div slot='item' let:item={item}>
        <span class="font-semibold">{item.nam}</span>
      </div>
      <div slot='result' let:item={item}>
        <span class="font-semibold">{item.nam}</span>
      </div>
    </EditorList>

  {:else if editorType === 'Files'}

    <EditorList
      editorType = 'Files'
      storeData = {$currData.files}
      multiple = {true}
      listSortField = 'nam'
      resSortField = 'nam'
      on:resultChanged = {(e)=> $currData.files = e.detail}
    >
      <div slot='item' let:item={item}>
        <span class="font-semibold">{item.nam}</span>
        <span class="italic">({item.auc})</span>
      </div>
      <div slot='result' let:item={item}>
        <span class="font-semibold">{item.nam})</span>
        <span class="italic">({item.auc})</span>
      </div>
    </EditorList>    

  {/if}
  
</div>
        
<div class="h-1/4 bg-yellow-100 "></div>