<script>
  import cpIcon from '$lib/assets/crp_logo_icon.svg';
  import ResetContraseña from '$lib/components/Reset-Contraseña.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Cambiar Contraseña</title>
  <link rel="icon" href={cpIcon} />
</svelte:head>


<div class="contenedorFrom">
  <ResetContraseña/>
</div>

