
<script>
  let { opciones = [], valor = $bindable(opciones[0]) } = $props();
</script>

<div class="inline-flex bg-[var(--bg-card)] border-[0.5px] border-[var(--border-subtle)] rounded-[var(--radius-md)] p-1 gap-1">
  {#each opciones as opcion}
    <button
      onclick={() => (valor = opcion)}
      class="px-4 py-1.5 rounded-[var(--radius-sm)] text-sm font-[var(--font-ui)] font-medium transition-colors
        {valor === opcion
          ? 'bg-[#4A7FA8] text-white shadow-sm'
          : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}"
    >
      {opcion}
    </button>
  {/each}
</div>