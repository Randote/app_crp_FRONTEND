<script>
  import FormSection from './FormSection.svelte';
  import FieldError from './FieldError.svelte';
  import ComboBox from './ComboBox.svelte';
  import { mostrarNotificacion, ocultarNotificacion } from '$lib/Notificacion.svelte.js';

  let { value = $bindable([]), usuarios = [] } = $props();

  const procesos = [
    'Dirección Estratégica (GGG)',
    'Gestión de Negocios (GNE)',
    'Gestión de Control de Producción (GCP)',
    'Gestión de Producción (GPR)',
    'Gestión de Logística de Salida (GLS)',
    'Gestión de diseño y desarrollo de productos (GDP)',
    'Gestión de Compras (GCO)',
    'Gestión de Control De Calidad (GCC)',
    'Gestión de Logística de Entrada (GLE)',
    'Gestión de Calidad (GCA)',
    'Gestión de Finanzas (GFI)',
    'Gestión de Mantenimiento (GMT)',
    'Gestión de TI(GTI)',
    'Gestión de Seguridad y Salud en el Trabajo (GSL)',
    'Gestión de Proyectos (GPY)',
    'Gestión de Personal (GPE)',
    'Gestión de Talento Humano (GTH)'
  ];

  let contadorId = 0;
  function generarId(prefijo) {
    contadorId += 1;
    return `${prefijo}-${Date.now()}-${contadorId}`;
  }

  function crearResponsable() {
    return { id: generarId('resp'), nombre: '', email: '', proceso: '' };
  }

  function crearAccion() {
    return {
      id: generarId('accion'),
      descripcion: '',
      sinFecha: false, 
      fecha: '',
      responsables: [crearResponsable()],
      metodologia: { 
        descripcion: '', 
        sinFecha: false, 
        fecha: '', 
        responsable: '', 
        email: '' 
      }
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

  function agregarResponsable(accion) {
    accion.responsables.push(crearResponsable());
  }

  function eliminarResponsable(accion, respId) {
    if (accion.responsables.length <= 1) return;
    accion.responsables = accion.responsables.filter((r) => r.id !== respId);
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

  export function validar() {
    validationErrors = {};
    let tieneErrores = false;

    // Obtener la fecha de hoy a las 00:00:00 para comparar correctamente
    const hoyFecha = new Date();
    hoyFecha.setHours(0, 0, 0, 0);

    for (const grupo of value) {
      for (const accion of grupo.acciones) {
        // Validar descripción de la acción
        if (!accion.descripcion || !accion.descripcion.trim()) {
          validationErrors[accion.id] = 'La descripción de la acción es obligatoria.';
          tieneErrores = true;
        }

        // Validar fecha de la acción
        if (!accion.sinFecha) {
          if (!accion.fecha || !accion.fecha.trim()) {
            validationErrors[`${accion.id}-fecha`] = 'La fecha es obligatoria.';
            tieneErrores = true;
          } else {
            const fechaAccion = new Date(accion.fecha + 'T00:00:00');
            if (fechaAccion < hoyFecha) {
              validationErrors[`${accion.id}-fecha`] = 'La fecha no puede ser pasada.';
              tieneErrores = true;
            }
          }
        }

        // Validar descripción de la metodología
        if (!accion.metodologia.descripcion || !accion.metodologia.descripcion.trim()) {
          validationErrors[`${accion.id}-met-desc`] = 'La metodología es obligatoria.';
          tieneErrores = true;
        }

        // Validar fecha de la metodología
        if (!accion.metodologia.sinFecha) {
          if (!accion.metodologia.fecha || !accion.metodologia.fecha.trim()) {
            validationErrors[`${accion.id}-met-fecha`] = 'La fecha es obligatoria.';
            tieneErrores = true;
          } else {
            const fechaMet = new Date(accion.metodologia.fecha + 'T00:00:00');
            if (fechaMet < hoyFecha) {
              validationErrors[`${accion.id}-met-fecha`] = 'La fecha no puede ser pasada.';
              tieneErrores = true;
            }
          }
        }
      }
    }

    if (tieneErrores) {
      mostrarNotificacion('Corrija los campos y fechas resaltadas en el Plan de Acción.', 'error');
      return false;
    }

    ocultarNotificacion();
    return true;
  }

  let layouts = $derived.by(() => {
    let filaActual = 1;
    const resultado = [];
    for (const grupo of value) {
      const filas = grupo.acciones.length + 1;
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

<FormSection title="Plan de acción">
  <div class="w-full overflow-x-auto">
    <div class="flex flex-col gap-4 min-w-[1450px]">

      <!-- Contenedor principal unificado (Tarjeta Blanca) -->
      <div class="border border-[var(--border-medium)] rounded-[8px] shadow-sm bg-white overflow-hidden">

        <!-- Cabecera de la tabla integrada -->
        <div class="hidden lg:grid bg-[var(--bg-rojito)] border-b border-[var(--border-medium)] py-2.5 items-center" style="grid-template-columns: 48px minmax(280px, 1.5fr) 160px minmax(260px, 1.2fr) minmax(280px, 1.5fr) 160px minmax(260px, 1.2fr);">
          <div class="px-2 flex items-center justify-center">
            <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-white uppercase tracking-wide">N#</span>
          </div>
          <div class="px-3 border-l border-[var(--border-medium)] flex items-center">
            <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-white uppercase tracking-wide">Acciones correctivas</span>
          </div>
          <div class="px-3 border-l border-[var(--border-medium)] flex items-center justify-center">
            <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-white uppercase tracking-wide text-center">Fecha</span>
          </div>
          <div class="px-3 border-l border-[var(--border-medium)] flex items-center justify-center">
            <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-white uppercase tracking-wide text-center">Responsable(s)</span>
          </div>
          <div class="px-3 border-l border-[var(--border-medium)] flex items-center">
            <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-white uppercase tracking-wide">Verificación de la eficacia</span>
          </div>
          <div class="px-3 border-l border-[var(--border-medium)] flex items-center justify-center">
            <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-white uppercase tracking-wide text-center">Fecha</span>
          </div>
          <div class="px-3 border-l border-[var(--border-medium)] flex items-center justify-center">
            <span class="font-[var(--font-ui,'Sora')] text-[11px] font-semibold text-white uppercase tracking-wide text-center">Responsable</span>
          </div>
        </div>

        <!-- Cuerpo de la tabla principal -->
        <div
          class="grid"
          style="grid-template-columns: 48px minmax(280px, 1.5fr) 160px minmax(260px, 1.2fr) minmax(280px, 1.5fr) 160px minmax(260px, 1.2fr); grid-template-rows: repeat({totalFilas - 1}, auto);"
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
              <!-- Columna 2: Descripción Acción -->
              <div
                class="relative border-r border-b border-[var(--border-medium)] p-2.5 group"
                style="grid-row: {filaInicio + ai}; grid-column: 2;"
              >
                <textarea
                  bind:value={accion.descripcion}
                  oninput={() => clearError(accion.id)}
                  placeholder="Describe la acción correctiva..."
                  rows="4"
                  class="textarea !min-h-[140px] w-full resize-y"
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

              <!-- Columna 3: Fecha Acción -->
              <div class="border-r border-b border-[var(--border-medium)] p-2.5 flex flex-col justify-center gap-1.5" style="grid-row: {filaInicio + ai}; grid-column: 3;">
                {#if !accion.sinFecha}
                  <input 
                    class="input-date w-full" 
                    type="date" 
                    bind:value={accion.fecha} 
                    class:input--error={validationErrors[`${accion.id}-fecha`]}
                  />
                  <FieldError message={validationErrors[`${accion.id}-fecha`]} />
                {:else}
                  <input class="input-date opacity-50 bg-stone-100 cursor-not-allowed w-full" type="date" disabled value="" />
                {/if}

                <label class="flex items-center gap-1.5 text-[11px] text-[var(--text-hint)] cursor-pointer select-none">
                  <input type="checkbox" bind:checked={accion.sinFecha} class="rounded border-stone-300 text-[#8B1A2A] focus:ring-[#8B1A2A]" />
                  Sin fecha
                </label>
              </div>

              <!-- Columna 4: Responsables -->
              <div class="border-r border-b border-[var(--border-medium)] p-2.5 flex flex-col gap-2.5" style="grid-row: {filaInicio + ai}; grid-column: 4;">
                {#each accion.responsables as resp, ri (resp.id)}
                  <div
                    class="flex flex-col gap-2"
                    class:pt-3={ri > 0}
                    class:border-t={ri > 0}
                    class:border-[var(--border-subtle)]={ri > 0}
                  >
                    {#if accion.responsables.length > 1}
                      <div class="flex items-center justify-between">
                        <span class="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-hint)]">
                          Responsable {ri + 1}
                        </span>
                        <button
                          type="button"
                          onclick={() => eliminarResponsable(accion, resp.id)}
                          class="text-[var(--text-hint,#9A9590)] hover:text-[var(--text-error,#B85050)] transition-colors cursor-pointer bg-transparent border-0 p-0.5"
                          title="Eliminar este responsable"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" />
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" />
                            <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
                          </svg>
                        </button>
                      </div>
                    {/if}
                
                    <input class="input w-full" type="text" bind:value={resp.nombre} placeholder="Nombre del responsable" />
                    <input class="input w-full" type="email" bind:value={resp.email} placeholder="correo@corimon.com" />
                
                    <ComboBox
                      bind:value={resp.proceso}
                      options={procesos}
                      placeholder="Buscar proceso…"
                    />
                  </div>
                {/each}

                <button
                  type="button"
                  onclick={() => agregarResponsable(accion)}
                  class="ishikawa-btn-agregar !text-[11px] !py-1 w-full mt-1"
                >
                  + Agregar usuario
                </button>
              </div>

              <!-- Columna 5: Metodología Descripción -->
              <div class="border-r border-b border-[var(--border-medium)] p-2.5 bg-[#FAFBFB]" style="grid-row: {filaInicio + ai}; grid-column: 5;">
                <textarea
                  bind:value={accion.metodologia.descripcion}
                  placeholder="Elaborar / Realizar..."
                  rows="4"
                  class="textarea !min-h-[140px] w-full resize-y"
                  class:input--error={validationErrors[`${accion.id}-met-desc`]}
                ></textarea>
                <FieldError message={validationErrors[`${accion.id}-met-desc`]} />
              </div>

              <!-- Columna 6: Metodología Fecha -->
              <div class="border-r border-b border-[var(--border-medium)] p-2.5 bg-[#FAFBFB] flex flex-col justify-center gap-1.5" style="grid-row: {filaInicio + ai}; grid-column: 6;">
                {#if !accion.metodologia.sinFecha}
                  <input 
                    class="input-date w-full" 
                    type="date" 
                    bind:value={accion.metodologia.fecha} 
                    class:input--error={validationErrors[`${accion.id}-met-fecha`]}
                  />
                  <FieldError message={validationErrors[`${accion.id}-met-fecha`]} />
                {:else}
                  <input class="input-date opacity-50 bg-stone-100 cursor-not-allowed w-full" type="date" disabled value="" />
                {/if}
                <label class="flex items-center gap-1.5 text-[11px] text-[var(--text-hint)] cursor-pointer select-none">
                  <input type="checkbox" bind:checked={accion.metodologia.sinFecha} class="rounded border-stone-300 text-[#8B1A2A] focus:ring-[#8B1A2A]" />
                  Sin fecha
                </label>
              </div>

              <!-- Columna 7: Metodología Responsable -->
              <div class="border-b border-[var(--border-medium)] p-2.5 bg-[#FAFBFB] flex flex-col gap-2" style="grid-row: {filaInicio + ai}; grid-column: 7;">
                <select
                  class="input !h-[40px] w-full"
                  value={accion.metodologia.responsable}
                  onchange={(e) => seleccionarResponsable(accion.metodologia, 'responsable', 'email', e.target.value)}
                >
                  <option value="">Selecciona responsable...</option>
                  {#each usuarios as u}
                    <option value={`${u.nombre} ${u.apellido}`}>{u.nombre} {u.apellido}</option>
                  {/each}
                </select>
                <input class="input w-full" type="email" value={accion.metodologia.email} disabled placeholder="correo@corimon.com" />
              </div>
            {/each}

            <!-- Botón agregar acción dentro del grupo -->
            <div
              class="border-r border-b border-[var(--border-medium)] p-3 bg-[color-mix(in_srgb,var(--text-primary)_2%,white)] flex items-center"
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

      </div>

      <!-- Botón agregar causa raíz general -->
      <div class="px-1">
        <button
          type="button"
          onclick={agregarGrupo}
          class="ishikawa-btn-agregar gap-2 !w-[180px]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9" /><path d="M12 8v8" /><path d="M8 12h8" />
          </svg>
          Agregar causa raíz
        </button>
      </div>

    </div>
  </div>
</FormSection>