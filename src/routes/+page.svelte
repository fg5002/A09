<script>
  import { SQLocal } from 'sqlocal';
  import {currDate, currData, currData2 } from '../lib/store';
  
  export const { sql, overwriteDatabaseFile, getDatabaseFile } = new SQLocal('ffd.db');
  
  let searchText = '';
  let items = [];
  let promptRef = null;
  let editorItems = $currData2.map(n=>n.name);
  editorItems.length = 6;
  let xx = false;
  
  const fileInputChange = async()=> {
    try {
      const fileInput = document.querySelector('input[type="file"]');
      const databaseFile = fileInput.files[0];
      await overwriteDatabaseFile(databaseFile);
    } catch (error) {
        alert(error);
    } finally {
      const version = await sql`select sqlite_version()`;
      console.log(version[0]);
    }    
  }

  const extractFile = async()=>{
    const databaseFile = await getDatabaseFile();
    console.log(databaseFile);
    const fileUrl = URL.createObjectURL(databaseFile);
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = `ffd-${new Date().toISOString().split('T')[0]}.db`;
    a.click();
    a.remove();
    URL.revokeObjectURL(fileUrl);
  }

  const query1 = async()=>{
    if(searchText.length<4){
      items.length = 0;
      return;
    }
    try {
      const data = await sql`select id, hun, ltn, abr, mon from taxons where lower(hun) LIKE ${'%'+searchText+'%'} OR lower(ltn) LIKE ${'%'+searchText+'%'} OR abr LIKE ${'%'+searchText+'%'}`;
      items = data.sort((a, b)=> a["hun"].localeCompare(b["hun"], 'hu'));
    } catch (error) {
        console.log(error);
        alert(error);
    }
  }

  const dateTimeString = ()=> {
    let date = new Date().toISOString().split('T')[0].replace(/-/g,'');
    let time = new Date().toTimeString().slice(0, 8).replace(/:/g,'');
    return `${date}${time}`;
  }

  const submitList = (i)=> {
    $currData.taxon = i;
    console.log($currData.taxon, 'dt', dateTimeString());
    searchText = "";
    items.length = 0;
    promptRef.focus();
  }

  const keyUp = (e)=> {
    if(e.key === "Enter"){
      if(items.length > 0){
        submitList(items[0]);
      }
    }else{
      query1();
    }
  }

  const keyDown = (e)=> {
    if(e.key === "Enter"){
      e.preventDefault();
    }
  }
  
  const monthConv =(m)=> parseInt(m[$currDate.split('-')[1]-1]);

  let loc = ["",""];
  
  const geoLocation= async()=>{
    try{
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject,{
          timeout: 15000,
          maximumAge: 200,
          enableHighAccuracy: true
        });
      });

      let cor = [position.coords.longitude, position.coords.latitude];
      cor = cor.map(s=>parseFloat(s.toFixed(6)));
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(cor);
      }
      let acc = parseFloat(position.coords.accuracy.toFixed(1));
      loc= [cor, acc]
    } catch(e) {
      alert(locationError(e));
    }
  }
    
  const locationError = (error)=> {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        return "User denied the request for geolocation.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is currently unavailable.";
      case error.TIMEOUT:
        return "Request for user location timed out.";
      case error.UNKNOWN_ERROR:
        return "An unknown error occurred.";
    }
  
  }

  </script>
  
  <div class="flex flex-col gap-2 p-2 items-center bg-indigo-300 h-3/4">

    <input
      class="border-2 border-violet-400 rounded-sm" 
      type="file" 
      id="input" 
      name="Input" 
      accept=".db, .sqlite" 
      on:change={fileInputChange}
    />

    <textarea
      class="px-2 py-1 w-2/3 border-2 min-h-9 border-violet-400 bg-yellow-200 h-9 resize-none" 
      type="text"
      bind:value = {searchText}
      on:keyup = {keyUp}
      on:keydown= {keyDown}
      bind:this={promptRef}
      placeholder="Search"
    />

    {#if items.length>0}
      <div class="w-2/3 h-auto max-h-full overflow-y-auto snap-y snap-proximity border-slate-600 border">
        <ul>
          {#each items as item, i (item.id)}
            <li 
              class="border-b border-slate-600 p-2 select-none bg-lime-{monthConv(item.mon) === 1 ? '500' : monthConv(item.mon) === 2  ? '300' : '100'} " 
              on:pointerup={()=> submitList(item)}
            >
              <span class="font-semibold">{item.hun}</span>
              <span class="italic">{item.ltn}</span>
              {#if item.abr != null}
                <span class=" text-violet-700 self-center text-sm">{`(${item.abr})`}</span>
              {/if}
            </li>
          {/each} 
        </ul>    
      </div>
    {:else}
      <div class="w-2/3 h-auto bg-lime-100 border-2 border-slate-600 overflow-y-auto snap-y snap-proximity">
        <ul>
          {#each editorItems as eid, i}
            <li 
              class="border-b border-slate-600 p-2 select-none " 
              on:pointerup={()=> submitList(i)}
            >
              <span class="font-semibold">{eid}</span>
            </li>
          {/each} 
        </ul>    
      </div>    
    {/if}
  </div>
  <div class="bg-yellow-200 flex gap-2 p-2 overflow-x-auto">
    <button class="bg-violet-100 border-2 border-violet-700 rounded-md p-2 self-center" on:click={geoLocation}>Geolocation</button>
    <span class="p-2 h-full, text-xl self-center bg-orange-100">{loc[0]}</span>
    <span class="p-2 h-full, text-xl self-center bg-orange-100">{loc[1]}</span>
  </div>
