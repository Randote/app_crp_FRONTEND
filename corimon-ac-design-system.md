# Design System — Corimon AC
## Aplicación de Acciones Correctivas · Corimon C.A.

> Versión 1.1 · Estilo: Crema + Pizarra + Rojo Vino · Light mode corporativo cálido

---

## 0. Changelog v1.0 → v1.1

La v1.0 definía **Pizarra `#2A2720`** como color de botón primario y acento de navegación activa. Durante la construcción real de la app (login, formularios) se adoptó **Rojo Vino `#8B1A2A`** como el único acento interactivo, dejando Pizarra como color neutro de texto y headings. Esta versión documenta ese cambio de forma consistente en todos los componentes:

| Componente                    | v1.0 (antes)        | v1.1 (ahora)         |
|--------------------------------|---------------------|------------------------|
| Botón primario (fondo)         | Pizarra `#2A2720`   | Rojo Vino `#8B1A2A`   |
| Botón primario (hover)         | —                    | Vino oscuro `#701420` |
| Borde activo sidebar            | Pizarra soft `#8B7355` | Rojo Vino `#8B1A2A` |
| Focus de inputs                 | Pizarra soft `#8B7355` | Rojo Vino `#8B1A2A` |
| Links / acciones de texto       | —                    | Rojo Vino `#8B1A2A`   |
| Toggle switch (estado "on")     | sin definir          | Rojo Vino `#8B1A2A`   |
| Pizarra `#2A2720`               | Acento principal     | Neutro (texto, headings, logo) |

Los **estados/badges** (Nueva, En proceso, Cerrada, Vencida) **no cambian** — siguen siendo inamovibles e independientes del acento de marca.

---

## 1. Identidad y principios

**Empresa:** Corimon C.A. — fabricante venezolano de pinturas y recubrimientos industriales
**Aplicación:** Gestión de Acciones Correctivas (AC) — formularios de 4 y 7 pasos
**Usuarios:** Personal operativo, supervisores y administradores de planta

### Principios de diseño
- **Claridad sobre decoración** — la información operativa debe leerse de un vistazo
- **Calidez corporativa** — no frío ni tecnológico; humano y confiable
- **Jerarquía visual clara** — el estado de cada AC es lo más importante
- **Funcional en planta** — legible en pantallas de tablet con buena y mala iluminación
- **Un solo acento interactivo** — Rojo Vino marca toda acción clickeable; el resto de la paleta es neutra o de estado

---

## 2. Paleta de colores

### Superficies y fondos

| Nombre          | Hex       | Uso                          |
|-----------------|-----------|------------------------------|
| Fondo base      | `#F8F5F0` | Fondo general de la página   |
| Sidebar         | `#F0EDE6` | Navegación lateral           |
| Card principal  | `#FFFFFF` | Cards, tablas, paneles       |
| Hover / elevada | `#F5F2EC` | Estado hover de cards        |
| Borde sutil     | `#E4DFD6` | Bordes de cards y divisores  |
| Borde medio     | `#D4CFC6` | Bordes con más énfasis       |

### Texto y neutros (Pizarra)

| Nombre           | Hex       | Uso                          |
|------------------|-----------|------------------------------|
| Texto primario   | `#2A2720` | Títulos, texto principal, logo |
| Texto secundario | `#6B6560` | Subtítulos, descripciones    |
| Texto terciario  | `#9A9590` | Labels, hints, placeholders  |
| Texto desactiv.  | `#C4C0BB` | Campos deshabilitados        |

> Pizarra ya **no** se usa como color de acción — solo como neutro de texto y elementos no interactivos (ej. número de paso completado en el stepper, ícono de logo).

### Acento principal — Rojo Vino

| Nombre           | Hex       | Uso                                          |
|------------------|-----------|-----------------------------------------------|
| Vino             | `#8B1A2A` | Botón primario, links activos, focus de input, borde activo sidebar, toggle "on" |
| Vino hover       | `#701420` | Hover de botón primario y acciones vino       |
| Crema texto      | `#F8F5F0` | Texto sobre botón primario (fondo vino)       |

### Estados y alertas *(inamovibles en todos los temas)*

