<script>
  import '$lib/layout.css';
  import { invalidateAll } from '$app/navigation';
  import { base } from '$app/paths';
  import cpIcon from '$lib/assets/crp_logo_icon.svg';
  import Editarpermisos from '$lib/components/Editar-permisos.svelte';
  import Cambiarclave from '$lib/components/Cambio-clave-admin.svelte';
  import Editar from '$lib/components/Editar-usuario.svelte';
  import { fetchAutenticado } from '$lib/fetchAutenticador.js';

  let { data } = $props();

  let esAdmin = $derived(data.user.cargo==='Admin');
  let usuario = $derived(data.usuario);

  let tabActiva = $state('personales');

  function iniciales(nombre, apellido) {
    if (!nombre) return '—';
    return `${nombre.trim()[0] ?? ''}${apellido?.trim()[0] ?? ''}`.toUpperCase();
  }

  const TABS = [
    {
      id: 'personales',
      etiqueta: 'Datos Personales',
      icono: 'M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'
    },
    // {
    //   id: 'permisos',
    //   etiqueta: 'Cargo y Permisos',
    //   icono: 'M12 2 3 7v6c0 5 4 9 9 9s9-4 9-9V7Z'
    // },
    {
      id: 'seguridad',
      etiqueta: 'Seguridad y Contraseña',
      icono: 'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'
    }
  ];

  async function onGuardarPerfil(payload) {
    const res = await fetchAutenticado(`/api_crp/api/usuarios/${usuario.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'No se pudo guardar el perfil.');
    }
        await invalidateAll(); 
  }

  async function onGuardarPermisos(payload) {
    const res = await fetchAutenticado (`/api_crp/api/usuarios/${usuario.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'No se pudieron guardar los permisos.');
    }
    await invalidateAll(); 
  }

  async function onCambiarPasswordAdmin(payload) {
    const res = await fetchAutenticado(`/api_crp/api/usuarios/${usuario.id}/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'No se pudo cambiar la contraseña.');
    }
        await invalidateAll(); 
  }
</script>

<svelte:head>
  <title>Editar usuario</title>
  <link rel="icon" href={cpIcon} />
</svelte:head>

{#if !esAdmin}
  <p class="p-6 text-[var(--text-secondary)]">No tienes permisos para ver esta página.</p>
{:else}
  <div class="p-2 mx-auto">

    <!-- Header -->
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] border-t-[3px] border-t-[var(--bg-rojito)] bg-[var(--bg-card)] px-6 py-5">
      <div class="flex items-center gap-3.5">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-rojito)] text-base font-bold text-white">
          {iniciales(usuario.nombre, usuario.apellido)}
        </div>
        <div>
          <h2 class="text-[15px] font-bold text-[var(--text-primary)] uppercase">{usuario.nombre} {usuario.apellido} </h2>
        </div>
      </div>

      <a href="{base}/Equipo" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-input-dis)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
        </svg>
        Volver al equipo
      </a>
    </div>

    <div class="flex flex-wrap gap-1 rounded-t-2xl border border-b-0 border-[var(--border-subtle)] bg-[var(--bg-input-dis)] p-2">
      {#each TABS as tab}
        <button
          type="button"
          onclick={() => (tabActiva = tab.id)}
          class="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors
            {tabActiva === tab.id
              ? 'bg-[var(--bg-card)] text-[var(--bg-rojito)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)]/60'}"
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
          <h3 class="text-[15px] font-bold text-[var(--bg-rojito)]">Información Básica de Identificación</h3>
        </div>
        <Editar {usuario} onGuardar={onGuardarPerfil} modoAdmin={true} />

      <!-- {:else if tabActiva === 'permisos'}
        <div class="mb-5 border-b border-[var(--border-subtle)] pb-4">
          <h3 class="text-[15px] font-bold text-[var(--bg-rojito)]">Cargo y Permisos</h3>
        </div>
        <Editarpermisos {usuario} onGuardar={onGuardarPermisos} /> -->

      {:else if tabActiva === 'seguridad'}
        <div class="mb-5 border-b border-[var(--border-subtle)] pb-4">
          <h3 class="text-[15px] font-bold text-[var(--bg-rojito)]">Seguridad y Contraseña</h3>
        </div>
        <Cambiarclave onGuardar={onCambiarPasswordAdmin} />
      {/if}

    </div>
  </div>
{/if}