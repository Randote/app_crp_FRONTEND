
export async function load({ params, fetch, cookies }) {
  const accessToken = cookies.get('access_token');

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${params.id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'No se pudo cargar el usuario.');
  }

  const usuario = await res.json();
  console.log(usuario)
  return { usuario };
}