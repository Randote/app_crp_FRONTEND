    <script>
    import { base } from '$app/paths';
    import { goto } from '$app/navigation';
    import cpIcon from '$lib/assets/crp_logo_icon.svg';
    import FieldError from '$lib/components/FieldError.svelte';
    import { mostrarNotificacion } from '$lib/Notificacion.svelte.js';

    let paso = $state(1);

    let email = $state('');
    let nuevaPassword = $state('');
    let confirmarPassword = $state('');
    let loading = $state(false);

    let errors = $state({ email: '', codigo: '', nuevaPassword: '', confirmarPassword: '' });

    // --- Código en 6 recuadros ---
    let codigoDigits = $state(['', '', '', '', '', '']);
    let codigo = $derived(codigoDigits.join(''));
    let inputsCodigo = [];

    function manejarInputCodigo(e, i) {
        const valor = e.target.value.replace(/\D/g, '').slice(-1);
        codigoDigits[i] = valor;
        if (valor && i < 5) {
        inputsCodigo[i + 1]?.focus();
        }
    }

    function manejarKeydownCodigo(e, i) {
        if (e.key === 'Backspace' && !codigoDigits[i] && i > 0) {
        inputsCodigo[i - 1]?.focus();
        }
    }

    function manejarPasteCodigo(e) {
        e.preventDefault();
        const texto = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
        for (let i = 0; i < 6; i++) {
        codigoDigits[i] = texto[i] || '';
        }
        const siguiente = Math.min(texto.length, 5);
        inputsCodigo[siguiente]?.focus();
    }

    // --- Contador de expiración (15 min, igual que minutos_validez del backend) ---
    let segundosRestantes = $state(0);
    let intervaloActual = null;

