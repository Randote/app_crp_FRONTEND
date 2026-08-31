<script>
  let {
    paginaActual = $bindable(1),
    totalPaginas = 1,
  } = $props();

  function irA(pagina) {
    if (pagina < 1 || pagina > totalPaginas) return;
    paginaActual = pagina;
  }

  let rango = $derived.by(() => {
    const total = totalPaginas;
    const actual = paginaActual;
    const ventana = 2;

    let inicio = Math.max(1, actual - ventana);
    let fin = Math.min(total, actual + ventana);

    if (fin - inicio < 4) {
      if (inicio === 1) fin = Math.min(total, inicio + 4);
      else if (fin === total) inicio = Math.max(1, fin - 4);
    }

    const paginas = [];
    for (let i = inicio; i <= fin; i++) paginas.push(i);
    return paginas;
  });
</script>

{#if totalPaginas > 1}
  <div class="flex items-center justify-center gap-1.5">
    <button
      type="button"
      onclick={() => irA(paginaActual - 1)}
      disabled={paginaActual === 1}
      class="flex items-center justify-center w-8 h-8 rounded-[8px] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-input-dis)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      aria-label="Página anterior"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>

    {#if rango[0] > 1}
      <button
        type="button"
        onclick={() => irA(1)}
        class="w-8 h-8 rounded-[8px] text-[12.5px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-input-dis)] transition-colors"
      >
        1
      </button>
      {#if rango[0] > 2}
        <span class="text-[var(--text-hint)] px-1">…</span>
      {/if}
    {/if}

    {#each rango as pagina}
      <button
        type="button"
        onclick={() => irA(pagina)}
        class="w-8 h-8 rounded-[8px] text-[12.5px] font-semibold transition-colors {pagina === paginaActual
          ? 'bg-[var(--bg-rojito)] text-white'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-input-dis)]'}"
      >
        {pagina}
      </button>
    {/each}

    {#if rango[rango.length - 1] < totalPaginas}
      {#if rango[rango.length - 1] < totalPaginas - 1}
        <span class="text-[var(--text-hint)] px-1">…</span>
      {/if}
      <button
        type="button"
        onclick={() => irA(totalPaginas)}
        class="w-8 h-8 rounded-[8px] text-[12.5px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-input-dis)] transition-colors"
      >
        {totalPaginas}
      </button>
    {/if}

    <button
      type="button"
      onclick={() => irA(paginaActual + 1)}
      disabled={paginaActual === totalPaginas}
      class="flex items-center justify-center w-8 h-8 rounded-[8px] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-input-dis)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      aria-label="Página siguiente"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  </div>
{/if}