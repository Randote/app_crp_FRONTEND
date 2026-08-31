<script>
  import { goto } from '$app/navigation';
  import GraficaApilada from '$lib/components/Dashboard/GraficaApiladas.svelte';

  let { data } = $props();

  const COLOR_TIPO_ACCION = {
    'Preventiva': '#4A7FA8',
    'Inmediata':  '#B8892A',
    'Correctiva': '#8B1A2A',
  };

  const COLOR_TIPO_HALLAZGO = {
    'No Conforme':        '#B85050',
    'Oportunidad de Mejora': '#4A8F4A',
    'Observación':           '#6E5AA0',
  };

    const ANIO_INICIO = 2026; 
    const anioActual = new Date().getFullYear();
    const ANIOS_DISPONIBLES = Array.from(
  { length: anioActual - ANIO_INICIO + 1 },
  (_, i) => ANIO_INICIO + i
).reverse()

  function cambiarAnio(e) {
    goto(`?anio=${e.target.value}`, { invalidateAll: true });
  }
</script>

<div class="flex justify-end mb-4">
  <select
    value={data.anioSeleccionado}
    onchange={cambiarAnio}
    class="bg-white border border-[#E4DFD6] rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-[var(--font-ui)] text-[var(--text-primary)]"
  >
    {#each ANIOS_DISPONIBLES as anio}
      <option value={anio}>{anio}</option>
    {/each}
  </select>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

  <GraficaApilada
    titulo="Acciones por Tipo"
    meses={data.acciones.meses}
    series={data.acciones.series}
    colores={COLOR_TIPO_ACCION}
  />


  <GraficaApilada
    titulo="Hallazgos por Tipo"
    meses={data.hallazgos.meses}
    series={data.hallazgos.series}
    colores={COLOR_TIPO_HALLAZGO}
  />
</div>