<script>
  import { onMount } from 'svelte';
  import * as echarts from 'echarts/core';
  import { BarChart } from 'echarts/charts';
  import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
  import { CanvasRenderer } from 'echarts/renderers';
  import FormSection from '$lib/components/FormSection.svelte';
 

  echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

  let { titulo = '', meses = [], series = [], colores = {} } = $props();

  let chartEl;
  let chart;

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

    chart.setOption({
      textStyle: { fontFamily: fontCode },
      grid: { left: 40, right: 20, top: 40, bottom: 30 },
      legend: {
        top: 0,
        left: 0,
        textStyle: { fontFamily: fontCode, fontSize: 12, color: '#6B6560' },
        itemWidth: 10,
        itemHeight: 10
      },
      xAxis: {
        type: 'category',
        data: meses,
        axisLine: { lineStyle: { color: '#E4DFD6' } },
        axisTick: { show: false },
        axisLabel: { color: '#9A9590', fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#E4DFD6', type: 'dashed' } },
        axisLabel: { color: '#9A9590', fontSize: 11 }
      },
      series: series.map((s, index)=> ({
        name: s.tipo,
        type: 'bar',
        stack: 'total',
        barMaxWidth: 32,
        data: s.data,
        itemStyle: { color: colores[s.tipo] ?? '#9A9590',
           borderRadius: index === series.length - 1 ? [6, 6, 0, 0] : 0
        }
      })),
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        textStyle: { fontFamily: fontCode, fontSize: 12 }
      }
    });
  }

  $effect(() => {
    meses; series;
    render();
  });
</script>

 <FormSection title={titulo}>
    <div bind:this={chartEl} style="width: 100%; height: 300px;"></div>
 </FormSection>


