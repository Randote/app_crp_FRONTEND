<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Manual de Usuario — Sistema de Gestión de Acciones Correctivas</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Instrument+Sans:wght@400;600;700&family=Inter:wght@400;600;700;900&family=Istok+Web:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root{
    --cream:#F8F5F0;
    --wine-dark:#6B0606;
    --wine:#8B1A2A;
    --wine-mid:#710E0E;
    --red:#B00909;
    --red-bright:#C8102E;
    --red-accent:#9F1F1F;
    --red-orange:#D9381B;
    --amber:#EF9B14;
    --ink:#1E1E1E;
    --white:#FFFFFF;
    --shadow-soft:0 10px 10px rgba(0,0,0,.25);
    --shadow-hard:12px 12px 12px rgba(0,0,0,.25);
  }

  *{box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{
    margin:0;
    background:var(--cream);
    font-family:'Instrument Sans', sans-serif;
    color:var(--ink);
  }

  img.placeholder, .img-placeholder{
    display:flex;
    align-items:center;
    justify-content:center;
    text-align:center;
    background:repeating-linear-gradient(45deg,#eee,#eee 10px,#e2e2e2 10px,#e2e2e2 20px);
    color:#888;
    font-family:'Instrument Sans',sans-serif;
    font-size:14px;
    border-radius:15px;
    box-shadow:var(--shadow-hard);
    padding:12px;
  }

  a.btn, button.btn{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    padding:14px 30px;
    background:var(--red-bright);
    color:var(--white);
    border:1px solid rgba(0,0,0,.76);
    box-shadow:var(--shadow-soft);
    border-radius:12px;
    font-family:'Inter',sans-serif;
    font-weight:900;
    font-size:20px;
    text-decoration:none;
    cursor:pointer;
  }

  .module-title{
    display:flex;
    align-items:center;
    gap:14px;
    background:var(--white);
    padding:20px 32px;
    box-shadow:var(--shadow-hard);
    font-family:'Sora',sans-serif;
    font-weight:700;
    font-size:32px;
    margin:0 auto;
    max-width:900px;
    border-radius:4px;
  }

  .module-title.on-dark{
    background:transparent;
    color:var(--white);
    box-shadow:none;
    font-size:36px;
  }

  .icon-circle{
    width:56px;
    height:56px;
    border-radius:50%;
    background:var(--cream);
    display:flex;
    align-items:center;
    justify-content:center;
    flex:none;
    box-shadow:var(--shadow-soft);
  }
  .icon-circle svg{width:28px;height:28px;stroke:var(--ink);}

  .container{
    max-width:1200px;
    margin:0 auto;
    padding:0 24px;
  }

  /* ---------- HERO ---------- */
  .hero{
    position:relative;
    background:linear-gradient(rgba(139,26,42,.65), rgba(139,26,42,.65)),
      linear-gradient(120deg,#3a0d0d,#8b1a2a 60%,#3a0d0d);
    color:var(--white);
    padding:70px 24px 90px;
    overflow:hidden;
  }
  .hero-inner{
    max-width:1100px;
    margin:0 auto;
    text-align:center;
  }
  .hero h1{
    font-family:'Sora',sans-serif;
    font-weight:800;
    font-size:clamp(36px,6vw,72px);
    line-height:1.1;
    margin:0 0 12px;
  }
  .hero h2{
    font-family:'Instrument Sans',sans-serif;
    font-weight:700;
    font-size:clamp(18px,3vw,30px);
    margin:0 0 32px;
  }
  .hero .logo-row{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:24px;
    flex-wrap:wrap;
  }
  .hero .logo{
    height:70px;
    background:var(--white);
    color:var(--wine);
    border-radius:8px;
    display:flex;
    align-items:center;
    padding:0 18px;
    font-family:'Sora',sans-serif;
    font-weight:800;
    font-size:20px;
    letter-spacing:.02em;
  }

  /* ---------- MODULE 1 ---------- */
  .m1{
    padding:64px 24px;
  }
  .cards-2col{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:32px;
    max-width:1100px;
    margin:40px auto 0;
  }
  .card{
    background:var(--white);
    border-radius:12px;
    box-shadow:8px 8px 4px rgba(0,0,0,.25);
    padding:32px;
  }
  .card.left{border-left:8px solid var(--wine);}
  .card.right{border-right:8px solid var(--wine); text-align:right;}
  .card h3{
    font-family:'Instrument Sans',sans-serif;
    font-weight:700;
    font-size:26px;
    color:var(--wine-mid);
    margin:0 0 10px;
  }
  .card p{
    font-family:'Instrument Sans',sans-serif;
    font-weight:600;
    font-size:18px;
    line-height:1.4;
    color:var(--wine-mid);
    margin:0;
  }

  /* ---------- ACCESO SIN REGISTRO (dark band) ---------- */
  .band-acceso{
    background:var(--wine);
    padding:70px 24px 100px;
    color:var(--white);
    position:relative;
  }
  .band-acceso h2{
    font-family:'Sora',sans-serif;
    font-weight:700;
    font-size:clamp(30px,5vw,54px);
    letter-spacing:.01em;
    margin:0 0 40px;
  }
  .band-flex{
    display:flex;
    gap:48px;
    align-items:flex-start;
    flex-wrap:wrap;
  }
  .steps{
    flex:1 1 380px;
    display:flex;
    flex-direction:column;
    gap:16px;
  }
  .step-card{
    background:var(--cream);
    color:var(--ink);
    border-radius:15px;
    box-shadow:var(--shadow-hard);
    padding:20px 24px;
  }
  .step-card p{
    font-family:'Sora',sans-serif;
    font-weight:700;
    font-size:17px;
    line-height:1.4;
    text-align:center;
    letter-spacing:.01em;
    margin:0;
  }
  .band-acceso .screenshot{
    flex:1 1 300px;
    aspect-ratio:4/5;
  }

  /* ---------- MODULE 2 ---------- */
  .m2{
    background:var(--wine);
    padding:70px 24px;
    color:var(--white);
  }
  .m2-flex{
    display:flex;
    gap:48px;
    align-items:flex-start;
    flex-wrap:wrap;
    margin-top:40px;
  }
  .field-list{
    flex:1 1 380px;
    display:flex;
    flex-direction:column;
    gap:18px;
  }
  .field-card{
    background:var(--white);
    color:var(--ink);
    border-left:6px solid var(--red-accent);
    box-shadow:var(--shadow-hard);
    padding:20px 24px;
    display:flex;
    align-items:center;
    gap:20px;
  }
  .field-card .icon-circle{background:var(--cream);}
  .field-card p{
    font-family:'Sora',sans-serif;
    font-weight:600;
    font-size:17px;
    line-height:1.4;
    margin:0;
  }
  .field-card strong{display:block;font-weight:700;}
  .m2 .screenshot{
    flex:1 1 320px;
    aspect-ratio:4/3.5;
  }
  .banner-importante{
    margin-top:48px;
    background:var(--red-bright);
    border-radius:40px;
    padding:32px 40px;
    display:flex;
    align-items:center;
    gap:24px;
  }
  .banner-importante .icon-circle{background:var(--white);}
  .banner-importante h4{
    font-family:'Sora',sans-serif;
    font-weight:600;
    font-size:22px;
    margin:0 0 6px;
  }
  .banner-importante p{
    font-family:'Sora',sans-serif;
    font-weight:600;
    font-size:16px;
    margin:0;
    line-height:1.4;
  }

  /* ---------- MODULE 3 ---------- */
  .m3{
    padding:70px 24px;
  }
  .m3-inner{max-width:1100px;margin:0 auto;}
  .m3 h2{
    font-family:'Sora',sans-serif;
    font-weight:700;
    font-size:30px;
    margin:0 0 6px;
  }
  .m3 .lead{
    font-family:'Sora',sans-serif;
    font-weight:700;
    font-size:17px;
    color:var(--wine-mid);
    margin:0 0 30px;
  }
  .notes-3col{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:20px;
    margin-bottom:24px;
  }
  .note{
    background:var(--cream);
    border-radius:15px;
    box-shadow:var(--shadow-hard);
    padding:18px 20px;
  }
  .note p{
    font-family:'Sora',sans-serif;
    font-weight:700;
    font-size:15px;
    text-align:center;
    line-height:1.4;
    margin:0;
  }
  .textarea-box{
    width:100%;
    min-height:130px;
    border-radius:8px;
    border:1px solid #ddd;
    background:var(--white);
    box-shadow:inset 0 1px 3px rgba(0,0,0,.08);
    margin-bottom:28px;
  }
  .m3 .screenshot{
    width:100%;
    aspect-ratio:2109/895;
  }

  /* ---------- MODULE 4 ---------- */
  .m4{
    padding:70px 24px;
  }
  .m4-inner{max-width:1150px;margin:0 auto;}
  .m4 h2{
    font-family:'Sora',sans-serif;
    font-weight:700;
    font-size:30px;
    margin:0 0 40px;
  }
  .m4-flex{
    display:flex;
    gap:48px;
    align-items:flex-start;
    flex-wrap:wrap;
  }
  .m4-callout{
    background:#BD3232;
    color:var(--white);
    border:3px solid #000;
    border-radius:15px;
    box-shadow:var(--shadow-hard);
    padding:24px 28px;
    flex:1 1 320px;
  }
  .m4-callout p{
    font-family:'Inter',sans-serif;
    font-weight:700;
    font-size:19px;
    line-height:1.3;
    margin:0;
  }
  .m4 .screenshot{
    flex:1 1 380px;
    aspect-ratio:1334/1141;
  }
  .action-fields{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:24px;
    margin-top:40px;
  }
  .action-field{
    background:var(--red-orange);
    color:var(--white);
    border-radius:15px;
    box-shadow:var(--shadow-hard);
    padding:22px 24px;
  }
  .action-field p{
    font-family:'Sora',sans-serif;
    font-weight:700;
    font-size:18px;
    text-align:center;
    line-height:1.35;
    margin:0;
  }
  .action-field strong{display:block;font-size:20px;margin-bottom:4px;}
  .m4-screenshot2{
    width:100%;
    aspect-ratio:1448/1087;
    margin:40px 0;
  }
  .note-band{
    background:var(--red);
    padding:26px 30px;
    display:flex;
    align-items:center;
    gap:24px;
    border-radius:8px;
    color:var(--white);
    box-shadow:var(--shadow-hard);
  }
  .note-band p{
    font-family:'Sora',sans-serif;
    font-weight:600;
    font-size:17px;
    line-height:1.4;
    margin:0;
  }

  /* ---------- MODULE 5 ---------- */
  .m5{
    background:var(--wine);
    color:var(--white);
    padding:70px 0 90px;
  }
  .m5-tools-intro{
    max-width:1100px;
    margin:0 auto 40px;
    padding:0 24px;
  }
  .tools-card{
    background:var(--red);
    border-radius:12px;
    box-shadow:var(--shadow-hard);
    padding:28px 36px;
    display:flex;
    gap:24px;
    align-items:flex-start;
  }
  .tools-card p{
    font-family:'Sora',sans-serif;
    font-weight:700;
    font-size:17px;
    line-height:1.4;
    margin:0;
  }
  .tools-card ul{
    margin:10px 0 0;
    padding-left:20px;
    font-family:'Sora',sans-serif;
    font-weight:600;
    font-size:16px;
  }

  .ishikawa-band{
    background:var(--amber);
    padding:24px;
    margin:20px 0 40px;
  }
  .ishikawa-band p{
    max-width:1000px;
    margin:0 auto;
    text-align:center;
    font-family:'Istok Web',serif;
    font-weight:700;
    font-size:20px;
    line-height:1.5;
    color:var(--ink);
  }

  .ishikawa-layout{
    max-width:1300px;
    margin:0 auto;
    padding:0 24px;
    display:grid;
    grid-template-columns:1fr 340px 1fr;
    gap:20px;
    align-items:center;
  }
  .ishikawa-col{display:flex;flex-direction:column;gap:24px;}
  .fish-note{
    background:#F3F3F3;
    color:var(--ink);
    border-radius:15px;
    box-shadow:var(--shadow-hard);
    padding:20px 22px;
  }
  .fish-note.left{border-left:7px solid var(--amber);}
  .fish-note.right{border-right:7px solid var(--amber);}
  .fish-note h5{
    font-family:'Inter',sans-serif;
    font-weight:700;
    font-size:17px;
    margin:0 0 6px;
  }
  .fish-note p{
    font-family:'Inter',sans-serif;
    font-weight:600;
    font-size:14px;
    line-height:1.4;
    margin:0;
  }
  .fishbone-img{
    aspect-ratio:1125/1688;
    width:100%;
  }

  .porques-band{
    background:var(--amber);
    padding:24px;
    margin-top:60px;
  }
  .porques-band p{
    max-width:900px;
    margin:0 auto;
    text-align:center;
    font-family:'Inter',sans-serif;
    font-weight:600;
    font-size:20px;
    line-height:1.5;
    color:var(--ink);
  }

  @media (max-width:900px){
    .cards-2col, .notes-3col, .action-fields{grid-template-columns:1fr;}
    .card.right{text-align:left;border-right:none;border-left:8px solid var(--wine);}
    .ishikawa-layout{grid-template-columns:1fr;}
  }
</style>
</head>
<body>

<!-- ============ HERO ============ -->
<header class="hero">
  <div class="hero-inner">
    <h1>MANUAL DE USUARIO</h1>
    <h2>Sistema de Gestión de Acciones Correctivas</h2>
    <div class="logo-row">
      <div class="logo">CORIMON&nbsp;/&nbsp;MONTANA PINTURAS</div>
      <a href="#modulo1" class="btn">Ingresar</a>
    </div>
  </div>
</header>

<!-- ============ MÓDULO 1 ============ -->
<section class="m1" id="modulo1">
  <div class="module-title">MÓDULO 1: ACCESO Y MODALIDADES DE INGRESO</div>
  <div class="cards-2col">
    <div class="card left">
      <h3>Acceso Sin Registro</h3>
      <p>Permite reportar un hallazgo o registrar una acción correctiva de forma rápida sin iniciar sesión.</p>
    </div>
    <div class="card right">
      <h3>Acceso Usuario Registrado</h3>
      <p>Requiere usuario y contraseña institucionales asignadas por el departamento de Calidad / TI. Otorga permisos de aprobación, asignación de responsables, análisis de causa raíz y cierre de acciones.</p>
    </div>
  </div>
</section>

<!-- ============ ACCESO SIN REGISTRO (banda oscura) ============ -->
<section class="band-acceso">
  <div class="container">
    <h2>Acceso Sin Registro</h2>
    <div class="band-flex">
      <div class="steps">
        <div class="step-card">
          <p>Paso 1: Portal de Bienvenida — Ingresa a la URL del portal e identifica el menú principal.</p>
        </div>
        <div class="step-card">
          <p>Paso 2: Opción "Realizar Registro" — Haz clic directo sobre el botón destacado en el panel frontal.</p>
        </div>
        <div class="step-card">
          <p>Paso 3: Formulario Express — Suministra la información del hallazgo o no conformidad detectada.</p>
        </div>
      </div>
      <div class="screenshot img-placeholder">Captura de pantalla<br>Portal de bienvenida / Formulario express<br><small>(reemplazar por imagen real)</small></div>
    </div>
  </div>
</section>

<!-- ============ MÓDULO 2 ============ -->
<section class="m2">
  <div class="container">
    <div class="module-title on-dark">MÓDULO 2: FORMULARIO DE REGISTRO CAPA</div>
    <div class="m2-flex">
      <div class="field-list">
        <div class="field-card">
          <div class="icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M6 2h9l5 5v15H6z"/><path d="M9 13h6M9 17h6"/></svg></div>
          <p><strong>Codificación</strong>Campo automático. El sistema genera un código único de seguimiento una vez ingresada la información.</p>
        </div>
        <div class="field-card">
          <div class="icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></svg></div>
          <p><strong>Fecha de Detección</strong>Selecciona el día, mes y año en que se detectó el hallazgo.</p>
        </div>
        <div class="field-card">
          <div class="icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.2-1.6l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2.8-1.6L13 2h-4l-.6 2.8A7 7 0 0 0 5.6 6.4l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 3 12"/></svg></div>
          <p><strong>Proceso Afectado</strong>Selecciona del buscador la gerencia o área donde ocurrió el evento.</p>
        </div>
        <div class="field-card">
          <div class="icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h1"/><path d="M17 21l2-2 3 3"/></svg></div>
          <p><strong>Dueño del Proceso</strong>Ingresa el nombre del responsable del área.</p>
        </div>
        <div class="field-card">
          <div class="icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1"/><circle cx="18" cy="8" r="3"/><path d="M22 21v-1a5 5 0 0 0-3-4.6"/></svg></div>
          <p><strong>Participantes</strong>Escribe los nombres de los colaboradores involucrados separados por comas.</p>
        </div>
      </div>
      <div class="screenshot img-placeholder">Captura de pantalla<br>Formulario de registro CAPA<br><small>(reemplazar por imagen real)</small></div>
    </div>

    <div class="banner-importante">
      <div class="icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg></div>
      <div>
        <h4>IMPORTANTE</h4>
        <p>Completa todos los campos para asegurar un registro correcto y un mejor seguimiento.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============ MÓDULO 3 ============ -->
<section class="m3">
  <div class="m3-inner">
    <div class="module-title" style="margin-bottom:8px;">MÓDULO 3: FORMULARIO DE REGISTRO CAPA</div>
    <h2 style="margin-top:30px;">Definición del Problema</h2>
    <p class="lead">Describa de forma breve y clara la no conformidad o hallazgo identificado en la operación.</p>

    <div class="notes-3col">
      <div class="note"><p>¿Qué ocurre? Especifique el detalle exacto del fallo o desviación encontrada.</p></div>
      <div class="note"><p>¿Cuándo ocurre? Indique el momento, fecha, turno o frecuencia con la que se manifiesta el problema.</p></div>
      <div class="note"><p>¿Dónde ocurre? Señale la ubicación física, equipo, área o línea de proceso afectada.</p></div>
    </div>

    <div class="textarea-box" aria-hidden="true"></div>

    <div class="screenshot img-placeholder" style="height:320px;">Captura de pantalla<br>Formulario de registro<br><small>(reemplazar por imagen real)</small></div>
  </div>
</section>

<!-- ============ MÓDULO 4 ============ -->
<section class="m4">
  <div class="m4-inner">
    <div class="module-title" style="margin-bottom:0;">MÓDULO 4: ACCIONES INMEDIATAS O CORRECTIVAS</div>
    <div class="m4-flex" style="margin-top:36px;">
      <div class="m4-callout">
        <p>Haga clic en el botón "+ Agregar acción". Esto desplegará la primera fila dinámica de campos interactivos (Acción, Fecha, Responsable y Estatus).</p>
      </div>
      <div class="screenshot img-placeholder">Captura de pantalla<br>Acciones inmediatas o correctivas<br><small>(reemplazar por imagen real)</small></div>
    </div>

    <div class="action-fields">
      <div class="action-field"><p><strong>1. Acción</strong>Ingrese la descripción de la medida correctiva implementada.</p></div>
      <div class="action-field"><p><strong>2. Fecha</strong>Seleccione la fecha de ejecución en el calendario desplegable.</p></div>
      <div class="action-field"><p><strong>3. Responsable</strong>Ingrese el nombre del encargado asignado a la tarea.</p></div>
      <div class="action-field"><p><strong>4. Estatus</strong>Seleccione en el menú desplegable el estado actual (Pendiente, En proceso o Ejecutada).</p></div>
    </div>

    <div class="screenshot img-placeholder m4-screenshot2">Captura de pantalla<br>Tabla de acciones registradas<br><small>(reemplazar por imagen real)</small></div>

    <div class="note-band">
      <div class="icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1"/><path d="M16 11l2 2 4-4"/></svg></div>
      <p>Si el evento requiere intervenciones adicionales, vuelva a presionar "+ Agregar acción" para insertar filas consecutivas. Si necesita remover una fila ingresada por error, haga clic en el icono de Papelera al final de dicha fila.</p>
    </div>
  </div>
</section>

<!-- ============ MÓDULO 5 ============ -->
<section class="m5">
  <div class="m5-tools-intro">
    <div class="tools-card">
      <div class="icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg></div>
      <div>
        <p>Selección de Herramientas de Análisis de Causa Raíz — En la parte inferior del módulo, el usuario dispone de dos casillas de verificación (checkboxes) para realizar el análisis según el nivel de detalle requerido.</p>
        <ul>
          <li>Diagrama de Ishikawa</li>
          <li>Método de los 5 Porqués</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="module-title on-dark" style="max-width:900px;margin:0 auto 20px;padding:0 24px;">
    MÓDULO 5: HERRAMIENTAS DE ANÁLISIS DE CAUSA RAÍZ
  </div>

  <div class="ishikawa-band">
    <p>Diagrama de Ishikawa (Espina de Pescado): Recomendado cuando la falla puede tener múltiples causas clasificadas por categorías (Mano de obra, Maquinaria, Materiales, Métodos, Medio ambiente, Medición).</p>
  </div>

  <div class="ishikawa-layout">
    <div class="ishikawa-col">
      <div class="fish-note left">
        <h5>Mano de obra</h5>
        <p>Ingrese factores vinculados al personal (ej. Falta de capacitación, Error en la manipulación, Fatiga del operador).</p>
      </div>
      <div class="fish-note left">
        <h5>Material</h5>
        <p>Ingrese problemas asociados a las materias primas o insumos (ej. Variación de viscosidad, Lote fuera de especificación, Empaque defectuoso).</p>
      </div>
      <div class="fish-note left">
        <h5>Medición</h5>
        <p>Ingrese inconsistencias en las herramientas de control o métricas (ej. Manómetro descalibrado, Muestreo insuficiente).</p>
      </div>
      <div class="fish-note left">
        <h5>Problema enfocado</h5>
        <p>El usuario debe redactar de forma clara y precisa el problema, no conformidad o desviación detectada.</p>
      </div>
    </div>

    <div class="fishbone-img img-placeholder">Diagrama de<br>Ishikawa<br><small>(reemplazar por imagen real)</small></div>

    <div class="ishikawa-col">
      <div class="fish-note right">
        <h5>Máquina</h5>
        <p>Ingrese fallas o desajustes en los equipos (ej. Desgaste de empacadura, Falla en sensor de presión, Falta de calibración).</p>
      </div>
      <div class="fish-note right">
        <h5>Método</h5>
        <p>Ingrese desviaciones en los procedimientos o instrucciones de trabajo (ej. Procedimiento desactualizado).</p>
      </div>
      <div class="fish-note right">
        <h5>Medio ambiente</h5>
        <p>Ingrese condiciones del entorno que afecten el proceso (ej. Alta humedad relativa, Variación de temperatura ambiental).</p>
      </div>
    </div>
  </div>

  <div class="porques-band">
    <p>Método de los 5 Porqués: Recomendado para profundizar de manera lineal e iterativa hasta dar con la causa origen del problema.</p>
  </div>
</section>

</body>
</html>