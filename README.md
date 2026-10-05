# MotoGrafix — Landing page

Landing page para el taller de **wrapping, vinilos y calcomanías** MotoGrafix
(Cali, Valle del Cauca). Sus dos funciones principales son **agendar citas** y
**mostrar trabajos realizados**.

## Estructura

```
motografix/
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── img/
│       ├── logo-motografix.png          ← logo horizontal (barra superior)
│       ├── logo-motografix-stacked.png  ← logo apilado (footer)
│       └── favicon.svg
└── README.md
```

Abre `index.html` en el navegador. No necesita build ni dependencias.

---

## Datos del negocio configurados

- **Dirección:** Carrera 15 # 49-72, Barrio Chapineros, Cali, Valle del Cauca — Colombia
- **Horario:** lunes a sábado, jornada continua de 9:30 a.m. a 6:30 p.m.
- **Cerrado:** domingos y días festivos
- **WhatsApp:** 324 383 6054 (`573243836054` en formato internacional)
- **Instagram:** [@motografix02](https://www.instagram.com/motografix02)
- **TikTok:** [@moto.grafix](https://www.tiktok.com/@moto.grafix)
- **Marcas que atendemos:** Yamaha, AKT, Honda, Victory, Suzuki, Bajaj, KTM, BMW, Hero, Voge

Las marcas van en la franja deslizante bajo el hero (`<section class="marquee">` en
`index.html`). Para agregar o quitar una, edítala **en los dos bloques de `<span>`**:
la lista está duplicada a propósito para que el desplazamiento sea continuo, y las
dos mitades deben ser idénticas.

Si el número cambia, hay que tocarlo en dos sitios: `CONFIG.whatsapp` en
`assets/js/main.js` y los enlaces del `<footer>` en `index.html`.

## Precios (COP)

| Servicio | Precio |
|---|---|
| Wrap completo (moto) | $400.000 |
| Kit gráfico original | $90.000 |
| Kit gráfico personalizado | $160.000 |
| Calcomanías y stickers | desde $20.000 |
| PPF — moto completa | $500.000 |
| Rotulación comercial | a cotización |
| Detalles y blackout | a cotización |

Se editan en la sección `#servicios` de `index.html` (dentro de `<p class="card__price">`)
y en el `<select id="servicio">` del formulario.

---

## Cómo funciona el formulario de citas

Es 100 % del lado del cliente. Valida los campos y **bloquea automáticamente**:

- domingos,
- fechas con menos de un día de anticipación,
- fechas a más de 3 meses.

Las horas disponibles van de 9:30 a.m. a 5:30 p.m., para que el último trabajo
alcance a cerrarse antes de las 6:30 p.m.

Al enviar, arma un mensaje de WhatsApp con el resumen completo de la cita
(nombre, teléfono, vehículo, servicio, fecha, hora y notas). El cliente pulsa
**Enviar por WhatsApp** y llega al taller.

> Los festivos **no** se bloquean en el calendario: la página avisa en el FAQ y en
> el footer que no se atiende en festivos, y la cita se confirma manualmente por
> WhatsApp de todos modos.

Si más adelante quieres guardar las citas en un servidor, al final del `submit`
en `main.js` hay un bloque comentado con el `fetch()` listo para tu endpoint.

---

## Portafolio: el feed de TikTok

La galería **ya no son fotos locales**. La sección `#galeria` muestra el
*embed de creador* oficial de TikTok, que trae hasta los **10 videos más
recientes de [@moto.grafix](https://www.tiktok.com/@moto.grafix)** y se
actualiza solo: cuando Jonathan publica en TikTok, aparece en la página sin
tocar código ni volver a desplegar.

### Cómo cambiar de cuenta

En `index.html`, dentro de `<div class="tt">`, hay que editar **dos cosas**
en el mismo bloque:

```html
<blockquote class="tiktok-embed"
            cite="https://www.tiktok.com/@moto.grafix"
            data-unique-id="moto.grafix"      ← aquí
            data-embed-type="creator">
  <section>
    <a target="_blank" rel="noopener"
       href="https://www.tiktok.com/@moto.grafix?refer=creator_embed">@moto.grafix</a>
  </section>                                   ← y el href de aquí
</blockquote>
```

Y en `assets/css/styles.css` no hay que tocar nada.

### La altura es obligatoria y va en el CSS

Esto es lo más fácil de romper. TikTok declara su embed como `height: 100%`,
o sea que **rellena lo que le demos**. Si el contenedor no define una altura,
el iframe se queda en los 150 px que el navegador da por defecto y no se ve
nada.

La altura tiene que bajar en cadena, y los tres eslabones están en el CSS:

```
.tt__frame        height:470px   (540px en celular)
  └ blockquote    height:100% !important
      └ iframe    height:100% !important
```

Los `!important` hacen falta porque `embed.js` escribe sus propios estilos en
línea. Si algún día el feed aparece aplastado en una franja delgada, es que se
rompió uno de esos tres eslabones.

Las medidas salieron de medir el contenido real: **457 px de alto a 720 px de
ancho**. En celular el encabezado del perfil (nombre, cifras y biografía)
envuelve en más líneas, por eso allá se le dan 540 px.

### El script se carga tarde, a propósito

`embed.js` no se descarga al abrir la página. `main.js` espera con un
`IntersectionObserver` a que el visitante se acerque a la sección (400 px
antes). Si nunca baja hasta el portafolio, nunca se descarga. Eso mantiene
rápida la primera carga, que es la que importa en datos móviles.

### El respaldo

Si a los 10 segundos TikTok no insertó su iframe, la página oculta el feed y
muestra `#ttFallback`: una tarjeta con enlaces a TikTok e Instagram. Pasa en
tres casos:

- la cuenta se volvió **privada** (TikTok no deja embeber cuentas privadas);
- TikTok responde con su **protección de sobrecarga** (`overload-protect`),
  que se activa si recibe muchas peticiones seguidas desde la misma IP;
- el visitante usa un **bloqueador de rastreadores** — Brave y Firefox lo
  traen activado de fábrica y bloquean `tiktok.com/embed.js`.

Ese último caso no es raro, así que el respaldo no es decorativo: para una
parte real de los visitantes es lo único que van a ver. Por eso está escrito
como una invitación y no como un mensaje de error.

### Lo que se perdió al cambiar

Vale tenerlo presente por si algún día conviene volver atrás:

- **Los filtros por servicio** (Wrap / Gráficos / Rines). El feed de TikTok es
  cronológico y no se puede filtrar.
- **El visor de fotos** a pantalla completa.
- **La indexación en Google.** Google indexaba las fotos con su `alt`; los
  videos dentro de un iframe de TikTok no cuentan como contenido de la página.

Las 9 fotos **siguen en `assets/img/trabajos/`** y el código de la galería
sigue en el historial de git, así que restaurarla es revertir un commit.

### Peso de las fotos

Las fotos que quedan en uso están en el hero y en el muestrario de acabados.
Ideal por debajo de 300 KB cada una. `yamaha-xtz-150-graficos-tornasol.jpeg`
pesa 879 KB, pero **ya no se carga en ninguna parte** desde que se quitó la
galería: solo ocupa espacio en el repositorio.

## Las fotos del hero

Las tres fotos superpuestas del encabezado (`<div class="hero__visual">`) son
**las mismas de la galería**, a propósito: el navegador las descarga una sola vez
y las reutiliza desde caché cuando el visitante llega al portafolio.

Si las cambias, usa fotos que ya estén en la galería. Si pones fotos nuevas,
sumas ese peso a la primera carga de la página, que es la que más importa.

El rojo, el amarillo y el azul de la marca siguen ahí: ahora van en las etiquetas
(`tag--red`, `tag--blue`, `tag--yellow`) en vez de en bloques de color sueltos.

## Paleta de colores

Tema oscuro completo, estilo "asfalto". En `assets/css/styles.css`, dentro de `:root`:

```css
/* Marca — los tres del logo, subidos de tono para que peguen en oscuro */
--red: #FF2E3F;    /* acento principal, CTAs */
--yellow: #FFC933; /* acento secundario, viñetas */
--blue: #3D7BFF;   /* foco, enlaces, estados */

/* Tornasol — el color insignia, sacado de los wraps del taller */
--iri-1: #A855F7;  /* morado */
--iri-2: #3D7BFF;  /* azul   */
--iri-3: #22D3EE;  /* cian   */
```

El tornasol se usa en el titular del hero ("Sin repetirse"), en la barra
superior de las tarjetas de servicio al pasar el mouse, en los resplandores
del fondo del hero y en el bloque de llamada a la acción.

### Los grises son cuatro y cada uno tiene su trabajo

Es lo más fácil de romper si se editan a ojo:

| Variable | Para qué |
|---|---|
| `--bg` `#08090C` | fondo de la página |
| `--bg-soft` `#0D1015` | bandas de sección y campos del formulario |
| `--surface` `#14171E` | tarjetas y paneles que van *encima* de la página |
| `--surface-2` `#1B1F28` | campo del formulario cuando está enfocado |
| `--ink` `#0B0D12` | negro más profundo: hero, galería, pie, menú móvil |

Y el texto: `--text` para el principal, `--text-2` para el secundario,
`--gray` / `--gray-2` para el apagado.

### El grano

La textura de grano de película sale de un SVG en línea aplicado en `body::after`
al 4,5 % de opacidad. Le quita el brillo digital al negro. Si molesta, se baja la
`opacity` o se borra ese bloque: no afecta a nada más.

## Optimización para celulares

Puntos de quiebre: **980 px** (tablet), **760 px** (celular grande),
**560 px** (celular), **420 px** (celular pequeño), más un bloque
`@media (hover:none)` para pantallas táctiles.

Decisiones que conviene no deshacer sin querer:

- **Los campos del formulario van en `font-size:16px` exactos.** Por debajo de
  16 px, Safari en iPhone hace zoom automático al enfocar un campo y descuadra
  toda la página. Si quieres letra más chica, cambia el `padding`, no el tamaño.
- **`scroll-margin-top` en las secciones.** La barra superior es sticky; sin esa
  regla, al tocar un enlace del menú la sección aterriza escondida detrás.
- **El bloque `@media (hover:none)`.** En pantallas táctiles el `:hover` se queda
  pegado después de tocar: una tarjeta tocada se quedaba levantada. Ese bloque
  anula los efectos de mouse.
- **El feed de TikTok mide 540 px de alto en celular** y 470 px en escritorio.
  No es capricho: ver la sección del portafolio.
- **En el hero, el texto va antes que las fotos** en celular, para que el titular
  y el botón de agendar se vean sin hacer scroll. Y de las tres fotos superpuestas
  queda solo una: en 340 px de ancho las otras dos ni se distinguían.

## Notas

- La barra superior es oscura a propósito: el logo tiene letras blancas con
  contorno, y sobre fondo claro perdía legibilidad.
- Si alguno de los dos PNG del logo faltara, la página muestra automáticamente un
  logo de texto de respaldo en vez de romperse.
- Responsive de 320 px en adelante, con menú hamburguesa en móvil.
- Accesible: skip link, focus visible, `aria-*` en el menú, respeta
  `prefers-reduced-motion`.
- El feed de TikTok es contenido de un tercero dentro de un iframe: su aspecto
  lo controla TikTok, no este CSS. Viene con fondo claro y no se puede
  oscurecer desde aquí, así que rompe un poco con el tema oscuro del resto.
- Las fuentes vienen de Google Fonts (Barlow Condensed + Inter). Si necesitas que
  funcione sin internet, descárgalas a `assets/` y cambia el `<link>` del `<head>`.
