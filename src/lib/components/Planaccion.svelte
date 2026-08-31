<script>
  import FormSection from './FormSection.svelte';
  import FieldError from './FieldError.svelte';
  import { mostrarNotificacion } from '$lib/Notificacion.svelte.js';

let { value = $bindable([]), usuarios = [] } = $props();

  let contadorId = 0;
  function generarId(prefijo) {
    contadorId += 1;
    return `${prefijo}-${Date.now()}-${contadorId}`;
  }

  function crearAccion() {
    return {
      id: generarId('accion'),
      descripcion: '',
      fecha: '',
      responsable: '',
      email: '',
      metodologia: { descripcion: '', fecha: '', responsable: '', email: '' }
    };
  }

  function crearGrupo() {
    return {
      id: generarId('grupo'),
      acciones: [crearAccion()]
    };
  }

  $effect(() => {
    if (value.length === 0) {
      value = [crearGrupo()];
    }
  });

  function agregarGrupo() {
    value = [...value, crearGrupo()];
  }

  function eliminarGrupo(id) {
    if (value.length <= 1) return;
    value = value.filter((g) => g.id !== id);
  }

  function agregarAccion(grupo) {
    grupo.acciones.push(crearAccion());
  }

  function eliminarAccion(grupo, accionId) {
    if (grupo.acciones.length <= 1) return;
    grupo.acciones = grupo.acciones.filter((a) => a.id !== accionId);
  }

  let validationErrors = $state({});

  function clearError(accionId) {
    if (validationErrors[accionId]) {
      const nuevos = { ...validationErrors };
      delete nuevos[accionId];
      validationErrors = nuevos;
    }
  }

  function seleccionarResponsable(objetivo, campoNombre, campoCorreo, nombreSeleccionado) {
  const usuario = usuarios.find(
    (u) => `${u.nombre} ${u.apellido}` === nombreSeleccionado
  );
  objetivo[campoNombre] = nombreSeleccionado;
  objetivo[campoCorreo] = usuario?.email ?? '';
}

  // Se llama desde el padre (bind:this) antes de armar el payload final.
  export function validar() {
    validationErrors = {};
    let tieneErrores = false;

    for (const grupo of value) {
      for (const accion of grupo.acciones) {
        if (!accion.descripcion || !accion.descripcion.trim()) {
          validationErrors[accion.id] = 'La descripción de la acción es obligatoria.';
          tieneErrores = true;
        }
      }
    }

    if (tieneErrores) {
      mostrarNotificacion('Corrija las acciones resaltadas en el Plan de Acción.', 'error');
      return false;
    }

    return true;
  }

  // Ahora la grilla empieza en la fila 1 (el encabezado ya no está dentro)
  let layouts = $derived.by(() => {
    let filaActual = 1;
    const resultado = [];
    for (const grupo of value) {
      const filas = grupo.acciones.length + 1; // acciones + botón "Agregar acción"
      resultado.push({ grupo, filaInicio: filaActual, filas });
      filaActual += filas;
    }
    return resultado;
  });

  let totalFilas = $derived(
    layouts.length
      ? layouts[layouts.length - 1].filaInicio + layouts[layouts.length - 1].filas
      : 1
  );
</script>

