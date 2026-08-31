<script>
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

  // ASIGNAMOS LOS VALORES INFERIORES (PA QUE NO SE TE OLVIDE PANFILO)
  const filaInferior = new Set(['metodo', 'medicion', 'medio_ambiente']);

  let validationErrors = $state({});
  let errorProblema = $state('');

  // AQUI TOMAMOS LOS VALORES DE LOS INPUTS (PA QUE NO SE TE OLVIDE PANFILO)
  function agregarCausa(categoria) {
    const nueva = { texto: '', valor: 0 };
    if (filaInferior.has(categoria)) {
      diagrama[categoria].causas.unshift(nueva);
    } else {
      diagrama[categoria].causas.push(nueva);
    }
    validationErrors = {};
    ocultarNotificacion(); 
  }

  // AQUI BORRAMOS (PA QUE NO SE TE OLVIDE PANFILO)
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


  export function validar() {
    validationErrors = {};
    errorProblema = '';

    if (!problema || !problema.trim()) {
      errorProblema = 'El problema enfocado es obligatorio.';
      mostrarNotificacion('Describa el problema enfocado (efecto) antes de continuar.', 'warning');
      return false;
    }

    // 2. Verificar que cada categoría tenga al menos una causa
    const categoriasVacias = [];
    for (const cat in diagrama) {
      if (diagrama[cat].causas.length === 0) {
        categoriasVacias.push(diagrama[cat].titulo);
      }
    }
    if (categoriasVacias.length > 0) {
      mostrarNotificacion(
        `Debe agregar al menos una causa en: ${categoriasVacias.join(', ')}.`,
        'warning'
      );
      return false;
    }

    
    // 3. Verificar que cada causa tenga un valor numérico > 0
    let hayErrorValor = false;
    for (const cat in diagrama) {
      diagrama[cat].causas.forEach((causa, i) => {
        if (!causa.valor || causa.valor <= 0) {
          validationErrors[`${cat}-${i}`] = 'El valor debe ser mayor a 0.';
          hayErrorValor = true;
        }
      });
    }

    if (hayErrorValor) {
      mostrarNotificacion('Corrija los valores numéricos resaltados.', 'warning');
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
                bind:value={causa.valor}
                oninput={() => clearError(cat, i)}
                class="ishikawa-numero w-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                class:border-red-500={validationErrors[`${cat}-${i}`]}
                class:border-2={validationErrors[`${cat}-${i}`]}
              />
              <FieldError message={validationErrors[`${cat}-${i}`]} />
            </div>

            <input
              type="text"
              bind:value={causa.texto}
              placeholder="Describa la causa..."
              class="ishikawa-input-causa input flex-1 min-w-0"
            />

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