<script>
  let {
    value = $bindable(''),
    placeholder = 'Buscar…',
  } = $props();
</script>

<div class="flex items-center gap-2 flex-1 min-w-[220px] bg-[var(--bg-input-dis)] border border-[var(--border-subtle)] rounded-[10px] px-3 py-2">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-[var(--text-hint)] shrink-0">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>

  <input
    type="text"
    bind:value
    {placeholder}
    class="flex-1 bg-transparent border-none outline-none text-[13.5px] text-[var(--text-primary)] placeholder:text-[var(--text-hint)]"
  />

  {#if value}
    <button
      type="button"
      onclick={() => (value = '')}
      class="shrink-0 text-[var(--text-hint)] hover:text-[var(--text-primary)] transition-colors"
      aria-label="Limpiar búsqueda"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
      </svg>
    </button>
  {/if}
</div>