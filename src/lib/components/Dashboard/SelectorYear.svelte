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
    'No Conforme':           '#B85050',
    'Oportunidad de Mejora': '#4A8F4A',
    'Observación':           '#6E5AA0',
  };

  const ANIO_INICIO = 2026;
  const anioActual = new Date().getFullYear();
  const ANIOS_DISPONIBLES = Array.from(
    { length: anioActual - ANIO_INICIO + 1 },
    (_, i) => ANIO_INICIO + i
  ).reverse();

  const MESES_NOMBRE = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  let mesSeleccionado = $state('Todos');

  function cambiarAnio(e) {
    goto(`?anio=${e.target.value}`, { invalidateAll: true });
  }

  function filtrarPorMes(dataset) {
    if (mesSeleccionado === 'Todos') return dataset;

    const idx = MESES_NOMBRE.indexOf(mesSeleccionado);
    return {
      meses: [dataset.meses[idx]],
      series: dataset.series.map(s => ({
        tipo: s.tipo,
        data: [s.data[idx]]
      }))
    };
  }

  let accionesFiltradas = $derived(filtrarPorMes(data.acciones));
  let hallazgosFiltrados = $derived(filtrarPorMes(data.hallazgos));
</script>

<div class="flex justify-start gap-4 mb-4">
  <select
    value={data.anioSeleccionado}
    onchange={cambiarAnio}
    class=" min-w-[90px] bg-white border border-[#E4DFD6] rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-[var(--font-ui)] text-[var(--text-primary)]"
  >
    {#each ANIOS_DISPONIBLES as anio}
      <option value={anio}>{anio}</option>
    {/each}
  </select>

  <select
    bind:value={mesSeleccionado}
    class="min-w-[140px] bg-white border border-[#E4DFD6] rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-[var(--font-ui)] text-[var(--text-primary)]"
  >
    <option value="Todos">Todos los meses</option>
    {#each MESES_NOMBRE as mes}
      <option value={mes}>{mes}</option>
    {/each}
  </select>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
  <GraficaApilada
    titulo="Acciones por Tipo"
    meses={accionesFiltradas.meses}
    series={accionesFiltradas.series}
    colores={COLOR_TIPO_ACCION}
  />

  <GraficaApilada
    titulo="Hallazgos por Tipo"
    meses={hallazgosFiltrados.meses}
    series={hallazgosFiltrados.series}
    colores={COLOR_TIPO_HALLAZGO}
  />
</div>