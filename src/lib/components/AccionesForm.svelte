<script>
  import FormSection from './FormSection.svelte';
  import AccionesTable from './AccionesTable.svelte';
  import FieldError from './FieldError.svelte';
  import ComboBox from './ComboBox.svelte';
  import { mostrarNotificacion } from '$lib/Notificacion.svelte.js';

  const hoy = new Date();

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

  const Deteccion=[
    'Auditoria Interna',
    'Auditoria Externa',
    'Quejas y Reclamos',
    'Auditoria Proceso/Producto',
    'Producto no Conforme',
    'Indicadores',
    'Otro',
  ]

  function obtenerSiglasProceso(procesoTexto) {
    if (!procesoTexto) return '';
    const match = procesoTexto.match(/\(([^)]+)\)/);
    return match ? match[1] : '';
  }

  const abreviaturasOrigen = {
    'Auditoria Interna': 'AI',
    'Auditoria Externa': 'AE',
    'Quejas y Reclamos': 'QR',
    'Auditoria Proceso/Producto': 'APP',
    'Producto no Conforme': 'PNC',
    'Indicadores': 'IND',
    'Otro': 'OT'
  };


  $effect(() => {
    const siglaProceso = obtenerSiglasProceso(form.procesoAfectado);
    const siglaOrigen = abreviaturasOrigen[form.origenDeteccion] || '';

    if (siglaProceso && siglaOrigen) {
      const correlativo = form.correlativo || '1'; 
      
      form.codificador = `${siglaProceso}-${siglaOrigen}-${correlativo}`;
    } else {
      form.codificador = '';
    }
  });


  let {
    form = $bindable({
      codificador: '',
      fechaEmision: hoy.toISOString().split('T')[0],
      fechaDeteccion: '',
      procesoAfectado: '',
      dueñoProceso: '',
      participantes: '',
      origenDeteccion: '',
      especificacion: '',
      problemaDetectado: '',
      quéOcurre: '',
      cuandoOcurre: '',
      dondeOcurre: ''
    }),
    acciones = $bindable([]),
    checkboxIshikawa = $bindable(false),
    checkbox5Porques = $bindable(false)
  } = $props();


  let accionesErrors = $state([]);
  let errors = $state({});


$effect(() => {
    if (form.procesoAfectado && form.origenDeteccion) {
      const url = `${import.meta.env.VITE_API_URL}/api/acciones-correctivas/siguiente-codificador?proceso=${encodeURIComponent(form.procesoAfectado)}&origen=${encodeURIComponent(form.origenDeteccion)}`;

      fetch(url, {
        method: 'GET',
        credentials: 'include'
      })
      .then(res => res.json())
      .then(data => {
        if (data.codificador) {
          form.codificador = data.codificador;
        }
      })
      .catch(err => console.error('Error al obtener el codificador:', err));
    } else {
      form.codificador = '';
    }
  });


  export function validarRegistro() {
    errors = {};
    accionesErrors = acciones.map(() => ({}));

    let tieneErrores = false;

    if (!form.fechaDeteccion) {
      errors.fechaDeteccion = 'La fecha es obligatoria';
      tieneErrores = true;
    } else {
      const fechaDet = new Date(form.fechaDeteccion + 'T00:00:00');
      const hoyFecha = new Date();
      hoyFecha.setHours(0, 0, 0, 0);
      if (fechaDet > hoyFecha) {
        errors.fechaDeteccion = 'La fecha no puede ser futura';
        tieneErrores = true;
      }
    }

    if (!form.procesoAfectado || form.procesoAfectado.trim().length < 3) {
      errors.procesoAfectado = 'Seleccione o escriba un proceso válido';
      tieneErrores = true;
    }

    if (!form.dueñoProceso || !form.dueñoProceso.trim()) {
      errors.dueñoProceso = 'El dueño del proceso es obligatorio';
      tieneErrores = true;
    }

    if (!form.origenDeteccion || !form.origenDeteccion.trim()) {
      errors.origenDeteccion = 'El origen de la detección es obligatorio';
      tieneErrores = true;
    }

    if (!form.participantes || !form.participantes.trim()) {
      errors.participantes = 'Los participantes son obligatorios';
      tieneErrores = true;
    }

    if (form.origenDeteccion === 'Otro' && (!form.especificacion || !form.especificacion.trim())) {
      errors.especificacion = 'Debe especificar el origen';
      tieneErrores = true;
    }

    if (!form.problemaDetectado || !form.problemaDetectado.trim()) {
      errors.problemaDetectado = 'La descripción del problema es obligatoria';
      tieneErrores = true;
    }

    if (!form.quéOcurre || !form.quéOcurre.trim()) {
      errors.quéOcurre = 'Este campo es obligatorio';
      tieneErrores = true;
    }

    if (!form.cuandoOcurre || !form.cuandoOcurre.trim()) {
      errors.cuandoOcurre = 'Este campo es obligatorio';
      tieneErrores = true;
    }

    if (!form.dondeOcurre || !form.dondeOcurre.trim()) {
      errors.dondeOcurre = 'Este campo es obligatorio';
      tieneErrores = true;
    }

    // Validación estricta de las acciones inmediatas
    if (acciones.length > 0) {
      for (let i = 0; i < acciones.length; i++) {
        const a = acciones[i];
        const filaErrores = {};

        if (!a.accion || !a.accion.trim()) filaErrores.accion = 'Requerida';
        if (!a.fecha || !a.fecha.trim()) filaErrores.fecha = 'Requerida';
        if (!a.responsable || !a.responsable.trim()) filaErrores.responsable = 'Requerido';
        if (!a.estatus || !a.estatus.trim()) filaErrores.estatus = 'Requerido';

        if (Object.keys(filaErrores).length > 0) {
          accionesErrors[i] = filaErrores;
          tieneErrores = true;
        }
      }
    } else {
      mostrarNotificacion('Debe agregar al menos una acción inmediata.', 'error');
      tieneErrores = true;
    }

    if (tieneErrores) {
      mostrarNotificacion('Corrija los campos resaltados antes de enviar.', 'error');
      return false;
    }

    return true;
  }
