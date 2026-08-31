<script>
  let { acciones = $bindable([]), errors = [] } = $props();

  function agregarFila() {
    acciones.push({ accion: '', fecha: '', responsable: '', estatus: '' });
    // Forzar reactividad en Svelte 5
    acciones = acciones;
  }

  function eliminarFila(index) {
    acciones.splice(index, 1);
    acciones = acciones;
  }
</script>

<div class="overflow-x-auto">
  <table class="w-full min-w-[560px] border-collapse text-[13px]">
    <thead>
      <tr class="bg-[var(--bg-input-dis)]">
        <th class="w-8 border-b border-[var(--border-subtle)] px-3 py-2.5 text-left text-[11px] font-semibold tracking-wider text-[var(--text-hint)] uppercase">#</th>
        <th class="border-b border-[var(--border-subtle)] px-3 py-2.5 text-left text-[11px] font-semibold tracking-wider text-[var(--text-hint)] uppercase">Acción</th>
        <th class="w-36 border-b border-[var(--border-subtle)] px-3 py-2.5 text-left text-[11px] font-semibold tracking-wider text-[var(--text-hint)] uppercase">Fecha</th>
        <th class="w-44 border-b border-[var(--border-subtle)] px-3 py-2.5 text-left text-[11px] font-semibold tracking-wider text-[var(--text-hint)] uppercase">Responsable</th>
        <th class="w-40 border-b border-[var(--border-subtle)] px-3 py-2.5 text-left text-[11px] font-semibold tracking-wider text-[var(--text-hint)] uppercase">Estatus</th>
        <th class="w-10 border-b border-[var(--border-subtle)]"></th>
      </tr>
    </thead>
    <tbody>
      {#if acciones.length === 0}
        <tr>
          <td colspan="6" class="border-b border-[var(--border-subtle)] px-4 py-6 text-center text-sm italic text-[var(--text-hint)]">
            No hay acciones registradas
          </td>
        </tr>
      {:else}
        {#each acciones as accion, i}
          <tr class="group transition-colors hover:bg-[var(--bg-input-dis)]">
            <td class="border-b border-[var(--border-subtle)] px-3 py-2 text-center font-['Fira_Code'] text-[12px] text-[var(--text-disabled)]">
              {i + 1}
            </td>
            <td class="border-b border-[var(--border-subtle)] px-2 py-2">
              <input
                class="input h-9 text-[13px]"
                class:input--error={errors[i]?.accion}
                type="text"
                placeholder="Describir acción…"
                bind:value={accion.accion}
              />
              {#if errors[i]?.accion}
                <span class="text-[11px] text-[var(--text-error)]">{errors[i].accion}</span>
              {/if}
            </td>
            <td class="border-b border-[var(--border-subtle)] px-2 py-2">
              <input
                class="input-date h-9 text-[13px]"
                class:input--error={errors[i]?.fecha}
                type="date"
                bind:value={accion.fecha}
              />
              {#if errors[i]?.fecha}
                <span class="text-[11px] text-[var(--text-error)]">{errors[i].fecha}</span>
              {/if}
            </td>
            <td class="border-b border-[var(--border-subtle)] px-2 py-2">
              <input
                class="input h-9 text-[13px]"
                class:input--error={errors[i]?.responsable}
                type="text"
                placeholder="Nombre"
                bind:value={accion.responsable}
              />
              {#if errors[i]?.responsable}
                <span class="text-[11px] text-[var(--text-error)]">{errors[i].responsable}</span>
              {/if}
            </td>
            <td class="border-b border-[var(--border-subtle)] px-2 py-2" >
            <select
              class="select w-full h-9 text-[13px]"
              class:select--error={errors[i]?.estatus}
              bind:value={accion.estatus}
            >
              <option class="option" value="" disabled></option>
              <option class="option" value="PENDIENTE">Pendiente</option>
              <option class="option" value="EN PROCESO">En proceso</option>
              <option class="option" value="EJECUTADA">Ejecutada</option>
            </select>
              {#if errors[i]?.estatus}
                <span class="text-[11px] text-[var(--text-error)]">{errors[i].estatus}</span>
              {/if}
            </td>
            <td class="border-b border-[var(--border-subtle)] px-2 py-2 text-center">
              <button
                type="button"
                onclick={() => eliminarFila(i)}
                class="text-[var(--text-tertiary)] hover:text-[var(--text-error)] transition-colors"
                aria-label="Eliminar acción"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>

  <div class="mt-3 flex justify-center">
    <button
      type="button"
      onclick={agregarFila}
      class="flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--border-medium)] px-4 py-2 text-[13px] font-medium text-[var(--text-hint)] transition-colors hover:bg-[var(--bg-input-dis)] hover:border-[var(--accent-wine)]"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Agregar acción
    </button>
  </div>
</div>