export async function load({ fetch }) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/matrizbasic/acciones-detalle`);

  if (!res.ok) {
    return { registros: [] };
  }

  return {
    registros: await res.json()
  };
}