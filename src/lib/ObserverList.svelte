<script>
  import ListSelect from "./ListSelect.svelte";

  export let showObserverList = false;
  export let source = [];
  export let result = [];

  let sText = "";

  const select = (i)=> {
    result = result.filter(f=> f.id != i.id);
    result.push(i)
    result.sort((a, b)=> a.nam.localeCompare(b.nam, 'hu'));
    sText = "";
  }

  const remove = (i)=>{
    result = result.filter(f=> f.id != i.id)
  }

</script>

<ListSelect
  bind:showSelectList ={showObserverList}
  bind:searchText = {sText}
  source = {source}
  placeHolder = "Observers"
  minChars = {1}
  result = {result}
  on:firstItemSelected = {(e)=> select(e.detail)}
  on:outroEnd
>
  <div
    class="font-semibold px-2 pt-1 border-b border-slate-400" 
    slot="item" 
    let:item 
    on:pointerdown={select(item)}
  >
    <span>{item.nam}</span>
  </div>
  
  <div
    class="font-semibold px-2 pt-1 bg-cyan-200  border-b border-slate-400"
    slot="result"
    let:item
    on:pointerdown={remove(item)}
  >
    <span class="">{item.nam}</span>
  </div>
</ListSelect>