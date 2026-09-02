# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dueños de motocicletas en Cali, Valle del Cauca, que quieren personalizar o
proteger su vehículo (wrap, kits gráficos, calcomanías, PPF) y llegan al sitio
para dos cosas: ver trabajos reales del taller (portafolio) y agendar una cita.
Ocasionalmente también llegan dueños de autos o camionetas, pero el enfoque
principal del negocio y del contenido son las motos.

## Product Purpose

La landing page es la vitrina digital del taller MotoGrafix. Debe generar
confianza mostrando trabajos reales terminados y facilitar al máximo que el
visitante agende una cita, que se confirma manualmente por WhatsApp. Éxito =
citas agendadas por WhatsApp y visitantes que navegan el portafolio antes de
decidirse.

## Positioning

Instalación certificada, vinilo premium de alta durabilidad, garantía de 3
años, +600 vehículos intervenidos, y diseños que no se repiten ("Tu moto. Tu
estilo. Sin repetirse"). El acabado "tornasol" (iridiscente) es una seña de
identidad real del taller, no un recurso decorativo: sale de los wraps que de
verdad instalan.

## Operating Context

- Taller físico: Carrera 15 # 49-72, Barrio Chapineros, Cali, Valle del Cauca.
- Horario: lunes a sábado, 9:30 a.m. a 6:30 p.m., jornada continua. Cerrado
  domingos y festivos (los festivos no se bloquean en el calendario del
  formulario; el sitio avisa que la cita igual se confirma manualmente por
  WhatsApp).
- Canal de confirmación: WhatsApp (324 383 6054 / `573243836054`). El
  formulario de citas es 100% del lado del cliente: arma un mensaje de
  WhatsApp con el resumen (nombre, teléfono, vehículo, servicio, fecha, hora,
  notas) y el cliente lo envía; no hay backend ni almacenamiento de citas.
- Redes: Instagram [@motografix02](https://www.instagram.com/motografix02),
  TikTok [@moto.grafix](https://www.tiktok.com/@moto.grafix).
- Marcas de moto atendidas: Yamaha, AKT, Honda, Victory, Suzuki, Bajaj, KTM,
  BMW, Hero, Voge.

## Capabilities and Constraints

- Sitio estático (HTML/CSS/JS plano), sin build ni dependencias, desplegado en
  Vercel (`vercel.json`). Sin backend: el `submit` del formulario solo arma un
  link de WhatsApp (hay un bloque comentado en `main.js` listo para un
  `fetch()` a un endpoint propio si algún día se quiere guardar citas en
  servidor).
- Portafolio organizado por servicio (`wrap`, `graficos`, `rines`), no por
  tipo de vehículo, porque el foco es motos. Hoy todas las fotos del
  portafolio son de motos; autos/camionetas aún no están representados ahí
  aunque el taller sí los atiende ocasionalmente.
- Precios fijos y visibles (COP): wrap completo moto $400.000, kit gráfico
  original $90.000, kit gráfico personalizado $160.000, calcomanías desde
  $20.000, PPF moto completa $500.000; rotulación comercial y detalles/blackout
  a cotización.
- El formulario bloquea automáticamente domingos, fechas con menos de un día
  de anticipación y fechas a más de 3 meses; horas disponibles 9:30 a.m. a
  5:30 p.m.

## Brand Commitments

- Nombre: MotoGrafix. Logo horizontal (barra superior) y apilado (footer) ya
  existen como PNG; si faltara alguno, el sitio cae a un logotipo de texto de
  respaldo.
- Tema oscuro "asfalto" ya establecido, con paleta de marca y tornasol fijadas
  en `assets/css/styles.css` (`--red`, `--yellow`, `--blue` de marca;
  `--iri-1/2/3` para el tornasol). Tipografía: Barlow Condensed + Inter
  (Google Fonts).
- Accesibilidad ya implementada como estándar a preservar: skip link, foco
  visible, `aria-*` en menú y filtros, respeta `prefers-reduced-motion`,
  campos de formulario en `font-size:16px` (evita zoom automático de Safari
  iOS).

## Evidence on Hand

- Fotos reales de trabajos terminados en `assets/img/trabajos/` (motos AKT,
  Honda, Suzuki, Yamaha). No hay testimonios ni casos de estudio en texto
  todavía — no inventar.
- Datos reales de contacto, horario, dirección y precios (arriba). Sin
  prensa ni certificaciones documentadas más allá de "instalación
  certificada" como afirmación del taller.

## Product Principles

1. La prueba vende, no la afirmación: fotos reales de trabajos y cifras
   concretas (+600 vehículos, 3 años de garantía) hacen el trabajo de
   convencer, no el copy.
2. El camino a "Agendar cita" debe ser el más corto posible: toda decisión de
   layout y jerarquía visual prioriza que ese CTA esté siempre cerca y sea
   obvio.
3. Durabilidad y oficio por encima de la moda: vinilo premium, instalación
   certificada y el acabado tornasol son las diferencias reales del taller,
   no un ángulo de marketing.
4. Identidad centrada en motos: el contenido y el tono priorizan motos aunque
   el taller atienda autos/camionetas de forma ocasional; no forzar
   protagonismo de otros vehículos que aún no tienen evidencia en el
   portafolio.

## Accessibility & Inclusion

Sin requisito específico más allá del estándar ya implementado (ver Brand
Commitments): skip link, foco visible, `aria-*`, `prefers-reduced-motion`,
tamaño de fuente táctil en formularios.
