<script>
  import FormSection from '$lib/components/FormSection.svelte';

  let { procesos = [], total = 0 } = $props();

  const SVG_FLAG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 21v-16a1 1 0 0 1 1 -1h6.5a0.5 .5 0 0 1 .5 .5v2h6a1 1 0 0 1 1 1v9a1 1 0 0 1 -1 1h-6.5a0.5 .5 0 0 1 -.5 -.5v-2h-6" /></svg>`;
  const SVG_ADJUSTMENTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 8m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M4 16m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /></svg>`;
  const SVG_TOOL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5"/></svg>`;
  const SVG_FLASK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 3l6 0" /><path d="M10 9l4 0" /><path d="M10 3v6l-4 11a0.7 .7 0 0 0 .5 1h11a0.7 .7 0 0 0 .5 -1l-4 -11v-6" /></svg>`;
  const SVG_BRIEFCASE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" /><path d="M12 12l0 .01" /><path d="M3 13a20 20 0 0 0 18 0" /></svg>`;
  const SVG_SETTINGS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>`;
  const SVG_TRUCK_DELIVERY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M3 9l4 0" /><path d="M9 5v12" /><path d="M9 6h5l3 3v5" /><path d="M9 17h6" /><path d="M17 11h-3" /></svg>`;
  const SVG_BULB = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" /><path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" /><path d="M9.7 17l4.6 0" /></svg>`;
  const SVG_CART = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>`;
  const SVG_SHIELD_CHECK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" /><path d="M9 12l2 2l4 -4" /></svg>`;
  const SVG_TRUCK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /></svg>`;
  const SVG_CERTIFICATE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 15m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M13 17.5v4.5l2 -1.5l2 1.5v-4.5" /><path d="M10 19h-5a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v7" /><path d="M6 9h8" /><path d="M6 12h3" /></svg>`;
  const SVG_COIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-2a2 2 0 0 1 -1.8 -1" /><path d="M12 6v2m0 8v2" /></svg>`;
  const SVG_DESKTOP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z" /><path d="M7 20h10" /><path d="M9 16v4" /><path d="M15 16v4" /></svg>`;
  const SVG_FIRST_AID = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 6m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /><path d="M10 10h4v4h-4z" /><path d="M10 3v3" /><path d="M14 3v3" /><path d="M10 18v3" /><path d="M14 18v3" /><path d="M3 10h3" /><path d="M3 14h3" /><path d="M18 10h3" /><path d="M18 14h3" /></svg>`;
  const SVG_CHART_BAR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M9 8m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M15 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M4 20h14" /></svg>`;
  const SVG_USERS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>`;
  const SVG_USERS_GROUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" /><path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M17 10c.554 0 1.055 .225 1.417 .589a2 2 0 0 1 .583 1.411v2" /><path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M3 14v-2a2 2 0 0 1 .583 -1.411a2 2 0 0 1 1.417 -.589" /></svg>`;
  const SVG_SETTINGS_COG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.284c0 -.809 .443 -1.555 1.158 -1.948l6.75 -4.27a2.269 2.269 0 0 1 2.184 0l6.75 4.27" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>`;

