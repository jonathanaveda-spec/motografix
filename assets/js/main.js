/* =========================================================
   MotoGrafix — interacciones de la landing
   Cali, Valle del Cauca (Colombia)
   ========================================================= */
(function () {
  'use strict';

  /* -------------------------------------------------------
     CONFIGURACIÓN — cambia estos datos por los del taller
     ------------------------------------------------------- */
  const CONFIG = {
    // WhatsApp del taller. Formato internacional, solo dígitos (57 = Colombia).
    whatsapp: '573243836054',

    negocio: 'MotoGrafix',

    // Días de la semana cerrados. 0 = domingo, 6 = sábado.
    // El taller abre lunes a sábado, así que solo se cierra el domingo.
    diasCerrados: [0],

    // Antelación mínima para agendar, en días
    minDias: 1,

    // Clave de Web3Forms: hace que cada solicitud llegue TAMBIÉN al correo
    // del taller, sin depender de que el cliente pulse "Enviar por WhatsApp".
    //
    // Es una clave PÚBLICA, pensada para ir en el código del navegador: no
    // da acceso a la cuenta ni revela el correo de destino. Ese correo se
    // cambia desde el panel de https://app.web3forms.com
    //
    // Si se deja vacía, el formulario vuelve a funcionar solo por WhatsApp.
    formKey: '634f42f7-af18-4628-a3c6-b6d2e0170453'
  };

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Año en el footer ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Logo: si la imagen no existe, usa el logo de texto ---------- */
  $$('.logo__img').forEach((img) => {
    const usarFallback = () => {
      img.hidden = true;
      const fb = img.parentElement.querySelector('.logo__fallback');
      if (fb) fb.hidden = false;
    };
    img.addEventListener('error', usarFallback);
    // Por si la imagen ya falló antes de que corriera este script
    if (img.complete && img.naturalWidth === 0) usarFallback();
  });

  /* ---------- Enlace flotante de WhatsApp ---------- */
  const waFloat = $('#waFloat');
  if (waFloat) {
    waFloat.href = 'https://wa.me/' + CONFIG.whatsapp +
      '?text=' + encodeURIComponent('Hola ' + CONFIG.negocio + ', quiero información sobre un wrap.');
  }

  /* ---------- Header: sombra al hacer scroll + botón flotante ---------- */
  const header = $('#header');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-stuck', y > 8);
    if (waFloat) waFloat.classList.toggle('is-visible', y > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  const burger = $('#burger');
  const nav = $('#nav');
  if (burger && nav) {
    const closeMenu = () => {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menú');
    };
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  /* ---------- Animaciones de entrada ---------- */
  const revealables = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealables.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    revealables.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Enlace activo según la sección visible ---------- */
  const navLinks = $$('.nav__link');
  const sections = navLinks
    .map((link) => $(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) =>
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id)
        );
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Muestrario de acabados (hero) ---------- */
  const swatchTabs = $$('.swatchbook__tab');
  const swatchPanels = $$('.swatchbook__panel');
  if (swatchTabs.length && swatchPanels.length) {
    const abrirSwatch = (id) => {
      swatchTabs.forEach((tab) => {
        const activo = tab.dataset.swatch === id;
        tab.classList.toggle('is-active', activo);
        tab.setAttribute('aria-selected', String(activo));
        tab.tabIndex = activo ? 0 : -1;
      });
      swatchPanels.forEach((panel) => {
        const activo = panel.dataset.panel === id;
        panel.classList.toggle('is-active', activo);
        panel.hidden = !activo;
      });
    };
    swatchTabs.forEach((tab) => {
      tab.addEventListener('click', () => abrirSwatch(tab.dataset.swatch));
    });
    /* Flechas para moverse entre pestañas, como cualquier tablist */
    const swatchTabsEl = $('.swatchbook__tabs');
    if (swatchTabsEl) {
      swatchTabsEl.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const actual = swatchTabs.findIndex((t) => t.classList.contains('is-active'));
        const paso = e.key === 'ArrowRight' ? 1 : -1;
        const siguiente = swatchTabs[(actual + paso + swatchTabs.length) % swatchTabs.length];
        abrirSwatch(siguiente.dataset.swatch);
        siguiente.focus();
      });
    }
  }

  /* Cualquier botón "Agendar este acabado" precarga el servicio en el
     formulario, para que el cliente no tenga que volver a elegirlo. */
  const servicioSelect = $('#servicio');
  if (servicioSelect) {
    $$('[data-service]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const valor = btn.dataset.service;
        const existe = Array.from(servicioSelect.options).some((o) => o.value === valor);
        if (existe) servicioSelect.value = valor;
      });
    });
  }

  /* ---------- Feed de TikTok ----------

     El script de TikTok pesa y hace sus propias peticiones, así que NO se
     carga al abrir la página: esperamos a que el visitante se acerque a la
     sección. Si nunca baja hasta el portafolio, nunca se descarga.

     TikTok reemplaza el <blockquote> por un <iframe>. Eso es lo único que
     podemos mirar desde fuera para saber si cargó: el iframe es de otro
     dominio, así que el navegador no nos deja ver su contenido ni nos avisa
     si falló.

     Si a los 10 segundos no apareció el iframe, mostramos el respaldo. Pasa
     cuando la cuenta está privada, cuando TikTok responde con su protección
     de sobrecarga, o cuando el visitante tiene un bloqueador de rastreadores
     (Brave y Firefox lo traen activado por defecto).
  */
  const ttFrame = $('#ttFrame');
  if (ttFrame) {
    const ttLoading = $('#ttLoading');
    const ttFallback = $('#ttFallback');
    let lanzado = false;

    const ocultarCargando = () => {
      if (ttLoading) ttLoading.hidden = true;
    };

    const mostrarRespaldo = () => {
      ocultarCargando();
      ttFrame.hidden = true;
      if (ttFallback) ttFallback.hidden = false;
    };

    const cargar = () => {
      if (lanzado) return;
      lanzado = true;

      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      script.onerror = mostrarRespaldo;
      document.body.appendChild(script);

      /* Revisamos cada 400 ms si TikTok ya insertó su iframe. */
      const LIMITE = 10000;
      const inicio = Date.now();
      const revisar = setInterval(() => {
        if (ttFrame.querySelector('iframe')) {
          clearInterval(revisar);
          ocultarCargando();
          ttFrame.classList.add('is-ready');
        } else if (Date.now() - inicio > LIMITE) {
          clearInterval(revisar);
          mostrarRespaldo();
        }
      }, 400);
    };

    const seccion = $('#galeria');
    if ('IntersectionObserver' in window && seccion) {
      /* 400px de margen: empieza a cargar justo antes de que la sección
         entre en pantalla, para que al llegar ya esté lista. */
      const obs = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            cargar();
            obs.disconnect();
          }
        });
      }, { rootMargin: '400px' });
      obs.observe(seccion);
    } else {
      cargar();
    }
  }

  /* ---------- Formulario de citas ---------- */
  const form = $('#bookingForm');
  if (!form) return;

  const fecha = $('#fecha', form);
  const success = $('#formSuccess');
  const successText = $('#successText');
  const waLink = $('#waLink');

  /* Fecha mínima: mañana. Máxima: 3 meses. (en hora local, no UTC) */
  const toISO = (d) =>
    d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');

  const hoy = new Date();
  const min = new Date(hoy);
  min.setDate(min.getDate() + CONFIG.minDias);
  const max = new Date(hoy);
  max.setMonth(max.getMonth() + 3);
  if (fecha) {
    fecha.min = toISO(min);
    fecha.max = toISO(max);
  }

  const MENSAJES = {
    nombre:   'Escribe tu nombre completo.',
    telefono: 'Necesitamos un número válido (mínimo 7 dígitos).',
    vehiculo: 'Selecciona el tipo de vehículo.',
    servicio: 'Selecciona un servicio.',
    fecha:    'Elige una fecha disponible.',
    hora:     'Elige una hora.',
    acepto:   'Debes aceptar para poder contactarte.'
  };

  const setError = (input, msg) => {
    const field = input.closest('.field') || input.parentElement;
    const box = form.querySelector('[data-error-for="' + input.id + '"]');
    if (field) field.classList.toggle('has-error', Boolean(msg));
    if (box) box.textContent = msg || '';
  };

  const validarCampo = (input) => {
    const val = (input.value || '').trim();
    let msg = '';

    switch (input.id) {
      case 'nombre':
        if (val.length < 3) msg = MENSAJES.nombre;
        break;
      case 'telefono': {
        const digitos = val.replace(/\D/g, '');
        if (digitos.length < 7) msg = MENSAJES.telefono;
        break;
      }
      case 'fecha': {
        if (!val) { msg = MENSAJES.fecha; break; }
        const d = new Date(val + 'T12:00:00');
        if (CONFIG.diasCerrados.includes(d.getDay())) {
          msg = 'Los domingos el taller está cerrado. Elige otro día.';
        } else if (val < fecha.min) {
          msg = 'Agenda con al menos ' + CONFIG.minDias + ' día de anticipación.';
        } else if (val > fecha.max) {
          msg = 'Solo agendamos hasta 3 meses hacia adelante.';
        }
        break;
      }
      case 'acepto':
        if (!input.checked) msg = MENSAJES.acepto;
        break;
      default:
        if (input.required && !val) msg = MENSAJES[input.id] || 'Este campo es obligatorio.';
    }

    setError(input, msg);
    return !msg;
  };

  /* Valida al salir del campo y limpia el error al corregir */
  $$('input, select, textarea', form).forEach((input) => {
    input.addEventListener('blur', () => validarCampo(input));
    input.addEventListener('input', () => {
      const field = input.closest('.field');
      if (field && field.classList.contains('has-error')) validarCampo(input);
    });
    if (input.type === 'checkbox') {
      input.addEventListener('change', () => validarCampo(input));
    }
  });

  const formatoFecha = (iso) => {
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('es-CO', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  /* ---------- Copia por correo ----------
     Hasta ahora la cita solo llegaba si el cliente pulsaba "Enviar por
     WhatsApp". Quien llenaba el formulario y se iba, se perdía. Esto
     manda la solicitud al correo del taller apenas se pulsa "Solicitar
     cita", sin esperar ese segundo clic.

     No bloquea nada: el panel de confirmación aparece de inmediato y el
     envío viaja en segundo plano. Si falla, se le avisa al cliente para
     que use el WhatsApp y la cita no se pierda igual.                  */
  const avisoCorreo = $('#successMailWarn');

  const enviarPorCorreo = (data, fechaLarga) => {
    if (!CONFIG.formKey) return;   // sin clave configurada no hace nada

    const falló = () => { if (avisoCorreo) avisoCorreo.hidden = false; };

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: CONFIG.formKey,
        subject: 'Nueva cita: ' + data.nombre + ' — ' + data.servicio,
        from_name: 'Web de ' + CONFIG.negocio,
        botcheck: data.botcheck || '',

        Nombre: data.nombre,
        WhatsApp: data.telefono,
        Vehículo: data.vehiculo + (data.modelo ? ' (' + data.modelo + ')' : ''),
        Servicio: data.servicio,
        Fecha: fechaLarga + ' a las ' + data.hora,
        Detalles: data.mensaje || '(sin detalles)'
      })
    })
      .then((r) => r.json())
      .then((res) => { if (!res || !res.success) falló(); })
      .catch(falló);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const requeridos = $$('[required]', form);
    let primerError = null;

    requeridos.forEach((input) => {
      if (!validarCampo(input) && !primerError) primerError = input;
    });

    if (primerError) {
      primerError.focus({ preventScroll: true });
      primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const fechaLarga = formatoFecha(data.fecha);

    const texto =
      'Hola ' + CONFIG.negocio + ', quiero agendar una cita.\n\n' +
      '• Nombre: ' + data.nombre + '\n' +
      '• WhatsApp: ' + data.telefono + '\n' +
      '• Vehículo: ' + data.vehiculo + (data.modelo ? ' (' + data.modelo + ')' : '') + '\n' +
      '• Servicio: ' + data.servicio + '\n' +
      '• Fecha: ' + fechaLarga + ' a las ' + data.hora + '\n' +
      (data.mensaje ? '• Detalles: ' + data.mensaje + '\n' : '');

    const urlWhatsApp = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);

    /* WhatsApp se abre AQUÍ, dentro del mismo gesto del clic. Si se abriera
       después de esperar la respuesta del correo, el navegador lo tomaría
       como ventana emergente y lo bloquearía. Por eso va primero y el
       correo viaja después.
       El enlace del panel queda como salida por si aun así lo bloquean. */
    window.open(urlWhatsApp, '_blank', 'noopener');
    if (waLink) waLink.href = urlWhatsApp;

    if (successText) {
      successText.textContent =
        data.nombre.split(' ')[0] + ', anotamos tu cita para el ' + fechaLarga +
        ' a las ' + data.hora + '. Te abrimos WhatsApp con el resumen: envíalo y ' +
        'te confirmamos el cupo en menos de 2 horas hábiles.';
    }

    if (avisoCorreo) avisoCorreo.hidden = true;
    enviarPorCorreo(data, fechaLarga);

    form.classList.add('is-sent');
    if (success) {
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  const resetBtn = $('#resetForm');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.classList.remove('is-sent');
      if (success) success.hidden = true;
      $$('.has-error', form).forEach((f) => f.classList.remove('has-error'));
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();
