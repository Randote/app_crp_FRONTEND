import { fetchAutenticado } from '$lib/fetchAutenticador.js';

export const ssr = false;

export async function load({ url }) {
  const anio = url.searchParams.get('anio') ?? new Date().getFullYear();

  const [resProcesos, resOrigenes, resAcciones, resHallazgos] = await Promise.all([
    fetchAutenticado(`${import.meta.env.VITE_API_URL}/api/reportes/indicadores/proceso-afectado`),
    fetchAutenticado(`${import.meta.env.VITE_API_URL}/api/reportes/indicadores/origen-deteccion`),
    fetchAutenticado(`${import.meta.env.VITE_API_URL}/api/reportes/indicadores/acciones-por-tipo?anio=${anio}`),
    fetchAutenticado(`${import.meta.env.VITE_API_URL}/api/reportes/indicadores/hallazgos-por-tipo?anio=${anio}`)
  ]);

  const jsonProcesos = resProcesos.ok ? await resProcesos.json() : { procesos: [], total: 0 };
  const jsonOrigenes = resOrigenes.ok ? await resOrigenes.json() : { origenes: [], total: 0 };
  const jsonAcciones = resAcciones.ok ? await resAcciones.json() : { meses: [], series: [] };
  const jsonHallazgos = resHallazgos.ok ? await resHallazgos.json() : { meses: [], series: [] };

  return {
    procesos: jsonProcesos.procesos,
    totalProcesos: jsonProcesos.total,
    origenes: jsonOrigenes.origenes,
    acciones: jsonAcciones,
    hallazgos: jsonHallazgos,
    anioSeleccionado: Number(anio)
  };
}