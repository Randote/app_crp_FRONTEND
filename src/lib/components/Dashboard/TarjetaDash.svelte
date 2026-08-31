<script>
	let {
		totalProcesos = 0,
		totalAcciones = 0,
		abiertas = 0,
		cerradas = 0,
		vencidas = 0,
	} = $props();

	const kpis = $derived([
		{
			label: 'Total Procesos',
			valor: totalProcesos,
			accent: 'var(--text-primary)',
			iconColor: 'text-[var(--text-primary)]',
			valorColor: 'text-[var(--text-primary)]'
		},
		{
			label: 'Total de Acciones',
			valor: totalAcciones,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
			accent: 'var(--taupe-500, #a8a29e)',
			iconBg: 'bg-taupe-500/10',
			iconColor: 'text-taupe-500',
			valorColor: 'text-taupe-500'
		},
		{
			label: 'Abiertas',
			valor: abiertas,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
			accent: 'var(--open-text)',
			iconBg: 'bg-[var(--open-bg)]',
			iconColor: 'text-[var(--open-text)]',
			valorColor: 'text-[var(--open-text)]'
		},
		{
			label: 'Cerradas',
			valor: cerradas,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"/><path d="m9 10 2 2 4-4"/></svg>',
			accent: 'var(--done-text)',
			iconBg: 'bg-[var(--done-bg)]',
			iconColor: 'text-[var(--done-text)]',
			valorColor: 'text-[var(--done-text)]'
		},
		{
			label: 'Vencidas',
			valor: vencidas,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
			accent: 'var(--expired-text)',
			iconBg: 'bg-[var(--expired-bg)]',
			iconColor: 'text-[var(--expired-text)]',
			valorColor: 'text-[var(--expired-text)]'
		}
	]);
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
	{#each kpis as kpi}
		<div
			class="relative overflow-hidden bg-white border-[0.5px] border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.12)]"
		>

			<div class="flex items-start justify-between gap-2">
				<span class="font-[var(--font-ui)] text-[10.5px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
					{kpi.label}
				</span>
				<span class="{kpi.iconBg} {kpi.iconColor} w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 [&_svg]:w-[16px] [&_svg]:h-[16px]">
					{@html kpi.icon}
				</span>
			</div>

			<div class="mt-5 flex items-baseline gap-1.5">
				<span class="font-[var(--font-ui)] text-[26px] font-bold {kpi.valorColor} leading-none tracking-tight tabular-nums">
					{String(kpi.valor).padStart(2, '0')}
				</span>
			</div>
		</div>
	{/each}
</div>