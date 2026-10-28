<script>
    import FieldError from '../FieldError.svelte';
    import { invalidateAll } from '$app/navigation';
    import { mostrarNotificacion } from '$lib/Notificacion.svelte.js';
    import { fetchAutenticado } from '$lib/fetchAutenticador.js';
    import Modal from '$lib/components/Modal.svelte';

    let mostrarModal = $state(false);

    let {
      grupos: grupoInicial = [],
      codificador,
      tipoHallazgoInicial = ''
    } = $props();

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

    const TIPOS_HALLAZGO = ['No Conforme', 'Observacion', 'Oportunidad de Mejora'];

    let tipoHallazgo = $state('');

    $effect(() => {
      tipoHallazgo = tipoHallazgoInicial ?? '';
    });

    let contadorId = 0;
    function generarId(prefijo) {
      contadorId += 1;
      return `${prefijo}-${Date.now()}-${contadorId}`;
    }

    function crearResponsable() {
      return { id: generarId('resp'), nombre: '', email: '', proceso: '' };
    }

    function mapearResponsables(lista) {
      const mapeados = (lista ?? []).map((r) => ({
        id: generarId('resp'),
        nombre: r.nombre ?? '',
        email: r.email ?? '',
        proceso: r.proceso ?? ''
      }));
      return mapeados.length > 0 ? mapeados : [crearResponsable()];
    }

    function mapearAccion(a) {
        const est = a.estatus_accion ?? {};
        return {
        id: a.id,
        accion_correctiva: a.descripcion ?? '',
        tipo: est.tipo_accion ?? '',
        fecha_plan: a.fecha ?? '',
        responsables: mapearResponsables(a.responsables),
        verificacion_eficacia: a.metodologia_descripcion ?? '',
        fecha_verificacion: a.metodologia_fecha ?? '',
        responsable_verificacion_nombre: a.metodologia_responsable ?? '',
        responsable_verificacion_correo: a.metodologia_email ?? '',
        observaciones: est.observaciones ?? '',
        estatus: est.estatus ?? 'Abierto'
        };
    }

    let registros = $state([]);

    $effect(() => {
        registros = grupoInicial.map((g) => ({
        id: g.id,
        causa_raiz_numero: g.causa_raiz_numero,
        acciones: (g.acciones ?? []).map(mapearAccion)
        }));
    });

    function agregarResponsable(acc) {
      acc.responsables.push(crearResponsable());
    }

    function eliminarResponsable(acc, respId) {
      if (acc.responsables.length <= 1) return;
      acc.responsables = acc.responsables.filter((r) => r.id !== respId);
    }

    function estaVencida(acc) {
        if (acc.estatus !== 'Abierto') return false;
        if (!acc.fecha_plan) return false;
        const hoy = new Date().toISOString().split('T')[0];
        return acc.fecha_plan < hoy;
    }

    let validationErrors = $state({});
    let guardandoTodo = $state(false);

    function limpiarError(id) {
        if (validationErrors[id]) {
        const copy = { ...validationErrors };
        delete copy[id];
        validationErrors = copy;
        }
    }

    export function validar() {
        validationErrors = {};
        let invalido = false;
        for (const causa of registros) {
        for (const acc of causa.acciones) {
            if (!acc.accion_correctiva?.trim()) {
            validationErrors[acc.id] = 'Requerido';
            invalido = true;
            }
        }
        }
        if (invalido) {
        mostrarNotificacion('Complete todas las acciones requeridas.', 'error');
        return false;
        }
        return true;
    }

    async function guardarUnaAccion(acc) {
        const res = await fetchAutenticado(`${import.meta.env.VITE_API_URL}/api/plan-accion/${acc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            descripcion: acc.accion_correctiva,
            fecha: acc.fecha_plan || null,
            responsables: acc.responsables.map((r) => ({
              nombre: r.nombre || null,
              email: r.email || null,
              proceso: r.proceso || null
            })),
            metodologia_descripcion: acc.verificacion_eficacia || null,
            metodologia_fecha: acc.fecha_verificacion || null,
            metodologia_responsable: acc.responsable_verificacion_nombre || null,
            metodologia_email: acc.responsable_verificacion_correo || null,
            tipo_accion: acc.tipo || null,
            estatus: acc.estatus || null,
            observaciones: acc.observaciones || null
        })
        });

    if (!res.ok) {
      const error = await res.json().catch(() => null); 
      throw new Error(error?.detail || `No se pudo guardar la acción "${acc.accion_correctiva.slice(0, 30)}".`);
    }
    }

    async function guardarTipoHallazgo() {
        const res = await fetchAutenticado(
          `${import.meta.env.VITE_API_URL}/api/acciones-correctivas/${codificador}/tipo-hallazgo`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo_hallazgo: tipoHallazgo || null })
          }
        );

        if (!res.ok) {
          const error = await res.json().catch(() => null);
          throw new Error(error?.detail || 'No se pudo guardar el tipo de hallazgo.');
        }
    }

    function abrirConfirmacion() {
    if (!validar()) return;
    mostrarModal = true;
}

    async function guardarTodo() {
        guardandoTodo = true;
        const todasLasAcciones = registros.flatMap((c) => c.acciones);

        const resultados = await Promise.allSettled([
          guardarTipoHallazgo(),
          ...todasLasAcciones.map((acc) => guardarUnaAccion(acc))
        ]);

        guardandoTodo = false;

        const fallidas = resultados.filter((r) => r.status === 'rejected');

        if (fallidas.length === 0) {
        mostrarNotificacion('Plan de acción guardado correctamente.', 'success');
        await invalidateAll();
        } else {
        mostrarNotificacion(
            `Se guardaron ${resultados.length - fallidas.length} de ${resultados.length} cambios. Revise los errores.`,
            'error'
        );
        }
    }

    let layoutCalculado = $derived.by(() => {
        let currentFila = 1;
        const items = [];
        for (let index = 0; index < registros.length; index++) {
        const causa = registros[index];
        const totalFilas = causa.acciones.length + 1;
        items.push({ causa, acciones: causa.acciones, numero: index + 1, filaInicio: currentFila, totalFilas });
        currentFila += totalFilas;
        }
        return items;
    });

    let maxFilasGrid = $derived(
        layoutCalculado.length
        ? layoutCalculado[layoutCalculado.length - 1].filaInicio + layoutCalculado[layoutCalculado.length - 1].totalFilas
        : 1
    );
    // Columnas ajustadas: N# | ACCIONES | TIPO ACCIÓN | ESTATUS | FECHA | RESPONSABLES(S) | VERIFICACIÓN | FECHA | RESPONSABLE | OBSERVACIONES
    const GRID_COLS = '45px 240px 135px 135px 135px 260px 1fr 135px 220px 1fr';
</script>

<div class="w-full font-sans flex flex-col gap-4">

  <!-- Tipo de Hallazgo: UN SOLO campo para toda la Acción Correctiva -->
  <div class="flex items-center gap-3 rounded-xl border border-[#E0DCD5] bg-[var(--bg-input-dis)] p-3.5">
    <label class="text-xs font-bold uppercase tracking-wide text-[#6E685E] whitespace-nowrap" for="tipo-hallazgo-general">
      Tipo de Hallazgo
    </label>
    <select
      id="tipo-hallazgo-general"
      bind:value={tipoHallazgo}
      class="max-w-xs text-sm p-2 rounded-lg border border-[#D5D0C7] focus:border-[#801B2B] focus:outline-none bg-white text-stone-800 cursor-pointer"
    >
      <option value="">Sin definir</option>
      {#each TIPOS_HALLAZGO as t}
        <option value={t}>{t}</option>
      {/each}
    </select>
  </div>

  <div class="w-full overflow-x-auto rounded-xl border border-[#E0DCD5] bg-white">
    <div class="min-w-[1875px] flex flex-col gap-2 p-0">

      <div
        class="grid bg-[var(--bg-rojito)] p-2.5 text-[11px] font-bold text-[white] uppercase tracking-wider text-center border-b border-[#DFDAD1]"
        style="grid-template-columns: {GRID_COLS};"
      >
        <div>N#</div>
        <div>ACCIONES CORRECTIVAS</div>
        <div>TIPO ACCIÓN</div>
        <div>ESTATUS</div>
        <div>FECHA</div>
        <div>RESPONSABLE(S)</div>
        <div>VERIFICACIÓN DE LA EFICACIA</div>
        <div>FECHA</div>
        <div>RESPONSABLE</div>
        <div>OBSERVACIONES</div>
      </div>

      <div class="grid" style="grid-template-columns: {GRID_COLS}; grid-template-rows: repeat({maxFilasGrid}, auto);">
        {#each layoutCalculado as { causa, acciones, numero, filaInicio, totalFilas } (causa.id)}
          <div class="flex flex-col items-center justify-start p-3 border-r border-b border-[#E8E4DD] bg-[#FAF8F5] text-[#8C857B] font-serif text-lg font-semibold" style="grid-row: {filaInicio} / span {totalFilas}; grid-column: 1;">
            <span>{causa.causa_raiz_numero ?? numero}</span>
          </div>

          {#each acciones as acc, ai (acc.id)}
            <div class="p-2 border-r border-b border-[#E8E4DD] relative" style="grid-row: {filaInicio + ai}; grid-column: 2;">
              <textarea
                bind:value={acc.accion_correctiva}
                oninput={() => limpiarError(acc.id)}
                placeholder="Describe la acción correctiva..."
                rows="6"
                class="w-full text-sm p-3 rounded-lg border border-[#D5D0C7] focus:border-[#801B2B] focus:outline-none resize-none text-stone-800 placeholder:text-stone-400 min-h-[130px]"
              ></textarea>
              {#if validationErrors[acc.id]}
                <FieldError message={validationErrors[acc.id]} />
              {/if}
            </div>

            <!-- Tipo Acción (Columna 3) -->
            <div class="p-2 border-r border-b border-[#E8E4DD]" style="grid-row: {filaInicio + ai}; grid-column: 3;">
              <select bind:value={acc.tipo} class="w-full text-sm p-2.5 rounded-lg border border-[#D5D0C7] focus:border-[#801B2B] focus:outline-none bg-white text-stone-800 cursor-pointer">
                <option value="Correctiva">Correctiva</option>
                <option value="Preventiva">Preventiva</option>
                <option value="Inmediata">Inmediata</option>
              </select>
            </div>

            <!-- Estatus (Columna 4 - Movido al lado de Tipo Acción) -->
            <div class="p-2 border-r border-b border-[#E8E4DD]" style="grid-row: {filaInicio + ai}; grid-column: 4;">
              <select bind:value={acc.estatus} class="w-full text-sm p-2.5 rounded-lg border border-[#D5D0C7] focus:border-[#801B2B] focus:outline-none bg-white text-stone-800 cursor-pointer font-medium">
                <option value="Abierto">Abierta</option>
                <option value="Cerrado">Cerrada</option>
              </select>
              {#if estaVencida(acc)}
                <span class="mt-1.5 inline-block text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1">
                  Vencida
                </span>
              {/if}
            </div>

            <!-- Fecha Plan (Columna 5) -->
            <div class="p-2 border-r border-b border-[#E8E4DD]" style="grid-row: {filaInicio + ai}; grid-column: 5;">
              <input type="date" bind:value={acc.fecha_plan} class="w-full text-sm p-2.5 rounded-lg border border-[#D5D0C7] focus:border-[#801B2B] focus:outline-none text-stone-800" />
            </div>

            <!-- Responsable(s), repetible (Columna 6) -->
            <div class="p-2 border-r border-b border-[#E8E4DD] flex flex-col gap-2" style="grid-row: {filaInicio + ai}; grid-column: 6;">
              {#each acc.responsables as resp, ri (resp.id)}
                <div class="flex flex-col gap-1.5" class:pt-2={ri > 0} class:border-t={ri > 0} class:border-[#E8E4DD]={ri > 0}>
                  {#if acc.responsables.length > 1}
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-semibold uppercase tracking-wide text-[#9A9590]">Responsable {ri + 1}</span>
                      <button
                        type="button"
                        onclick={() => eliminarResponsable(acc, resp.id)}
                        class="text-[#9A9590] hover:text-red-600 transition-colors cursor-pointer bg-transparent border-0 p-0.5"
                        title="Eliminar este responsable"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  {/if}
                  <input type="text" bind:value={resp.nombre} placeholder="Nombre" class="w-full text-sm p-2 rounded-lg border border-[#D5D0C7] focus:border-[#801B2B] focus:outline-none text-stone-800 placeholder:text-stone-400" />
                  <input type="email" bind:value={resp.email} placeholder="Correo" class="w-full text-sm p-2 rounded-lg border border-[#D5D0C7] focus:border-[#801B2B] focus:outline-none text-stone-800 placeholder:text-stone-400" />
                  <select bind:value={resp.proceso} class="w-full text-sm p-2 rounded-lg border border-[#D5D0C7] focus:border-[#801B2B] focus:outline-none bg-white text-stone-800 cursor-pointer">
                    <option value="">Selecciona proceso...</option>
                    {#each procesos as p}
                      <option value={p}>{p}</option>
                    {/each}
                  </select>
                </div>
              {/each}
              <button
                type="button"
                onclick={() => agregarResponsable(acc)}
                class="text-[11px] font-medium text-[#801B2B] hover:underline cursor-pointer bg-transparent border-0 p-0 text-left"
              >
                + Agregar usuario
              </button>
            </div>

            <!-- Verificación (Columna 7) -->
            <div class="p-2 border-r border-b border-[#E8E4DD]" style="grid-row: {filaInicio + ai}; grid-column: 7;">
              <textarea bind:value={acc.verificacion_eficacia} placeholder="Elaborar / Realizar..." rows="6" class="w-full text-sm p-3 rounded-lg border border-[#D5D0C7] focus:border-[#801B2B] focus:outline-none resize-none text-stone-800 placeholder:text-stone-400 min-h-[130px]"></textarea>
            </div>

            <!-- Fecha Verificación (Columna 8) -->
            <div class="p-2 border-r border-b border-[#E8E4DD]" style="grid-row: {filaInicio + ai}; grid-column: 8;">
              <input type="date" bind:value={acc.fecha_verificacion} class="w-full text-sm p-2.5 rounded-lg border border-[#D5D0C7] focus:border-[#801B2B] focus:outline-none text-stone-800" />
            </div>

            <!-- Responsable Verificación (Columna 9) -->
            <div class="p-2 border-r border-b border-[#E8E4DD] flex flex-col gap-2" style="grid-row: {filaInicio + ai}; grid-column: 9;">
              <input type="text" bind:value={acc.responsable_verificacion_nombre} placeholder="Nombre" class="w-full text-sm p-2.5 rounded-lg border border-[#D5D0C7] focus:border-[#801B2B] focus:outline-none text-stone-800 placeholder:text-stone-400" />
              <input type="email" bind:value={acc.responsable_verificacion_correo} placeholder="Correo" class="w-full text-sm p-2.5 rounded-lg border border-[#D5D0C7] focus:border-[#801B2B] focus:outline-none text-stone-800 placeholder:text-stone-400" />
            </div>

            <!-- Observaciones (Columna 10) -->
            <div class="p-2 border-b border-[#E8E4DD]" style="grid-row: {filaInicio + ai}; grid-column: 10;">
              <textarea
                bind:value={acc.observaciones}
                placeholder="Observaciones de Normalización..."
                rows="6"
                class="w-full text-sm p-3 rounded-lg border border-[#D5D0C7] focus:border-[#801B2B] focus:outline-none resize-none text-stone-800 placeholder:text-stone-400 min-h-[130px]"
              ></textarea>
            </div>
          {/each}
        {/each}
      </div>
    </div>
  </div>

  <div class="flex items-center justify-end gap-3 mt-1">
    <button
      type="button"
      onclick={abrirConfirmacion}
      disabled={guardandoTodo}
      class="px-5 py-2 text-xs font-semibold text-white bg-[#801B2B] hover:bg-[#681422] rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
        <path d="M17 21v-8H7v8" />
        <path d="M7 3v5h8" />
      </svg>
      {guardandoTodo ? 'Guardando…' : 'Guardar cambios'}
    </button>
  </div>
    <Modal
    bind:open={mostrarModal}
    categoria="PLAN DE ACCIÓN"
    titulo="Confirmar guardado"
    mensaje="¿Confirmas que deseas guardar los cambios en las acción(es) del plan?"
    textoConfirmar="Sí, guardar"
    textoCancelar="Cancelar"
    onConfirm={guardarTodo}
    variante="normal"
  />
</div>