<script>
  import { onMount } from 'svelte';

  let {
      value = $bindable(''),
      options = [],
      placeholder = 'Buscar…',
      error = false
  } = $props();

  let query = $state(value);
  let abierto = $state(false);
  let contenedor;

  let posicion = $state({ top: 0, left: 0, width: 0 });

  $effect(() => {
      query = value;
  });

  let filtradas = $derived(
      query.trim() === ''
      ? options
      : options.filter(o => o.toLowerCase().includes(query.trim().toLowerCase()))
  );

  function portal(node) {
      document.body.appendChild(node);
      return {
          destroy() {
              if (node.parentNode) node.parentNode.removeChild(node);
          }
      };
  }

  function actualizarPosicion() {
      if (!contenedor) return;
      const r = contenedor.getBoundingClientRect();
      posicion = { top: r.bottom + 4, left: r.left, width: r.width };
  }

  function abrir() {
      abierto = true;
      actualizarPosicion();
  }

  function seleccionar(op) {
      value = op;
      query = op;
      abierto = false;
  }

  function manejarClickFuera(e) {
      if (contenedor && !contenedor.contains(e.target) && !e.target.closest('.combobox-portal')) {
          abierto = false;
          if (query !== value) query = value;
      }
  }

  function manejarKeydown(e) {
      if (e.key === 'Escape') {
          abierto = false;
          query = value;
      }
  }

  function manejarWheel(e) {
      const el = e.currentTarget;
      const atTop = el.scrollTop === 0 && e.deltaY < 0;
      const atBottom = el.scrollHeight - el.scrollTop === el.clientHeight && e.deltaY > 0;
      
      if (atTop || atBottom) {
          e.preventDefault();
      }
      e.stopPropagation();
  }


  onMount(() => {
      const handleScroll = () => {
          if (abierto) actualizarPosicion();
      };
      window.addEventListener('scroll', handleScroll, true);
      return () => {
          window.removeEventListener('scroll', handleScroll, true);
      };
  });
</script>

<svelte:window
    onclick={manejarClickFuera}
    onresize={actualizarPosicion}
/>

<div class="relative" bind:this={contenedor}>
<input
    type="text"
    class="input"
    class:input--error={error}
    {placeholder}
    bind:value={query}
    onfocus={abrir}
    oninput={abrir}
    onkeydown={manejarKeydown}
    autocomplete="off"
/>

{#if abierto && filtradas.length > 0}
    <ul
        use:portal
        onwheel={manejarWheel}
        class="combobox-portal fixed z-[9999] max-h-56 overflow-y-auto rounded-lg border border-[var(--border-subtle)] bg-white shadow-lg scrollbar-thin"
        style="top: {posicion.top}px; left: {posicion.left}px; width: {posicion.width}px;"
    >
    {#each filtradas as op}
        <li>
        <button
            type="button"
            class="w-full px-3 py-2 text-left text-[13px] hover:bg-[var(--bg-rojito)] hover:text-white"
            onclick={() => seleccionar(op)}
        >
            {op}
        </button>
        </li>
    {/each}
    </ul>
{/if}

{#if abierto && query.trim() !== '' && filtradas.length === 0}
    <div
        use:portal
        onwheel={manejarWheel}
        class="combobox-portal fixed z-[9999] rounded-lg border border-[var(--border-subtle)] bg-white px-3 py-2 text-[13px] text-[var(--text-hint)] shadow-lg"
        style="top: {posicion.top}px; left: {posicion.left}px; width: {posicion.width}px;"
    >
    Sin coincidencias
    </div>
{/if}
</div>