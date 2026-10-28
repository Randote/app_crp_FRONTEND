<script>
  import { onMount } from 'svelte';
  import * as echarts from 'echarts/core';
  import { PieChart } from 'echarts/charts';
  import { TooltipComponent, LegendComponent } from 'echarts/components';
  import { CanvasRenderer } from 'echarts/renderers';
  import FormSection from '$lib/components/FormSection.svelte';

  echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

  let { abiertas = 0, cerradas = 0, vencidas = 0 } = $props();

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
    const total = abiertas + cerradas + vencidas;

    chart.setOption({
      textStyle: { fontFamily: fontCode },
      legend: {
        bottom: 0,
        left: 'center',
        textStyle: { fontFamily: fontCode, fontSize: 12, color: '#6B6560' },
        itemWidth: 10,
        itemHeight: 10
      },
      series: [{
        type: 'pie',
        radius: ['55%', '80%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 3
        },
        label: {
          show: true,
          position: 'center',
          formatter: () => `${total}\nTotal`,
          fontFamily: fontCode,
          fontSize: 22,
          fontWeight: 600,
          color: '#2A2720',
          lineHeight: 24
        },
        data: [
          { value: abiertas, name: 'Abiertas', itemStyle: { color: '#4A7FA8' } },
          { value: cerradas, name: 'Cerradas', itemStyle: { color: '#4A8F4A' } },
          { value: vencidas, name: 'Vencidas', itemStyle: { color: '#B85050' } },
        ]
      }],
      tooltip: {
        trigger: 'item',
        formatter: (params) => `${params.name}: ${params.value} (${params.percent}%)`
      }
    });
  }

  $effect(() => {
    abiertas; cerradas; vencidas;
    render();
  });
</script>
  <FormSection title="Estado de Acciones">
  <div bind:this={chartEl} style="width: 100%; height: 280px;"></div>
</FormSection>