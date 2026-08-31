<script>
  import cpIcon from '$lib/assets/crp_logo_icon.svg';
  import MatrizAcciones from '$lib/components/MatrizAcciones.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Matriz de Acciones Correctivas</title>
  <link rel="icon" href={cpIcon} />
</svelte:head>


<main class="box-border min-h-screen bg-stone-100 p-4 md:p-8">
<MatrizAcciones registros={data.registros}/>
</main>