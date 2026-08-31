<script>
  let {
    value = $bindable(10),
    opciones = [5, 10, 25, 50, 100],
    etiqueta = 'Mostrar',
  } = $props();
</script>

<div class="flex items-center gap-2 text-[12.5px] text-[var(--text-secondary)] shrink-0">
  <span class="font-medium">{etiqueta}</span>

  <div class="relative">
    <select
      bind:value
      class="appearance-none bg-[var(--bg-input-dis)] border border-[var(--border-subtle)] rounded-[8px] pl-2.5 pr-7 py-1.5 text-[12.5px] font-medium text-[var(--text-primary)] cursor-pointer focus:outline-none focus:border-[var(--bg-rojito)] transition-colors"
    >
      {#each opciones as op}
        <option value={op}>{op}</option>
      {/each}
    </select>
  </div>

  <span>registros</span>
</div>