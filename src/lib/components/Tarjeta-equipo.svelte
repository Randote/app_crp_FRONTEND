<script>
import {base} from '$app/paths';
  let {
    id,
    nombre,
    apellido,
    cargo,
    email,
    ficha,
    asignadas = 0,
    cerradas = 0,
    vencidas = 0,
    esAdmin = false
  } = $props();

  let iniciales = $derived(
    `${nombre?.[0] ?? ''}${apellido?.[0] ?? ''}`.toUpperCase()
  );
</script>

<div class="bg-white rounded-[var(--radius-lg)] p-5 flex flex-col gap-4 font-[var(--font-ui)] border-[0.5px] border-[#E4DFD6] hover:border-[var(--bg-rojito)]">

  <div class="flex items-start justify-between gap-3">
    <div class="flex items-start gap-3">
      <div class="w-10 h-10 rounded-full bg-[var(--bg-rojito)] text-white flex items-center justify-center font-semibold shrink-0">
        {iniciales}
      </div>
      <div class="flex flex-col">
      <div class="mb-2">
        <p class="font-semibold flex items-center gap-1">{nombre} {apellido}</p>
        <p class="text-[var(--bg-rojito)] text-sm">{cargo}</p>
    </div>
        <p class="text-[var(--text-hint)] text-sm">{email}</p>
      </div>
    </div>

    {#if esAdmin }
    <a  
      class="text-[var(--text-hint)] hover:text-[var(--bg-rojito)] transition-colors shrink-0 p-1"
      href="{base}/Perfil/{id}"
      aria-label="Editar usuario"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    </a>
{/if}

  </div>

  <div class="flex justify-between bg-[var(--bg-input-dis)] rounded-[var(--radius-md)] px-4 py-3 border-[0.5px] border-[#E4DFD6]">
    <div class="flex flex-col items-center gap-1">
      <span class="text-xs text-[var(--text-hint)] tracking-wide">Asignadas</span>
      <span class="font-bold">{asignadas}</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <span class="text-xs text-[var(--text-hint)] tracking-wide">Cerradas</span>
      <span class="font-bold text-green-600">{cerradas}</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <span class="text-xs text-[var(--text-hint)] tracking-wide">Vencidas</span>
      <span class="font-bold">{vencidas}</span>
    </div>
  </div>
</div>