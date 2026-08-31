<script>
  import { base } from '$app/paths';
  let { usuario } = $props();

  const ETIQUETAS_CARGO = {
  Admin: 'Administrador',
  supervisor: 'Supervisor'
};

function cambiocargo(cargo) {
  return ETIQUETAS_CARGO[cargo] ?? cargo;
}

  function iniciales(nombre, apellido) {
    if (!nombre) return '—';
    const n = nombre.trim()[0] ?? '';
    const a = apellido?.trim()[0] ?? '';
    return (n + a).toUpperCase();
  }

  function etiquetaPermiso(permiso) {
    return permiso
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
</script>

{#if usuario}
  <div class="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">

    <aside class="h-full flex flex-col justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-6 py-7 text-center lg:sticky lg:top-6">

      <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bg-rojito)] text-2xl font-bold text-white">
        {iniciales(usuario.nombre, usuario.apellido)}
      </div>

      <h2 class="text-base font-bold text-[var(--text-primary)]">
        {usuario.nombre} {usuario.apellido}
      </h2>
      <p class="mt-0.5 text-sm font-medium text-[var(--bg-rojito)]">
        {usuario.cargo}
      </p>

      <div class="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-input-dis)] px-3 py-1 text-[11px] font-semibold text-[var(--text-secondary)]">
        Ficha: {usuario.ficha}
      </div>

      <a href="{base}/Perfil-usuario/Editar"
        class="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--bg-rojito)] px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        Editar mi perfil
    </a>
    </aside>

    <div class="flex flex-col gap-5">

      <div class="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-6 py-5">
        <div class="mb-4 flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <span class="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[var(--bg-rojito)] font-bold uppercase">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" />
            </svg>
            Ficha de identificación
          </span>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="flex flex-col gap-1 rounded-[10px] bg-[var(--bg-input-dis)] px-4 py-3 border border-[var(--border-subtle)]">
            <span class="text-[10px] font-bold tracking-wider text-[var(--text-hint)] uppercase">Nombre completo</span>
            <span class="text-sm font-medium text-[var(--text-primary)]">{usuario.nombre} {usuario.apellido}</span>
          </div>

          <div class="flex flex-col gap-1 rounded-[10px] bg-[var(--bg-input-dis)] px-4 py-3 border border-[var(--border-subtle)]">
            <span class="text-[10px] font-bold tracking-wider text-[var(--text-hint)] uppercase">Correo corporativo</span>
            <span class="text-sm font-medium text-[var(--text-primary)]">{usuario.email}</span>
          </div>

          <div class="flex flex-col gap-1 rounded-[10px] bg-[var(--bg-input-dis)] px-4 py-3 border border-[var(--border-subtle)]">
            <span class="text-[10px] font-bold tracking-wider text-[var(--text-hint)] uppercase">Cargo</span>
            <span class="text-sm font-medium text-[var(--text-primary)]">{cambiocargo(usuario.cargo)}</span>
          </div>

          <div class="flex flex-col gap-1 rounded-[10px] bg-[var(--bg-input-dis)] px-4 py-3 border border-[var(--border-subtle)]">
            <span class="text-[10px] font-bold tracking-wider text-[var(--text-hint)] uppercase">Usuario de acceso</span>
            <span class="font-['Fira_Code'] text-sm font-medium text-[var(--text-primary)]">{usuario.usuario}</span>
          </div>
        </div>
      </div>
 
      <div class="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-6 py-5">
        <div class="mb-4 flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <span class="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[var(--bg-rojito)] uppercase">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            </svg>
            Permisos disponibles
          </span>
          <span class="rounded-full bg-[var(--bg-input-dis)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)]">
            {usuario.permisos?.length ?? 0}
          </span>
        </div>

        {#if usuario.permisos && usuario.permisos.length > 0}
          <div class="flex flex-wrap gap-2">
            {#each usuario.permisos as permiso}
              <span class="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-input-dis)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--text-primary)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8B1A2A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus-icon lucide-circle-plus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                {etiquetaPermiso(permiso)}
              </span>
            {/each}
          </div>
        {:else}
          <p class="text-sm italic text-[var(--text-hint)]">
            Este usuario no tiene permisos adicionales asignados.
          </p>
        {/if}
      </div>

    </div>
  </div>
{:else}
  <p class="italic text-[var(--text-hint)]">No has iniciado sesión.</p>
{/if}