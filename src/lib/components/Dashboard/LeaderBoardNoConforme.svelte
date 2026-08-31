<script>
  let { procesos = [] } = $props();

  let ordenados = $derived(
    [...procesos]
      .filter(p => p.cantidad > 0)
      .sort((a, b) => b.cantidad - a.cantidad)
  );

  let maximo = $derived(
    ordenados.length > 0 ? ordenados[0].cantidad : 1
  );

  const MEDALLA = { 1: '#B8892A', 2: '#9A9590', 3: '#8B6F4E' }; // oro/plata/bronce sutil
</script>

<div class="flex flex-col gap-2">
  {#each ordenados as p, i}
    {@const posicion = i + 1}
    {@const anchoPct = (p.cantidad / maximo) * 100}
    <div class="flex items-center gap-3 py-2">
      <span
        class="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-[var(--font-ui)] font-bold shrink-0"
        style="background: {MEDALLA[posicion] ?? '#E4DFD6'}1A; color: {MEDALLA[posicion] ?? '#9A9590'};"
      >
        {posicion}
      </span>

      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2 mb-1">
          <span class="font-[var(--font-ui)] text-[13px] font-medium text-[var(--text-primary)] truncate">
            {p.proceso}
          </span>
          <span class="font-[var(--font-ui)] text-[13px] font-semibold text-[var(--accent-wine)] shrink-0">
            {p.cantidad} <span class="text-[var(--text-tertiary)] font-normal">({p.porcentaje}%)</span>
          </span>
        </div>

        <div class="h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
          <div
            class="h-full bg-[var(--accent-wine)] rounded-full transition-[width] duration-300"
            style="width: {anchoPct}%"
          ></div>
        </div>
      </div>
    </div>
  {/each}
</div>

{#if ordenados.length === 0}
  <p class="font-[var(--font-ui)] text-sm text-[var(--text-tertiary)] text-center py-8">
    No hay No Conformidades registradas.
  </p>
{/if}