| Estado            | Color texto    | Hex texto  | Fondo            | Hex fondo  | Borde     |
|-------------------|----------------|------------|-------------------|------------|-----------|
| Nueva / Abierta   | Azul acero     | `#4A7FA8` | Azul muy claro    | `#EAF2F8` | `#C5DCF0` |
| En proceso        | Ámbar          | `#B8892A` | Ámbar muy claro   | `#FBF3E0` | `#F0D9A0` |
| Cerrada           | Verde sage     | `#4A8F4A` | Verde muy claro   | `#EAF4EA` | `#B8D8B8` |
| Vencida / Crítica | Rojo ladrillo  | `#B85050` | Rojo muy claro    | `#FAECEC` | `#F0C0C0` |

> El rojo ladrillo de "Vencida" (`#B85050`) es distinto del Rojo Vino (`#8B1A2A`) — son intencionalmente diferentes para no confundir "estado crítico" con "acción interactiva".

---

## 3. Tipografía

### Fuentes

| Fuente        | Uso                              | CDN / Import                          |
|---------------|-----------------------------------|----------------------------------------|
| **Sora**      | Toda la interfaz (UI, headings)  | `fonts.google.com/specimen/Sora`      |
| **Fira Code** | Códigos de AC (AC-2024-XXXX)      | `fonts.google.com/specimen/Fira+Code` |

```css
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap');
```

### Escala tipográfica

| Nombre     | Fuente    | Tamaño | Peso | Color     | Uso                        |
|------------|-----------|--------|------|-----------|-----------------------------|
| Display    | Sora      | 26px   | 600  | `#2A2720` | Títulos de página          |
| Heading 1  | Sora      | 20px   | 600  | `#2A2720` | Encabezados de sección     |
| Heading 2  | Sora      | 16px   | 500  | `#2A2720` | Títulos de card             |
| Heading 3  | Sora      | 14px   | 500  | `#2A2720` | Subtítulos                  |
| Body       | Sora      | 14px   | 400  | `#6B6560` | Texto de cuerpo              |
| Body small | Sora      | 12px   | 400  | `#6B6560` | Texto secundario en cards   |
| Label      | Sora      | 11px   | 500  | `#9A9590` | Labels de campo, hints      |
| Overline   | Sora      | 9px    | 500  | `#9A9590` | Secciones del sidebar       |
| Code       | Fira Code | 11px   | 400  | `#9A9590` | Códigos AC-YYYY-XXXX        |

### Espaciado de línea
- Headings: `line-height: 1.25`
- Body: `line-height: 1.6`
- Labels: `line-height: 1.4`

---

## 4. Espaciado y layout

### Escala de espaciado (base 4px)

| Token  | Valor | Uso típico                        |
|--------|-------|------------------------------------|
| `xs`   | 4px   | Gap interno de badges, iconos     |
| `sm`   | 8px   | Gap entre elementos inline         |
| `md`   | 12px  | Gap entre cards, padding interno  |
| `lg`   | 16px  | Padding de cards, sección          |
| `xl`   | 20px  | Padding de panels, topbar          |
| `2xl`  | 24px  | Espaciado entre secciones          |
| `3xl`  | 32px  | Margen de página                   |

### Layout del dashboard

```
┌─────────────────────────────────────────────────────┐
│  SIDEBAR (210px fijo)  │  MAIN CONTENT (flex: 1)    │
│                        │                             │
│  Logo + subtítulo      │  Topbar                     │
│  ─────────────────     │  KPI row (4 cards)          │
│  PRINCIPAL             │  Content row:               │
│    Dashboard ◄activo   │    Tabla (flex:1)           │
│    Nueva AC            │    Panel lateral (175px)    │
│    Mis acciones        │                             │
│  ─────────────────     │                             │
│  GESTIÓN               │                             │
│    Seguimiento         │                             │
│    Equipo              │                             │
│    Reportes            │                             │
│  ─────────────────     │                             │
│  SISTEMA               │                             │
│    Configuración       │                             │
└─────────────────────────────────────────────────────┘
```

### Border radius

| Token  | Valor | Uso                         |
|--------|-------|-------------------------------|
| `sm`   | 6px   | Badges, inputs pequeños       |
| `md`   | 8px   | Botones, inputs                |
| `lg`   | 10px  | Cards, paneles                 |
| `xl`   | 14px  | Contenedor principal            |

---

## 5. Módulos de la aplicación

