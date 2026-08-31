<script>
  import '$lib/layout.css';
  import { base } from '$app/paths';
  import { invalidateAll } from '$app/navigation';
  import { mostrarNotificacion } from '$lib/Notificacion.svelte.js';
  import { fetchAutenticado } from '$lib/fetchAutenticador.js';
  import AccionesVista from '$lib/components/Historial/Accionesfrom-view.svelte';
  import Why5Vista from '$lib/components/Historial/why5-view.svelte';
  import Ishikawavista from '$lib/components/Historial/AccionesIshikawia-view.svelte';
  import MatrizEditar from '$lib/components/Historial/Matriz-edicion.svelte';
  import Bitacora from '$lib/components/Historial/Bitacora.svelte';
  import AccionesForm from '$lib/components/AccionesForm.svelte';
  import AccionesIshikawia from '$lib/components/AccionesIshikawia.svelte';
  import Why5 from '$lib/components/Why5.svelte';
  import Modal from '$lib/components/Modal.svelte'

  let { data } = $props();
  let accion = $derived(data.accion);

  let tabActiva = $state('analisis');
  let editando = $state(false);
  let guardando = $state(false);
  let mostrarModal= $state(false)

  let refForm = $state();
  let refIshikawa = $state();
  let refWhy5 = $state();

  const TABS = [
    {
      id: 'analisis',
      etiqueta: 'Análisis y Detección',
      icono: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    {
      id: 'plan_accion',
      etiqueta: 'Plan de Acción',
      icono: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7l2 2 4-4'
    },
    {
      id: 'bitacora',
      etiqueta: 'Bitácora y Observaciones',
      icono: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
    }
  ];

  // ============================================================
  // MAPEO IDA: accion (snake_case, del backend) -> shape del form editable
  // ============================================================

  function mapearFormPrincipal(a) {
    return {
      codificador: a.codificador ?? '',
      fechaEmision: new Date().toISOString().split('T')[0], // no existe en el modelo; solo display
      fechaDeteccion: a.fecha_deteccion ?? '',
      procesoAfectado: a.proceso_afectado ?? '',
      dueñoProceso: a.dueno_proceso ?? '',
      participantes: a.participantes ?? '',
      origenDeteccion: a.origen_deteccion ?? '',
      especificacion: a.especificacion ?? '',
      problemaDetectado: a.problema_detectado ?? '',
      quéOcurre: a.que_ocurre ?? '',
      cuandoOcurre: a.cuando_ocurre ?? '',
      dondeOcurre: a.donde_ocurre ?? ''
    };
  }

  function mapearAccionesInmediatas(a) {
    return (a.acciones_inmediatas ?? []).map((item) => ({
      accion: item.accion ?? '',
      fecha: item.fecha ?? '',
      responsable: item.responsable ?? '',
      estatus: item.estatus ?? ''
    }));
  }

  const TITULOS_ISHIKAWA = {
    mano_obra: 'MANO DE OBRA',
    maquina: 'MÁQUINA',
    material: 'MATERIAL',
    metodo: 'MÉTODO',
    medicion: 'MEDICIÓN',
    medio_ambiente: 'MEDIO AMBIENTE'
  };

  function mapearIshikawa(ishikawa) {
    const diagrama = {};
    for (const cat in TITULOS_ISHIKAWA) {
      diagrama[cat] = { titulo: TITULOS_ISHIKAWA[cat], causas: [] };
    }
    for (const causa of ishikawa?.causas ?? []) {
      if (diagrama[causa.categoria]) {
        diagrama[causa.categoria].causas.push({ texto: causa.texto ?? '', valor: causa.valor ?? 0 });
      }
    }
    return { diagrama, problema: ishikawa?.problema_enfocado ?? '' };
  }

  function mapearWhy5(analisis5porques) {
    return (analisis5porques ?? []).map((causa, i) => {
      const raizIndice = (causa.porques ?? []).findIndex((p) => p.es_raiz);
      return {
        id: causa.id ?? `causa-existente-${i}`,
        causaPotencial: causa.causa_potencial ?? '',
        porques: (causa.porques ?? []).map((p) => ({
          pregunta: p.pregunta ?? '',
          respuesta: p.respuesta ?? ''
        })),
        raizIndice: raizIndice === -1 ? null : raizIndice
      };
    });
  }

  // ============================================================
  // MAPEO VUELTA: estado del form editable -> payload snake_case (AccionCorrectivaUpdate)
  // ============================================================

  function construirPayloadPrincipal() {
    return {
      fecha_deteccion: formPrincipal.fechaDeteccion,
      proceso_afectado: formPrincipal.procesoAfectado,
      proceso_interaccion: accion?.proceso_interaccion ?? null,
      dueno_proceso: formPrincipal.dueñoProceso,
      participantes: formPrincipal.participantes || null,
      origen_deteccion: formPrincipal.origenDeteccion || null,
      especificacion: formPrincipal.especificacion || null,
      problema_detectado: formPrincipal.problemaDetectado || null,
      que_ocurre: formPrincipal.quéOcurre || null,
      cuando_ocurre: formPrincipal.cuandoOcurre || null,
      donde_ocurre: formPrincipal.dondeOcurre || null,
      usa_ishikawa: checkboxIshikawa,
      usa_5porques: checkbox5Porques
    };
  }

  function construirPayloadAccionesInmediatas() {
    return accionesInmediatas.map((a) => ({
      accion: a.accion,
      fecha: a.fecha,
      responsable: a.responsable,
      estatus: a.estatus
    }));
  }

  function construirPayloadIshikawa() {
    if (!checkboxIshikawa) return null;

    const payload = { problema_enfocado: ishikawaProblema };
    for (const cat in TITULOS_ISHIKAWA) {
      payload[cat] = (ishikawaDiagrama[cat]?.causas ?? []).map((c) => ({
        texto: c.texto,
        valor: c.valor
      }));
    }
    return payload;
  }

  function construirPayloadWhy5() {
    if (!checkbox5Porques) return [];

    return why5Value.map((causa) => ({
      causa_potencial: causa.causaPotencial,
      porques: causa.porques.map((p, pi) => ({
        numero: pi + 1,
        pregunta: p.pregunta || null,
        respuesta: p.respuesta || null,
        es_raiz: causa.raizIndice === pi
      }))
    }));
  }

  // Estado editable
  let formPrincipal = $state({});
  let accionesInmediatas = $state([]);
  let ishikawaDiagrama = $state({});
  let ishikawaProblema = $state('');
  let why5Value = $state([]);
  let checkboxIshikawa = $state(false);
  let checkbox5Porques = $state(false);

  function entrarModoEdicion() {
    formPrincipal = mapearFormPrincipal(accion);
    accionesInmediatas = mapearAccionesInmediatas(accion);

    const ishikawaSrc = accion?.ishikawa_analisis || accion?.analisis_ishikawa;
    const { diagrama, problema } = mapearIshikawa(ishikawaSrc);
    ishikawaDiagrama = diagrama;
    ishikawaProblema = problema;

    why5Value = mapearWhy5(accion?.analisis_5porques);

    checkboxIshikawa = !!accion?.usa_ishikawa;
    checkbox5Porques = !!accion?.usa_5porques;

    editando = true;
  }

  function cancelarEdicion() {
    editando = false;
  }

  function abrirConfirmacion(e) {
  e.preventDefault();
  mostrarModal = true;
}

  async function guardarCambios() {
    const formValido = refForm?.validarRegistro?.() ?? true;
    const ishikawaValido = checkboxIshikawa ? (refIshikawa?.validar?.() ?? true) : true;
    const why5Valido = checkbox5Porques ? (refWhy5?.validar?.() ?? true) : true;

    if (!formValido || !ishikawaValido || !why5Valido) return;

    const payload = {
      ...construirPayloadPrincipal(),
      acciones_inmediatas: construirPayloadAccionesInmediatas(),
      ishikawa: construirPayloadIshikawa(),
      analisis_5porques: construirPayloadWhy5()
    };

    guardando = true;
    try {
      const res = await fetchAutenticado(
        `${import.meta.env.VITE_API_URL}/api/acciones-correctivas/Actualizar/${accion.codificador}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.detail || 'No se pudo guardar la acción correctiva.');
      }

      mostrarNotificacion('Análisis actualizado correctamente.', 'success');
      await invalidateAll();
      editando = false;
    } catch (err) {
      mostrarNotificacion(err.message, 'error');
    } finally {
      guardando = false;
    }
  }
</script>

<svelte:head>
  <title>{accion?.codificador || 'Detalle'} - Detalle</title>
</svelte:head>

<main class="matriz-page-from">
  <div class="flex flex-col gap-5 max-w-7xl mx-auto">

    <div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] border-t-[4px] border-t-[var(--bg-rojito)] bg-[var(--bg-card)] px-6 py-5 shadow-xs">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-rojito)] text-white shadow-sm">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-[var(--text-primary)] tracking-tight uppercase">
            {accion?.codificador || 'SIN CÓDIGO'}
          </h2>
          <div class="flex flex-wrap items-center gap-2 mt-1">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--bg-rojito)] text-white">
              {accion?.proceso_afectado || 'N/A'}
            </span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
              {accion?.origen_deteccion || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        {#if tabActiva === 'analisis'}
          {#if editando}
            <button
              type="button"
              onclick={cancelarEdicion}
              disabled={guardando}
              class="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] px-4 py-2.5 text-[13px] font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-input-dis)] disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onclick={abrirConfirmacion}
              disabled={guardando}
              class="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[var(--bg-rojito)] px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#701420] disabled:opacity-60"
            >
              {guardando ? 'Guardando…' : 'Guardar cambios'}
            </button>
          {:else}
            <button
              type="button"
              onclick={entrarModoEdicion}
              class="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] px-4 py-2.5 text-[13px] font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-input-dis)] hover:text-[var(--text-primary)]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
              Editar
            </button>
          {/if}
        {/if}

        <a
          href="{base}/Matriz"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] px-4 py-2.5 text-[13px] font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-input-dis)] hover:text-[var(--text-primary)]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Volver
        </a>
      </div>
    </div>

    <div class="flex flex-wrap gap-1.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-input-dis)] p-1.5 shadow-xs items-center ">
      {#each TABS as tab}
        <button
          type="button"
          onclick={() => (tabActiva = tab.id)}
          class="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-150
            {tabActiva === tab.id
              ? 'bg-[var(--bg-card)] text-[var(--bg-rojito)] shadow-sm border border-[var(--border-subtle)]'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)]/60 hover:text-[var(--text-primary)]'}"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d={tab.icono} />
          </svg>
          {tab.etiqueta}
        </button>
      {/each}
    </div>

    <div class="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-xs">
      {#if tabActiva === 'analisis'}
        <div class="flex flex-col gap-6">
          {#if editando}
            <AccionesForm
              bind:this={refForm}
              bind:form={formPrincipal}
              bind:acciones={accionesInmediatas}
              bind:checkboxIshikawa
              bind:checkbox5Porques
            />

            {#if checkboxIshikawa || checkbox5Porques}
              <div class="flex flex-col gap-6 border-t border-[var(--border-subtle)] pt-6">
                {#if checkboxIshikawa}
                  <AccionesIshikawia
                    bind:this={refIshikawa}
                    bind:diagrama={ishikawaDiagrama}
                    bind:problema={ishikawaProblema}
                  />
                {/if}

                {#if checkbox5Porques}
                  <Why5 bind:this={refWhy5} bind:value={why5Value} />
                {/if}
              </div>
            {/if}
          {:else}
            <AccionesVista {accion} />

            {#if accion?.usa_ishikawa || accion?.usa_5porques}
              <div class="flex flex-col gap-6 border-t border-[var(--border-subtle)] pt-6">
                {#if accion?.usa_ishikawa}
                  <Ishikawavista ishikawa={accion.ishikawa_analisis || accion.analisis_ishikawa} />
                {/if}

                {#if accion?.usa_5porques}
                  <Why5Vista accion={accion.analisis_5porques} />
                {/if}
              </div>
            {/if}
          {/if}
        </div>

      {:else if tabActiva === 'plan_accion'}
        <div class="flex flex-col gap-4">
          <div class="border-b border-[var(--border-subtle)] pb-4">
            <h3 class="text-base font-bold text-[var(--bg-rojito)]">
              Plan de Acción
            </h3>
            <p class="text-xs text-[var(--text-secondary)] mt-0.5">
              Acciones correctivas programadas y seguimiento de tareas.
            </p>
          </div>
          <MatrizEditar grupos={data.accion.plan_accion_grupos} />
        </div>

      {:else if tabActiva === 'bitacora'}
        <div class="flex flex-col gap-4">
          <div class="border-b border-[var(--border-subtle)] pb-4">
            <h3 class="text-base font-bold text-[var(--bg-rojito)]">
              Bitácora de Observaciones
            </h3>
            <p class="text-xs text-[var(--text-secondary)] mt-0.5">
              Historial de cambios, notas y comentarios adicionales del seguimiento.
            </p>
          </div>
          <Bitacora codificador={accion.codificador} />
        </div>
      {/if}
    </div>

<Modal
  bind:open={mostrarModal}
  categoria="ÁNALISIS Y DETECCIÓN"
  titulo="Confirmar guardado"
  mensaje="¿Confirmas que deseas guardar los cambios realizados?"
  textoConfirmar="Sí, guardar"
  textoCancelar="Cancelar"
  onConfirm={guardarCambios}
  variante="normal"
/>
  </div>
</main>