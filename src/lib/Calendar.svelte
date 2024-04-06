<script>
  import Modal from "./Modal.svelte";
  import SveltyPicker, {config} from 'svelty-picker';

  export let showCalendar = false;
  export let calDate = new Date().toISOString().split('T')[0];

  config.todayBtn = false;
  config.clearBtn = false;
  config.clearToggle = false;

  const toggleCalendar = ()=> showCalendar=!showCalendar;

</script>

<Modal 
  bind:showModal={showCalendar}
  modalClass = "calendar"
  backdropClasses = "items-start justify-center z-3000"
  mainClasses = "w-auto h-auto mt-1.5"
>
  <div class=" shadow-xl border border-slate-500 rounded-sm">
    <SveltyPicker
      inputClasses="p-2 w-auto border-2 border-gray-700 rounded-md"
      format = "yyyy-mm-dd"
      pickerOnly = true
      on:input = {toggleCalendar}
      bind:value = {calDate}
    />
  </div>
</Modal>