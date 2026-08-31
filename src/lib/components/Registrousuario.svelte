<script>
    import { base } from '$app/paths';
    import Modal from '$lib/components/Modal.svelte';
    import { mostrarNotificacion } from '$lib/Notificacion.svelte.js';
    import { fetchAutenticado } from '$lib/fetchAutenticador.js';

    let showPassword = $state(false);
    let mostrarModal = $state(false);

    let {
        onSuccess = () => {}
    } = $props();

    function formInicial() {
        return {
            numeroFicha: '',
            cargo: '',
            nombre: '',
            apellido: '',
            correo: '',
            password: '',
            confirmarPassword: '',
            permisos: {
                noConformidades: false,
                causaRaiz: false,
                planesAccion: false,
                efectividad: false
            }
        };
    }

    let form = $state(formInicial());

    let passwordChecks = $derived.by(() => {
        const p = form.password;
        const cp = form.confirmarPassword;
        return [
            { label: 'Mínimo 6 caracteres', ok: p.length >= 6 },
            { label: 'Una letra mayúscula', ok: /[A-Z]/.test(p) },
            { label: 'Un número', ok: /[0-9]/.test(p) },
            { label: 'Un carácter especial', ok: /[^a-zA-Z0-9]/.test(p) },
            { label: 'Las contraseñas coinciden', ok: p === cp && p.length > 0 }
        ];
    });

    let passwordValida = $derived(passwordChecks.every((c) => c.ok));

    let usuarioRed = $derived(
        form.nombre && form.apellido
            ? `${form.nombre.toLowerCase().trim()}_${form.apellido.toLowerCase().trim()}`
            : ''
    );

    let loading = $state(false);

    const cargos = [
        { value: 'Admin', label: 'Administrador' },
        { value: 'supervisor', label: 'Supervisor' },
    ];



function handleSubmit(e) {
    e.preventDefault();
    console.log('handleSubmit ejecutado');
    if (!passwordValida) {
        console.log('passwordValida es false');
        mostrarNotificacion('La contraseña no cumple con todos los requisitos o no coinciden.', 'error');
        return;
    }
    console.log('abriendo modal');
    mostrarModal = true;
}


async function confirmarRegistro() {
        loading = true;
        try {
            const res = await fetchAutenticado(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ficha: form.numeroFicha,
                    cargo: form.cargo,
                    nombre: form.nombre,
                    apellido: form.apellido,
                    usuario: usuarioRed,
                    email: form.correo,
                    password: form.password,
                    permisos: Object.entries(form.permisos)
                        .filter(([, activo]) => activo)
                        .map(([clave]) => clave)
                })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.detail ?? 'Error al registrar');
            }

            mostrarNotificacion('Usuario registrado exitosamente.', 'success');
            onSuccess(await res.json());
            form = formInicial();
        } catch (err) {
            mostrarNotificacion(err.message, 'error');
        } finally {
            loading = false;
        }
    }
</script>


