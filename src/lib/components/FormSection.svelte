<script>
  let { title, children } = $props();
</script>

<div class="form-section relative mb-0 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 md:p-7">
  <div class="problema-badge">{title}</div>
  {@render children?.()}
</div>