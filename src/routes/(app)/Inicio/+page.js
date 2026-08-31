import { fetchAutenticado } from '$lib/fetchAutenticador.js';

export const ssr = false;

export async function load() {
  const [resAcciones, resIndicadores] = await Promise.all([
    fetchAutenticado(`${import.meta.env.VITE_API_URL}/api/acciones-correctivas/resumen`),
    fetchAutenticado(`${import.meta.env.VITE_API_URL}/api/reportes/dashboard`)
  ]);

  return {
    acciones: resAcciones.ok ? await resAcciones.json() : [],
    kpis: resIndicadores.ok
      ? await resIndicadores.json()
      : { total_procesos: 0, total_acciones: 0, abiertas: 0, cerradas: 0, vencidas: 0 }
  };
}