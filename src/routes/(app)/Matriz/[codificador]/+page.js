import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/acciones-correctivas/${params.codificador}`
  );

  if (!res.ok) {
    throw error(res.status, 'No se encontró esa acción correctiva.');
  }

  return {
    accion: await res.json()
  };
}