export async function load({ fetch }) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/usuarios/publico`);
  const usuarios = res.ok ? await res.json() : [];
  return { usuarios };
}