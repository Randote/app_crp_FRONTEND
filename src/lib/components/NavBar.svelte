<script>
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import crp from '$lib/assets/crp_logo_icon.svg';

  let { contadores = {}, usuario = { nombre: 'Usuario', cargo: '', apellido: '' } } = $props();
  let colapsadoEscritorio = $state(false);
  let menuMovilAbierto = $state(false);    
  let menuUsuarioAbierto = $state(false);   

  function toggleSidebarEscritorio() {
    colapsadoEscritorio = !colapsadoEscritorio;
  }

  function toggleMenuMovil() {
    menuMovilAbierto = !menuMovilAbierto;
  }

  function toggleMenuUsuario() {
    menuUsuarioAbierto = !menuUsuarioAbierto;
  }

  const NAV_BASE = [
    {
      seccion: 'PRINCIPAL',
      items: [
        { label: 'Dashboard', href: `${base}/Inicio`, icon: 'dashboard' },
        { label: 'Matriz', href: `${base}/Matriz`, icon: 'list' },
        { label: 'Formulario', href: `${base}/Form`, icon: 'form' },
      ]
    },
    {
      seccion: 'GESTIÓN',
      items: [
        { label: 'Equipo', href: `${base}/Equipo`, icon: 'users' },
        { label: 'Reportes', href: `${base}/Reportes`, icon: 'chart' }
      ]
    },
     {
      seccion: 'SISTEMA',
       items: [
        { label: 'Configuración', href: `${base}/Configuracion`, icon: 'settings' }
      ]
    }
  ];

  // Filtrado reactivo protegido con encadenamiento opcional para evitar errores en SSR
  let NAV = $derived(
    NAV_BASE.map(grupo => {
      if (grupo.seccion === 'SISTEMA') {
        return {
          ...grupo,
          items: (usuario?.cargo === 'Admin') ? grupo.items : []
        };
      }
      return grupo;
    }).filter(grupo => grupo.items.length > 0)
  );

  function esActivo(href) {
    const ruta = $page.url.pathname;
    return ruta === href || ruta.startsWith(href + '/');
  }

  // Estado de conexión nativo
  let enLinea = $state(true);

  $effect(() => {
    if (typeof window !== 'undefined') {
      enLinea = navigator.onLine;
      const marcarOnline = () => (enLinea = true);
      const marcarOffline = () => (enLinea = false);
      window.addEventListener('online', marcarOnline);
      window.addEventListener('offline', marcarOffline);
      return () => {
        window.removeEventListener('online', marcarOnline);
        window.removeEventListener('offline', marcarOffline);
      };
    }
  });

  function iniciales(nombre) {
    return (nombre || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');
  }

  async function cerrarSesion() {
      try {
          await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
              method: 'POST',
              credentials: 'include'
          });
      } catch (err) {
          console.error('Error al cerrar sesión:', err);
      } finally {
          document.cookie = 'access_token=; path=/; max-age=0';
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          localStorage.removeItem('refresh_token');
          menuUsuarioAbierto = false;
          goto(`${base}/`);
      }
  }
</script>

<header class="flex md:hidden items-center gap-4 bg-white border-b border-[#E4DFD6] px-4 h-14 w-full box-border flex-shrink-0">
  <button type="button" class="bg-none border-none text-[#2A2720] cursor-pointer p-1 flex items-center" onclick={toggleMenuMovil} aria-label="Abrir menú">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  </button>
  <span class="font-sans font-semibold text-base text-[#2A2720]">Corimon Pinturas</span>
</header>

