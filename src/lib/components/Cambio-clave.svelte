<script>
  import { mostrarNotificacion } from '$lib/Notificacion.svelte.js';
  import Modal from '$lib/components/Modal.svelte';

  let mostrarModal = $state(false);

  let { onGuardar } = $props();

  let showPassword = $state(false);
  let guardando = $state(false);

  let passwordActual = $state('');
  let passwordNueva = $state('');
  let confirmarPasswordNueva = $state('');

  let passwordChecks = $derived.by(() => {
    const p = passwordNueva;
    const cp = confirmarPasswordNueva;
    return [
      { label: 'Mínimo 6 caracteres', ok: p.length >= 6 },
      { label: 'Una letra mayúscula', ok: /[A-Z]/.test(p) },
      { label: 'Un número', ok: /[0-9]/.test(p) },
      { label: 'Un carácter especial', ok: /[^a-zA-Z0-9]/.test(p) },
      { label: 'Las contraseñas coinciden', ok: p === cp && p.length > 0 }
    ];
  });

  let passwordValida = $derived(passwordChecks.every((c) => c.ok));

function handleSubmit(e) {
  e.preventDefault();

  if (!passwordActual) {
    mostrarNotificacion('Debe ingresar su contraseña actual.', 'error');
    return;
  }

  if (!passwordValida) {
    mostrarNotificacion('La contraseña no cumple con todos los requisitos o no coinciden.', 'error');
    return;
  }

  mostrarModal = true;
}

async function cambiarPasswordConfirmado() {
  guardando = true;
  try {
    await onGuardar({
      password_actual: passwordActual,
      password_nueva: passwordNueva,
      confirmar_password_nueva: confirmarPasswordNueva
    });
    mostrarNotificacion('Contraseña actualizada correctamente.', 'success');
    passwordActual = '';
    passwordNueva = '';
    confirmarPasswordNueva = '';
  } catch (err) {
    mostrarNotificacion(err.message || 'No se pudo cambiar la contraseña.', 'error');
  } finally {
    guardando = false;
  }
}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-5">

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">

    <div class="flex flex-col gap-1.5">
      <label class="text-[13px] font-semibold text-[var(--text-primary)]" for="password_actual">
        Contraseña actual
      </label>
      <div class="relative flex items-center">
        <input
          id="password_actual"
          class="input w-full pl-10"
          type={showPassword ? 'text' : 'password'}
          bind:value={passwordActual}
        />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[13px] font-semibold text-[var(--text-primary)]" for="password_nueva">
        Nueva contraseña
      </label>
      <div class="relative flex items-center">
        <input
          id="password_nueva"
          class="input w-full pl-10"
          class:input--success={passwordNueva && passwordValida}
          class:input--error={passwordNueva && !passwordValida}
          type={showPassword ? 'text' : 'password'}
          placeholder="Mínimo 6 caracteres"
          bind:value={passwordNueva}
        />

                <button
          type="button"
          onclick={() => (showPassword = !showPassword)}
          class="absolute right-3 cursor-pointer text-[var(--text-secondary)]"
        >
          {#if showPassword}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" x2="22" y1="2" y2="22" />
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          {/if}
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[13px] font-semibold text-[var(--text-primary)]" for="confirmar">
        Confirmar nueva contraseña
      </label>
      <div class="relative flex items-center">
        <input
          id="confirmar"
          class="input w-full pl-10 pr-10"
          class:input--success={confirmarPasswordNueva && passwordNueva === confirmarPasswordNueva}
          class:input--error={confirmarPasswordNueva && passwordNueva !== confirmarPasswordNueva}
          type={showPassword ? 'text' : 'password'}
          placeholder="Repita la nueva clave"
          bind:value={confirmarPasswordNueva}
        />
        <button
          type="button"
          onclick={() => (showPassword = !showPassword)}
          class="absolute right-3 cursor-pointer text-[var(--text-secondary)]"
        >
          {#if showPassword}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" x2="22" y1="2" y2="22" />
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          {/if}
        </button>
      </div>
    </div>

  </div>

  {#if passwordNueva || confirmarPasswordNueva}
    <div class="pass-check-grid">
      {#each passwordChecks as check}
        <div class="pass-check-item" style="color: {check.ok ? 'var(--text-success, #2e7d32)' : 'var(--text-secondary)'}; flex: 1;">
          <span class="pass-check-icon" style="background: {check.ok ? 'var(--text-success, #2e7d32)' : 'transparent'}; border-color: {check.ok ? 'var(--text-success, #2e7d32)' : 'var(--border-medium)'};">
            {#if check.ok}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            {/if}
          </span>
          {check.label}
        </div>
      {/each}
    </div>
  {/if}

  <div class="flex items-center justify-end border-t border-[var(--border-subtle)] pt-4">


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
  categoria="CAMBIO DE CONTRASEÑA"
  titulo="Confirmar cambio de contraseña"
  mensaje="¿Confirmas que deseas actualizar tu contraseña? Deberás usar la nueva clave en tu próximo inicio de sesión."
  textoConfirmar="Sí, cambiar contraseña"
  textoCancelar="Cancelar"
  variante="advertencia"
  onConfirm={cambiarPasswordConfirmado}
/>