<script>
  let { message } = $props();
</script>

{#if message}
  <span class="text-[11px] text-[var(--text-error)]">{message}</span>
{/if}
