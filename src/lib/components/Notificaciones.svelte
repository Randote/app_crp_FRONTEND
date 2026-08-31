<script>
  let {
    message = '',
    type = 'info',
    dismissible = true,
    autoClose = 0,
    onClose = () => {}
  } = $props();

  let visible = $state(false);
  let timer;

  $effect(() => {
    if (message) {
      visible = true;
      if (autoClose > 0) {
        clearTimeout(timer);
        timer = setTimeout(cerrar, autoClose);
      }
    } else {
      visible = false;
    }
    return () => clearTimeout(timer);
  });

  function cerrar() {
    visible = false;
    clearTimeout(timer);
    onClose();
  }

  const colorMap = {
    info:    { bg: '#EAF2F8', text: '#4A7FA8', border: '#C5DCF0', icon: '#4A7FA8' },
    success: { bg: '#EAF4EA', text: '#4A8F4A', border: '#B8D8B8', icon: '#4A8F4A' },
    warning: { bg: '#FBF3E0', text: '#B8892A', border: '#F0D9A0', icon: '#B8892A' },
    error:   { bg: '#FAECEC', text: '#B85050', border: '#F0C0C0', icon: '#B85050' }
  };

  const currentColor = $derived(colorMap[type]);
</script>

{#if visible && message}
  <div
    class="notification-bar"
    style="
      --notif-bg: {currentColor.bg};
      --notif-text: {currentColor.text};
      --notif-border: {currentColor.border};
      --notif-icon: {currentColor.icon};
    "
    role="alert"
    aria-live="polite"
  >
    <div class="notif-content">
      <!-- Ícono según tipo -->
      <svg class="notif-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        {#if type === 'info'}
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        {:else if type === 'success'}
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        {:else if type === 'warning'}
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        {:else if type === 'error'}
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        {/if}
      </svg>
      <span class="notif-message">{message}</span>
    </div>
    {#if dismissible}
      <button class="notif-close" onclick={cerrar} aria-label="Cerrar notificación">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    {/if}
  </div>
{/if}

<style>
  .notification-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm, 8px);
    padding: 10px 14px;
    background: var(--notif-bg);
    border: 1px solid var(--notif-border);
    border-radius: var(--radius-lg, 10px);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 400;
    color: var(--notif-text);
    box-shadow: 0 2px 8px rgba(42, 39, 32, 0.06);
    margin-bottom: 12px;
    animation: slideDown 0.25s ease-out;
  }

  .notif-content {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0; /* Permite que el texto se encoja en pantallas pequeñas */
  }

  .notif-icon {
    flex-shrink: 0;
    color: var(--notif-icon);
  }

  .notif-message {
    line-height: 1.4;
    word-break: break-word;
  }

  .notif-close {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 2px;
    color: var(--notif-text);
    opacity: 0.7;
    cursor: pointer;
    border-radius: 4px;
    transition: opacity 0.15s, background 0.15s;
    flex-shrink: 0;
  }

  .notif-close:hover {
    opacity: 1;
    background: rgba(0,0,0,0.05);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ===== Responsive ===== */
  @media (max-width: 640px) {
    .notification-bar {
      padding: 8px 12px;
      font-size: 12px;
      gap: 6px;
    }
    .notif-icon {
      width: 16px;
      height: 16px;
    }
    .notif-close svg {
      width: 12px;
      height: 12px;
    }
    .notif-content {
      gap: 6px;
    }
  }
</style>