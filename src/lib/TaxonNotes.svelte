<script>
  import Modal from "./Modal.svelte";
  import {currData} from "./store";
  
  export let showEditorNotes = false;
  export let placeHolder = "none";

  let inputRef = null;

  const enterPressed = (e)=>{
    if(e.key == 'Enter'){
      showEditorNotes = false
    }
  }
  
</script>

<Modal
  bind:showModal = {showEditorNotes} 
  modalClass = "editor-notes-list" 
  backdropClasses = "items-start justify-center z-2000"
  mainClasses = "w-4/5 h-1/3 mt-1.5 md:w-1/2 xl:w-1/3"
  on:introEnd = {()=> inputRef.focus()}
  on:outroEnd
>
  <textarea 
    class="h-full w-full bg-yellow-200 border-2 border-zinc-500 rounded-sm p-2 text-xl" 
    type="text"
    placeholder= {placeHolder}
    bind:value={$currData.note}
    bind:this={inputRef}
    on:contextmenu={()=> $currData.note =""}
    on:keydown|stopPropagation={enterPressed}
  />
  
</Modal>