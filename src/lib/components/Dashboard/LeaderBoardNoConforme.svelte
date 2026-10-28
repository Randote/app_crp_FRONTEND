<script>
  import ModalDetalleProceso from './ModalDetalle.svelte';
  let { procesos = [] } = $props();
  let procesoSeleccionado = $state(null);

  let ordenados = $derived(
    [...procesos]
      .filter(p => p.cantidad > 0)
      .sort((a, b) => b.cantidad - a.cantidad)
  );

  let maximo = $derived(
    ordenados.length > 0 ? ordenados[0].cantidad : 1
  );

  const MEDALLA = { 1: '#B8892A', 2: '#9A9590', 3: '#8B6F4E' };
</script>

<div class="flex flex-col gap-1.5">
  {#each ordenados as p, i}
    {@const posicion = i + 1}
    {@const anchoPct = (p.cantidad / maximo) * 100}
    {@const esTop3 = posicion <= 3}
    <button
      onclick={() => (procesoSeleccionado = p.proceso)}
      class="group flex items-center gap-3 py-2.5 w-full text-left rounded-[var(--radius-sm)] px-3 -mx-1 transition-all hover:shadow-sm hover:-translate-y-[1px]
        {esTop3 ? '' : 'hover:bg-[var(--bg-hover)]'}"
      style={esTop3 ? `background: ${MEDALLA[posicion]}0D;` : ''}
    >
      <span
        class="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-[var(--font-ui)] font-bold shrink-0"
        style="background: {MEDALLA[posicion] ?? '#E4DFD6'}1A; color: {MEDALLA[posicion] ?? '#9A9590'};"
      >
        {posicion}
      </span>

      <div class="flex-1 min-w-0 cursor-pointer">
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <span class="font-[var(--font-ui)] text-[13px] font-medium text-[var(--text-primary)] truncate">
            {p.proceso}
          </span>
          <span class="font-[var(--font-ui)] text-[13px] font-semibold text-[var(--accent-wine)] shrink-0">
            {p.cantidad} <span class="text-[var(--text-tertiary)] font-normal">({p.porcentaje}%)</span>
          </span>
        </div>

        <div class="h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-[width] duration-500 ease-out"
            style="width: {anchoPct}%; background: #8B1A2A;"
          ></div>
        </div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="text-[var(--text-tertiary)] shrink-0 transition-transform group-hover:translate-x-0.5"
      >
        <path d="M9 6l6 6l-6 6" />
      </svg>
    </button>
  {/each}
</div>

<ModalDetalleProceso proceso={procesoSeleccionado} onClose={() => (procesoSeleccionado = null)} />

{#if ordenados.length === 0}
  <p class="font-[var(--font-ui)] text-sm text-[var(--text-tertiary)] text-center py-8">
    No hay No Conformidades registradas.
  </p>
{/if}