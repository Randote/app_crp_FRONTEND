<!-- ModalDetalle.svelte -->
<script>
  import { fetchAutenticado } from '$lib/fetchAutenticador.js';

  let { proceso = null, onClose } = $props();

  let acciones = $state([]);
  let cargando = $state(true);

  async function cargar() {
    if (!proceso) return;
    cargando = true;
    const res = await fetchAutenticado(
      `${import.meta.env.VITE_API_URL}/api/reportes/indicadores/no-conformidades-por-proceso/detalle?proceso=${encodeURIComponent(proceso)}`
    );
    const json = res.ok ? await res.json() : { acciones: [] };
    acciones = json.acciones.sort((a, b) => b.dias_vencido - a.dias_vencido);
    cargando = false;
  }

  $effect(() => {
    proceso;
    cargar();
  });
</script>

{#if proceso}
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onclick={onClose}>
    <div
      class="bg-white rounded-[14px] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="bg-[var(--bg-rojito)] px-5 py-4 flex items-center justify-between">
        <div>
          <h3 class="font-[var(--font-ui)] text-white font-semibold text-base">{proceso}</h3>
          <p class="font-[var(--font-ui)] text-white/80 text-xs">{acciones.length} No Conformidades abiertas</p>
        </div>
        <button onclick={onClose} class="text-white/80 hover:text-white text-xl leading-none">×</button>
      </div>

      <div class="overflow-y-auto flex-1">
        {#if cargando}
          <p class="font-[var(--font-ui)] text-sm text-[var(--text-tertiary)] text-center py-12">Cargando...</p>
        {:else if acciones.length === 0}
          <p class="font-[var(--font-ui)] text-sm text-[var(--text-tertiary)] text-center py-12">
            No hay No Conformidades abiertas para este proceso.
          </p>
        {:else}
          <table class="w-full text-sm">
            <thead class="sticky top-0 bg-[var(--bg-card)] border-b border-[var(--border-subtle)]">
              <tr class="font-[var(--font-ui)] text-[11px] uppercase text-[var(--text-tertiary)]">
                <th class="text-left px-5 py-2">Codificador</th>
                <th class="text-left px-5 py-2">Acción</th>
                <th class="text-left px-5 py-2">Fecha</th>
                <th class="text-right px-5 py-2">Vencida</th>
              </tr>
            </thead>
            <tbody>
              {#each acciones as a, i}
                <tr class="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors {i % 2 === 1 ? 'bg-[#FAFAF8]' : ''}">
                  <td class="px-5 py-3 whitespace-nowrap">
                    <span class="inline-block bg-[var(--bg-rojito)]/10 text-[var(--bg-rojito)] font-[var(--font-code)] text-[11px] font-medium px-2 py-1 rounded-[var(--radius-sm)]">
                      {a.codificador}
                    </span>
                  </td>
                  <td class="px-5 py-3 font-[var(--font-ui)] text-[var(--text-primary)]">{a.descripcion}</td>
                  <td class="px-5 py-3 font-[var(--font-ui)] text-[var(--text-tertiary)] whitespace-nowrap">{a.fecha}</td>
                  <td class="px-5 py-3 text-right whitespace-nowrap">
                    {#if a.dias_vencido > 0}
                      <span class="inline-flex items-center gap-1 font-[var(--font-ui)] text-[13px] font-semibold text-[#B85050]">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#B85050]"></span>
                        {a.dias_vencido} días
                      </span>
                    {:else}
                      <span class="font-[var(--font-ui)] text-[13px] text-[var(--text-tertiary)]">Al día</span>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>

          <div class="border-t border-[var(--border-subtle)] px-5 py-3 bg-[var(--bg-card)]">
            <p class="font-[var(--font-ui)] text-[12px] text-[var(--text-tertiary)]">
              {acciones.length} acciones abiertas · promedio {Math.round(acciones.reduce((s, a) => s + a.dias_vencido, 0) / acciones.length)} días vencidas
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}