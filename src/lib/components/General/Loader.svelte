<script>
  import cpIcon from '$lib/assets/crp_logo_icon.svg';
  let { size = 64 } = $props();
</script>

<div class="flex items-center justify-center" style="width: {size}px; height: {size}px;">
  <div class="relative" style="width: {size}px; height: {size}px;">
    <div class="absolute inset-0 rounded-full animate-spin-slow" style="
      background: conic-gradient(from 0deg, transparent 0%, var(--bg-rojito) 15%, transparent 40%);
      mask: radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px));
      -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px));
    "></div>

    <div class="absolute inset-0 flex items-center justify-center">
      <img
        src={cpIcon}
        alt="Cargando"
        style="width: {size * 0.5}px; height: {size * 0.5}px;"
        class="animate-pulse-subtle"
      />
    </div>
  </div>
</div>

<style>
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 1.2s linear infinite;
  }

  @keyframes pulse-subtle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(0.94); }
  }
  .animate-pulse-subtle {
    animation: pulse-subtle 1.6s ease-in-out infinite;
  }
</style>