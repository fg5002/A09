<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from "./Modal.svelte";
  import SveltyPicker, {config} from 'svelty-picker';

  export let showTimePicker = false;
  export let time = new Date().toISOString().split('T')[1].substring(1, 5);

  config.clearBtn = false;

  // TODO GMT+1 ???

  const dispatch = createEventDispatcher();

  const submitTimePicker = ()=> {
    dispatch('submitTimePicker', time);
    showTimePicker = false;   
  }

</script>

<Modal 
  bind:showModal={showTimePicker}
  modalClass = "timepicker" 
  backdropClasses = "items-start justify-center z-3000"
  mainClasses = "w-auto h-auto mt-1.5"
>
  <SveltyPicker
    inputClasses="p-2 w-auto border-2 border-gray-700 rounded-md"
    mode = time
    format = "hh.ii"
    pickerOnly = true
    manualInput = true
    on:input = {submitTimePicker}
    bind:value = {time}
  />
</Modal>