### Módulo 1 — Dashboard
- KPIs: Abiertas · En proceso · Cerradas · Vencidas
- Tabla de acciones recientes con filtros
- Panel de distribución por estado (barras horizontales)
- Botón "+ Nueva AC" en topbar (estilo primario — fondo Vino)

### Módulo 2 — Nueva AC · Tipo 1 (Personal operativo, 4 pasos)

| Paso | Nombre            | Campos principales                                    |
|------|--------------------|--------------------------------------------------------|
| 1    | Identificación    | Área (dropdown), Fecha, Descripción, Nivel de impacto |
| 2    | Causa raíz         | Categoría, Descripción, ¿Es recurrente? (toggle)       |
| 3    | Acción correctiva | Descripción, Responsable, Fecha límite, Recursos        |
| 4    | Confirmación       | Resumen read-only, checkbox, botón Enviar                |

### Módulo 3 — Nueva AC · Tipo 2 (Supervisores/Gerencia, 7 pasos)

| Paso | Nombre              | Campos principales                                       |
|------|----------------------|------------------------------------------------------------|
| 1–4  | (mismos que Tipo 1) | —                                                          |
| 5    | Aprobación           | Revisor asignado, comentarios, toggle aprobación            |
| 6    | Seguimiento          | Evidencias (adjuntos), % avance, comentarios                 |
| 7    | Cierre formal        | Fecha de cierre, lecciones aprendidas, firma digital          |

### Módulo 4 — Mis acciones
- Listado de ACs asignadas al usuario
- Filtros: estado, área, fecha, nivel de impacto
- Vista de tabla + vista de cards (toggle)

### Módulo 5 — Seguimiento
- Timeline horizontal de estados por AC individual
- Comentarios con hilo por AC
- Adjuntos y evidencias

### Módulo 6 — Equipo
- Listado de usuarios con rol y área
- Asignación de responsables a ACs

### Módulo 7 — Reportes
- Filtros: rango de fechas, área, responsable, estado, tipo
- Exportar a PDF y Excel
- Gráficas: barras por área, torta por estado, línea temporal

### Módulo 8 — Configuración
- Gestión de usuarios y roles
- Gestión de áreas / departamentos
- Parámetros de la aplicación

---

## 6. Componentes

### Botones

| Variante   | Fondo         | Texto       | Borde        | Uso                          |
|------------|---------------|-------------|--------------|-------------------------------|
| Primary    | `#8B1A2A`     | `#F8F5F0`   | ninguno      | Acción principal (login, enviar, +Nueva AC) |
| Primary hover | `#701420`  | `#F8F5F0`   | ninguno      | Hover de Primary               |
| Secondary  | transparente  | `#2A2720`   | `#D4CFC6`    | Acción secundaria               |
| Ghost      | transparente  | `#9A9590`   | ninguno      | Cancelar, acciones suaves        |
| Danger     | transparente  | `#B85050`   | `#F0C0C0`    | Eliminar, acciones críticas       |

Altura: `36px` · Padding: `8px 16px` · Border-radius: `8px` · Font: Sora 500 13px

> Nota: el botón Primary ya no usa Pizarra. Pizarra queda reservada para texto y para el borde/texto de Secondary.

### Badges de estado

```
● Nueva      — texto #4A7FA8  fondo #EAF2F8  borde #C5DCF0
● En proceso — texto #B8892A  fondo #FBF3E0  borde #F0D9A0
● Cerrada    — texto #4A8F4A  fondo #EAF4EA  borde #B8D8B8
● Vencida    — texto #B85050  fondo #FAECEC  borde #F0C0C0
```

Padding: `3px 9px` · Border-radius: `5px` · Font: Sora 500 10px
Punto de color: `5×5px` círculo, misma familia de color

### Inputs

```css
background:    #FFFFFF
border:        0.5px solid #D4CFC6
border-radius: 8px
padding:       9px 12px
font:          Sora 400 13px #2A2720
placeholder:   #C4C0BB
height:        36px

/* Focus */
border-color:  #8B1A2A   /* antes #8B7355 */
outline:       none

/* Error */
border-color:  #B85050
```

### KPI Card

