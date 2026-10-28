export async function load({ fetch, cookies }) {
  const accessToken = cookies.get('access_token');
  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    const [resUsuarios, resSupervisores] = await Promise.all([
      fetch(`${apiUrl}/api/usuarios/`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      fetch(`${apiUrl}/api/supervisores/`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
    ]);

    const usuarios = resUsuarios.ok ? await resUsuarios.json() : [];
    const supervisores = resSupervisores.ok ? await resSupervisores.json() : [];

    return { usuarios, supervisores };
  } catch (err) {
    console.error('Error cargando datos de configuración:', err);
    return { usuarios: [], supervisores: [] };
  }
}