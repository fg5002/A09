<script>
  import {onMount} from 'svelte';
  import { SQLocal } from 'sqlocal';
  import {currDate } from '../lib/store';
  
  export const { sql, overwriteDatabaseFile, getDatabaseFile } = new SQLocal('ffd.db');
  
  onMount( async()=> {
    try {
      const databaseFile = await getDatabaseFile();
      console.log(databaseFile);
    } catch (error) {
        alert(error);
    }    
  });

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

  const dateTimeString = ()=> {
    let date = new Date().toISOString().split('T')[0].replace(/-/g,'_');
    let time = new Date().toTimeString().slice(0, 8).replace(/:/g,'_');
    return `${date}_${time}`;
  }

  const monthConv =(m)=> parseInt(m[$currDate.split('-')[1]-1]);

  </script>
  
  <div class="h-3/4 flex flex-col bg-indigo-100 p-4">

    <input
      class="border-2 border-violet-100 rounded-md px-2 py-1" 
      type="file" 
      id="input" 
      name="Input" 
      accept=".db, .sqlite" 
      on:change={fileInputChange}
    />
  </div>
  <div class="h-1/4 flex flex-col bg-indigo-100"></div>

