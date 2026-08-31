<script>
  let { problema = $bindable('') } = $props();
</script>

<div class="problema-card">
  <div class="problema-badge">Efecto</div>
  <p class="problema-eyebrow">Problema enfocado</p>
  <textarea
    bind:value={problema}
    placeholder="Describa el problema enfocado..."
    class="textarea"
  ></textarea>
</div>