function iniciarContador() {
    if (intervaloActual) clearInterval(intervaloActual);
    segundosRestantes = 5 * 60;
    intervaloActual = setInterval(() => {
        segundosRestantes = Math.max(0, segundosRestantes - 1);
        if (segundosRestantes === 0) clearInterval(intervaloActual);
    }, 1000);
}

    let tiempoFormateado = $derived(
        `${Math.floor(segundosRestantes / 60)}:${String(segundosRestantes % 60).padStart(2, '0')}`
    );
    let codigoExpirado = $derived(segundosRestantes === 0);

    // --- Checklist de requisitos de contraseña ---
    let requisitos = $derived.by(() => {
        const p = nuevaPassword;
        const cp = confirmarPassword;
        return [
        { label: 'Mínimo 6 caracteres', ok: p.length >= 6 },
        { label: 'Una letra mayúscula', ok: /[A-Z]/.test(p) },
        { label: 'Un número', ok: /[0-9]/.test(p) },
        { label: 'Un carácter especial', ok: /[^a-zA-Z0-9]/.test(p) },
        { label: 'Las contraseñas coinciden', ok: p === cp && p.length > 0 }
        ];
    });

    async function solicitarCodigo(e) {
        e?.preventDefault();
        errors.email = email.trim() ? '' : 'El correo es obligatorio.';
        if (errors.email) return;

        loading = true;
        try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/auth/olvide-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        mostrarNotificacion('Se envio un codigo a su correo', 'success');
        codigoDigits = ['', '', '', '', '', ''];
        paso = 2;
        iniciarContador(); 
        } catch {
        mostrarNotificacion('No se pudo procesar la solicitud. Intenta de nuevo.', 'error');
        } finally {
        loading = false;
        }
    }

    async function restablecer(e) {
        e.preventDefault();

        errors.codigo = /^\d{6}$/.test(codigo) ? '' : 'El código debe tener 6 dígitos.';
        errors.nuevaPassword = nuevaPassword.length >= 6 ? '' : 'Mínimo 6 caracteres.';
        errors.confirmarPassword = confirmarPassword === nuevaPassword ? '' : 'Las contraseñas no coinciden.';

        if (errors.codigo || errors.nuevaPassword || errors.confirmarPassword) return;

        loading = true;
        try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/restablecer-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            email,
            codigo,
            password_nueva: nuevaPassword,
            confirmar_password_nueva: confirmarPassword
            })
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            let mensaje = 'Código inválido o expirado.';

            if (Array.isArray(data.detail)) {
            mensaje = data.detail.map((e) => e.msg).join(' | ');
            } else if (typeof data.detail === 'string') {
            mensaje = data.detail;
            }

            throw new Error(mensaje);
        }

        mostrarNotificacion('Contraseña actualizada. Ya puedes iniciar sesión.', 'success');
        goto(`${base}/`);
        } catch (err) {
        mostrarNotificacion(err.message, 'error');
        } finally {
        loading = false;
        }
    }
    </script>

    <div class="relative w-full h-full max-w-[420px] rounded-xl border border-stone-200 bg-[var(--bg-base)] p-8 shadow-xl">
    <div class="mb-6 flex flex-col items-center gap-3">
        <img src={cpIcon} alt="Logo Corimon" class="h-12 w-auto" />
        <h1 class="text-lg font-bold text-[var(--text-primary)]">
        {paso === 1 ? 'Recuperar contraseña' : 'Verifica tu identidad'}
        </h1>
    </div>

    {#if paso === 1}
        <p class="mb-6 text-center text-[13px] text-[var(--text-secondary)]">
        Introduce el correo asociado a tu cuenta para recibir un código de recuperación.
        </p>

        <form onsubmit={solicitarCodigo} class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="email">
            Correo
            </label>
            <input id="email" class="input" type="email" bind:value={email} />
            <FieldError message={errors.email} />
        </div>

        <button
            type="submit"
            class="mt-2 w-full cursor-pointer rounded-lg bg-[#8B1A2A] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#701420] disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
        >
            {loading ? 'Enviando…' : 'Enviar código'}
        </button>

        <a href="{base}/" class="text-center text-[12px] font-medium text-[#8B1A2A] hover:underline">
            Volver a iniciar sesión
        </a>
        </form>
    {:else}
        <p class="mb-4 text-center text-[13px] text-[var(--text-secondary)]">
        Revisa <strong class="text-[var(--text-primary)]">{email}</strong> e ingresa el código de 6 dígitos.
        </p>

        <form onsubmit={restablecer} class="flex flex-col gap-4">
        <div class="flex flex-col items-center gap-2">
            <div class="flex justify-center gap-2" onpaste={manejarPasteCodigo}>
            {#each codigoDigits as digit, i}
                <input
                id={`codigo-${i}`}
                bind:this={inputsCodigo[i]}
                type="text"
                inputmode="numeric"
                maxlength="1"
                value={digit}
                oninput={(e) => manejarInputCodigo(e, i)}
                onkeydown={(e) => manejarKeydownCodigo(e, i)}
                class="h-12 w-11 rounded-lg border border-[var(--border-subtle)] bg-white text-center text-lg font-mono text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--bg-rojito)]"
                />
            {/each}
            </div>

            <FieldError message={errors.codigo} />

            {#if codigoExpirado}
            <button
                type="button"
                onclick={solicitarCodigo}
                disabled={loading}
                class="text-[12px] font-medium text-[#8B1A2A] hover:underline disabled:opacity-60">
            reenviar código
            </button>
            {:else}
            <p class="text-[12px] text-white rounded-lg bg-[var(--bg-rojito)] px-2 py-1">
                Expira en <span class="font-mono font-medium text-white">{tiempoFormateado}</span>
            </p>
            {/if}
        </div>

        <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="nuevaPassword">
            Nueva contraseña
            </label>
            <input
            id="nuevaPassword"
            class="input"
            type="password"
            placeholder="••••••••"
            bind:value={nuevaPassword}
            />
            <FieldError message={errors.nuevaPassword} />
        </div>

        <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-medium text-[var(--text-secondary)]" for="confirmarPassword">
            Confirmar contraseña
            </label>
            <input
            id="confirmarPassword"
            class="input"
            type="password"
            placeholder="••••••••"
            bind:value={confirmarPassword}
            />
            <FieldError message={errors.confirmarPassword} />
        </div>

        {#if nuevaPassword || confirmarPassword}
            <ul class="flex flex-col gap-1 rounded-lg border border-[var(--border-subtle)] bg-white p-3">
            {#each requisitos as req}
                <li class="flex items-center gap-2 text-[12px]" class:text-[var(--text-secondary)]={!req.ok}>
                {#if req.ok}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8F4A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
                    <path d="M20 6 9 17l-5-5" />
                    </svg>
                {:else}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9590" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
                    <circle cx="12" cy="12" r="9" />
                    </svg>
                {/if}
                <span class={req.ok ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-hint)]'}>
                    {req.label}
                </span>
                </li>
            {/each}
            </ul>
        {/if}

        <button
            type="submit"
            class="mt-2 w-full cursor-pointer rounded-lg bg-[#8B1A2A] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#701420] disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
        >
            {loading ? 'Guardando…' : 'Restablecer contraseña'}
        </button>

        <button
            type="button"
            onclick={() => (paso = 1)}
            class="items-center rounded-xl border border-[var(--border-subtle)] px-1 py-1.5 text-[13px] font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-input-dis)] hover:text-[var(--text-primary)] min-w-6">
            Volver al apartado anterior
        </button>
        </form>
    {/if}
    </div>