```
┌─────────────────────┐
│ ABIERTAS            │  ← Label: Sora 9px 500 #9A9590 uppercase
│                     │
│ 14                  │  ← Valor: Sora 600 26px color del estado
│ este mes            │  ← Sub: Sora 400 10px #C4C0BB
└─────────────────────┘
Background: #FFFFFF · Border: 0.5px #E4DFD6 · Radius: 10px · Padding: 14px 16px
```

### Stepper de pasos

```
  ✓          ✓          [3]         4
Problema  Causa raíz  Acción   Confirmar
 ——————————————————————
```

- Completado: círculo verde `#4A8F4A` bg `#EAF4EA` con ✓
- Activo: círculo `#2A2720` bg con número blanco *(se mantiene Pizarra — es un indicador de estado, no una acción clickeable)*
- Pendiente: círculo gris `#E4DFD6` con número `#9A9590`
- Línea conectora: `0.5px solid #E4DFD6`; completada: `#B8D8B8`
- Label: Sora 10px `#9A9590`; activo: `#2A2720`

### Item del sidebar

```css
/* Default */
padding:       9px 20px;
font-size:     12px;
color:         #9A9590;
border-left:   2px solid transparent;

/* Active */
color:         #2A2720;
background:    #E4DFD6;
border-left:   2px solid #8B1A2A;   /* antes #8B7355 */
font-weight:   500;

/* Hover */
background:    #EAE7E0;
color:         #2A2720;
```

### Toggle switch

```css
/* Off */
background:    #D4CFC6;
border-radius: 999px;
width: 36px; height: 20px;

/* On */
background:    #8B1A2A;

/* Círculo (ambos estados) */
background:    #FFFFFF;
border-radius: 50%;
size: 16px;
```

---

## 7. Iconografía

Librería: **Tabler Icons** (outline) — `https://tabler.io/icons`

| Módulo        | Ícono Tabler            |
|----------------|---------------------------|
| Dashboard      | `ti-layout-dashboard`     |
| Nueva AC       | `ti-circle-plus`          |
| Mis acciones   | `ti-list-check`           |
| Seguimiento    | `ti-eye`                  |
| Equipo         | `ti-users`                |
| Reportes       | `ti-chart-bar`            |
| Configuración  | `ti-settings`             |
| Adjuntar       | `ti-paperclip`            |
| Exportar       | `ti-download`             |
| Editar         | `ti-edit`                 |
| Eliminar       | `ti-trash`                |
| Buscar         | `ti-search`               |
| Notificación   | `ti-bell`                 |
| Calendario     | `ti-calendar`             |
| Usuario        | `ti-user`                 |

Tamaño en sidebar: `15px` · En botones: `14px` · Decorativo: `20px`

---

## 8. CSS tokens de referencia

```css
:root {
  /* Superficies */
  --bg-base:        #F8F5F0;
  --bg-sidebar:     #F0EDE6;
  --bg-card:        #FFFFFF;
  --bg-hover:       #F5F2EC;
  --bg-active-nav:  #E4DFD6;

  /* Bordes */
  --border-subtle:  #E4DFD6;
  --border-medium:  #D4CFC6;

  /* Texto / neutros (Pizarra) */
  --text-primary:   #2A2720;
  --text-secondary: #6B6560;
  --text-tertiary:  #9A9590;
  --text-disabled:  #C4C0BB;

  /* Acento principal — Rojo Vino */
  --accent-wine:        #8B1A2A;
  --accent-wine-hover:  #701420;

  /* Estados */
  --open-text:     #4A7FA8;   --open-bg:    #EAF2F8;
  --process-text:  #B8892A;   --process-bg: #FBF3E0;
  --done-text:     #4A8F4A;   --done-bg:    #EAF4EA;
  --expired-text:  #B85050;   --expired-bg: #FAECEC;

  /* Radios */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-xl: 14px;

  /* Espaciado */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  12px;
  --space-lg:  16px;
  --space-xl:  20px;
  --space-2xl: 24px;
  --space-3xl: 32px;
}
```

> `--accent-medium: #8B7355` (Pizarra soft) de la v1.0 queda **deprecado** — todo lo que lo usaba (focus de inputs, borde activo del sidebar) ahora usa `--accent-wine`.

---

*Documento generado para Corimon C.A. — Proyecto Acciones Correctivas*
*Versión 1.1 — Estilo Crema + Pizarra + Rojo Vino*