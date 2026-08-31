
//
// Reemplazo mínimo para tus fetch() del lado del cliente.
// Mismo patrón que ya usas (obtenerCookie + Authorization),
// solo que si el access token venció, refresca UNA vez y reintenta.

function obtenerCookie(nombre) {
	const match = document.cookie.match(new RegExp(`(?:^|; )${nombre}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : null;
}

// 👇 debug: decodifica el payload del JWT (sin verificar firma, solo para leer "exp")
function decodificarExpJWT(token) {
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return payload.exp ? new Date(payload.exp * 1000) : null;
	} catch {
		return null;
	}
}

async function refrescarToken() {
	const tokenViejo = obtenerCookie('access_token');
	const refreshViejo = obtenerCookie('refresh_token'); // solo si no es httpOnly; si lo es, sale null y ya

	console.log('[auth] access token venció, pidiendo uno nuevo…', new Date().toISOString());

	const res = await fetch('/api_crp/api/auth/refresh', {
		method: 'POST',
		credentials: 'include' // el navegador manda el refresh_token solo
	});
	if (!res.ok) {
		console.log('[auth] refresh FALLÓ — refresh_token inválido o expirado', res.status);
		return null;
	}
	const data = await res.json();
	document.cookie = `access_token=${data.access_token}; path=/; max-age=600; samesite=lax`;

	const refreshNuevo = obtenerCookie('refresh_token');
	console.log(
		'[auth] refresh OK. access token nuevo expira:',
		decodificarExpJWT(data.access_token),
		'| refresh_token rotado:',
		refreshViejo && refreshNuevo ? refreshViejo !== refreshNuevo : '(no medible, probablemente httpOnly — bueno)'
	);

	return data.access_token;
}

/**
 * Mismo uso que fetch(), pero con reintento automático si el token venció.
 */
export async function fetchAutenticado(url, options = {}) {
	const hacer = (token) =>
		fetch(url, {
			...options,
			headers: { ...options.headers, Authorization: `Bearer ${token}` }
		});

	let token = obtenerCookie('access_token');
	let res = await hacer(token);

	if (res.status === 401) {
		const expEsperado = decodificarExpJWT(token);
		console.log(
			'[auth] 401 recibido. el token deb\u00eda expirar:', expEsperado,
			'| ahora:', new Date()
		);
		token = await refrescarToken();
		if (!token) throw new Error('SESION_EXPIRADA'); // acá sí mandas a /login
		res = await hacer(token);
	}

	return res;
}