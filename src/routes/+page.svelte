<script>
  import { SQLocal } from 'sqlocal';
  
  export const { sql, overwriteDatabaseFile } = new SQLocal('birds.db');
  
  let id;
  let res = "";
  
  const fileInputChange = async()=> {
    const fileInput = document.querySelector('input[type="file"]');
    const databaseFile = fileInput.files[0];
    await overwriteDatabaseFile(databaseFile);
  }
  
  const query = async()=>{
      const data = await sql`SELECT hun,ltn from birds where id = ${id}`;
      //console.log(data);
      res = `${data[0].hun} (${data[0].ltn})`;
      id = "";
  }
  
  </script>
  
  <div class="flex flex-col gap-2 items-center bg-indigo-300">
    <h1>Hello Attila</h1>
    <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
    <input class="border-2 border-violet-400 rounded-sm" type="file" id="input" name="Input" accept=".db, .sqlite" on:change={fileInputChange}/>
    <input class="border-2 border-violet-400 rounded-sm" type="text" on:change={fileInputChange} bind:value={id}/>
    <button class="border-2 border-violet-400 rounded-md" on:click={query}>Gomb</button>
    <span class="font-bold">{res}</span>
  </div>
