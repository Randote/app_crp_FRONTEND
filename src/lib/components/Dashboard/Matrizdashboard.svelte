<script>
  import { base } from '$app/paths';
  import Kpicrads from '$lib/components/Dashboard/TarjetaDash.svelte';
  import BuscadorTabla from '$lib/components/BuscadorTabla.svelte';
  import SelectorCantidad from '$lib/components/SelectorCantidad.svelte';
  import PaginadorTabla from '$lib/components/Paginadortabla.svelte';

  let { acciones = [], kpis = {} } = $props();

  let busqueda = $state('');
  let cantidadPorPagina = $state(5);
  let paginaActual = $state(1);

  let filtradas = $derived(
    acciones.filter((a) =>
      !busqueda.trim() ||
      a.codificador.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.proceso_afectado.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  let totalPaginas = $derived(Math.max(1, Math.ceil(filtradas.length / cantidadPorPagina)));

  $effect(() => {
    busqueda;
    cantidadPorPagina;
    paginaActual = 1;
  });

  let visibles = $derived(
    filtradas.slice((paginaActual - 1) * cantidadPorPagina, paginaActual * cantidadPorPagina)
  );
</script>

<Kpicrads
  totalProcesos={kpis.total_procesos}
  totalAcciones={kpis.total_acciones}
  abiertas={kpis.abiertas}
  cerradas={kpis.cerradas}
  vencidas={kpis.vencidas}
/>

<div class="dash-tabla-wrap mt-6">
  <div class="flex items-center justify-between gap-3 mb-1 flex-wrap bg-white border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-3">
    <BuscadorTabla bind:value={busqueda} placeholder="Filtrar por código, proceso…" />
    <SelectorCantidad bind:value={cantidadPorPagina} />
  </div>

  {#if acciones.length === 0}
    <div class="dash-vacio">
      <p>No hay acciones correctivas registradas todavía.</p>
    </div>
  {:else if filtradas.length === 0}
    <div class="dash-vacio">
      <p>No se encontraron resultados para "{busqueda}".</p>
    </div>
  {:else}
    <!-- 👇 tabla + paginador viven ahora en la misma tarjeta (igual que en Matriz) -->
    <div class="dash-tabla-card">
      <div class="dash-tabla-scroll">
        <table class="dash-tabla">
          <colgroup>
            <col style="width: 20%" />
            <col style="width: 40%" />
            <col style="width: 30%" />
            <col style="width: 10%" />
          </colgroup>
          <thead>
            <tr>
              <th>Codificador</th>
              <th>Proceso</th>
              <th>Origen del hallazgo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {#each visibles as accion (accion.id)}
              <tr>
                <td>
                  <span class="dash-codigo-valor">{accion.codificador}</span>
                </td>
                <td>
                  <span class="dash-proceso-nombre">{accion.proceso_afectado}</span>
                </td>
                <td class="dash-texto-hint">{accion.origen_deteccion ?? '—'}</td>
                <td class="dash-col-ver">
                  <a href="{base}/Matriz/{accion.codificador}" class="dash-ver-detalle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <path d="M15 3h6v6" />
                      <path d="M10 14 21 3" />
                    </svg>
                  </a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="dash-tabla-footer">
        <PaginadorTabla bind:paginaActual {totalPaginas} />
      </div>
    </div>
  {/if}
</div>