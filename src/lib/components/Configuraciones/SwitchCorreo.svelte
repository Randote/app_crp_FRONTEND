<script>
  import { mostrarNotificacion } from '$lib/Notificacion.svelte.js';

  let { usuarios = [], supervisores = [] } = $props();

  // Estado reactivo para la pestaña activa ('usuarios' o 'supervisores')
  let tabActiva = $state('usuarios');

  // Estados locales reactivos para los listados
  let listaUsuarios = $state(usuarios);
  let listaSupervisores = $state(supervisores);

  // Función para cambiar estatus de Usuario
  async function toggleUsuario(usuario) {
    const estadoAnterior = usuario.activo;
    usuario.activo = !usuario.activo;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${usuario.id}/estatus`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: usuario.activo }),
        credentials: 'include'
      });

      if (!res.ok) {
        usuario.activo = estadoAnterior;
        mostrarNotificacion('No se pudo actualizar el estatus del usuario.', 'error');
      } else {
        mostrarNotificacion(`Notificaciones para ${usuario.nombre} actualizadas.`, 'success');
      }
    } catch (err) {
      usuario.activo = estadoAnterior;
      console.error('Error de red:', err);
      mostrarNotificacion('Error de conexión con el servidor.', 'error');
    }
  }

  // Función para cambiar estatus de Supervisor
  async function toggleSupervisor(sup) {
    const estadoAnterior = sup.activo;
    sup.activo = !sup.activo;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/supervisores/${sup.id}/estatus`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: sup.activo }),
        credentials: 'include'
      });

      if (!res.ok) {
        sup.activo = estadoAnterior;
        mostrarNotificacion('No se pudo actualizar el estatus del supervisor.', 'error');
      } else {
        mostrarNotificacion(`Estatus actualizado para el proceso ${sup.nombre_proceso}.`, 'success');
      }
    } catch (err) {
      sup.activo = estadoAnterior;
      console.error('Error de red:', err);
      mostrarNotificacion('Error de conexión con el servidor.', 'error');
    }
  }
</script>

<div class="bg-white border border-[#E4DFD6] rounded-xl shadow-sm p-6 space-y-6">
  
  <!-- Cabecera y Toggle / Pestañas -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E4DFD6] pb-4">
    <div>
      <h2 class="font-sans font-bold text-lg text-[#2A2720] m-0">Gestión de Alertas y Correos</h2>
      <p class="text-xs text-[#6B6560] m-0">Administra qué personal y procesos reciben notificaciones automáticas.</p>
    </div>

    <!-- Botones de Toggle -->
    <div class="flex bg-[#FAF8F4] p-1 rounded-lg border border-[#E4DFD6] self-start">
      <button
        type="button"
        onclick={() => tabActiva = 'usuarios'}
        class={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
          tabActiva === 'usuarios' 
            ? 'bg-[#8B1A2A] text-white shadow-xs' 
            : 'text-[#6B6560] hover:text-[#2A2720]'
        }`}
      >
        Usuarios ({listaUsuarios.length})
      </button>
      <button
        type="button"
        onclick={() => tabActiva = 'supervisores'}
        class={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
          tabActiva === 'supervisores' 
            ? 'bg-[#8B1A2A] text-white shadow-xs' 
            : 'text-[#6B6560] hover:text-[#2A2720]'
        }`}
      >
        Supervisores / Procesos ({listaSupervisores.length})
      </button>
    </div>
  </div>

  <!-- Contenido Condicional según la pestaña activa -->
  {#if tabActiva === 'usuarios'}
    <!-- TABLA DE USUARIOS -->
    <div class="overflow-x-auto animate-fadeIn">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-[#E4DFD6] text-[11px] font-bold text-[#9A9590] uppercase">
            <th class="py-3 px-4">Nombre y Apellido</th>
            <th class="py-3 px-4">Correo Electrónico</th>
            <th class="py-3 px-4">Cargo</th>
            <th class="py-3 px-4 text-center">Estatus Correos</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E4DFD6]">
          {#each listaUsuarios as u (u.id)}
            <tr class="hover:bg-[#FAF8F4] transition-colors">
              <td class="py-3 px-4 text-sm font-medium text-[#2A2720]">{u.nombre} {u.apellido}</td>
              <td class="py-3 px-4 text-sm text-[#6B6560]">{u.email}</td>
              <td class="py-3 px-4 text-xs">
                <span class="bg-[#8B1A2A]/10 text-[#8B1A2A] px-2.5 py-1 rounded-full font-semibold">{u.cargo}</span>
              </td>
              <td class="py-3 px-4 text-center">
                <button
                  type="button"
                  onclick={() => toggleUsuario(u)}
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none {Boolean(u.activo) ? 'bg-[#8B1A2A]' : 'bg-stone-300'}"
                  role="switch"
                  aria-checked={Boolean(u.activo)}
                >
                  <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out {Boolean(u.activo) ? 'translate-x-5' : 'translate-x-0'}"></span>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

  {:else}
    <!-- TABLA DE SUPERVISORES -->
    <div class="overflow-x-auto animate-fadeIn">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-[#E4DFD6] text-[11px] font-bold text-[#9A9590] uppercase">
            <th class="py-3 px-4">Proceso</th>
            <th class="py-3 px-4">Supervisor</th>
            <th class="py-3 px-4">Correo Electrónico</th>
            <th class="py-3 px-4 text-center">Estatus Correos</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E4DFD6]">
          {#each listaSupervisores as s (s.id)}
            <tr class="hover:bg-[#FAF8F4] transition-colors">
              <td class="py-3 px-4 text-sm font-medium text-[#2A2720]">{s.nombre_proceso}</td>
              <td class="py-3 px-4 text-sm text-[#6B6560]">{s.supervisor_nombre}</td>
              <td class="py-3 px-4 text-sm text-[#6B6560]">{s.supervisor_email}</td>
              <td class="py-3 px-4 text-center">
                <button
                  type="button"
                  onclick={() => toggleSupervisor(s)}
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none {Boolean(s.activo) ? 'bg-[#8B1A2A]' : 'bg-stone-300'}"
                  role="switch"
                  aria-checked={Boolean(s.activo)}
                >
                  <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out {Boolean(s.activo) ? 'translate-x-5' : 'translate-x-0'}"></span>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

</div>