<div class="problema-card">
    <form onsubmit={handleSubmit} style="display: flex; flex-direction: column; flex: 1; height: 100%;">
        <div class="form-section" style="margin-bottom: 20px;">
            <div class="form-grid-2">
                <div>
                    <label class="text-[14px] font-semibold text-[var(--text-secondary)]">Número de ficha</label>
                    <input class="input" bind:value={form.numeroFicha} placeholder="Ej: 3352" required />
                </div>
                <div>
                    <label class="text-[14px] font-semibold text-[var(--text-secondary)]">Cargo</label>
                    <select class="select" bind:value={form.cargo} required>
                        <option value="">Selecciona...</option>
                        {#each cargos as c}
                            <option value={c.value}>{c.label}</option>
                        {/each}
                    </select>
                </div>

                <div>
                    <label class="text-[14px] font-semibold text-[var(--text-secondary)]">Nombre</label>
                    <input class="input" bind:value={form.nombre} required />
                </div>
                <div>
                    <label class="text-[14px] font-semibold text-[var(--text-secondary)]">Apellido</label>
                    <input class="input" bind:value={form.apellido} required />
                </div>
            </div>
        </div>

        {#if usuarioRed}
            <div class="form-section" style="margin-bottom: 20px;">
                <label class="text-[14px] font-semibold text-[var(--text-secondary)]" style="display: block; margin-bottom: 6px;">
                    Usuario de red (generado automáticamente)
                </label>
                <div style="display:flex; align-items:center; justify-content:space-between;
                    background:var(--bg-input-dis); border:0.5px solid var(--border-subtle);
                    border-radius:var(--radius-md); padding:9px 12px;">
                    <span style="color:var(--bg-rojito); font-family:var(--font-code); font-size:13px;">
                        {usuarioRed}
                    </span>
                    <span style="font-size:10px; color:var(--text-hint); background:var(--bg-card);
                        padding:2px 8px; border-radius:999px; border:0.5px solid var(--border-subtle);">
                        auto-generado
                    </span>
                </div>
            </div>
        {/if}

        <div class="form-section" style="margin-bottom: 20px;">
            <div class="form-grid-2">
                <div class="form-full" style="grid-column: 1 / -1; margin-bottom: 12px;">
                    <label class="text-[14px] font-semibold text-[var(--text-secondary)]">Correo corporativo</label>
                    <div class="input-icon-wrap">
                        <span class="input-icon">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
                        </span>
                        <input class="input" type="email" bind:value={form.correo}
                            placeholder="usuario@corimon.com.ve" required />
                    </div>
                </div>

                <div>
                    <label class="text-[14px] font-semibold text-[var(--text-secondary)]">Contraseña</label>
                    <div class="input-icon-wrap">
                        <span class="input-icon">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
                        </span>
                        <input
                            class="input"
                            class:input--success={form.password && passwordValida}
                            class:input--error={form.password && !passwordValida}
                            type={showPassword ? 'text' : 'password'}
                            bind:value={form.password}
                            placeholder="Mínimo 6 caracteres"
                            required
                        />

                    </div>
                </div>

                <div>
                    <label class="text-[14px] font-semibold text-[var(--text-secondary)]">Confirmar Contraseña</label>
                    <div class="input-icon-wrap">
                        <span class="input-icon">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
                        </span>
                        <input
                            class="input"
                            class:input--success={form.confirmarPassword && form.password === form.confirmarPassword}
                            class:input--error={form.confirmarPassword && form.password !== form.confirmarPassword}
                            type={showPassword ? 'text' : 'password'}
                            bind:value={form.confirmarPassword}
                            placeholder="Repita la contraseña"
                            required
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
                </div>

                {#if form.password || form.confirmarPassword}
                    <div class="form-full" style="grid-column: 1 / -1; margin-top: 4px;">
                        <div class="pass-check-grid">
                            {#each passwordChecks as check}
                                <div class="pass-check-item" style="color: {check.ok ? 'var(--text-success, #2e7d32)' : 'var(--text-secondary)'}; flex: 1;">
                                    <span class="pass-check-icon" style="background: {check.ok ? 'var(--text-success, #2e7d32)' : 'transparent'}; border-color: {check.ok ? 'var(--text-success, #2e7d32)' : 'var(--border-medium)'};">
                                        {#if check.ok}
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                        {/if}
                                    </span>
                                    {check.label}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        </div>

        <div class="form-section shadow-sm" style="background:var(--bg-input-dis); border-radius:var(--radius-lg);
            padding:20px; border:0.5px solid var(--border-subtle); margin-bottom: 20px;">
            <p style="font-size:11px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase;
                color:var(--text-hint); margin:0 0 16px;">Permisos requeridos de planta</p>
            
            <div class="permisos-grid">
                <label class="permiso-card" class:active={form.permisos.noConformidades}>
                    <input type="checkbox" bind:checked={form.permisos.noConformidades} class="hidden-checkbox" />
                    <div class="custom-checkbox">
                        {#if form.permisos.noConformidades}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        {/if}
                    </div>
                    <div class="permiso-text-wrapper">
                        <span class="permiso-titulo">Registrar No Conformidades</span>
                        <span class="permiso-desc">Permite abrir nuevos reportes CAPA y hallazgos en planta.</span>
                    </div>
                </label>

                <label class="permiso-card" class:active={form.permisos.causaRaiz}>
                    <input type="checkbox" bind:checked={form.permisos.causaRaiz} class="hidden-checkbox" />
                    <div class="custom-checkbox">
                        {#if form.permisos.causaRaiz}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        {/if}
                    </div>
                    <div class="permiso-text-wrapper">
                        <span class="permiso-titulo">Análisis de Causa Raíz</span>
                        <span class="permiso-desc">Permite configurar diagramas de Ishikawa y redactar los 5 Porqués.</span>
                    </div>
                </label>

                <label class="permiso-card" class:active={form.permisos.planesAccion}>
                    <input type="checkbox" bind:checked={form.permisos.planesAccion} class="hidden-checkbox" />
                    <div class="custom-checkbox">
                        {#if form.permisos.planesAccion}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        {/if}
                    </div>
                    <div class="permiso-text-wrapper">
                        <span class="permiso-titulo">Planificar Planes de Acción</span>
                        <span class="permiso-desc">Permite definir medidas correctivas, preventivas y fechas límite.</span>
                    </div>
                </label>

                <label class="permiso-card" class:active={form.permisos.efectividad}>
                    <input type="checkbox" bind:checked={form.permisos.efectividad} class="hidden-checkbox" />
                    <div class="custom-checkbox">
                        {#if form.permisos.efectividad}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        {/if}
                    </div>
                    <div class="permiso-text-wrapper">
                        <span class="permiso-titulo">Verificación de Efectividad</span>
                        <span class="permiso-desc">Permite validar, auditar y cerrar formalmente acciones concluídas.</span>
                    </div>
                </label>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <a href="{base}/Inicio" class="btn-secundario" style="flex: 0 0 auto;">← Atrás</a>

            <button type="submit" class="ishikawa-btn-guardar" style="flex: 0 0 auto; width: auto; min-width: 200px;" disabled={loading}>
                {loading 
                ? 'Registrando...' : 'Registrar Usuario'}
            </button>
        </div>
    </form>


    <Modal 
        bind:open={mostrarModal}
        title="Confirmar Registro"
        mensaje="¿Confirmas que deseas registrar a {form.nombre} {form.apellido} como {form.cargo === 'Admin' ? 'Administrador' : 'Supervisor'}?"
        textoConfirmar="Sí, registrar"
        textoCancelar="Cancelar"
        onConfirm={confirmarRegistro}
    />
</div>