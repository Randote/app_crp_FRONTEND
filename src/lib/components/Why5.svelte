<script>
  import FormSection from './FormSection.svelte';
  import FieldError from './FieldError.svelte';
  import { mostrarNotificacion, ocultarNotificacion } from '$lib/Notificacion.svelte.js';

  let { value = $bindable([]) } = $props();

  const ETIQUETAS_PORQUE = ['1ER', '2DO', '3ER', '4TO', '5TO'];

  let contadorId = 0;
  function generarId() {
    contadorId += 1;
    return `causa-${Date.now()}-${contadorId}`;
  }

  function crearPorques() {
    return Array.from({ length: 5 }, () => ({
      pregunta: '',
      respuesta: ''
    }));
  }

  function nuevaCausa() {
    return {
      id: generarId(),
      causaPotencial: '',
      porques: crearPorques(),
      raizIndice: null
    };
  }

  $effect(() => {
    if (value.length === 0) {
      value = [nuevaCausa()];
    }
  });

  function agregarCausa() {
    value = [...value, nuevaCausa()];
  }

  function eliminarCausa(id) {
    value = value.filter((c) => c.id !== id);
    validationErrors = {};
  }

  function toggleRaiz(causa, indice) {
    causa.raizIndice = causa.raizIndice === indice ? null : indice;
    clearErrorRaiz();
  }

  let numerosRaiz = $derived.by(() => {
    const mapa = new Map();
    let contador = 1;
    for (const causa of value) {
      if (causa.raizIndice !== null) {
        mapa.set(causa.id, contador);
        contador++;
      }
    }
    return mapa;
  });

  let validationErrors = $state({});
  let errorRaizGeneral = $state('');

  function clearErrorCausa(id) {
    if (validationErrors[id]) {
      const nuevos = { ...validationErrors };
      delete nuevos[id];
      validationErrors = nuevos;
    }
  }
export function validar() {
    validationErrors = {};
    errorRaizGeneral = '';
    let tieneErrores = false;

    // 1. Validar que si hay texto en pregunta, tenga respuesta (y viceversa)
    for (const causa of value) {
      for (let pi = 0; pi < causa.porques.length; pi++) {
        const p = causa.porques[pi];
        const tienePregunta = p.pregunta && p.pregunta.trim();
        const tieneRespuesta = p.respuesta && p.respuesta.trim();

        if (tienePregunta && !tieneRespuesta) {
          validationErrors[causa.id] = `Falta la respuesta en el ${ETIQUETAS_PORQUE[pi]} Por qué.`;
          tieneErrores = true;
          break;
        }
        if (!tienePregunta && tieneRespuesta) {
          validationErrors[causa.id] = `Falta la pregunta en el ${ETIQUETAS_PORQUE[pi]} Por qué.`;
          tieneErrores = true;
          break;
        }
      }
    }

    if (tieneErrores) {
      mostrarNotificacion('Corrija los campos resaltados en el análisis de 5 Porqués.', 'error');
      return false;
    }

    ocultarNotificacion();
    return true;
  }
</script>

