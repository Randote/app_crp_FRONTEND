<script>
  import { base } from '$app/paths';
  import { mostrarNotificacion } from '$lib/Notificacion.svelte.js';
  import { invalidateAll } from '$app/navigation';
  import Modal from '$lib/components/Modal.svelte';
  

  let { usuario, onGuardar, modoAdmin = false } = $props();  
  let mostrarModal = $state(false);

  let form = $state({
    nombre: '',
    apellido: '',
    email: '',
    cargo: '' ,
    ficha:'' 
  });

      const cargos = [
        { value: 'Admin', label: 'Administrador' },
        { value: 'supervisor', label: 'Supervisor' },
    ];

  function primeraPalabra(texto) {
    return (texto ?? '').trim().split(/\s+/)[0] ?? '';
  }

  function normalizar(texto) {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  let usuarioPreview = $derived.by(() => {
    const nombre = primeraPalabra(form.nombre);
    const apellido = primeraPalabra(form.apellido);
    if (!nombre || !apellido) return usuario.usuario;
    return `${normalizar(nombre)}_${normalizar(apellido)}`;
  });

  $effect(() => {
    form.nombre = usuario.nombre;
    form.apellido = usuario.apellido;
    form.email = usuario.email;
    form.cargo = usuario.cargo;
    form.ficha = usuario.ficha;
  });

  function iniciales(nombre, apellido) {
    if (!nombre) return '—';
    const n = nombre.trim()[0] ?? '';
    const a = apellido?.trim()[0] ?? '';
    return (n + a).toUpperCase();
  }

  let guardando = $state(false);

function handleSubmit(e) {
    e.preventDefault();
    mostrarModal = true;
  }


async function confirmarGuardar() {
    guardando = true;

    try {
      const payload = modoAdmin
        ? { nombre: form.nombre, apellido: form.apellido, email: form.email, cargo: form.cargo, ficha: form.ficha }
        : { nombre: form.nombre, apellido: form.apellido, email: form.email, };

      await onGuardar(payload);
      mostrarNotificacion('Perfil actualizado correctamente.', 'success');
      await invalidateAll();
    } catch (err) {
      mostrarNotificacion(err.message || 'No se pudo guardar el perfil.', 'error');
    } finally {
      guardando = false;
    }
  }
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

    <div class="flex flex-col gap-1.5">
      <label class="text-[13px] font-semibold text-[var(--text-primary)]" for="nombre">Nombre</label>
      <div class="relative flex items-center">
        <input id="nombre" class="input w-full pl-10" type="text" bind:value={form.nombre} />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[13px] font-semibold text-[var(--text-primary)]" for="apellido">Apellido</label>
      <div class="relative flex items-center">
        <input id="apellido" class="input w-full pl-10" type="text" bind:value={form.apellido} />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[13px] font-semibold text-[var(--text-primary)]" for="email">Correo electrónico</label>
      <div class="relative flex items-center">
        <input id="email" class="input w-full pl-10" type="email" bind:value={form.email} />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[13px] font-semibold text-[var(--text-primary)]" for="ficha">Ficha de empleado</label>
      <div class="relative flex items-center">
          {#if modoAdmin}
          <input id="ficha" class="input w-full pl-10" type="text"  bind:value={form.ficha}  />
        {:else}
        <input id="ficha" class="input w-full cursor-not-allowed pl-10" type="text" value={usuario.ficha} disabled />
        {/if}
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[13px] font-semibold text-[var(--text-primary)]" for="cargo">Cargo</label>
      <div class="relative flex items-center">
        {#if modoAdmin}
                        <select class="select" bind:value={form.cargo}>
                  <option value="">Selecciona...</option>
                  {#each cargos as c}
                      <option value={c.value}>{c.label}</option>
                  {/each}
              </select>
  {:else}
          <input id="cargo" class="input w-full cursor-not-allowed pl-10" type="text" value={usuario.cargo} disabled />
        {/if}
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[13px] font-semibold text-[var(--text-primary)]" for="usuario_login">Usuario de acceso</label>
      <div class="relative flex items-center">
        <input id="usuario_login" class="input w-full cursor-not-allowed pl-10" type="text" value={usuarioPreview} disabled />
      </div>
      <p class="text-[11px] text-[var(--text-hint)]">Se genera automáticamente a partir de tu nombre y apellido.</p>
    </div>

  </div>

  <div class="mt-2 flex items-center justify-end border-t border-[var(--border-subtle)] pt-4">
    <button
      type="submit"
      disabled={guardando}
      class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--bg-rojito)] px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
        <path d="M17 21v-8H7v8" />
        <path d="M7 3v5h8" />
      </svg>
      {guardando ? 'Guardando…' : 'Guardar cambios'}
    </button>
  </div>
</form>

<Modal
  bind:open={mostrarModal}
  categoria="EDICIÓN DE USUARIO"
  titulo="Confirmar cambios"
  mensaje="¿Confirmas que deseas guardar los cambios su perfil?"
  textoConfirmar="Sí, guardar"
  textoCancelar="Cancelar"
  onConfirm={confirmarGuardar}
  variante="advertencia"
/>

