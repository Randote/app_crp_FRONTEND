<script>
  import { fade, scale } from "svelte/transition";
  import { cubicOut, backOut } from "svelte/easing";

  let {
    open = $bindable(false),
    categoria = null,
    titulo = "¿Estás seguro?",
    mensaje = "Esta acción no se puede deshacer.",
    tablaEncabezados = null,
    tablaFilas = null,
    textoConfirmar = "Confirmar",
    textoCancelar = "Cancelar",
    variante = "normal",
    onConfirm,
  } = $props();

  const ESTILOS = {
    normal: {
      barra: "bg-[#3B6FA5]",
      boton: "bg-[#3B6FA5] hover:bg-[#325D8B] shadow-[0_4px_14px_-4px_rgba(59,111,165,0.5)]",
      badgeTexto: "text-[#3B6FA5]",
      badgeBorde: "border-[#3B6FA5]/30",
      badgeFondo: "bg-[#3B6FA5]/5",
    },
    advertencia: {
      barra: "bg-[#C7791F]",
      boton: "bg-[#C7791F] hover:bg-[#A8631A] shadow-[0_4px_14px_-4px_rgba(199,121,31,0.5)]",
      badgeTexto: "text-[#C7791F]",
      badgeBorde: "border-[#C7791F]/30",
      badgeFondo: "bg-[#C7791F]/5",
    },
    peligro: {
      barra: "bg-[var(--bg-rojito)]",
      boton: "bg-[var(--bg-rojito)] hover:opacity-90 shadow-[0_4px_14px_-4px_rgba(139,26,42,0.5)]",
      badgeTexto: "text-[var(--bg-rojito)]",
      badgeBorde: "border-[var(--bg-rojito)]/30",
      badgeFondo: "bg-[var(--bg-rojito)]/5",
    },
  };

  let estilo = $derived(ESTILOS[variante] ?? ESTILOS.normal);

  function cerrar() {
    open = false;
  }

  function confirmar() {
    onConfirm?.();
    open = false;
  }

  function manejarTeclado(e) {
    if (e.key === "Escape") cerrar();
  }

  function portal(nodo) {
    document.body.appendChild(nodo);
    return {
      destroy() {
        nodo.remove();
      },
    };
  }
</script>

<svelte:window onkeydown={open ? manejarTeclado : null} />

{#if open}
  <div use:portal>
    <div
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-[3px] p-4"
      onclick={cerrar}
      role="presentation"
      transition:fade={{ duration: 180, easing: cubicOut }}
    >
      <div
        class="w-full max-w-md rounded-2xl bg-white shadow-[0_20px_60px_-12px_rgba(0,0,0,0.35)] overflow-hidden"
        onclick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        transition:scale={{ duration: 260, start: 0.9, easing: backOut }}
      >
        <div class="p-7 relative">
          <button
            type="button"
            onclick={cerrar}
            aria-label="Cerrar"
            class="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-full text-[var(--text-hint)] hover:bg-[var(--bg-input-dis)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>

          {#if categoria}
            <span class="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border {estilo.badgeBorde} {estilo.badgeFondo} {estilo.badgeTexto} font-[var(--font-code)] mb-3">
              {categoria}
            </span>
          {/if}

          <h2 id="modal-titulo" class="text-[19px] font-bold font-[var(--font-ui)] text-[var(--text-primary)] mb-2.5 leading-snug pr-6">
            {titulo}
          </h2>

          <p class="text-[13.5px] text-[var(--text-hint)] leading-relaxed mb-5">
            {mensaje}
          </p>

          {#if tablaFilas && tablaFilas.length > 0}
            <div class="mb-6 max-h-[220px] overflow-y-auto rounded-xl border border-[var(--border-subtle)]">
              <table class="w-full text-left border-collapse">
                {#if tablaEncabezados}
                  <thead class="sticky top-0 bg-[var(--bg-input-dis)]">
                    <tr>
                      {#each tablaEncabezados as encabezado}
                        <th class="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-hint)] border-b border-[var(--border-subtle)]">
                          {encabezado}
                        </th>
                      {/each}
                    </tr>
                  </thead>
                {/if}
                <tbody>
                  {#each tablaFilas as fila}
                    <tr class="border-b border-[var(--border-subtle)] last:border-b-0">
                      {#each fila as celda}
                        <td class="px-3 py-2 text-[12px] text-[var(--text-primary)] align-top">
                          {celda}
                        </td>
                      {/each}
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}

          <div class="flex justify-end gap-2.5 pt-1">
            <button
              type="button"
              onclick={cerrar}
              class="px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-input-dis)] hover:bg-[var(--border-subtle)] transition-colors"
            >
              {textoCancelar}
            </button>

            <button
              type="button"
              onclick={confirmar}
              class="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 {estilo.boton}"
            >
              {textoConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}