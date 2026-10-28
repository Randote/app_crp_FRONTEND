<script>
	  	import cpIcon from '$lib/assets/crp_logo_icon.svg';
		import { base } from '$app/paths';
		import {page} from '$app/state';

  let nombreTitulo = $derived.by(() => {
    const ruta = page.url.pathname;
    if (ruta.includes('Matriz')) return 'Matriz de acciones correctivas';
    return 'Análisis de Causa y Toma de Acciones';
  });

</script>
<!-- Navbar -->
<div class="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-base)] shadow-sm">
	<div class="mx-auto flex items-center gap-3 px-6 py-3 md:gap-4 md:px-8 md:py-4">

		<div class="flex-shrink-0">
			<img src={cpIcon} alt="Logo Corimon" class="h-9 w-auto object-contain md:h-11" />
		</div>

		<div class="mx-1 hidden h-8 w-[1px] bg-[var(--border-subtle)] sm:block"></div>

<div class="flex min-w-0 flex-col justify-center">
    <h1 class="hidden md:block truncate text-base leading-none font-bold tracking-tight text-[var(--text-primary)] md:text-lg">
        {nombreTitulo}
    </h1>
</div>
		<div class="ml-auto flex flex-shrink-0 items-center gap-2 md:gap-3 justify-between">
			<a href="{base}" class="cursor-pointer rounded-full bg-[#8B1A2A] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#701420] md:px-7 md:py-2.5 md:text-base">
				Inicio Sesión
			</a>

			<a href="{base}/Manual" class="cursor-pointer rounded-full bg-[#8B1A2A] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#701420] md:px-7 md:py-2.5 md:text-base">
				Manual de llenado
			</a>
		</div>
	</div>
</div>