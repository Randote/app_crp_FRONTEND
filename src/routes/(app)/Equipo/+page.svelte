<script>
import '$lib/layout.css';
import cpIcon from '$lib/assets/crp_logo_icon.svg';
import Teamcard from '$lib/components/Tarjeta-equipo.svelte'; 
  let { data } = $props();
  let esAdmin= $derived(data.user.cargo === 'Admin');
</script>

<svelte:head>
  <title>Equipo</title>
  <link rel="icon" href={cpIcon} />
</svelte:head> 

<div class="hidden md:block relative bg-white border border-[#E4DFD6] rounded-[14px] p-5 mb-6 shadow-xs overflow-hidden select-none">
  <div class="absolute top-0 inset-x-0 h-[3px] bg-[var(--bg-rojito)]"></div>
  <h2 class="flex items-center justify-between text-2xl font-bold text-[var(--text-primary)]">Gestión de equipo</h2>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {#each data.equipo as usuario (usuario.id)}
    <Teamcard {...usuario} {esAdmin}/>
  {/each}
</div>