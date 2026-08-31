<script>
  import FormSection from '../FormSection.svelte';

  let { accion } = $props();

  const ETIQUETA_ESTATUS = {
    PENDIENTE: 'Pendiente',
    'EN PROCESO': 'En proceso',
    EJECUTADA: 'Ejecutada'
  };
</script>

<div class="w-full space-y-5 md:space-y-6">

  <FormSection title="Datos del registro">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

      <div class="flex flex-col gap-1.5">
        <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="codificador">
          Codificación
        </label>
        <input id="codificador" readonly class="input cursor-not-allowed" type="text" value={accion.codificador} />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="fechaDeteccion">
          Fecha de Detección
        </label>
        <input id="fechaDeteccion" readonly class="input-date cursor-not-allowed" type="date" value={accion.fecha_deteccion} />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="procesoAfectado">
          Proceso Afectado
        </label>
        <input id="procesoAfectado" readonly class="input cursor-not-allowed" type="text" value={accion.proceso_afectado} />
      </div>

    </div>
  </FormSection>


  <FormSection title="Responsables y participantes">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

      <div class="flex flex-col gap-1.5">
        <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="dueñoProceso">
          Dueño del Proceso
        </label>
        <input id="dueñoProceso" readonly class="input cursor-not-allowed" type="text" value={accion.dueno_proceso} />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="origenDeteccion">
          Origen de la Detección
        </label>
        <input id="origenDeteccion" readonly class="input cursor-not-allowed" type="text" value={accion.origen_deteccion || '—'} />
      </div>

      <div class="flex flex-col gap-1.5 sm:col-span-2">
        <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="participantes">
          Participantes
        </label>
        <input id="participantes" readonly class="input cursor-not-allowed" type="text" value={accion.participantes || '—'} />
      </div>

      {#if accion.especificacion}
        <div class="flex flex-col gap-1.5 sm:col-span-2">
          <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="especificacion">
            Especifique el origen
          </label>
          <input id="especificacion" readonly class="input cursor-not-allowed" type="text" value={accion.especificacion} />
        </div>
      {/if}

      <div class="flex flex-col gap-2 sm:col-span-2">
        <label class="text-[14px] font-semibold text-[var(--text-primary)]" for="problemaDetectado">
          Problema Detectado
        </label>
        <textarea
          id="problemaDetectado"
          readonly
          class="textarea cursor-not-allowed"
          rows="4"
          value={accion.problema_detectado || '—'}
        ></textarea>
      </div>

    </div>
  </FormSection>


  <FormSection title="Definición del problema">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">

      <div class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-base)] p-4">
        <span class="text-[11px] font-bold tracking-wider text-[var(--text-hint)] uppercase">¿Qué ocurre?</span>
        <textarea
          readonly
          class="textarea min-h-[90px] cursor-not-allowed border-none p-0"
          value={accion.que_ocurre || '—'}
        ></textarea>
      </div>

      <div class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-base)] p-4">
        <span class="text-[11px] font-bold tracking-wider text-[var(--text-hint)] uppercase">¿Cuándo ocurre?</span>
        <textarea
          readonly
          class="textarea min-h-[90px] cursor-not-allowed border-none p-0"
          value={accion.cuando_ocurre || '—'}
        ></textarea>
      </div>

      <div class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-base)] p-4">
        <span class="text-[11px] font-bold tracking-wider text-[var(--text-hint)] uppercase">¿Dónde ocurre?</span>
        <textarea
          readonly
          class="textarea min-h-[90px] cursor-not-allowed border-none p-0"
          value={accion.donde_ocurre || '—'}
        ></textarea>
      </div>

    </div>
  </FormSection>


  <FormSection title="Acciones inmediatas o correcciones">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[560px] border-collapse text-[13px]">
        <thead>
          <tr class="bg-[var(--bg-input-dis)]">
            <th class="w-8 border-b border-[var(--border-subtle)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--text-hint)]">#</th>
            <th class="border-b border-[var(--border-subtle)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--text-hint)]">Acción</th>
            <th class="w-36 border-b border-[var(--border-subtle)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--text-hint)]">Fecha</th>
            <th class="w-44 border-b border-[var(--border-subtle)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--text-hint)]">Responsable</th>
            <th class="w-40 border-b border-[var(--border-subtle)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--text-hint)]">Estatus</th>
          </tr>
        </thead>
        <tbody>
          {#if !accion.acciones_inmediatas?.length}
            <tr>
              <td colspan="5" class="border-b border-[var(--border-subtle)] px-4 py-6 text-center text-sm italic text-[var(--text-hint)]">
                No hay acciones registradas
              </td>
            </tr>
          {:else}
            {#each accion.acciones_inmediatas as item, i}
              <tr class="hover:bg-[var(--bg-input-dis)] transition-colors">
                <td class="border-b border-[var(--border-subtle)] px-3 py-2 text-center font-['Fira_Code'] text-[12px] text-[var(--text-disabled)]">
                  {i + 1}
                </td>
                <td class="border-b border-[var(--border-subtle)] px-2 py-2">
                  <input readonly class="input h-9 cursor-not-allowed text-[13px]" type="text" value={item.accion} />
                </td>
                <td class="border-b border-[var(--border-subtle)] px-2 py-2">
                  <input readonly class="input-date h-9 cursor-not-allowed text-[13px]" type="date" value={item.fecha} />
                </td>
                <td class="border-b border-[var(--border-subtle)] px-2 py-2">
                  <input readonly class="input h-9 cursor-not-allowed text-[13px]" type="text" value={item.responsable} />
                </td>
                <td class="border-b border-[var(--border-subtle)] px-2 py-2">
                  <input readonly class="input h-9 cursor-not-allowed text-[13px]" type="text" value={ETIQUETA_ESTATUS[item.estatus] ?? item.estatus} />
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </FormSection>

</div>