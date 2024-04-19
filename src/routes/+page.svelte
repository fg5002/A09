<script>
  import { SQLocal } from 'sqlocal';
  
  export const { sql, overwriteDatabaseFile, getDatabaseFile } = new SQLocal('ffd.db');
    
  let id;
  let res = "";
  
  const fileInputChange = async()=> {
    const fileInput = document.querySelector('input[type="file"]');
    const databaseFile = fileInput.files[0];
    await overwriteDatabaseFile(databaseFile);
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
      const version = await sql`select sqlite_version()`;
      console.log(version[0]);
      const data = await sql`select hun, ltn from taxons where lower(hun) REGEXP '${id}'`;
      res = `${data[0].hun} (${data[0].ltn})`;
    } catch (error) {
        console.log(error);
        alert(error);
    } finally {
      id = "";
    }
  }

  const query2 = async()=>{
    try {
      const version = await sql`select sqlite_version()`;
      console.log(version[0]);
      const data = await sql`select hun, ltn from taxons where lower(hun) LIKE ${id}`;
      res = `${data[0].hun} (${data[0].ltn})`;
    } catch (error) {
        console.log(error);
        alert(error);
    } finally {
      id = "";
    }
  }  

  const query3 = async()=>{
    try {
      const version = await sql`select sqlite_version()`;
      console.log(version[0]);
      const data = await sql`SELECT json_extract('{"a": 1, "b": 15}', '$.b') x;`;
      res = data[0].x;
    } catch (error) {
        console.log(error);
        alert(error);
    } finally {
      id = "";
    }
  }  

  
  </script>
  
  <div class="flex flex-col gap-2 items-center bg-indigo-300">
    <h1>Hello Attila</h1>
    <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
    <input class="border-2 border-violet-400 rounded-sm" type="file" id="input" name="Input" accept=".db, .sqlite" on:change={fileInputChange}/>
    <input class="border-2 border-violet-400 rounded-sm" type="text" on:change={fileInputChange} bind:value={id}/>
    <div class="flex gap-2">
      <button class="border-2 border-violet-400 rounded-md p-1" on:click={query1}>Query 1</button>
      <button class="border-2 border-violet-400 rounded-md p-1" on:click={query2}>Query 2</button>
      <button class="border-2 border-violet-400 rounded-md p-1" on:click={query3}>JSON Query</button>
      <button class="border-2 border-violet-400 rounded-md p-1" on:click={extractFile}>Download</button>
    </div>
    <span class="font-bold">{res}</span>
  </div>
