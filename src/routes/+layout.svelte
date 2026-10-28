<script>
  import '$lib/layout.css';
  import '../css/input.css';
  let { children } = $props();
    import NotificationBar from '$lib/components/Notificaciones.svelte';
  import { getNotifMessage, getNotifType, ocultarNotificacion } from '$lib/Notificacion.svelte.js';
   import Particulas from "$lib/components/Particulas.svelte";
</script>


  <div class="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-auto max-w-lg overflow-hidden">
    <NotificationBar
      message={getNotifMessage()}
      type={getNotifType()}
      dismissible={true}
      autoClose={4000}
      onClose={ocultarNotificacion}
    />
  </div>

  <Particulas/>
  {@render children()}