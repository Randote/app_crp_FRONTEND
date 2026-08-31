<script>
  import '$lib/layout.css';
  import '../css/input.css';
  let { children } = $props();
    import NotificationBar from '$lib/components/Notificaciones.svelte';
  import { getNotifMessage, getNotifType, ocultarNotificacion } from '$lib/Notificacion.svelte.js';
</script>


  <div class="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-auto max-w-lg">
    <NotificationBar
      message={getNotifMessage()}
      type={getNotifType()}
      dismissible={true}
      autoClose={4000}
      onClose={ocultarNotificacion}
    />
  </div>
  {@render children()}