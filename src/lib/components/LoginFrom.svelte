<script>
import cpIcon from '$lib/assets/crp_logo_icon.svg';
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores'; 
  import FieldError from '$lib/components/FieldError.svelte';
  import Loader from '$lib/components/General/Loader.svelte';
  import { mostrarNotificacion } from '$lib/Notificacion.svelte.js';

  let username = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let loading = $state(false);

  let errors = $state({ username: '', password: '' });

  function validate() {
    errors.username = username.trim() ? '' : 'El usuario es obligatorio.';
    errors.password = password.length >= 6
      ? ''
      : 'La contraseña debe tener al menos 6 caracteres.';

    return !errors.username && !errors.password;
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!validate()) return;

    loading = true;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ usuario: username, password })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? 'Usuario o contraseña incorrectos.');
      }

      const data = await res.json();
      document.cookie = `access_token=${data.access_token}; path=/; max-age=600; samesite=lax`;
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('usuario', JSON.stringify({
        nombre: `${data.nombre} ${data.apellido}`,
        email: data.email,
        cargo: data.cargo
      }));

      const redirectTo = $page.url.searchParams.get('redirectTo');
      goto(redirectTo ? redirectTo : `${base}/Inicio`);

    } catch (err) {
      mostrarNotificacion(err.message, 'error');
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Iniciar Sesión</title>
  <link rel="icon" href={cpIcon} />
</svelte:head>

<div class="relative w-full h-full max-w-[420px] rounded-xl border border-stone-200 bg-[var(--bg-base)] p-8 overflow-hidden">
  
  <!-- Overlay de carga con efecto desenfocado -->
  {#if loading}
<div class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-sm transition-all">
    <Loader />
    <span class="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Iniciando sesión</span>
    </div>
  {/if}

  <div class="mb-6 flex flex-col items-center gap-3">
    <img src={cpIcon} alt="Logo Corimon" class="h-12 w-auto" />
    <h1 class="text-lg font-bold text-[var(--text-primary)]">Acciones Correctivas</h1>
  </div>

  <!-- Acceso sin registro: lista tipo settings -->
  <div class="mb-5 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white">
    <p class="flex items-center gap-1.5 border-b border-[var(--border-subtle)] bg-[var(--bg-input-dis)] px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-hint)]">
      <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8B1A2A]"></span>
      Acceso sin registro
    </p>

    <a
      href="{base}/Formulario"
      class="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-3 transition-colors hover:bg-[color-mix(in_srgb,var(--bg-rojito)_8%,white)]"
    >
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--bg-rojito)_10%,white)] text-[var(--bg-rojito)]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6" />
        </svg>
      </span>
      <span class="flex-1">
        <span class="block text-[13.5px] font-semibold text-[var(--text-primary)]">Realizar Registro</span>
        <span class="block text-[11.5px] text-[var(--text-hint)]">Llenar formulario sin cuenta</span>
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-[var(--text-hint)]">
        <path d="m9 18 6-6-6-6" />
      </svg>
    </a>

    <a
      href="{base}/Matriz-Acciones"
      class="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#EAF2FB]"
    >
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--bg-rojito)_10%,white)] text-[var(--bg-rojito)]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      </span>
      <span class="flex-1">
        <span class="block text-[13.5px] font-semibold text-[var(--text-primary)]">Matriz de Consulta</span>
        <span class="block text-[11.5px] text-[var(--text-hint)]">Ver acciones registradas</span>
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-[var(--text-hint)]">
        <path d="m9 18 6-6-6-6" />
      </svg>
    </a>
  </div>

  <div class="mb-5">
    <p class="h-[0.5px] w-full bg-[#E4DFD6]"></p>
  </div>

  <form onsubmit={handleLogin} class="flex flex-col gap-4 ">
    <div class="flex flex-col gap-1.5">
      <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="username">
        Usuario
      </label>
      <input
        id="username"
        class="input"
        type="text"
        placeholder="Ingresa tu usuario"
        bind:value={username}
      />
      <FieldError message={errors.username} />
    </div>

    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between">
        <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="password">
          Contraseña
        </label>
        <a href="{base}/Reset-Password" class="text-[12px] font-medium text-[#8B1A2A] hover:underline">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
      <div class="relative">
        <input
          id="password"
          class="input pr-10"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          bind:value={password}
        />
        <button
          type="button"
          onclick={() => (showPassword = !showPassword)}
          class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] cursor-pointer"
        >
          {#if showPassword}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" x2="22" y1="2" y2="22" />
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          {/if}
        </button>
      </div>
      <FieldError message={errors.password} />
    </div>

    <button
      type="submit"
      class="mt-2 w-full cursor-pointer rounded-lg bg-[#8B1A2A] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#701420] disabled:opacity-60 disabled:cursor-not-allowed"
      disabled={loading}
    >
      Entrar
    </button>
  </form>
</div>