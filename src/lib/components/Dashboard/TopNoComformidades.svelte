<script>
  let { titulo = '', proceso = '', cantidad = 0, porcentaje = 0, color = '#8B1A2A' } = $props();
</script>

<div class="relative bg-white border-[0.5px] border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-4 overflow-hidden">
  <div class="absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.06]" style="background: {color}; transform: translate(30%, -30%);"></div>

  <div class="flex items-center gap-1.5 mb-2">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z"/>
    </svg>
    <span class="font-[var(--font-ui)] text-[11px] font-semibold uppercase tracking-wide" style="color: {color};">
      {titulo}
    </span>
  </div>

  <p class="font-[var(--font-ui)] text-[15px] font-bold text-[var(--text-primary)] mb-1 truncate">
    {proceso}
  </p>
</div>