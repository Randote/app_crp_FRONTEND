<script>
  import cpIcon from '$lib/assets/crp_logo_icon.svg';
  import AccionesForm from '$lib/components/AccionesForm.svelte';
  import AccionesIshikawia from '$lib/components/AccionesIshikawia.svelte';
  import Why5 from '$lib/components/Why5.svelte';
  import Planaccion from '$lib/components/Planaccion.svelte';
  import { mostrarNotificacion } from '$lib/Notificacion.svelte.js';

  // --- Checkboxes que activan secciones opcionales ---
  let verIshikawa = $state(false);
  let ver5Porques = $state(false);

  // --- Referencias a componentes hijos con validación exportada ---
  let accionesFormRef = $state();
  let ishikawaRef = $state();
  let why5Ref = $state();
  let planAccionRef = $state();
  let { data } = $props();


  function estadoInicialForm() {
    return {
      codificador: '',
      fechaEmision: new Date().toISOString().split('T')[0],
      fechaDeteccion: '',
      procesoAfectado: '',
      procesoInteraccion: '',
      dueñoProceso: '',
      participantes: '',
      origenDeteccion: '',
      especificacion: '',
      problemaDetectado: '',
      quéOcurre: '',
      cuandoOcurre: '',
      dondeOcurre: ''
    };
  }

  let form = $state(estadoInicialForm());
  let acciones = $state([]);

  // --- Estado de Ishikawa ---
  function estadoInicialDiagrama() {
    return {
      mano_obra: { titulo: 'MANO DE OBRA', causas: [] },
      maquina: { titulo: 'MÁQUINA', causas: [] },
      material: { titulo: 'MATERIAL', causas: [] },
      metodo: { titulo: 'MÉTODO', causas: [] },
      medicion: { titulo: 'MEDICIÓN', causas: [] },
      medio_ambiente: { titulo: 'MEDIO AMBIENTE', causas: [] }
    };
  }

function estadoInicialPorques() {
  return [];
}

function estadoInicialPlanAccion() {
  return [];
}


  let diagrama = $state(estadoInicialDiagrama());
  let problema = $state('');
  let porques = $state(estadoInicialPorques());
  let planAccion = $state(estadoInicialPlanAccion());
  let enviando = $state(false);

  function construirPayload() {
    const payload = {
      fecha_deteccion: form.fechaDeteccion,
      proceso_afectado: form.procesoAfectado,
      proceso_interaccion: form.procesoInteraccion || null,
      dueno_proceso: form.dueñoProceso,
      participantes: form.participantes || null,
      origen_deteccion: form.origenDeteccion || null,
      especificacion: form.especificacion || null,
      problema_detectado: form.problemaDetectado || null,
      que_ocurre: form.quéOcurre || null,
      cuando_ocurre: form.cuandoOcurre || null,
      donde_ocurre: form.dondeOcurre || null,
      usa_ishikawa: verIshikawa,
      usa_5porques: ver5Porques,
      acciones_inmediatas: acciones.map((a) => ({
        accion: a.accion,
        fecha: a.fecha,
        responsable: a.responsable,
        estatus: a.estatus
      }))
    };

    if (verIshikawa) {
      payload.ishikawa = {
        problema_enfocado: problema,
        mano_obra: diagrama.mano_obra.causas,
        maquina: diagrama.maquina.causas,
        material: diagrama.material.causas,
        metodo: diagrama.metodo.causas,
        medicion: diagrama.medicion.causas,
        medio_ambiente: diagrama.medio_ambiente.causas
      };
    }

    if (ver5Porques) {
    payload.analisis_5porques = porques.map((causa) => ({
      causa_potencial: causa.causaPotencial,
      porques: causa.porques.map((p, i) => ({
        numero: i + 1,
        pregunta: p.pregunta || null,
        respuesta: p.respuesta || null,
        es_raiz: causa.raizIndice === i
      }))
    }));
  }

  if (verIshikawa || ver5Porques) {
    payload.plan_accion_grupos = planAccion.map((grupo, gi) => ({
      causa_raiz_numero: gi + 1,
      acciones: grupo.acciones.map((accion) => ({
    descripcion: accion.descripcion,
    fecha: accion.sinFecha || !accion.fecha ? null : accion.fecha,
    responsables: accion.responsables.map((r) => ({
      nombre: r.nombre,
      email: r.email,
      proceso: r.proceso
    })),
    metodologia_descripcion: accion.metodologia.descripcion,
    metodologia_fecha: accion.metodologia.fecha,
    metodologia_responsable: accion.metodologia.responsable,
    metodologia_email: accion.metodologia.email
  }))
  }));
}

    return payload;
  }

