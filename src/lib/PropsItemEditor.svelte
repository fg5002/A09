<script>
  import {afterUpdate, createEventDispatcher} from 'svelte';
  import SveltyPicker, {config} from 'svelty-picker';
  import List from '$lib/List.svelte';
  import ItemInputEditor from '$lib/ItemInputEditor.svelte';

  export let item = {};

  const dispatch = createEventDispatcher();

  const selectListItem = (i)=> {
    item.value = i;
    dispatch('submit', item);
    dispatch('close')
  }

  const submit = (e)=> {
    item.value = e.detail;
    dispatch('submit', item);
  }

  const deleteItem = (e)=> {
    item.value = e.detail;
    dispatch('delete', item);
  }

</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->


  {#if item.typ === 'text' || item.typ === 'tel' || item.typ === 'note'}

    <ItemInputEditor 
      label = {item.nam}
      value = {item.value}
      typ = {item.typ}
      on:submit = {submit}
      on:delete = {deleteItem}
      on:close
    />
  
  {:else if item.typ === 'time'}

      <SveltyPicker
        mode = time
        format = "hh.ii"
        pickerOnly = true
        autocommit = false
        on:input = {dispatch('submit', item)}
        bind:value = {item.value}
      />


  {:else if item.typ === 'date'}

    <div class="w-fit h-fit bg-violet-500">
      <SveltyPicker
        format = "yyyy-mm-dd"
        pickerOnly = true
        on:input = {dispatch('submit', item)}
        bind:value = {item.value}
      />
    </div>

  {:else if item.typ === 'list'}

    <List
      items ={item.list.split(',')}
      width = 'fit'
      on:itemSelected={(e)=>selectListItem(e.detail)}
      let:item={item}
    >
      <div class="px-2 py-1 bg-lime-200">
        <span class="font-semibold select-none">{item}</span>
      </div> 
    </List>    

  {/if}