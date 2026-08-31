<script>
  import { onMount } from 'svelte';
  import * as echarts from 'echarts/core';
  import { BarChart } from 'echarts/charts';
  import { GridComponent, TooltipComponent } from 'echarts/components';
  import { CanvasRenderer } from 'echarts/renderers';

  echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

  let { origenes = [] } = $props();
  let chartEl;
  let chart;

  const COLOR_ORIGEN = {
    'Auditoria Proceso/Producto': '#4A7FA8',
    'Quejas y Reclamos':          '#B85050',
    'Auditoria Interna':          '#4A8F4A',
    'Auditoria Externa':          '#6E5AA0',
    'Indicadores':                '#B8892A',
    'Otros':                      '#9A9590'
  };

  onMount(() => {
    chart = echarts.init(chartEl);
    render();

    const resize = () => chart.resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      chart.dispose();
    };
  });

  function obtenerFuente(variable) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
}

  function render() {
    if (!chart) return;

    const fontCode = obtenerFuente('--font-ui'); 

    const ordenados = [...origenes].sort((a, b) => a.cantidad - b.cantidad);

    chart.setOption({
      textStyle: { fontFamily: fontCode },
      grid: { left: 160, right: 40, top: 20, bottom: 20 },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#E4DFD6' } },
        splitLine: { lineStyle: { color: '#E4DFD6' } },
        axisLabel: { color: '#9A9590', fontSize: 11 }
      },
      yAxis: {
        type: 'category',
        data: ordenados.map(o => o.origen),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {  fontFamily: fontCode, color: '#2A2720', fontSize: 12 }
      },
      series: [{
        type: 'bar',
        barWidth: 18,
        data: ordenados.map(o => ({
          value: o.cantidad,
          itemStyle: { color: COLOR_ORIGEN[o.origen] ?? '#9A9590' }
        })),
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        label: {
          show: true,
          position: 'right',
          formatter: (params) => {
            const item = ordenados[params.dataIndex];
            return `${item.cantidad} (${item.porcentaje}%)`;
          },
          color: '#6B6560',
          fontFamily: fontCode,
          fontSize: 12
        }
      }],
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const item = ordenados[params.dataIndex];
          return `${item.origen}<br/>${item.cantidad} casos (${item.porcentaje}%)`;
        }
      }
    });
  }

  $effect(() => {
    origenes;
    render();
  });
</script>

<div class="relative bg-white border border-[#E4DFD6] rounded-[14px] p-5 overflow-hidden">  
  <h3 class="font-[var(--font-ui)] text-lg font-semibold text-[var(--text-primary)] mb-4">
    Origen de Detección
  </h3>

  <div bind:this={chartEl} style="width: 100%; height: 280px;"></div>
</div>