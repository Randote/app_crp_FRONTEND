<script>
  let { ishikawa = null } = $props();

  const TITULOS_CATEGORIAS = {
    mano_obra: 'MANO DE OBRA',
    maquina: 'MÁQUINA',
    material: 'MATERIAL',
    metodo: 'MÉTODO',
    medicion: 'MEDICIÓN',
    medio_ambiente: 'MEDIO AMBIENTE'
  };

  let diagrama = $derived.by(() => {
    const base = {
      mano_obra: [],
      maquina: [],
      material: [],
      metodo: [],
      medicion: [],
      medio_ambiente: []
    };

    if (ishikawa?.causas && Array.isArray(ishikawa.causas)) {
      for (const causa of ishikawa.causas) {
        if (base[causa.categoria]) {
          base[causa.categoria].push(causa);
        }
      }
    }

    return base;
  });

  let problema = $derived(ishikawa?.problema_enfocado || '');
</script>

{#snippet filaCategoria(cat)}
  <div class="flex flex-col gap-3">
    <div class="ishikawa-titulo">
      {TITULOS_CATEGORIAS[cat]}
    </div>

    <div class="flex flex-col gap-3">
      {#if diagrama[cat].length === 0}
        <div class="ishikawa-texto-vacio text-sm italic py-2 flex items-center justify-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
            <circle cx="12" cy="12" r="10"/>
            <path d="M22 2 2 22"/>
          </svg>
          <span>Sin causas</span>
        </div>
      {:else}
        {#each diagrama[cat] as causa, i (causa.id || i)}
          <div class="flex items-center gap-2">
            <span class="ishikawa-numero w-16 text-center py-1.5 px-2 bg-white rounded border border-[var(--border-medium,#D4CFC6)] font-semibold text-sm shrink-0">
              {causa.valor ?? 0}
            </span>

            <div class="ishikawa-input-causa flex-1 min-w-0 py-1.5 px-3 bg-white rounded border border-[var(--border-medium,#D4CFC6)] text-sm text-[var(--text-main,#2D2B28)]">
              {causa.texto || ''}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
{/snippet}

<div class="ishikawa-contenedor relative bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[14px] p-5 md:p-6 lg:p-8 flex flex-col gap-4 lg:gap-5">
  <div class="problema-badge z-999">CAUSAS POTENCIALES</div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 lg:gap-8 relative z-20">
    {#each ['mano_obra', 'maquina', 'material'] as cat}
      {@render filaCategoria(cat)}
    {/each}
  </div>

  <div class="hidden lg:flex h-10 items-center justify-start relative z-20 pointer-events-none"></div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 lg:gap-8 relative z-20">
    {#each ['metodo', 'medicion', 'medio_ambiente'] as cat}
      {@render filaCategoria(cat)}
    {/each}
  </div>

  <div class="problema-card relative z-20 !mt-4 lg:mb-0">
    <div class="problema-badge">Efecto</div>
    <p class="problema-eyebrow">Problema enfocado</p>
    <div class="p-3 bg-white border border-[var(--border-medium,#D4CFC6)] rounded-[8px] text-sm text-[var(--text-main,#2D2B28)] whitespace-pre-wrap min-h-[50px]">
      {problema || 'Sin problema registrado'}
    </div>
  </div>
</div>