<FormSection title='5 ¿PORQUE?'>
<div class="w-full overflow-x-auto lg:overflow-visible">
  <div class="flex flex-col gap-4 min-w-[900px] lg:min-w-0">
    <div class="hidden lg:flex bg-[var(--bg-rojito)] border border-[var(--border-medium)] rounded-[8px] py-1">
      <div class="w-[210px] shrink-0 px-4 py-2 flex items-center">
        <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-white uppercase tracking-wide">
          Causa potencial
        </span>
      </div>
      {#each ETIQUETAS_PORQUE as etiqueta}
        <div class="flex-1 px-4 py-2 border-l border-[var(--border-medium)] text-center">
          <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-white uppercase tracking-wide">
            {etiqueta} Por qué
          </span>
        </div>
      {/each}
    </div>

{#each value as causa, ci (causa.id)}

      <div class="flex flex-col lg:flex-row border border-[var(--border-medium)] rounded-[8px] shadow-sm bg-white group overflow-hidden">

        <!-- Columna Izquierda: Causa Potencial -->
        <div class="w-full lg:w-[210px] shrink-0 p-4 border-b lg:border-b-0 lg:border-r border-[var(--border-medium)] bg-[#FAF8F4] flex flex-col justify-between gap-3">
          <textarea
            bind:value={causa.causaPotencial}
            oninput={() => clearErrorCausa(causa.id)}
            placeholder="Describe la causa potencial..."
            rows="5"
            class="textarea flex-1 !resize-none"
            class:input--error={validationErrors[causa.id]}
          ></textarea>
          <FieldError message={validationErrors[causa.id]} />
          <button
            type="button"
            onclick={() => eliminarCausa(causa.id)}
            class="cursor-pointer self-end text-[var(--text-hint,#9A9590)] opacity-0 group-hover:opacity-100 hover:text-[var(--text-error,#B85050)] transition-colors"
            title="Eliminar causa potencial"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" />
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" />
              <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
            </svg>
          </button>
        </div>

        <!-- Columnas Derecha: Divididas en Fila Superior (Preguntas) y Fila Inferior (Respuestas) -->
        <div class="flex-1 grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-medium)]">
          {#each causa.porques as porque, pi}
            <div class="flex flex-col bg-white">
              <!-- Fila Superior: Pregunta -->
              <div class="p-3 border-b border-[var(--border-medium)] bg-white flex flex-col h-full">
                <p class="font-[var(--font-ui,'Sora')] text-[9px] font-medium text-[var(--text-hint,#9A9590)] uppercase tracking-wide mb-1.5">
                  Pregunta {ETIQUETAS_PORQUE[pi]}
                </p>
                <textarea
                  bind:value={porque.pregunta}
                  placeholder="¿Por qué...?"
                  rows="3"
                  class="textarea flex-1 !resize-none"
                ></textarea>
              </div>

              <!-- Fila Inferior: Respuesta -->
              <div class="relative p-3 bg-[#FAFBFB] flex flex-col h-full">
                <div class="flex items-center justify-between mb-1.5">
                  <p class="font-[var(--font-ui,'Sora')] text-[9px] font-medium text-[var(--text-hint,#9A9590)] uppercase tracking-wide">
                    Respuesta
                  </p>

                  <button
                    type="button"
                    onclick={() => toggleRaiz(causa, pi)}
                    title={causa.raizIndice === pi ? 'Quitar como causa raíz' : 'Marcar como causa raíz'}
                    class="w-[18px] h-[18px] rounded-full border flex items-center justify-center text-[10px] font-[var(--font-ui,'Sora')] font-semibold transition-colors z-10 cursor-pointer
                      {causa.raizIndice === pi
                        ? 'bg-[var(--text-error,#B85050)] border-[var(--text-error,#B85050)] text-white'
                        : 'bg-white border-[var(--border-medium,#D4CFC6)] text-[var(--text-hint,#9A9590)] hover:border-[var(--text-error,#B85050)]'}"
                  >
                    {causa.raizIndice === pi ? numerosRaiz.get(causa.id) : ''}
                  </button>
                </div>

                <textarea
                  bind:value={porque.respuesta}
                  placeholder="Respuesta..."
                  rows="3"
                  class="textarea flex-1 !resize-none"
                ></textarea>

                {#if causa.raizIndice === pi}
                  <div class="absolute inset-0 rounded-[6px] ring-2 ring-[var(--text-error,#B85050)] pointer-events-none z-0"></div>
                {/if}
              </div>
            </div>
          {/each}
        </div>

      </div>
    {/each}
    <FieldError message={errorRaizGeneral} />

    <div class="pt-2">
      <button
        type="button"
        onclick={agregarCausa}
        class="ishikawa-btn-agregar flex items-center gap-1.5 font-[var(--font-ui,'Sora')] text-[13px] font-medium text-[var(--bg-rojito,#8B1A2A)] hover:text-[#701420] transition-colors cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9" /><path d="M12 8v8" /><path d="M8 12h8" />
        </svg>
        Agregar causa
      </button>
    </div>
  </div>
</div>
</FormSection>