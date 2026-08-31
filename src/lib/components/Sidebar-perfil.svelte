<script>
  import { base } from '$app/paths';
  import Edicion from '$lib/components/Editar-usuario.svelte';
  import Cambioclave from '$lib/components/Cambio-clave.svelte';

  let { usuario, onGuardarPerfil, onCambiarPassword } = $props();

  let tabActiva = $state('personales');

  function iniciales(nombre, apellido) {
    if (!nombre) return '—';
    const n = nombre.trim()[0] ?? '';
    const a = apellido?.trim()[0] ?? '';
    return (n + a).toUpperCase();
  }

  const TABS = [
    {
      id: 'personales',
      etiqueta: 'Datos Personales',
      disponible: true,
      icono: 'M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'
    },
    {
      id: 'seguridad',
      etiqueta: 'Seguridad y Contraseña',
      disponible: true,
      icono: 'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'
    }
  ];
</script>

<div class="p-2 mx-auto">

  <!-- 1. Header, su propia tarjeta -->
  <div class="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] border-t-[3px] border-t-[var(--bg-rojito)] bg-[var(--bg-card)] px-6 py-5">
    <div class="flex items-center gap-3.5">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-rojito)] text-base font-bold text-white">
        {iniciales(usuario.nombre, usuario.apellido)}
      </div>
      <div>
        <h2 class="text-[15px] font-bold text-[var(--text-primary)] uppercase">
          {usuario.nombre} {usuario.apellido}
        </h2>
        <p class="text-[13px] text-[var(--text-secondary)]">
          Actualiza tus datos de contacto.
        </p>
      </div>
    </div>

    
      <a href="{base}/Perfil-usuario"
      class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-input-dis)]"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      Volver a mi perfil
    </a>
  </div>

  <!-- 2. Barra de pestañas -->
  <div class="flex flex-wrap gap-1 rounded-t-2xl border border-b-0 border-[var(--border-subtle)] bg-[var(--bg-input-dis)] p-2">
    {#each TABS as tab}
      <button
        type="button"
        disabled={!tab.disponible}
        onclick={() => (tabActiva = tab.id)}
        class="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors
          {tabActiva === tab.id
            ? 'bg-[var(--bg-card)] text-[var(--bg-rojito)] shadow-sm'
            : tab.disponible
              ? 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)]/60'
              : 'cursor-not-allowed text-[var(--text-hint)] opacity-50'}"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d={tab.icono} />
        </svg>
        {tab.etiqueta}
      </button>
    {/each}
  </div>

  <div class="rounded-b-2xl rounded-tr-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6">

    {#if tabActiva === 'personales'}
          <div class="mb-5 border-b border-[var(--border-subtle)] pb-4">
        <h3 class="text-[15px] font-bold text-[var(--bg-rojito)]">
          Información Básica de Identificación
        </h3>
      </div>
      <Edicion {usuario} onGuardar={onGuardarPerfil} />

    {:else if tabActiva === 'seguridad'}
      <div class="mb-5 border-b border-[var(--border-subtle)] pb-4">
        <h3 class="text-[15px] font-bold text-[var(--bg-rojito)]">
           Cambio de Contraseña
        </h3>
      </div>

      <Cambioclave onGuardar={onCambiarPassword} />
    {/if}

  </div>
</div>