{#if menuMovilAbierto}
  <button type="button" class="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-40 md:hidden border-none w-screen h-screen" onclick={() => menuMovilAbierto = false} aria-label="Cerrar menú"></button>
{/if}

{#if menuUsuarioAbierto}
  <button type="button" class="fixed inset-0 z-40 bg-transparent border-none w-screen h-screen cursor-default" onclick={() => menuUsuarioAbierto = false} aria-label="Cerrar menú de usuario"></button>
{/if}

<aside 
  class="fixed top-0 bottom-0 left-0 z-50 bg-[#F0EDE6] border-r border-[#E4DFD6] flex flex-col flex-shrink-0 transition-all duration-200 ease-in-out
  md:sticky md:top-0 md:h-screen md:translate-x-0
  {menuMovilAbierto ? 'translate-x-0 w-[260px]' : '-translate-x-full w-[260px]'} 
  {colapsadoEscritorio ? 'md:w-[68px]' : 'md:w-[260px]'}"
>
  <div class="flex items-center justify-between px-4 pt-6 pb-4 h-[70px] box-border {colapsadoEscritorio ? 'md:justify-center md:px-0' : ''}">
    <div class="flex items-center gap-3 overflow-hidden {colapsadoEscritorio ? 'md:justify-center md:w-full' : ''}">
      {#if crp}
        <img src={crp} alt="Logo Corimon" class="h-8 w-auto object-contain transition-all {colapsadoEscritorio ? 'md:max-w-[36px]' : ''}" />
      {:else}
        <div class="bg-[#8B1A2A] text-white text-[11px] font-bold px-2 py-1.5 rounded flex-shrink-0">CAC</div>
      {/if}
      
      <div class="transition-all duration-150 {colapsadoEscritorio ? 'md:hidden' : ''}">
        <p class="font-sans font-bold text-sm text-[#8B1A2A] m-0 leading-tight">Corimon Pinturas</p>
        <p class="font-sans text-[11px] text-[#6B6560] m-0">Acciones Correctivas</p>
      </div>
    </div>
  </div>

  <button 
    type="button" 
    onclick={toggleSidebarEscritorio} 
    aria-label="Alternar menú"
    class="hidden md:flex items-center justify-center bg-white border border-[#D4CFC6] text-[#6B6560] rounded-full w-6 h-6 cursor-pointer shadow-sm transition-all duration-200 hover:text-[#8B1A2A] hover:border-[#8B1A2A] absolute -right-3 top-1/2 -translate-y-1/2 z-50"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200 {colapsadoEscritorio ? 'rotate-180' : ''}">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  </button>

  <nav class="flex-grow py-4 overflow-y-auto overflow-x-hidden">
    {#each NAV as grupo}
      <div class="mb-5">
        <p class="font-sans text-[10px] font-bold uppercase tracking-wider text-[#9A9590] px-6 mb-1.5 transition-opacity duration-100 {colapsadoEscritorio ? 'md:hidden' : ''}">{grupo.seccion}</p>
        <ul class="list-none p-0 m-0">
          {#each grupo.items as item}
            <li>
              <a
                href={item.href}
                class="flex items-center gap-3 px-6 py-2.5 text-[#6B6560] font-sans text-[13px] font-medium no-underline transition-all duration-150 relative hover:bg-[#8B7355]/5 hover:text-[#2A2720]
                {esActivo(item.href) ? 'bg-[#8B1A2A]/5 text-[#8B1A2A] font-semibold before:content-[\'\'] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#8B1A2A]' : ''}
                {colapsadoEscritorio ? 'md:py-3 md:px-0 md:justify-center md:gap-0' : ''}"
                title={colapsadoEscritorio ? item.label : ''}
                onclick={() => { menuMovilAbierto = false; }}
              >
                <span class="flex items-center flex-shrink-0 {colapsadoEscritorio ? 'md:mx-auto' : ''}">{@render icono(item.icon)}</span>
                
                <span class="flex-grow transition-all duration-150 {colapsadoEscritorio ? 'md:hidden' : ''}">{item.label}</span>
                {#if contadores[item.label] != null}
                  <span class="bg-[#8B1A2A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full {colapsadoEscritorio ? 'md:hidden' : ''}">{contadores[item.label]}</span>
                {/if}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </nav>

  <div class="p-4 border-t border-[#E4DFD6] flex items-center gap-3 relative {colapsadoEscritorio ? 'md:justify-center md:py-4 md:px-0' : ''}">
    
{#if menuUsuarioAbierto}
      <div 
        class="absolute bottom-16 left-4 right-4 bg-white border border-[#E4DFD6] rounded-xl shadow-xl z-50 py-1.5 flex flex-col font-sans transition-all duration-150
        {colapsadoEscritorio ? 'md:left-[60px] md:bottom-2 md:right-auto md:w-[210px] md:ml-2' : ''}"
      >
        <a href="{base}/Perfil-usuario" onclick={() => menuUsuarioAbierto = false} class="px-4 py-2 text-[13px] text-[#2A2720] hover:bg-[#F0EDE6]/60 no-underline transition-colors text-left font-medium">
          Perfil
        </a>

        {#if usuario?.cargo === 'Admin'}
          <a href="{base}/Registro-Usuario" onclick={() => menuUsuarioAbierto = false} class="px-4 py-2 text-[13px] text-[#2A2720] hover:bg-[#F0EDE6]/60 no-underline transition-colors text-left font-medium">
            Registro de Usuario
          </a>
        {/if}
        
        <div class="border-t border-[#E4DFD6] my-1"></div>
        
        <button type="button" onclick={cerrarSesion} class="px-4 py-2 text-[13px] text-red-600 font-semibold hover:bg-red-50 border-none bg-transparent text-left cursor-pointer transition-colors w-full">
          Cerrar sesión
        </button>
      </div>
    {/if}

    <div class="relative flex-shrink-0">
      {#if usuario.avatarUrl}
        <img src={usuario.avatarUrl} alt={usuario.nombre} class="w-9 h-9 rounded-full object-cover border border-[#D4CFC6]" />
      {:else}
        <div class="bg-[#8B7355] text-white flex items-center justify-center font-sans text-xs font-semibold w-9 h-9 rounded-full">{iniciales(usuario.nombre)}</div>
      {/if}
      <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#F0EDE6] {enLinea ? 'bg-green-500' : 'bg-gray-400'}"></span>
    </div>

    <div class="overflow-hidden font-sans flex-grow transition-all duration-150 {colapsadoEscritorio ? 'md:hidden' : ''}">
      <p class="text-[13px] font-semibold text-[#2A2720] m-0 whitespace-nowrap overflow-hidden text-ellipsis">{usuario.nombre} {usuario.apellido}</p>
      <p class="inline-flex items-center justify-center text-[11px] text-white bg-[#8B1A2A] rounded-full px-3 py-1 whitespace-nowrap">
        {usuario.cargo}
      </p>
    </div>

    <button 
      type="button" 
      onclick={toggleMenuUsuario} 
      class="bg-none border-none text-[#9A9590] cursor-pointer p-1 flex items-center transition-colors hover:text-[#2A2720] rounded-lg {colapsadoEscritorio ? 'md:hidden' : ''} {menuUsuarioAbierto ? 'text-[#2A2720] bg-[#8B7355]/10' : ''}" 
      title="Más opciones"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" />
      </svg>
    </button>
  </div>
</aside>

{#snippet icono(nombre)}
  {#if nombre === 'dashboard'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
  {:else if nombre === 'list'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
  {:else if nombre === 'eye'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  {:else if nombre === 'users'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  {:else if nombre === 'chart'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
  {:else if nombre === 'settings'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
    {:else if nombre === 'form'}
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6"/><path d="M4 2h10"/><rect x="4" y="18" width="16" height="4" rx="1"/><rect x="4" y="6" width="16" height="4" rx="1"/></svg>
  {/if}
{/snippet}