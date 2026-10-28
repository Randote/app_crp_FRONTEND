<script>
import '$lib/layout.css';
import cpIcon from '$lib/assets/crp_logo_icon.svg';
import GraficaDeteccion from '$lib/components/Dashboard/GraficaDeteccion.svelte'
import TarjetaProceso from '$lib/components/Dashboard/TarjetaProceso.svelte'
import GraficasporMes from '$lib/components/Dashboard/SelectorYear.svelte'
import NoConformidades from '$lib/components/Dashboard/NoConformidadesPorProceso.svelte'
 import GraficaPieAbiertasVencidas from '$lib/components/Dashboard/GraficaPieAbiertasVencidas.svelte';

let {data}= $props()
</script>

<svelte:head>
  <title>Reportes</title>
  <link rel="icon" href={cpIcon} />
</svelte:head> 

<div class="hidden md:block relative bg-white border border-[#E4DFD6] rounded-[14px] p-5 mb-6 shadow-xs overflow-hidden select-none">
  <div class="absolute top-0 inset-x-0 h-[3px] bg-[var(--bg-rojito)]"></div>
  <h2 class="flex items-center justify-between text-2xl font-bold text-[var(--text-primary)]">Indicadores de Gestión</h2>
</div>


<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
  <GraficaPieAbiertasVencidas
    abiertas={data.kpis.abiertas}
    vencidas={data.kpis.vencidas}
    cerradas={data.kpis.cerradas}
  />
  <GraficaDeteccion origenes={data.origenes} />
</div>


<div class="mb-6">
  <GraficasporMes {data} />
</div>


<div class="mb-6">
  <TarjetaProceso procesos={data.procesos} total={data.total} />
</div>


<NoConformidades />
