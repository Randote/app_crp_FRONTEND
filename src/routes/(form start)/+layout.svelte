<script>
  import cpIcon from '$lib/assets/crp_logo_icon.svg';
  import '$lib/layout.css';
  import '../../css/input.css';
  import '../../css/ishikawa.css';
  import '../../css/matrizacciones.css';
  import TopBar from '$lib/components/TopBar.svelte';
  import NotificationBar from '$lib/components/Notificaciones.svelte';
  import { getNotifMessage, getNotifType, ocultarNotificacion } from '$lib/Notificacion.svelte.js';


  let { children } = $props();
</script>

<TopBar/>
<div class="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-auto max-w-lg">
  <NotificationBar
    message={getNotifMessage()}
    type={getNotifType()}
    dismissible={true}
    autoClose={4000}
    onClose={ocultarNotificacion}
  />
</div>
<main class="box-border bg-stone-100 p-4 md:p-8">
  {@render children()} 
</main>
 

