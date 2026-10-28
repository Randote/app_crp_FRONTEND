<script>
  import SegmentedToggle from '$lib/components/Dashboard/Segmento.svelte';
  import LeaderboardNoConformidades from '$lib/components/Dashboard/LeaderBoardNoConforme.svelte';
  import TarjetaTopProceso from '$lib/components/Dashboard/TopNoComformidades.svelte';
  import FormSection from '$lib/components/FormSection.svelte';
  import Loader from '$lib/components/General/Loader.svelte';
  import { fetchAutenticado } from '$lib/fetchAutenticador.js';

  let modo = $state('Solo Abiertas');
  let procesos = $state([]);
  let procesosHistorico = $state([]);
  let cargando = $state(true);

  async function cargarDatos() {
    cargando = true;
    const soloAbiertas = modo === 'Solo Abiertas';

    const [resActual, resHistorico] = await Promise.all([
      fetchAutenticado(`${import.meta.env.VITE_API_URL}/api/reportes/indicadores/no-conformidades-por-proceso?solo_abiertas=${soloAbiertas}`),
      fetchAutenticado(`${import.meta.env.VITE_API_URL}/api/reportes/indicadores/no-conformidades-por-proceso?solo_abiertas=false`)
    ]);

    const jsonActual = resActual.ok ? await resActual.json() : { procesos: [] };
    const jsonHistorico = resHistorico.ok ? await resHistorico.json() : { procesos: [] };

    procesos = jsonActual.procesos;
    procesosHistorico = jsonHistorico.procesos;
    cargando = false;
  }

  $effect(() => {
    modo;
    cargarDatos();
  });

  let topActual = $derived(
    [...procesos].filter(p => p.cantidad > 0).sort((a, b) => b.cantidad - a.cantidad)[0]
  );

  let topHistorico = $derived(
    [...procesosHistorico].filter(p => p.cantidad > 0).sort((a, b) => b.cantidad - a.cantidad)[0]
  );
</script>

<FormSection title="No Conformidades por Proceso">

  <div class="flex items-center justify-end mb-4">
    <SegmentedToggle opciones={['Solo Abiertas', 'Histórico']} bind:valor={modo} />
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
    {#if topActual}
      <TarjetaTopProceso
        titulo="Más urgente ahora"
        proceso={topActual.proceso}
        cantidad={topActual.cantidad}
        porcentaje={topActual.porcentaje}
        color="#B85050"
      />
    {/if}

    {#if topHistorico}
      <TarjetaTopProceso
        titulo="Total histórico"
        proceso={topHistorico.proceso}
        cantidad={topHistorico.cantidad}
        porcentaje={topHistorico.porcentaje}
        color="#8B1A2A"
      />
    {/if}
  </div>

  {#if cargando}
    <div class="flex justify-center py-12">
    <Loader size={56} />
  </div>
  {:else}
    <LeaderboardNoConformidades {procesos} />
  {/if}
</FormSection>