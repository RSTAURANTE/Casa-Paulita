

document.addEventListener('DOMContentLoaded', () => {
  formatearPrecios();
  inicializarHeader();
  inicializarNavMovil();
  inicializarRevelado();
  inicializarMenu();
  inicializarBuscador();
  inicializarBotonArriba();
  document.getElementById('year').textContent = new Date().getFullYear();
});

window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  setTimeout(() => {
    loader.classList.add('is-hidden');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    setTimeout(() => loader.remove(), 550);
  }, 650);
});



const formateadorMXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0
});

function formatearPrecios() {
  MENU_DATA.forEach(item => {
    item.precioFormateado = formateadorMXN.format(item.precio);
  });
}

function normalizarTexto(texto = '') {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}





function inicializarHeader() {
  const header = document.getElementById('site-header');

  const alScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  alScroll();
  window.addEventListener('scroll', alScroll, { passive: true });

  const secciones = ['inicio', 'menu', 'ubicacion', 'contacto']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const enlaces = document.querySelectorAll('.nav-link');

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        enlaces.forEach(a => {
          a.classList.toggle('is-active', a.getAttribute('href') === `#${entrada.target.id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  secciones.forEach(seccion => observador.observe(seccion));
}





function inicializarNavMovil() {
  const boton = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  boton.addEventListener('click', () => {
    const abierto = menu.classList.toggle('is-open');
    boton.classList.toggle('is-active', abierto);
    boton.setAttribute('aria-expanded', String(abierto));
  });

  menu.querySelectorAll('.nav-link').forEach(enlace => {
    enlace.addEventListener('click', () => {
      menu.classList.remove('is-open');
      boton.classList.remove('is-active');
      boton.setAttribute('aria-expanded', 'false');
    });
  });
}





function crearTarjetaMenu(item) {
  const articulo = document.createElement('article');
  articulo.className = 'menu-card';
  articulo.setAttribute('data-categoria', item.categoria);
  articulo.setAttribute('data-reveal', '');
  const imagenes = imagenItem(item);
  articulo.innerHTML = `
    <img class="menu-card__image" src="${imagenes[0]}" alt="${item.nombre}" loading="lazy">
    <h3>${item.nombre}</h3>
    <button type="button" class="menu-card__cta" data-id="${item.id}">
      Ver detalle
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  `;
  configurarImagen(articulo.querySelector('.menu-card__image'), imagenes, item.categoria);
  articulo.querySelector('.menu-card__cta').addEventListener('click', () => mostrarDetalle(item));
  return articulo;
}

function imagenItem(item) {
  const nombreArchivo = item.id
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  const nombreNormalizado = item.id
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  const nombres = [nombreArchivo, nombreNormalizado];
  if (item.id === 'huevos-al-albanil') nombres.push('huevos-al-albañil');
  if (item.id === 'huevos-divorciados') nombres.push('huevos-divorsiados');
  if (item.id === 'parrilla-de-corte-para-cuatro') nombres.push('parrilla-de-corte-para-cuatro-personas.webp');
  if (item.id === 'papas-a-la-francesa-compa') nombres.push('papas-a-la-francesa-compartir');

  return [...new Set(nombres)].flatMap(nombre =>
    ['jpg', 'png', 'webp'].map(extension =>
      `assets/images/menu/${nombre}.${extension}`
    )
  );
}

function configurarImagen(imagen, imagenes, categoria) {
  let indiceImagen = 0;

  const cambiarImagen = () => {
    indiceImagen += 1;
    if (imagenes[indiceImagen]) {
      imagen.src = imagenes[indiceImagen];
      return;
    }
    imagen.removeEventListener('error', cambiarImagen);
    imagen.src = imagenCategoria(categoria);
  };

  imagen.addEventListener('error', cambiarImagen);
}

function imagenCategoria(categoria) {
  const imagenes = {
    huevos: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=720&q=80',
    'omelett´s': 'https://images.unsplash.com/photo-1510693206972-df098f0cbf7b?auto=format&fit=crop&w=720&q=80',
    'enchiladas': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=720&q=80',
    'el-antojo-casa': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=720&q=80',
    bebidas: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=720&q=80'
  };
  return imagenes[categoria] || imagenes['enchiladas'];
}

function etiquetaCategoria(categoria) {
  const nombres = {
    huevos: 'Huevos',
    'omelett´s': 'Omelette´s',
    chilaquiles: 'Chilaquiles',
    'enchiladas': 'Enchiladas',
    bebidas: 'Bebidas',
    platillos: 'Platillos',
    hamburguesas: 'Hamburguesas',
    cortes: 'Cortes',
    alambres: 'Alambres',
    burritos: 'Burritos',
    'para-compartir': 'Para compartir',
    sandwiches: 'Sandwiches',
    'consome-o-arroz': 'Consomé o arroz',
    'guisado-del-dia': 'Guisado del día',
    'bistec-y-pechuga': 'Bistec y pechuga',
    'platillos-tradicionales': 'Platillos tradicionales',
    shots: 'Shots',
    pastas: 'Pastas',
    'antojo-de-la-casa': 'El antojo de la casa',
    snacks: 'Snacks',
    boneless: 'Boneless',
    'combos-guateque': 'Combos del guateque',
    'paquetes-cerveza': 'Paquetes de cerveza'
  };
  return nombres[categoria] || categoria;
}

function mostrarDetalle(item) {
  const existente = document.querySelector('.detalle-modal');
  if (existente) existente.remove();

  const modal = document.createElement('div');
  modal.className = 'detalle-modal';
  const imagenes = imagenItem(item);
  modal.innerHTML = `
    <div class="detalle-modal__panel" role="dialog" aria-modal="true" aria-label="Detalle de ${item.nombre}">
      <button class="detalle-modal__cerrar" aria-label="Cerrar">&times;</button>
      <img class="detalle-modal__image" src="${imagenes[0]}" alt="${item.nombre}">
      <span class="menu-card__tag">${etiquetaCategoria(item.categoria)}</span>
      <h3>${item.nombre}</h3>
      <p>${item.descripcion}</p>
      <p class="detalle-modal__precio">${item.precioFormateado}</p>
    </div>
  `;
  document.body.appendChild(modal);
  configurarImagen(modal.querySelector('.detalle-modal__image'), imagenes, item.categoria);
  document.body.style.overflow = 'hidden';

  const cerrar = () => {
    modal.remove();
    document.body.style.overflow = '';
  };
  modal.querySelector('.detalle-modal__cerrar').addEventListener('click', cerrar);
  modal.addEventListener('click', (e) => { if (e.target === modal) cerrar(); });
  document.addEventListener('keydown', function escListener(e) {
    if (e.key === 'Escape') { cerrar(); document.removeEventListener('keydown', escListener); }
  });

  if (!document.getElementById('detalle-modal-styles')) {
    const estilo = document.createElement('style');
    estilo.id = 'detalle-modal-styles';
    estilo.textContent = `
      .detalle-modal { position: fixed; inset: 0; background: rgba(5,10,15,0.6); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: subir-desvanecer 0.25s ease both; }
      .detalle-modal__panel { position: relative; background: var(--color-superficie); border-radius: var(--radio-lg); padding: 2.2rem; max-width: 420px; width: 100%; text-align: center; outline: 2px dashed var(--color-marca); outline-offset: -12px; }
      .detalle-modal__cerrar { position: absolute; top: 0.8rem; right: 1rem; font-size: 1.8rem; color: var(--color-texto-suave); line-height: 1; }
      .detalle-modal__icon { font-size: 2.6rem; margin-bottom: 0.5rem; }
      .detalle-modal__precio { margin-top: 0.75rem; font-family: var(--fuente-display); font-size: 1.5rem; color: var(--color-acento-2); }
    `;
    document.head.appendChild(estilo);
  }
}

function inicializarMenu() {
  const contenedores = {
    desayunos: document.getElementById('menuGridDesayunos'),
    cocina: document.getElementById('menuGridCocina'),
    karaoke: document.getElementById('menuGridKaraoke')
  };
  const vacio = document.getElementById('menuEmpty');
  const categoriasPorSeccion = {
    desayunos: ['huevos', 'omelettes', 'sandwiches', 'chilaquiles', 'enchiladas', 'consome-o-arroz', 'guisado-del-dia', 'bebidas'],
    cocina: ['platillos', 'bistec-y-pechuga', 'hamburguesas', 'cortes', 'alambres', 'burritos', 'pastas', 'para-compartir', 'shots', 'bebidas'],
    karaoke: ['antojo-de-la-casa', 'snacks', 'boneless', 'combos-guateque', 'paquetes-cerveza', 'bebidas']
  };
  const ocultosPorSeccion = {
    desayunos: [
      'cerveza-nacional',
      'michelada',
      'chelada',
      'cubeta-de-5-cervezas',
      'cubeta-de-10-cervezas',
      'clamato-preparado',
      'cantarito-clasico',
      'cantarito-paulita',
      'cantarito-grande',
      'jarra-de-clericot',
      'copa-de-clericot',
      'copa-de-vino-tinto',
      'copa-de-vino-blanco'
    ]
  };
  const seccionPorCategoria = {
    huevos: 'desayunos',
    omelettes: 'desayunos',
    sandwiches: 'desayunos',
    chilaquiles: 'desayunos',
    enchiladas: 'desayunos',
    'consome-o-arroz': 'desayunos',
    'guisado-del-dia': 'desayunos',
    platillos: 'cocina',
    'bistec-y-pechuga': 'cocina',
    hamburguesas: 'cocina',
    cortes: 'cocina',
    alambres: 'cocina',
    burritos: 'cocina',
    'para-compartir': 'cocina',
    shots: 'cocina',
    bebidas: 'cocina',
    pastas: 'cocina',
    'antojo-de-la-casa': 'karaoke',
    snacks: 'karaoke',
    boneless: 'karaoke',
    'combos-guateque': 'karaoke',
    'paquetes-cerveza': 'karaoke'
  };
  const seccionesPorCategoria = Object.fromEntries(
    Object.entries(seccionPorCategoria).map(([categoria, seccion]) => [categoria, [seccion]])
  );
  seccionesPorCategoria.bebidas = ['desayunos', 'cocina', 'karaoke'];
  let terminoBusqueda = '';

  function render() {
    let totalVisible = 0;

    Object.entries(contenedores).forEach(([nombreSeccion, contenedor]) => {
      const filtrado = MENU_DATA.filter(item => {
        const categoriasSeccion = categoriasPorSeccion[nombreSeccion] || [];
        const seccionesDelItem = seccionesPorCategoria[item.categoria] || [seccionPorCategoria[item.categoria] || nombreSeccion];
        const coincideSeccion = categoriasSeccion.includes(item.categoria) && seccionesDelItem.includes(nombreSeccion);
        const ocultoEnSeccion = (ocultosPorSeccion[nombreSeccion] || []).includes(item.id);
        const coincideBusqueda = !terminoBusqueda ||
        item.nombre.toLowerCase().includes(terminoBusqueda) ||
        item.descripcion.toLowerCase().includes(terminoBusqueda);
        return coincideSeccion && !ocultoEnSeccion && coincideBusqueda;
      });

      contenedor.innerHTML = '';
      categoriasPorSeccion[nombreSeccion].forEach(categoria => {
        const platillos = filtrado.filter(item => item.categoria === categoria);

        const grupo = document.createElement('section');
        grupo.className = 'menu-category';
        grupo.innerHTML = `<h3 class="menu-category__title">${etiquetaCategoria(categoria)}</h3>`;

        if (platillos.length === 0) {
          const mensaje = categoria === 'guisado-del-dia'
            ? 'Pregunta al mesero qué guisado está disponible hoy.'
            : 'Próximamente.';
          grupo.innerHTML += `<p class="menu-category__empty">${mensaje}</p>`;
          contenedor.appendChild(grupo);
          return;
        }

        const cuadricula = document.createElement('div');
        cuadricula.className = 'menu-grid';
        platillos.forEach(item => cuadricula.appendChild(crearTarjetaMenu(item)));
        grupo.appendChild(cuadricula);
        contenedor.appendChild(grupo);
      });
      totalVisible += filtrado.length;

      const detalle = document.querySelector(`[data-menu-section="${nombreSeccion}"]`);
      if (terminoBusqueda && filtrado.length > 0) detalle.open = true;
    });

    vacio.hidden = totalVisible > 0;

    observarRevelados();
  }

  window.filtrarMenuPorTexto = (texto) => {
    terminoBusqueda = normalizarTexto(texto.trim());
    render();
  };

  render();
}





function inicializarBuscador() {
  const toggle = document.getElementById('searchToggle');
  const panel = document.getElementById('searchPanel');
  const input = document.getElementById('searchInput');
  const cerrar = document.getElementById('searchClose');
  const resultados = document.getElementById('searchResults');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const seccionPorCategoria = {
    huevos: 'desayunos',
    omelettes: 'desayunos',
    sandwiches: 'desayunos',
    chilaquiles: 'desayunos',
    enchiladas: 'desayunos',
    'consome-o-arroz': 'desayunos',
    'guisado-del-dia': 'desayunos',
    platillos: 'cocina',
    'bistec-y-pechuga': 'cocina',
    hamburguesas: 'cocina',
    cortes: 'cocina',
    alambres: 'cocina',
    burritos: 'cocina',
    pastas: 'cocina',
    'para-compartir': 'cocina',
    shots: 'cocina',
    bebidas: 'cocina',
    'antojo-de-la-casa': 'karaoke',
    snacks: 'karaoke',
    boneless: 'karaoke',
    'combos-guateque': 'karaoke',
    'paquetes-cerveza': 'karaoke'
  };

  function abrir() {
    panel.classList.add('is-open');
    setTimeout(() => input.focus(), 150);
  }
  function cerrarPanel() {
    panel.classList.remove('is-open');
  }
  function cerrarNavMovil() {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    panel.classList.contains('is-open') ? cerrarPanel() : abrir();
  });
  cerrar.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarPanel(); });

  input.addEventListener('input', () => {
    const texto = input.value.trim();
    const textoNormalizado = normalizarTexto(texto);
    resultados.innerHTML = '';

    if (!texto) return;

    const coincidencias = MENU_DATA.filter(item => {
      const nombre = normalizarTexto(item.nombre);
      const descripcion = normalizarTexto(item.descripcion);
      const categoria = normalizarTexto(etiquetaCategoria(item.categoria));
      return nombre.includes(textoNormalizado) || descripcion.includes(textoNormalizado) || categoria.includes(textoNormalizado);
    });

    if (coincidencias.length === 0) {
      resultados.innerHTML = '<p class="search-panel__empty">No encontramos nada con eso. Prueba con "café", "tacos" o "molletes" 🌵</p>';
      return;
    }

    const seccionesCoincidentes = new Set(
      coincidencias.map(item => seccionPorCategoria[item.categoria] || 'desayunos')
    );
    if (coincidencias.some(item => item.categoria === 'bebidas')) {
      seccionesCoincidentes.add('desayunos');
      seccionesCoincidentes.add('cocina');
    }
    seccionesCoincidentes.forEach(nombreSeccion => {
      const seccion = document.querySelector(`[data-menu-section="${nombreSeccion}"]`);
      if (seccion) seccion.open = true;
    });

    coincidencias.slice(0, 8).forEach(item => {
      const fila = document.createElement('a');
      fila.href = '#menu';
      fila.className = 'search-result';
      fila.innerHTML = `<strong>${item.nombre}</strong><span>${etiquetaCategoria(item.categoria)} · ${item.precioFormateado}</span>`;
      fila.addEventListener('click', (evento) => {
        evento.preventDefault();
          cerrarPanel();
        cerrarNavMovil();
        window.location.hash = 'menu';

        requestAnimationFrame(() => {
          const seccionesObjetivo = item.categoria === 'bebidas'
            ? ['desayunos', 'cocina']
            : [seccionPorCategoria[item.categoria]];

          seccionesObjetivo.forEach(nombreSeccion => {
            const seccion = document.querySelector(`[data-menu-section="${nombreSeccion}"]`);
            if (seccion) seccion.open = true;
          });

          const tarjeta = [...document.querySelectorAll('.menu-card h3')]
            .find(el => normalizarTexto(el.textContent.trim()) === normalizarTexto(item.nombre));

          if (tarjeta) {
            const card = tarjeta.closest('.menu-card');
            if (card) {
              card.scrollIntoView({ behavior: 'smooth', block: 'center' });
              card.classList.add('is-selected');
              setTimeout(() => card.classList.remove('is-selected'), 1800);
            }
          }
        });
      });
      resultados.appendChild(fila);
    });
  });
}





function inicializarFormularioContacto() {
  const formulario = document.getElementById('contactForm');
  const exito = document.getElementById('formSuccess');

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    let valido = true;

    const campos = [
      { id: 'nombre', validar: (v) => v.trim().length >= 2 },
      { id: 'email', validar: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
      { id: 'mensaje', validar: (v) => v.trim().length >= 5 }
    ];

    campos.forEach(({ id, validar }) => {
      const campo = document.getElementById(id);
      const fila = campo.closest('.form-row');
      const ok = validar(campo.value);
      fila.classList.toggle('has-error', !ok);
      if (!ok) valido = false;
    });

    if (!valido) {
      exito.hidden = true;
      return;
    }

    exito.hidden = false;
    formulario.reset();
    setTimeout(() => { exito.hidden = true; }, 6000);
  });

  formulario.querySelectorAll('input, textarea').forEach(campo => {
    campo.addEventListener('input', () => campo.closest('.form-row').classList.remove('has-error'));
  });
}



let observadorRevelado;

function inicializarRevelado() {
  observadorRevelado = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-revealed');
        observadorRevelado.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  observarRevelados();
}

function observarRevelados() {
  document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach(el => observadorRevelado.observe(el));
}





function inicializarBotonArriba() {
  const boton = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    boton.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });
}