<FormSection title='Plan de acción'>
  <div class="w-full overflow-x-auto">
    <div class="flex flex-col gap-4 min-w-[1200px] lg:min-w-0">

      <div class="hidden lg:flex bg-[#F0EDE6] border border-[var(--border-medium)] rounded-[8px] py-1">
        <div class="w-[48px] shrink-0 px-2 py-2 flex items-center justify-center">
          <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-[var(--text-hint,#9A9590)] uppercase tracking-wide">N#</span>
        </div>
        <div class="flex-1 px-3 py-2 border-l border-[var(--border-medium)] flex items-center">
          <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-[var(--text-hint,#9A9590)] uppercase tracking-wide">Acciones correctivas</span>
        </div>
        <div class="w-[140px] shrink-0 px-3 py-2 border-l border-[var(--border-medium)] flex items-center justify-center">
          <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-[var(--text-hint,#9A9590)] uppercase tracking-wide text-center">Fecha</span>
        </div>
        <div class="w-[200px] shrink-0 px-3 py-2 border-l border-[var(--border-medium)] flex items-center justify-center">
          <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-[var(--text-hint,#9A9590)] uppercase tracking-wide text-center">Responsable</span>
        </div>
        <div class="flex-1 px-3 py-2 border-l border-[var(--border-medium)]">
          <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-[var(--text-hint,#9A9590)] uppercase tracking-wide text-center">Verificación de la eficacia</span>
        </div>
        <div class="w-[140px] shrink-0 px-3 py-2 border-l border-[var(--border-medium)] flex items-center justify-center">
          <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-[var(--text-hint,#9A9590)] uppercase tracking-wide text-center">Fecha</span>
        </div>
        <div class="w-[200px] shrink-0 px-3 py-2 border-l border-[var(--border-medium)] flex items-center justify-center">
          <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-[var(--text-hint,#9A9590)] uppercase tracking-wide text-center">Responsable</span>
        </div>
      </div>

      <div class="border border-[var(--border-medium)] rounded-[8px] shadow-sm bg-white">
        <div
          class="grid"
          style="grid-template-columns: 48px 1fr 140px 200px 1fr 140px 200px; grid-template-rows: auto repeat({totalFilas - 1}, auto);"
        >
          {#each layouts as { grupo, filaInicio, filas }, gi (grupo.id)}
            <div
              class="relative flex items-center justify-center bg-[#FAF8F4] border-r border-b border-[var(--border-medium)] font-[var(--font-ui,'Sora')] text-[16px] font-semibold text-[var(--text-primary)] group"
              style="grid-row: {filaInicio} / span {filas}; grid-column: 1;"
            >
              <span class="!font-['Fira_Code'] text-[var(--text-disabled)]">{gi + 1}</span>
              {#if value.length > 1}
                <button
                  type="button"
                  onclick={() => eliminarGrupo(grupo.id)}
                  class="absolute top-2 right-2 opacity-30 hover:opacity-100 hover:text-[var(--text-error,#B85050)] transition-opacity cursor-pointer bg-transparent border-0 p-0.5 text-[var(--text-hint,#9A9590)] hover:bg-white/80 rounded-full"
                  title="Eliminar este grupo completo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" />
                    <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
                  </svg>
                </button>
              {/if}
            </div>

            {#each grupo.acciones as accion, ai (accion.id)}
              <div
                class="relative border-r border-b border-[var(--border-medium)] p-2 group"
                style="grid-row: {filaInicio + ai}; grid-column: 2;"
              >
                <textarea
                  bind:value={accion.descripcion}
                  oninput={() => clearError(accion.id)}
                  placeholder="Describe la acción correctiva..."
                  rows="5"
                  class="textarea !min-h-[130px] !resize-none w-full"
                  class:input--error={validationErrors[accion.id]}
                ></textarea>
                <FieldError message={validationErrors[accion.id]} />
                {#if grupo.acciones.length > 1}
                  <button
                    type="button"
                    onclick={() => eliminarAccion(grupo, accion.id)}
                    class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:text-[var(--text-error,#B85050)] transition-opacity cursor-pointer bg-transparent border-0 p-0.5 text-[var(--text-hint,#9A9590)]"
                    title="Eliminar esta acción"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" />
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" />
                      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                  </button>
                {/if}
              </div>

              <!-- Fecha acción (col 3) -->
              <div class="border-r border-b border-[var(--border-medium)] p-2 " style="grid-row: {filaInicio + ai}; grid-column: 3;">
                <input class="input-date" type="date" bind:value={accion.fecha} placeholder="mes-año" />
              </div>

              <!-- Responsable + correo acción (col 4) -->
              <div class="border-r border-b border-[var(--border-medium)] p-2 flex flex-col gap-1.5" style="grid-row: {filaInicio + ai}; grid-column: 4;">
                <input class="input" type="text" bind:value={accion.responsable} placeholder="Nombre del responsable" />
                <input class="input" type="email" bind:value={accion.email} placeholder="correo@corimon.com" />
              </div>

              <!-- Metodología descripción (col 5) -->
              <div class="border-r border-b border-[var(--border-medium)] p-2 bg-[#FAFBFB]" style="grid-row: {filaInicio + ai}; grid-column: 5;">
                <textarea
                  bind:value={accion.metodologia.descripcion}
                  placeholder="Elaborar / Realizar..."
                  rows="5"
                  class="textarea !min-h-[130px] !resize-none"
                ></textarea>
              </div>

              <!-- Metodología fecha (col 6) -->
              <div class="border-r border-b border-[var(--border-medium)] p-2 bg-[#FAFBFB]" style="grid-row: {filaInicio + ai}; grid-column: 6;">
                <input class="input-date" type="date" bind:value={accion.metodologia.fecha} placeholder="mes-año" />
              </div>

            <div class="border-b border-[var(--border-medium)] p-2 bg-[#FAFBFB] flex flex-col gap-1.5" style="grid-row: {filaInicio + ai}; grid-column: 7;">
              <select
                class="input !h-[40px]"
                value={accion.metodologia.responsable}
                onchange={(e) => seleccionarResponsable(accion.metodologia, 'responsable', 'email', e.target.value)}
              >
                <option value="">Selecciona responsable...</option>
                {#each usuarios as u}
                  <option value={`${u.nombre} ${u.apellido}`}>{u.nombre} {u.apellido}</option>
                {/each}
              </select>
              <input class="input" type="email" value={accion.metodologia.email} disabled placeholder="correo@corimon.com" />
            </div>
            {/each}

            <div
              class="border-r border-b border-[var(--border-medium)] p-2 bg-[color-mix(in_srgb,var(--text-primary)_2%,white)]"
              style="grid-row: {filaInicio + grupo.acciones.length}; grid-column: 2 / span 6;"
            >
              <button
                type="button"
                onclick={() => agregarAccion(grupo)}
                class="ishikawa-btn-agregar gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="9" /><path d="M12 8v8" /><path d="M8 12h8" />
                </svg>
                Agregar acción
              </button>
            </div>
          {/each}
        </div>

        <div class="px-4 py-3">
          <button
            type="button"
            onclick={agregarGrupo}
            class="ishikawa-btn-agregar gap-2 !w-[150px]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9" /><path d="M12 8v8" /><path d="M8 12h8" />
            </svg>
            Agregar causa raíz
          </button>
        </div>
      </div>

    </div>
  </div>
</FormSection>