async function handleSubmitGlobal(e) {
    e.preventDefault();

    if (!accionesFormRef?.validarRegistro()) {
      return;
    }

    if (verIshikawa && ishikawaRef && !ishikawaRef.validar()) {
      return;
    }

    if (ver5Porques && why5Ref && !why5Ref.validar()) {
      return;
    }

    if ((verIshikawa || ver5Porques) && planAccionRef && !planAccionRef.validar()) {
      return;
    }

    const payload = construirPayload();

    enviando = true;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/acciones-correctivas/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      console.log('Status:', res.status);
      console.log('Payload enviado:', payload);

if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error('Detalle del error 422 de FastAPI:', errorData); // <-- Agrega esto
        mostrarNotificacion(errorData?.detail?.[0]?.msg || errorData?.detail || 'Ocurrió un error al enviar el formulario.', 'error');
        return;
      }

      const data = await res.json();
      mostrarNotificacion(`Formulario enviado correctamente. Código: ${data.codificador}`, 'success');
      
      form = estadoInicialForm();
      acciones = [];
      diagrama = estadoInicialDiagrama();
      problema = '';
      porques = estadoInicialPorques();
      planAccion = estadoInicialPlanAccion();
      verIshikawa = false;
      ver5Porques = false;

    } catch (err) {
      console.error(err);
      mostrarNotificacion('No se pudo conectar con el servidor.', 'error');
    } finally {
      enviando = false;
    }
  }
</script>

<svelte:head>
  <title>Acciones Correctivas · Corimon C.A.</title>
  <link rel="icon" href={cpIcon} />
</svelte:head>

<main class="box-border min-h-screen bg-stone-100 p-4 md:p-6">
  <form onsubmit={handleSubmitGlobal}>

    <div class="mx-auto w-full max-w-screen-2xl rounded-xl border border-stone-200 bg-[var(--bg-base)] p-5 shadow-xl md:p-10">
      <AccionesForm
        bind:this={accionesFormRef}
        bind:form
        bind:acciones
        bind:checkboxIshikawa={verIshikawa}
        bind:checkbox5Porques={ver5Porques}
      />
    </div>

    {#if verIshikawa}
      <div class="mx-auto w-full max-w-screen-2xl rounded-xl border border-stone-200 bg-[var(--bg-base)] p-5 shadow-xl md:p-10 mt-5">
        <AccionesIshikawia bind:this={ishikawaRef} bind:diagrama bind:problema />
      </div>
    {/if}


    {#if ver5Porques}
      <div class="mx-auto w-full max-w-screen-2xl rounded-xl border border-stone-200 bg-[var(--bg-base)] p-5 shadow-xl md:p-10 mt-5">
        <Why5 bind:value={porques} />
      </div>
    {/if}

{#if verIshikawa || ver5Porques}
      <div class="mx-auto w-full max-w-screen-2xl rounded-xl border border-stone-200 bg-[var(--bg-base)] p-5 shadow-xl md:p-10 mt-5">
        <Planaccion bind:this={planAccionRef} bind:value={planAccion} usuarios={data.usuarios} />
      </div>

      <div class="mx-auto w-full max-w-screen-2xl flex justify-center mt-6">
        <button
          type="submit"
          disabled={enviando}
          class="rounded-lg bg-[var(--bg-rojito,#8B1A2A)] px-8 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {enviando ? 'Enviando…' : 'Enviar formulario completo'}
        </button>
      </div>
    {/if}

  </form>
</main>