</script>

<div class="w-full space-y-5 md:space-y-6">

  <!-- 01 · Datos del registro -->
  <FormSection title="Datos del registro">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

      <div class="flex flex-col gap-1.5">
        <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="codificador">
          Codificación
        </label>
        <input id="codificador" disabled class="input cursor-not-allowed " type="input" bind:value={form.codificador}/>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="fechaDeteccion">
          Fecha de Detección <span class="text-[#8B1A2A]">*</span>
        </label>
        <input
          id="fechaDeteccion"
          class="input-date"
          class:input--error={errors.fechaDeteccion}
          type="date"
          bind:value={form.fechaDeteccion}
        />
        <FieldError message={errors.fechaDeteccion} />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="procesoAfectado">
          Proceso Afectado <span class="text-[#8B1A2A]">*</span>
        </label>
        <ComboBox
          bind:value={form.procesoAfectado}
          options={procesos}
          placeholder="Buscar proceso…"
          error={!!errors.procesoAfectado}
        />
        <FieldError message={errors.procesoAfectado} />
      </div>

    </div>
  </FormSection>

  <!-- 02 · Responsables -->
  <FormSection title="Responsables y participantes">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

      <div class="flex flex-col gap-1.5">
        <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="dueñoProceso">
          Dueño del Proceso <span class="text-[#8B1A2A]">*</span>
        </label>
        <input
          id="dueñoProceso"
          class="input"
          class:input--error={errors.dueñoProceso}
          type="text"
          placeholder="Nombre completo"
          bind:value={form.dueñoProceso}
        />
        <FieldError message={errors.dueñoProceso} />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="origenDeteccion">
          Origen de la Detección <span class="text-[#8B1A2A]">*</span>
        </label>
        <ComboBox
          bind:value={form.origenDeteccion}
          options={Deteccion}
          placeholder="Buscar origen…"
          error={!!errors.origenDeteccion}
        />
        <FieldError message={errors.origenDeteccion} />
      </div>

      {#if form.origenDeteccion === 'Otro'}
        <div class="flex flex-col gap-1.5 sm:col-span-2">
          <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="especificacion">
            Especifique el origen <span class="text-[#8B1A2A]">*</span>
          </label>
          <input
            id="especificacion"
            class="input"
            class:input--error={errors.especificacion}
            type="text"
            placeholder="Describir origen"
            bind:value={form.especificacion}
          />
          <FieldError message={errors.especificacion} />
        </div>
      {/if}

      <div class="flex flex-col gap-1.5 sm:col-span-2">
        <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="participantes">
          Participantes <span class="text-[#8B1A2A]">*</span>
        </label>
        <input
          id="participantes"
          class="input"
          class:input--error={errors.participantes}
          type="text"
          placeholder="Separar con comas"
          bind:value={form.participantes}
        />
        <FieldError message={errors.participantes} />
      </div>

      <div class="flex flex-col gap-2 sm:col-span-2">
        <label class="text-[14px] font-semibold text-[var(--text-primary)]" for="problemaDetectado">
          Problema Detectado <span class="text-[#8B1A2A]">*</span>
        </label>
        <textarea
          id="problemaDetectado"
          class="textarea"
          class:input--error={errors.problemaDetectado}
          rows="4"
          placeholder="Describa brevemente el problema o no conformidad identificada…"
          bind:value={form.problemaDetectado}
        ></textarea>
        <FieldError message={errors.problemaDetectado} />
      </div>

    </div>
  </FormSection>

  <!-- 03 · Definición del problema -->
  <FormSection title="Defina el problema — responda de forma específica">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">

      <div class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-base)] p-4">
        <span class="text-[11px] font-bold tracking-wider text-[var(--text-hint)] uppercase">¿Qué ocurre? <span class="text-[#8B1A2A]">*</span></span>
        <textarea
          class="textarea min-h-[90px] border-none p-0 focus:ring-0"
          class:input--error={errors.quéOcurre}
          placeholder="Describe el hallazgo…"
          bind:value={form.quéOcurre}
        ></textarea>
        <FieldError message={errors.quéOcurre} />
      </div>

      <div class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-base)] p-4">
        <span class="text-[11px] font-bold tracking-wider text-[var(--text-hint)] uppercase">¿Cuándo ocurre? <span class="text-[#8B1A2A]">*</span></span>
        <textarea
          class="textarea min-h-[90px] border-none p-0 focus:ring-0"
          class:input--error={errors.cuandoOcurre}
          placeholder="Frecuencia o momento…"
          bind:value={form.cuandoOcurre}
        ></textarea>
        <FieldError message={errors.cuandoOcurre} />
      </div>

      <div class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-base)] p-4">
        <span class="text-[11px] font-bold tracking-wider text-[var(--text-hint)] uppercase">¿Dónde ocurre? <span class="text-[#8B1A2A]">*</span></span>
        <textarea
          class="textarea min-h-[90px] border-none p-0 focus:ring-0"
          class:input--error={errors.dondeOcurre}
          placeholder="Lugar, línea, equipo…"
          bind:value={form.dondeOcurre}
        ></textarea>
        <FieldError message={errors.dondeOcurre} />
      </div>

    </div>
  </FormSection>

  <!-- 04 · Acciones inmediatas -->
  <FormSection title="Acciones inmediatas o correcciones">
    <AccionesTable bind:acciones errors={accionesErrors} />
  </FormSection>

  <div class="flex flex-col sm:flex-row justify-center items-center gap-3 border-t border-[var(--border-subtle)] pt-5 w-full">

    <label class="flex items-center gap-2.5 px-4 py-1.5 rounded-full border transition-all cursor-pointer select-none text-center
      {checkboxIshikawa 
        ? 'border-[#8B1A2A] bg-[#8B1A2A] text-white shadow-sm' 
        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'}">

      <input 
        type="checkbox" 
        id="ishikawa" 
        bind:checked={checkboxIshikawa} 
        class="sr-only"
      />

      <div class="w-3.5 h-3.5 rounded flex items-center justify-center transition-all border bg-white
        {checkboxIshikawa ? 'border-white text-[#8B1A2A]' : 'border-stone-400 text-transparent'}">
        {#if checkboxIshikawa}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4.5" stroke="currentColor" class="w-2.5 h-2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        {/if}
      </div>

      <span class="text-[13px] font-medium tracking-wide">Diagrama de Ishikawa</span>
    </label>

    <label class="flex items-center gap-2.5 px-4 py-1.5 rounded-full border transition-all cursor-pointer select-none text-center
      {checkbox5Porques 
        ? 'border-[#8B1A2A] bg-[#8B1A2A] text-white shadow-sm' 
        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'}">

      <input 
        type="checkbox" 
        id="5porqués" 
        bind:checked={checkbox5Porques} 
        class="sr-only"
      />

      <div class="w-3.5 h-3.5 rounded flex items-center justify-center transition-all border bg-white
        {checkbox5Porques ? 'border-white text-[#8B1A2A]' : 'border-stone-400 text-transparent'}">
        {#if checkbox5Porques}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4.5" stroke="currentColor" class="w-2.5 h-2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        {/if}
      </div>

      <span class="text-[13px] font-medium tracking-wide">Método de los 5 Porqués</span>
    </label>
  </div>
</div>