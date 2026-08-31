export async function load({ fetch, cookies }) {
  const accessToken = cookies.get('access_token');

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/usuarios`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!res.ok) {
    return { equipo: [] };
  }

  const equipo = await res.json();
  return { equipo };
}