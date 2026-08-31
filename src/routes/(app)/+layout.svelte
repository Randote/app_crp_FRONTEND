<script>
  import '$lib/layout.css';
  import '../../css/input.css';
  import '../../css/ishikawa.css';
  import '../../css/matrizacciones.css';
  import Navbar from '$lib/components/NavBar.svelte';
  
  let { data, children } = $props();
</script>

<div class="flex h-screen w-full bg-[#F8F5F0] overflow-hidden">

  <Navbar usuario={data.user} />
  <main class="flex-1 relative p-6 overflow-y-auto overflow-x-hidden">
    {@render children()}
  </main>

</div>
