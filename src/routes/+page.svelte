<script>
  import { SQLocal } from 'sqlocal';
  
  export const { sql, overwriteDatabaseFile, getDatabaseFile } = new SQLocal('ffd.db');
    
  let searchText = "";
  let res = "";
  
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
    try {
      searchText = `%${searchText}%`;
      const data = await sql`select hun, ltn from taxons where lower(hun) LIKE ${searchText}`;
      res = JSON.stringify(data);
    } catch (error) {
        console.log(error);
        alert(error);
    } finally {
      searchText = "";
    }
  }  

  const query2 = async()=>{
    try {
      const data = await sql`SELECT json_extract('{"a": 1, "b": 15}', '$.b') x;`;
      res = data[0].x;
    } catch (error) {
        console.log(error);
        alert(error);
    } finally {
      searchText = "";
    }
  }  

  const query3 = async()=>{
    try {
      const data = await sql`select hun, ltn from taxons where lower(hun) REGEXP ${searchText}`;
      res = data.length>0 ? `${data[0].hun} (${data[0].ltn})` : 'none';
      console.log(JSON.stringify(data));
    } catch (error) {
        console.log(error);
        alert(error);
    } finally {
      searchText = "";
    }
  }  

  
  </script>
  
  <div class="flex flex-col gap-2 p-2 items-start bg-indigo-300 h-full">
    <input class="border-2 border-violet-400 rounded-sm" type="file" id="input" name="Input" accept=".db, .sqlite" on:change={fileInputChange}/>
    <input 
      class="border-2 border-violet-400 rounded-sm w-1/2" 
      type="text" 
      on:change={fileInputChange} 
      bind:value={searchText}
      placeholder="searchtext"
    />
    <div class="flex flex-col gap-2 p-2">
      <button class="border-2 border-violet-400 rounded-md p-1" on:click={query1}>Normal query</button>
      <button class="border-2 border-violet-400 rounded-md p-1" on:click={query3}>Regexp query</button>
      <button class="border-2 border-violet-400 rounded-md p-1" on:click={query2}>JSON query</button>
      <!--button class="border-2 border-violet-400 rounded-md p-1" on:click={extractFile}>Download</button-->
    </div>
    <textarea class="p-2 w-full h-1/3" value={res} row=10/>
  </div>
