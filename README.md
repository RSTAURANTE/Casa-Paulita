# Casa Paulita — Sitio web

Sitio web completo, responsivo y funcional para el restaurante **Casa Paulita**,
en el Centro Histórico de la Ciudad de México.

## Estructura del proyecto

```
desayunos-paulita/
│
├── index.html              → Página única con todas las secciones (Inicio, Menú,
│                              Ubicación, Contacto), HTML5 semántico.
│
├── css/
│   ├── reset.css           → Normaliza estilos entre navegadores.
│   ├── variables.css       → Paleta de colores, tipografías y tokens de diseño
│   │                          (todo lo que puede necesitar cambiarse a futuro
│   │                          vive aquí, en un solo lugar).
│   ├── style.css           → Estilos de todos los componentes y secciones.
│   └── responsive.css      → Media queries para tablet y celular, incluido
│                              el menú de hamburguesa.
│
├── js/
│   ├── menu-data.js        → Los platillos del menú (nombre, descripción,
│   │                          precio, categoría). Editar aquí para agregar,
│   │                          quitar o modificar platillos — no requiere
│   │                          tocar el HTML.
│   └── script.js           → Toda la lógica: navegación móvil, buscador,
│                              filtros de menú, validación del formulario,
│                              animaciones al hacer scroll, botón "volver arriba".
│
└── assets/
    ├── images/
    │   ├── logo-completo.png   → Logotipo con banner ("Buenos días...").
    │   ├── logo-badge.png      → Logotipo sin banner (usado en header/footer).
    │   └── hero/hero-poster.jpg → Imagen decorativa de cactus y flores.
    └── icons/
        └── favicon.png          → Ícono de la pestaña del navegador.
```

## Funcionalidades incluidas

- Navegación fija con resaltado de sección activa y menú hamburguesa en móvil.
- Buscador en vivo que filtra los platillos del menú por nombre o descripción.
- Filtros de categoría en el menú (Todos, Clásicos, Antojitos, Pan & dulce, Bebidas).
- Modal de detalle al hacer clic en "Ver detalle" de cualquier platillo.
- Mapa interactivo de Google Maps con botón directo a direcciones.
- Animaciones de aparición al hacer scroll, respetando `prefers-reduced-motion`.
- Botón "volver arriba".
- Diseño responsivo probado para escritorio, laptop, tablet y celular.
