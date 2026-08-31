<script>
  import { base } from '$app/paths';

  let { registros = [] } = $props();

  let busqueda = $state('');
  let filtroActivo = $state('todos');

  function estadoDe(estatus) {
    const valor = (estatus ?? '').toLowerCase();
    if (valor === 'cerrado') return 'done';
    if (valor === 'vencido') return 'expired';
    return 'open';
  }

  const ETIQUETA_ESTADO = { open: 'Abierta', done: 'Cerrada', expired: 'Vencida' };

  function iniciales(nombre) {
    if (!nombre || nombre === '—') return '—';
    const partes = nombre.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }

  let filasCrudas = $derived.by(() => {
    const resultado = [];
    for (const registro of registros) {
      registro.acciones.forEach((accion, i) => {
        resultado.push({
          codificador: registro.codificador,
          numero: i + 1,
          accion: accion.accion,
          responsable: accion.responsable ?? '—',
          fecha: accion.fecha ?? '—',
          estado: estadoDe(accion.estatus)
        });
      });
    }
    return resultado;
  });

  let filas = $derived.by(() => {
    const texto = busqueda.trim().toLowerCase();

    const filtradas = filasCrudas.filter((f) => {
      const pasaFiltro = filtroActivo === 'todos' || f.estado === filtroActivo;
      const pasaBusqueda =
        !texto ||
        f.accion.toLowerCase().includes(texto) ||
        f.codificador.toLowerCase().includes(texto) ||
        f.responsable.toLowerCase().includes(texto);
      return pasaFiltro && pasaBusqueda;
    });

    const conteo = new Map();
    for (const f of filtradas) conteo.set(f.codificador, (conteo.get(f.codificador) ?? 0) + 1);

    const vistos = new Set();
    return filtradas.map((f) => {
      const esPrimera = !vistos.has(f.codificador);
      vistos.add(f.codificador);
      return { ...f, esPrimera, rowspan: conteo.get(f.codificador) };
    });
  });
</script>

<div class="matriz-page">
  <div class="matriz-wrap">

    <div class="matriz-toolbar">
      <div class="matriz-buscador">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input class="input-filtro" type="text" placeholder="Filtrar por código, título, responsable…" bind:value={busqueda} />
      </div>

      <div class="matriz-filtros">
        {#each [['todos', 'Todos'], ['open', 'Abierta'], ['done', 'Cerrada'], ['expired', 'Vencida']] as [valor, etiqueta]}
          <button
            type="button"
            class="matriz-filtro-btn"
            class:activo={filtroActivo === valor}
            onclick={() => (filtroActivo = valor)}
          >
            {etiqueta}
          </button>
        {/each}
      </div>
    </div>

    <div class="matriz-tabla-contenedor">
      <table class="matriz-tabla seg-tabla-ancho">
        <colgroup>
          <col style="width: 13%" />
          <col style="width: 33%" />
          <col style="width: 20%" />
          <col style="width: 12%" />
          <col style="width: 13%" />
          <col style="width: 9%" />
        </colgroup>
        <thead>
          <tr>
            <th>Codificador</th>
            <th>Acción</th>
            <th>Responsable</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {#if filas.length === 0}
            <tr><td colspan="6" class="matriz-vacio">No se encontraron acciones con ese criterio.</td></tr>
          {:else}
            {#each filas as fila (fila.codificador + '-' + fila.numero)}
              <tr class:grupo-nuevo={fila.esPrimera}>
                {#if fila.esPrimera}
                  <td rowspan={fila.rowspan}><span class="codigo-valor">{fila.codificador}</span></td>
                {/if}

                <td class="celda-accion">{fila.accion}</td>
                <td>
                  <div class="matriz-responsable">
                    <span class="matriz-avatar">{iniciales(fila.responsable)}</span>
                    <span>{fila.responsable}</span>
                  </div>
                </td>
                <td class="texto-hint">{fila.fecha}</td>
                <td>
                  <span class="estatus-punto estatus--{fila.estado}">{ETIQUETA_ESTADO[fila.estado]}</span>
                </td>
                {#if fila.esPrimera}
                  <td rowspan={fila.rowspan} class="col-ver">
                    <a href="{base}/Matriz/{fila.codificador}" class="ver-detalle" title="Ver detalle">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <path d="M15 3h6v6" />
                        <path d="M10 14 21 3" />
                      </svg>
                    </a>
                  </td>
                {/if}
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  .seg-tabla-ancho {
    min-width: 950px;
  }
</style>