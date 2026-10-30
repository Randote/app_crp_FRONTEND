import { env } from '$env/dynamic/private';

export async function handle({ event, resolve }) {
    // Mismo origen = nginx de este servidor; BACKEND_URL (opcional) lo sobrescribe.
    const backendUrl = env.BACKEND_URL ?? `${event.url.origin}/api_crp`;

    if (
        event.url.pathname.startsWith('/_app/') ||
        event.url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff2?|map)$/)
    ) {
        return resolve(event);
    }

    const accessToken = event.cookies.get('access_token');
    const refreshTokenCookie = event.cookies.get('refresh_token');

    event.locals.user = null;

    if (accessToken) {
        const user = await verificarToken(accessToken, backendUrl);
        if (user) {
            event.locals.user = user;
            return resolve(event);
        }
    }

    if (refreshTokenCookie) {
        const nuevoAccessToken = await refrescarToken(event, backendUrl);
        if (nuevoAccessToken) {
            event.cookies.set('access_token', nuevoAccessToken, {
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
                secure: false,
                maxAge: 60 * 10
            });
            event.locals.user = await verificarToken(nuevoAccessToken, backendUrl);
        }
    }

    return resolve(event);
}

async function verificarToken(token, backendUrl) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const res = await fetch(`${backendUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    } finally {
        clearTimeout(timeout);
    }
}

async function refrescarToken(event, backendUrl) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const res = await fetch(`${backendUrl}/api/auth/refresh`, {
            method: 'POST',
            headers: { Cookie: `refresh_token=${event.cookies.get('refresh_token')}` },
            signal: controller.signal
        });
        if (!res.ok) return null;

        const setCookieHeaders = typeof res.headers.getSetCookie === 'function'
            ? res.headers.getSetCookie()
            : [res.headers.get('set-cookie')].filter(Boolean);

        for (const cookieStr of setCookieHeaders) {
            const match = cookieStr.match(/^refresh_token=([^;]+)/);
            if (match) {
                event.cookies.set('refresh_token', match[1], {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: false,
                    maxAge: 60 * 60 * 4 // 4h, igual que REFRESH_COOKIE_MAX_AGE del backend
                });
            }
        }

        const data = await res.json();
        return data.access_token;
    } catch {
        return null;
    } finally {
        clearTimeout(timeout);
    }
}
