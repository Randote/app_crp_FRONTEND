<script>
  import { base } from '$app/paths';
  import PaginadorTabla from '$lib/components/Paginadortabla.svelte';

  let { registros = [] } = $props();

  let busqueda = $state('');
  let filtroActivo = $state('todos');
  let cantidadPorPagina = $state(10);
  let paginaActual = $state(1);

  function estadoDe(estatus) {
    const valor = (estatus ?? '').toLowerCase();
    if (valor === 'cerrado') return 'done';
    if (valor === 'vencido') return 'expired';
    return 'open';
  }

  function iniciales(nombre) {
    if (!nombre || nombre === '—') return '—';
    const partes = nombre.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }

  const ETIQUETA_ESTADO = {
    open: 'Abierta',
    done: 'Cerrada',
    expired: 'Vencida'
  };

  let registrosFiltrados = $derived.by(() => {
    const texto = busqueda.trim().toLowerCase();

    return registros
      .map((registro) => {
        const accionesFiltradas = registro.acciones.filter((accion) => {
          const estado = estadoDe(accion.estatus);
          const pasaFiltro = filtroActivo === 'todos' || estado === filtroActivo;

          const pasaBusqueda =
            !texto ||
            registro.codificador.toLowerCase().includes(texto) ||
            registro.proceso_afectado.toLowerCase().includes(texto) ||
            (accion.responsable ?? '').toLowerCase().includes(texto) ||
            accion.accion.toLowerCase().includes(texto);

          return pasaFiltro && pasaBusqueda;
        });

        return { ...registro, acciones: accionesFiltradas };
      })
      .filter((registro) => registro.acciones.length > 0);
  });

  let totalPaginas = $derived(
    Math.max(1, Math.ceil(registrosFiltrados.length / cantidadPorPagina))
  );

  $effect(() => {
    busqueda;
    filtroActivo;
    cantidadPorPagina;
    paginaActual = 1;
  });

  let registrosPagina = $derived.by(() => {
    const inicio = (paginaActual - 1) * cantidadPorPagina;
    return registrosFiltrados.slice(inicio, inicio + cantidadPorPagina);
  });

  let filas = $derived.by(() => {
    const resultado = [];
    for (const registro of registrosPagina) {
      const total = registro.acciones.length || 1;
      registro.acciones.forEach((accion, i) => {
        resultado.push({
          registro,
          accion,
          esPrimera: i === 0,
          rowspan: total,
          nuevoGrupo: i === 0
        });
      });
    }
    return resultado;
  });

  let resumen = $derived.by(() => {
    const conteo = { open: 0, done: 0, expired: 0 };
    for (const registro of registros) {
      for (const accion of registro.acciones) {
        conteo[estadoDe(accion.estatus)]++;
      }
    }
    return conteo;
  });

  // --- Drag to scroll horizontal ---
  let contenedorRef = $state();
  let arrastrando = $state(false);
  let inicioX = 0;
  let scrollInicial = 0;

  function iniciarArrastre(e) {
    arrastrando = true;
    inicioX = e.pageX - contenedorRef.offsetLeft;
    scrollInicial = contenedorRef.scrollLeft;
  }

  function moverArrastre(e) {
    if (!arrastrando) return;
    e.preventDefault();
    const x = e.pageX - contenedorRef.offsetLeft;
    const distancia = x - inicioX;
    contenedorRef.scrollLeft = scrollInicial - distancia;
  }

  function detenerArrastre() {
    arrastrando = false;
  }
</script>

<main class="matriz-page">
  <div class="matriz-wrap">
    <div class="matriz-toolbar">
      <div class="matriz-buscador">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input type="text" placeholder="Filtrar por código, proceso, responsable…" bind:value={busqueda} />
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

    {#if registros.length === 0}
      <div class="matriz-vacio">
        <p>No hay registros disponibles todavía.</p>
      </div>
    {:else if registrosFiltrados.length === 0}
      <div class="matriz-vacio">
        <p>No se encontraron acciones con ese criterio.</p>
      </div>
    {:else}
      <div class="matriz-tabla-card">
        <div
          class="matriz-tabla-contenedor-drag-to-hold"
          class:arrastrando
          bind:this={contenedorRef}
          onmousedown={iniciarArrastre}
          onmousemove={moverArrastre}
          onmouseup={detenerArrastre}
          onmouseleave={detenerArrastre}
        >
          <table class="matriz-tabla">
            <colgroup>
            <col class="col-ver"/>
              <col class="col-codigo" />
              <col class="col-proceso" />
              <col class="col-hallazgo" />
              <col class="col-tipo-hallazgo" />
              <col class="col-accion" />
              <col class="col-tipo" />
              <col class="col-responsable" />
              <col class="col-fecha" />
              <col class="col-estatus" />
              <col class="col-obs" />
            </colgroup>
            <thead>
              <tr>
              <th></th>
                <th>Codificador</th>
                <th>Proceso</th>
                <th>Hallazgo</th>
                <th>Tipo de Hallazgo</th>
                <th>Acción</th>
                <th>Tipo de Acción</th>
                <th>Responsable</th>
                <th>Cierre</th>
                <th>Estatus</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {#each filas as fila (fila.registro.codificador + '-' + fila.accion.accion + fila.accion.responsable)}
                {@const estado = estadoDe(fila.accion.estatus)}
                <tr class:grupo-nuevo={fila.nuevoGrupo}>
                  {#if fila.esPrimera}
                    <td class="col-ver" rowspan={fila.rowspan}>
                      <a href="{base}/Matriz/{fila.registro.codificador}" class="ver-detalle" title="Ver detalle">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <path d="M15 3h6v6" />
                          <path d="M10 14 21 3" />
                        </svg>
                      </a>
                    </td>
                    <td class="col-codigo" rowspan={fila.rowspan}>
                      <span class="codigo-valor">{fila.registro.codificador}</span>
                    </td>
                    <td class="col-proceso" rowspan={fila.rowspan}>
                      <span class="proceso-nombre">{fila.registro.proceso_afectado}</span>
                      <span class="proceso-origen">{fila.registro.origen_deteccion ?? 'Sin origen'}</span>
                    </td>
                    <td class="col-hallazgo" rowspan={fila.rowspan}>
                      {fila.registro.descripcion_hallazgo ?? '—'}
                    </td>
                    <td class="col-tipo-hallazgo texto-hint" rowspan={fila.rowspan}>
                      {fila.accion.tipo_hallazgo ?? '—'}
                    </td>
                  {/if}

                  <td class="col-accion celda-accion">{fila.accion.accion}</td>
                  <td class="col-tipo texto-hint">{fila.accion.tipo_accion ?? '—'}</td>
                  <td class="col-responsable">
                    <div class="matriz-responsable">
                      <span class="matriz-avatar">{iniciales(fila.accion.responsable)}</span>
                      <span>{fila.accion.responsable ?? '—'}</span>
                    </div>
                  </td>
                  <td class="col-fecha texto-hint">{fila.accion.fecha_cierre ?? '—'}</td>
                  <td class="col-estatus">
                    <span class="estatus-punto estatus--{estado}">
                      {ETIQUETA_ESTADO[estado]}
                    </span>
                  </td>
                  <td class="col-obs celda-obs texto-hint">{fila.accion.observaciones ?? '—'}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <div class="matriz-tabla-footer">
          <PaginadorTabla bind:paginaActual {totalPaginas} />
        </div>
      </div>
    {/if}
  </div>
</main>