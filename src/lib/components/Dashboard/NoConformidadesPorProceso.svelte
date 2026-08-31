<script>
  import Segmento from '$lib/components/Dashboard/Segmento.svelte';
  import Leaderboard from '$lib/components/Dashboard/LeaderBoardNoConforme.svelte';
  import { fetchAutenticado } from '$lib/fetchAutenticador.js';

  let modo = $state('Solo Abiertas');
  let procesos = $state([]);
  let cargando = $state(true);

  async function cargarDatos() {
    cargando = true;
    const soloAbiertas = modo === 'Solo Abiertas';

    const res = await fetchAutenticado(
      `${import.meta.env.VITE_API_URL}/api/reportes/indicadores/no-conformidades-por-proceso?solo_abiertas=${soloAbiertas}`
    );

    const json = res.ok ? await res.json() : { procesos: [] };
    procesos = json.procesos;
    cargando = false;
  }

  $effect(() => {
    modo; // dependencia reactiva — se re-ejecuta cuando cambia el toggle
    cargarDatos();
  });
</script>

<div class="relative bg-white border border-[#E4DFD6] rounded-[14px] p-5 overflow-hidden">

  <div class="flex items-center justify-between mb-4">
    <h3 class="font-[var(--font-ui)] text-lg font-semibold text-[var(--text-primary)]">
      No Conformidades por Proceso
    </h3>

    <Segmento
      opciones={['Solo Abiertas', 'Histórico']}
      bind:valor={modo}
    />
  </div>

  {#if cargando}
    <p class="font-[var(--font-ui)] text-sm text-[var(--text-tertiary)] text-center py-12">
      Cargando...
    </p>
  {:else if procesos.every(p => p.cantidad === 0)}
    <p class="font-[var(--font-ui)] text-sm text-[var(--text-tertiary)] text-center py-12">
      No hay No Conformidades registradas.
    </p>
  {:else}
    <Leaderboard {procesos} />
  {/if}
</div>