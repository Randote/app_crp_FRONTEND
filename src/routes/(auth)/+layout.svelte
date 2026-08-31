<script>
  import '$lib/layout.css';
  import '../../css/input.css';
  import '../../css/ishikawa.css';
  import Navbar from '$lib/components/NavBar.svelte';
  import NotificationBar from '$lib/components/Notificaciones.svelte';
  import { getNotifMessage, getNotifType, ocultarNotificacion } from '$lib/Notificacion.svelte.js';

  let { data, children } = $props();
</script>

<div class="flex h-screen w-full h-full bg-[#F8F5F0] overflow-auto relative">

  <Navbar usuario={data.user} />

  <div class="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-auto max-w-lg">
    <NotificationBar
      message={getNotifMessage()}
      type={getNotifType()}
      dismissible={true}
      autoClose={4000}
      onClose={ocultarNotificacion}
    />
  </div>

  <main class="flex-1 relative p-6">
    {@render children()}
  </main>

</div>