<script>
  import { fetchAutenticado } from '$lib/fetchAutenticador.js';

  let { codificador } = $props();

  let entradas = $state([]);
  let nuevoMensaje = $state('');
  let enviando = $state(false);

  async function cargar() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bitacora/${codificador}`);
    if (res.ok) entradas = await res.json();
  }

  $effect(() => { cargar(); });

  function iniciales(nombre) {
    const p = nombre.trim().split(/\s+/);
    return p.length === 1 ? p[0].slice(0, 2).toUpperCase() : (p[0][0] + p[1][0]).toUpperCase();
  }

  async function enviarComentario() {
    if (!nuevoMensaje.trim()) return;
    enviando = true;
    const res = await fetchAutenticado(`${import.meta.env.VITE_API_URL}/api/bitacora/${codificador}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: nuevoMensaje })
    });
    if (res.ok) {
      nuevoMensaje = '';
      await cargar();
    }
    enviando = false;
  }
</script>

<div class="flex flex-col gap-4">

  <div class="flex flex-col gap-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#D5D0C7]/60 scrollbar-track-transparent">
    {#each entradas as e}
      {#if e.tipo === 'comentario'}
        <div class="flex items-start gap-2.5 bg-[#FAF8F5] border border-[#E8E4DD] rounded-lg p-3">
          <div class="w-7 h-7 rounded-full bg-[#801B2B]/10 text-[#801B2B] text-[10px] font-bold flex items-center justify-center shrink-0">
            {iniciales(e.usuario_nombre)}
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-stone-800">{e.usuario_nombre}</span>
              <span class="text-[10px] text-stone-400">{e.creado_en.split('T')[0]}</span>
            </div>
            <p class="text-xs text-stone-600 mt-0.5">{e.mensaje}</p>
          </div>
        </div>
      {:else}
        <div class="text-[11px] text-stone-400 italic px-2 flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>
          {e.mensaje} · {e.creado_en.split('T')[0]}
        </div>
      {/if}
    {/each}
  </div>

  <div class="flex items-center gap-2">
    <input
      type="text"
      bind:value={nuevoMensaje}
      onkeydown={(ev) => ev.key === 'Enter' && enviarComentario()}
      placeholder="Añadir comentario técnico..."
      class="flex-1 text-sm p-2.5 rounded-lg border border-[#D5D0C7] focus:border-[#801B2B] focus:outline-none"
    />
    <button
      onclick={enviarComentario}
      disabled={enviando}
      class="px-4 py-2.5 text-xs font-semibold text-white bg-[#801B2B] hover:bg-[#681422] rounded-lg flex items-center gap-1.5"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-icon lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
    </button>
  </div>
</div>