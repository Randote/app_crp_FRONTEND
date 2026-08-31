<script>
  import '$lib/layout.css';
    import cpIcon from '$lib/assets/crp_logo_icon.svg';
  import PerfilEditarTabs from '$lib/components/Sidebar-perfil.svelte';
  import { fetchAutenticado } from '$lib/fetchAutenticador.js';

  let { data } = $props();


  async function guardarPerfil(form) {
    const res = await fetchAutenticado(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      const error = await res.json().catch(() => null);
      throw new Error(error?.detail || 'No se pudo actualizar tu perfil.');
    }
  }

  async function cambiarPassword(form) {
    const res = await fetchAutenticado(`${import.meta.env.VITE_API_URL}/api/auth/me/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      const error = await res.json().catch(() => null);
      throw new Error(error?.detail || 'No se pudo cambiar la contraseña.');
    }
  }
</script>

<svelte:head>
  <title>Edición</title>
  <link rel="icon" href={cpIcon} />
</svelte:head>

<div class="hidden md:block relative bg-white border border-[#E4DFD6] rounded-[14px] p-5 mb-6 shadow-xs overflow-hidden select-none">
  <div class="absolute top-0 inset-x-0 h-[3px] bg-[var(--bg-rojito)]"></div>
  <h2 class="flex items-center justify-between text-2xl font-bold text-[var(--text-primary)]">Edición de Usuario</h2>
</div>

<PerfilEditarTabs
  usuario={data.user}
  onGuardarPerfil={guardarPerfil}
  onCambiarPassword={cambiarPassword}
/>