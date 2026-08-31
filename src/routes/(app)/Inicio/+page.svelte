<script>
import '$lib/layout.css';
import cpIcon from '$lib/assets/crp_logo_icon.svg';
import MatrizDash from '$lib/components/Dashboard/Matrizdashboard.svelte';
  let { data } = $props();
</script>

<svelte:head>
  <title>Inicio</title>
  <link rel="icon" href={cpIcon} />
</svelte:head> 

<div class="hidden md:block relative bg-white border border-[#E4DFD6] rounded-[14px] p-5 mb-6 shadow-xs overflow-hidden select-none">
  <div class="absolute top-0 inset-x-0 h-[3px] bg-[var(--bg-rojito)]"></div>
  <h2 class="flex items-center justify-between text-2xl font-bold text-[var(--text-primary)]">Dashboard de Gestión</h2>
</div>
  

<MatrizDash  acciones={data.acciones}  kpis={data.kpis} />