const CONFIG_PROCESO = {
  'Dirección Estratégica (GGG)':                        { svg: SVG_FLAG,           color: '#8B1A2A' },
  'Gestión de Negocios (GNE)':                          { svg: SVG_BRIEFCASE,      color: '#4A7FA8' },
  'Gestión de Control de Producción (GCP)':              { svg: SVG_ADJUSTMENTS,    color: '#B8892A' },
  'Gestión de Producción (GPR)':                        { svg: SVG_SETTINGS_COG,   color: '#4A8F4A' },
  'Gestión de Logística de Salida (GLS)':                { svg: SVG_TRUCK_DELIVERY, color: '#6E5AA0' },
  'Gestión de diseño y desarrollo de productos (GDP)':   { svg: SVG_BULB,           color: '#B85050' },
  'Gestión de Compras (GCO)':                            { svg: SVG_CART,           color: '#3E8E8E' },
  'Gestión de Control De Calidad (GCC)':                 { svg: SVG_SHIELD_CHECK,   color: '#4A8F4A' },
  'Gestión de Logística de Entrada (GLE)':               { svg: SVG_TRUCK,          color: '#8B6F4E' },
  'Gestión de Calidad (GCA)':                            { svg: SVG_CERTIFICATE,    color: '#4A7FA8' },
  'Gestión de Finanzas (GFI)':                           { svg: SVG_COIN,           color: '#B8892A' },
  'Gestión de Mantenimiento (GMT)':                      { svg: SVG_TOOL,           color: '#8B1A2A' },
  'Gestión de TI(GTI)':                                  { svg: SVG_DESKTOP,        color: '#1E4E8C' },
  'Gestión de Seguridad y Salud en el Trabajo (GSL)':    { svg: SVG_FIRST_AID,      color: '#B85050' },
  'Gestión de Proyectos (GPY)':                          { svg: SVG_CHART_BAR,      color: '#6E5AA0' },
  'Gestión de Personal (GPE)':                           { svg: SVG_USERS,          color: '#4A8F4A' },
  'Gestión de Talento Humano (GTH)':                     { svg: SVG_USERS_GROUP,    color: '#B8892A' },
};


  function config(proceso) {
    return CONFIG_PROCESO[proceso] ?? { svg: SVG_CHART_BAR, color: '#9A9590' };
  }

  const POR_PAGINA = 9; 
  let pagina = $state(0);

  let totalPaginas = $derived(Math.ceil(procesos.length / POR_PAGINA));
  let procesosVisibles = $derived(
    procesos.slice(pagina * POR_PAGINA, pagina * POR_PAGINA + POR_PAGINA)
  );

  function anterior() {
    if (pagina > 0) pagina -= 1;
  }
  function siguiente() {
    if (pagina < totalPaginas - 1) pagina += 1;
  }
</script>
<FormSection title="Distribución por Proceso Afectado"> 
  <div class="relative">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {#each procesosVisibles as p}
        {@const c = config(p.proceso)}
        <div class="bg-[var(--bg-card)] border-[0.5px] border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-3 md:p-4">
          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="flex items-center gap-2 min-w-0">
              <span
                class="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] shrink-0 [&_svg]:w-[15px] [&_svg]:h-[15px]"
                style="background: {c.color}1A; color: {c.color};"
              >
                {@html c.svg}
              </span>
              <span class="font-[var(--font-ui)] text-[11px] font-medium uppercase text-[var(--text-tertiary)] truncate">
                {p.proceso}
              </span>
            </div>
            <span
              class="font-[var(--font-ui)] text-[13px] font-semibold shrink-0"
              style="color: {c.color};"
            >
              {p.porcentaje}%
            </span>
          </div>

          <div class="font-[var(--font-ui)] text-2xl md:text-[26px] font-semibold text-[var(--text-primary)] mb-2">
            {p.cantidad}
          </div>

          <div class="h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-[width] duration-300"
              style="width: {p.porcentaje}%; background: {c.color};"
            ></div>
          </div>
        </div>
      {/each}
    </div>

    {#if totalPaginas > 1}
      <button
        onclick={anterior}
        disabled={pagina === 0}
        class="group absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--bg-card)] border-[0.5px] border-[var(--border-subtle)] shadow-sm flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-[var(--bg-rojito)] hover:border-[var(--bg-rojito)]"
        aria-label="Página anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--text-primary)] group-hover:text-white transition-colors">
          <path d="M15 6l-6 6l6 6" />
        </svg>
      </button>

      <button
        onclick={siguiente}
        disabled={pagina === totalPaginas - 1}
        class="group absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--bg-card)] border-[0.5px] border-[var(--border-subtle)] shadow-sm flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-[var(--bg-rojito)] hover:border-[var(--bg-rojito)]"
        aria-label="Página siguiente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--text-primary)] group-hover:text-white transition-colors">
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </button>

      <div class="flex justify-center gap-1.5 mt-4">
        {#each Array(totalPaginas) as _, i}
          <button
            onclick={() => (pagina = i)}
            class="w-1.5 h-1.5 rounded-full transition-colors {i === pagina ? 'bg-[var(--accent-wine)]' : 'bg-[var(--border-subtle)]'}"
            aria-label={`Ir a página ${i + 1}`}
          ></button>
        {/each}
      </div>
    {/if}
  </div>

  {#if procesos.length === 0}
    <p class="font-[var(--font-ui)] text-sm text-[var(--text-tertiary)] text-center py-8">
      No hay procesos afectados registrados aún.
    </p>
  {/if}
</FormSection> 