
<script>
let {
    value = $bindable(''),
    options = [],
    placeholder = 'Buscar…',
    error = false
} = $props();

let query = $state(value);
let abierto = $state(false);
let contenedor;

$effect(() => {
    query = value;
});

let filtradas = $derived(
    query.trim() === ''
    ? options
    : options.filter(o => o.toLowerCase().includes(query.trim().toLowerCase()))
);

function seleccionar(op) {
    value = op;
    query = op;
    abierto = false;
}

function manejarClickFuera(e) {
    if (contenedor && !contenedor.contains(e.target)) {
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
</script>

<svelte:window onclick={manejarClickFuera} />

<div class="relative" bind:this={contenedor}>
<input
    type="text"
    class="input"
    class:input--error={error}
    {placeholder}
    bind:value={query}
    onfocus={() => (abierto = true)}
    oninput={() => (abierto = true)}
    onkeydown={manejarKeydown}
    autocomplete="off"
/>

{#if abierto && filtradas.length > 0}
    <ul class="absolute z-30 mt-1 max-h-56 w-full scrollbar-thin overflow-y-auto rounded-lg border border-[var(--border-subtle)] bg-white shadow-lg">
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
    <div class="absolute z-30 mt-1 w-full rounded-lg border border-[var(--border-subtle)] bg-white px-3 py-2 text-[13px] text-[var(--text-hint)] shadow-lg">
    Sin coincidencias
    </div>
{/if}
</div>