<script>
  import cpIcon from '$lib/assets/crp_logo_icon.svg';
  import MatrizAcciones from '$lib/components/MatrizAcciones.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Matriz de Acciones Correctivas</title>
  <link rel="icon" href={cpIcon} />
</svelte:head>

<div class="hidden md:block relative bg-white border border-[#E4DFD6] rounded-[14px] p-5 mb-6 shadow-xs overflow-hidden select-none">
  <div class="absolute top-0 inset-x-0 h-[3px] bg-[var(--bg-rojito)]"></div>
  <h2 class="flex items-center justify-between text-2xl font-bold text-[var(--text-primary)]">Matriz de Acciones Correctivas</h2>
</div> 

<MatrizAcciones registros={data.registros}/>




