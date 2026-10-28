<script>
  import { tick } from 'svelte';
  import FieldError from './FieldError.svelte';
  import { mostrarNotificacion, ocultarNotificacion } from '$lib/Notificacion.svelte.js';

  let {
    diagrama = $bindable({
      mano_obra: { titulo: 'MANO DE OBRA', causas: [] },
      maquina: { titulo: 'MÁQUINA', causas: [] },
      material: { titulo: 'MATERIAL', causas: [] },
      metodo: { titulo: 'MÉTODO', causas: [] },
      medicion: { titulo: 'MEDICIÓN', causas: [] },
      medio_ambiente: { titulo: 'MEDIO AMBIENTE', causas: [] }
    }),
    problema = $bindable('')
  } = $props();

  const filaInferior = new Set(['metodo', 'medicion', 'medio_ambiente']);
  const VALOR_MAXIMO = 5;

  let validationErrors = $state({});
  let errorProblema = $state('');

  async function agregarCausa(categoria) {
    const nueva = { texto: '', valor: 0 };
    let nuevoIndex;

    if (filaInferior.has(categoria)) {
      diagrama[categoria].causas.unshift(nueva);
      nuevoIndex = 0;
    } else {
      diagrama[categoria].causas.push(nueva);
      nuevoIndex = diagrama[categoria].causas.length - 1;
    }

    validationErrors = {};
    ocultarNotificacion();

    await tick();
    document.getElementById(`textarea-${categoria}-${nuevoIndex}`)?.focus();
  }

  function eliminarCausa(categoria, index) {
    diagrama[categoria].causas.splice(index, 1);
    validationErrors = {};
    ocultarNotificacion();
  }

  function clearError(cat, i) {
    const key = `${cat}-${i}`;
    if (validationErrors[key]) {
      const newErrors = { ...validationErrors };
      delete newErrors[key];
      validationErrors = newErrors;
      if (Object.keys(validationErrors).length === 0 && !errorProblema) {
        ocultarNotificacion();
      }
    }
  }

  function clearErrorProblema() {
    if (errorProblema) {
      errorProblema = '';
      if (Object.keys(validationErrors).length === 0) {
        ocultarNotificacion();
      }
    }
  }

  function limitarValor(cat, i) {
    const causa = diagrama[cat].causas[i];
    if (causa.valor !== '' && causa.valor !== null && causa.valor > VALOR_MAXIMO) {
      causa.valor = VALOR_MAXIMO;
    }
    if (causa.valor < 0 || isNaN(causa.valor)) {
      causa.valor = 0;
    }
  }

  function seleccionarAlEnfocar(e) {
    e.target.select();
  }

  export function validar() {
    validationErrors = {};
    errorProblema = '';

    if (!problema || !problema.trim()) {
      errorProblema = 'El problema enfocado es obligatorio.';
      mostrarNotificacion('Describa el problema enfocado (efecto) antes de continuar.', 'warning');
      return false;
    }

    const categoriasVacias = [];
    for (const cat in diagrama) {
      if (diagrama[cat].causas.length === 0) {
        categoriasVacias.push(diagrama[cat].titulo);
      }
    }
    if (categoriasVacias.length > 0) {
      mostrarNotificacion(
        `Debe agregar al menos una causa en: ${categoriasVacias.join(', ')}. De no tener causa colocar N/A`,
        'warning'
      );
      return false;
    }

    return true;
  }
</script>

{#snippet filaCategoria(cat)}
  <div class="flex flex-col gap-3">
    <div class="ishikawa-titulo">
      {diagrama[cat].titulo}
    </div>

    <div class="flex flex-col gap-3">
      {#if diagrama[cat].causas.length === 0}
        <div class="ishikawa-texto-vacio text-sm italic py-2 flex items-center justify-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
            <circle cx="12" cy="12" r="10"/>
            <path d="M22 2 2 22"/>
          </svg>
          <span>Sin causas</span>
        </div>
      {:else}
        {#each diagrama[cat].causas as causa, i (i)}
          <div class="flex items-start gap-2">
            <div class="flex flex-col gap-0.5">
              <input
                type="number"
                max={VALOR_MAXIMO}
                min="0"
                bind:value={causa.valor}
                oninput={() => {
                  limitarValor(cat, i);
                  clearError(cat, i);
                }}
                onfocus={seleccionarAlEnfocar}
                class="ishikawa-numero w-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>

            <textarea
              id={`textarea-${cat}-${i}`}
              bind:value={causa.texto}
              placeholder="Describa la causa..."
              class="ishikawa-input-causa input flex-1 min-w-0 !h-auto"
              rows="3"
            ></textarea>

            <button
              type="button"
              onclick={() => eliminarCausa(cat, i)}
              class="ishikawa-btn-eliminar"
              aria-label="Eliminar causa"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"/>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </button>
          </div>
        {/each}
      {/if}
      <div class="flex justify-center">
        <button type="button" onclick={() => agregarCausa(cat)} class="ishikawa-btn-agregar">
          + Agregar causa
        </button>
      </div>
    </div>
  </div>
{/snippet}

<div class="ishikawa-contenedor relative bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[14px] p-5 md:p-6 lg:p-8 flex flex-col gap-4 lg:gap-5 ">
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
    <textarea
      bind:value={problema}
      oninput={clearErrorProblema}
      placeholder="Describa el problema enfocado..."
      class="textarea"
      class:input--error={errorProblema}
    ></textarea>
    <FieldError message={errorProblema} />
  </div>
</div>