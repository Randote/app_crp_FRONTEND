<script>
import { scale } from 'svelte/transition';
import Modal from '$lib/components/Modal.svelte';

  let mostrarModal = $state(false);
  let { usuario, onGuardar } = $props();

  const TODOS_LOS_PERMISOS = [
    { valor: 'noConformidades', label: 'Registrar No Conformidades', descripcion: 'Permite abrir nuevos reportes CAPA y hallazgos en planta.' },
    { valor: 'causaRaiz', label: 'Análisis de Causa Raíz', descripcion: 'Permite configurar diagramas de Ishikawa y redactar los 5 Porqués.' },
    { valor: 'planesAccion', label: 'Planificar Planes de Acción', descripcion: 'Permite definir medidas correctivas, preventivas y fechas límite.' },
    { valor: 'efectividad', label: 'Verificación de Efectividad', descripcion: 'Permite validar, auditar y cerrar formalmente acciones concluidas.' },
  ];

  let seleccionados = $state(new Set());

  $effect(() => {
    seleccionados = new Set(usuario.permisos ?? []);
  });

  let guardando = $state(false);

  let activos = $derived(seleccionados.size);
  let total = TODOS_LOS_PERMISOS.length;

  function toggle(valor) {
    seleccionados.has(valor) ? seleccionados.delete(valor) : seleccionados.add(valor);
    seleccionados = new Set(seleccionados);
  }

  function activarTodos() {
    seleccionados = new Set(TODOS_LOS_PERMISOS.map(p => p.valor));
  }

  function desactivarTodos() {
    seleccionados = new Set();
  }

function abrirConfirmacion(e) {
  e.preventDefault();
  mostrarModal = true;
}

async function guardarConfirmado() {
  guardando = true;
  try {
    await onGuardar({ permisos: [...seleccionados] });
  } finally {
    guardando = false;
  }
}
</script>

<form onsubmit={abrirConfirmacion} class="flex flex-col gap-4">

  <div class="flex items-center justify-between">
    <span class="text-[13px] font-semibold text-[var(--text-hint)] uppercase tracking-wide">
      Atribuciones granulares por toggles: {activos} / {total} activos
    </span>
    <div class="flex gap-2">
      <button type="button" onclick={activarTodos} class="text-[12px] font-semibold px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-input-dis)]">
        Activar todos
      </button>
      <button type="button" onclick={desactivarTodos} class="text-[12px] font-semibold px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--bg-rojito)] hover:bg-[var(--bg-input-dis)]">
        Desactivar todos
      </button>
    </div>
  </div>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
  {#each TODOS_LOS_PERMISOS as permiso}
    <label class="flex items-start justify-between gap-3 px-4 py-3 bg-[var(--bg-input-dis)] rounded-[var(--radius-md)] border-[0.5px] border-[var(--border-subtle)] cursor-pointer transition-all duration-150 active:scale-[0.98] hover:border-[var(--bg-rojito)]/40">
      <div class="flex flex-col gap-0.5">
        <div class="flex items-center gap-2">
          <span class="text-[13px] font-semibold text-[var(--text-primary)]">{permiso.label}</span>
          {#if seleccionados.has(permiso.valor)}
            <span
              class="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded"
              in:scale={{ duration: 150, start: 0.7 }}
            >
              ACTIVO
            </span>
          {/if}
        </div>
        {#if permiso.descripcion}
          <span class="text-[12px] text-[var(--text-hint)]">{permiso.descripcion}</span>
        {/if}
      </div>

      <input type="checkbox" class="sr-only peer shrink-0" checked={seleccionados.has(permiso.valor)} onchange={() => toggle(permiso.valor)} />
      <div class="w-10 h-6 shrink-0 bg-[#E4DFD6] rounded-full relative transition-colors duration-300 ease-in-out peer-checked:bg-[var(--bg-rojito)]">
        <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] peer-checked:translate-x-4"></div>
      </div>
    </label>
  {/each}
</div>
  <div class="mt-2 flex items-center justify-end border-t border-[var(--border-subtle)] pt-4">
    <button type="submit" disabled={guardando} class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--bg-rojito)] px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
      {guardando ? 'Guardando…' : 'Guardar permisos'}
    </button>
  </div>
</form>

<Modal
  bind:open={mostrarModal}
  categoria="PERMISOS DE ACCESO"
  titulo="Confirmar permisos"
  mensaje="¿Confirmas que deseas guardar los {activos} permiso(s) seleccionado(s) para este usuario?"
  textoConfirmar="Sí, guardar"
  textoCancelar="Cancelar"
  onConfirm={guardarConfirmado}
  variante="advertencia"
/>