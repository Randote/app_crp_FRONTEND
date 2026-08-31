<script>
  import FormSection from '../FormSection.svelte';

  let { accion = [] } = $props();

  const ETIQUETAS_PORQUE = ['1ER', '2DO', '3ER', '4TO', '5TO'];

  let numerosRaiz = $derived.by(() => {
    const mapa = new Map();
    let contador = 1;
    for (const causa of accion) {
      if (causa.porques?.some((p) => p.es_raiz)) {
        mapa.set(causa.id, contador);
        contador++;
      }
    }
    return mapa;
  });
</script>

<FormSection title='5 ¿PORQUÉ?'>
  <div class="w-full overflow-x-auto lg:overflow-visible">
    <div class="flex flex-col gap-4 min-w-[900px] lg:min-w-0">
      <div class="hidden lg:flex bg-[#F0EDE6] border border-[var(--border-medium)] rounded-[8px] py-1">
        <div class="w-[210px] shrink-0 px-4 py-2 flex items-center">
          <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-[var(--text-hint,#9A9590)] uppercase tracking-wide">
            Causa potencial
          </span>
        </div>
        {#each ETIQUETAS_PORQUE as etiqueta}
          <div class="flex-1 px-4 py-2 border-l border-[var(--border-medium)] text-center">
            <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-[var(--text-hint,#9A9590)] uppercase tracking-wide">
              {etiqueta} Por qué
            </span>
          </div>
        {/each}
      </div>

      {#each accion as causa (causa.id || causa)}
        <div class="flex flex-col lg:flex-row border border-[var(--border-medium)] rounded-[8px] shadow-sm bg-white">
          <div class="w-full lg:w-[210px] shrink-0 p-4 border-b lg:border-b-0 lg:border-r border-[var(--border-medium)] bg-[#FAF8F4] flex flex-col justify-between gap-3">
            <p class="text-xs font-medium text-[var(--text-main,#2D2B28)] whitespace-pre-wrap">
              {causa.causa_potencial || '—'}
            </p>
          </div>

          <div class="flex-1 flex flex-col lg:flex-row">
            {#each causa.porques || [] as porque, pi}
              <div class="flex-1 flex flex-col border-b lg:border-b-0 lg:border-l border-[var(--border-medium)] first:border-l-0 bg-white">
                <div class="p-3 border-b border-[var(--border-medium)] bg-white min-h-[60px]">
                  <p class="font-[var(--font-ui,'Sora')] text-[9px] font-medium text-[var(--text-hint,#9A9590)] uppercase tracking-wide mb-1.5">
                    Pregunta {ETIQUETAS_PORQUE[pi]}
                  </p>
                  <p class="text-xs text-[var(--text-main,#2D2B28)] whitespace-pre-wrap">
                    {porque.pregunta || '—'}
                  </p>
                </div>

                <div class="relative p-3 flex-1 flex flex-col bg-[#FAFBFB] min-h-[70px]">
                  <div class="flex items-center justify-between mb-1.5">
                    <p class="font-[var(--font-ui,'Sora')] text-[9px] font-medium text-[var(--text-hint,#9A9590)] uppercase tracking-wide">
                      Respuesta
                    </p>

                    {#if porque.es_raiz}
                      <span class="w-[18px] h-[18px] rounded-full bg-[var(--text-error,#B85050)] border border-[var(--text-error,#B85050)] text-white flex items-center justify-center text-[10px] font-[var(--font-ui,'Sora')] font-semibold z-10">
                        {numerosRaiz.get(causa.id) || ''}
                      </span>
                    {/if}
                  </div>

                  <p class="text-xs text-[var(--text-main,#2D2B28)] whitespace-pre-wrap flex-1">
                    {porque.respuesta || '—'}
                  </p>

                  {#if porque.es_raiz}
                    <div class="absolute inset-0 rounded-[6px] ring-2 ring-[var(--text-error,#B85050)] pointer-events-none z-0"></div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</FormSection>