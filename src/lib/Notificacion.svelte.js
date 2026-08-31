
let notifMessage = $state('');
let notifType = $state('info'); 

export function mostrarNotificacion(mensaje, tipo = 'error') {
  notifMessage = mensaje;
  notifType = tipo;
}

export function ocultarNotificacion() {
  notifMessage = '';
}

// Getters reactivos para usar en el componente
export function getNotifMessage() {
  return notifMessage;
}

export function getNotifType() {
  return notifType;
}