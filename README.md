# TechWear Shop - Proyecto Web Maquetación CSS

> Sitio web de comercio electrónico desarrollado con HTML5 y CSS3, aplicando conceptos avanzados de maquetación web: **Box Model**, **Flexbox** y **Grid**.



## Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Conceptos CSS Implementados](#conceptos-css-implementados)
- [Páginas del Sitio](#páginas-del-sitio)
- [Instalación y Configuración](#instalación-y-configuración)
- [Cómo Usar](#cómo-usar)
- [Archivos CSS](#archivos-css)
- [Responsive Design](#responsive-design)
- [Requisitos de Navegador](#requisitos-de-navegador)
- [Autor](#autor)

---

## Descripción del Proyecto

**TechWear Shop** es un proyecto académico de sitio web de comercio electrónico especializado en venta de equipos y accesorios tecnológicos. El proyecto fue desarrollado como parte de una asignatura de Fundamentos de desarrollo web, aplicando conceptos de diseño responsivo y organización de contenido.

El sitio incluye:
- **Página principal** con catálogo de productos
- **Sistema de autenticación** (login y registro)
- **Carrito de compras** funcional
- **Diseño responsivo** que se adapta a cualquier dispositivo
- **Estilos modernos** con efectos visuales profesionales
- **Repositorio público**: https://github.com/dgbarragan-lang/TechWera-Shop_Css

---

## Objetivo

El objetivo del proyecto es crear una tienda web personal organizada, visualmente atractiva y responsive, usando HTML, CSS y Bootstrap, y mostrando estructuras de datos simulados en JSON y XML para definir el catálogo de productos.

---

## Características

### Diseño Visual
- Tema de color oscuro profesional (#0f1720 fondo, #e6eef6 texto)
- Paleta de colores consistente con énfasis en azul (#3b82f6)
- Tipografía clara y legible (Segoe UI, Roboto)
- Iconografía moderna con emojis temáticos

### Responsividad
- Diseño móvil-primero (mobile-first)
- Breakpoints en 768px y 640px
- Totalmente adaptado a dispositivos móviles
- Interfaz fluida en cualquier resolución

### Interactividad
- Efectos hover en elementos interactivos
- Transiciones suaves (0.2s ease)
- Focus effects en inputs
- Validación visual en formularios
- Transform effects en botones
- Sidebar sticky en carrito

### Maquetación Avanzada
- Grid responsivo con auto-fit
- Flexbox para centrado y alineación
- Box Model completo y controlado
- Posicionamiento estratégico
- Layouts complejos y profesionales

---

## Estructura del Proyecto

- `index.html`
- `pages/login.html`
- `pages/register.html`
- `pages/cart.html`
- `css/general.css`
- `css/index.css`
- `css/login.css`
- `css/register.css`
- `css/cart.css`
- `data/datos.json`
- `data/datos.xml`
- `img/` (imágenes y recursos visuales)
- `README.md`

---

## Tecnologías Utilizadas

| Tecnología | Propósito | Versión |
|-----------|----------|---------|
| **HTML5** | Estructura semántica | 5 |
| **CSS3** | Estilos y maquetación | 3 |
| **Flexbox** | Layouts flexibles | CSS3 |
| **CSS Grid** | Layouts de cuadrícula | CSS3 |
| **Bootstrap 5** | Componentes y sistema de grid | 5.3 |
| **FontAwesome** | Iconografía vectorial | 6.5 |
| **Git** | Control de versiones | - |
| **Live Server** | Servidor local de desarrollo | - |

---

## Componentes Bootstrap Utilizados

- **Navbar** básica en la navegación principal y botones de categoría.
- **Alert** informativa de oferta flash.
- **Badges** para etiquetas de categoría y conteo de productos.
- **Input group** en el footer para newsletter.
- **Grid system** en el footer y en el layout del contenido.
- **Buttons** y utilidades de espaciado (`d-flex`, `gap`, `fw-bold`).

---

## Conceptos CSS Implementados

### 1. Box Model

Controlamos completamente cada elemento mediante el modelo de cajas:

```css
/* Aplicación global */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* Ejemplo: Tarjeta de producto */
.card-secondary {
    width: 100%;
    height: auto;
    padding: 18px 16px;
    margin-bottom: 16px;
    border: 2px solid #1e293b;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
```

**Propiedades utilizadas:**
- `box-sizing: border-box` - Control de ancho incluyendo bordes y padding
- `margin` - Espaciado externo
- `padding` - Espaciado interno
- `width` y `height` - Dimensiones
- `border` - Bordes visibles
- `border-radius` - Esquinas redondeadas
- `box-shadow` - Sombras dinámicas

---

### 2. Flexbox

Usado para alineación, centrado y distribución de elementos:

```css
/* Ejemplo: Página de login centrada */
#login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 200px);
    padding: 24px 16px;
    flex-direction: column;
    gap: 20px;
}

/* Ejemplo: Ubicación en carrito */
#cart-location {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px;
}
```

**Propiedades utilizadas:**
- `display: flex` - Habilita flexbox
- `flex-direction` - Dirección del flujo
- `align-items` - Alineación vertical
- `justify-content` - Alineación horizontal
- `flex-wrap` - Salto de línea
- `gap` - Espaciado entre items
- `align-self` - Alineación individual
- `flex-grow/shrink/basis` - Proporción de crecimiento

---

### 3. CSS Grid

Usado para layouts complejos y multi-columna:

```css
/* Ejemplo: Grid responsivo de beneficios (Hero) */
#hero .hero-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 14px;
    list-style: none;
    margin-top: 1.5rem;
}

/* Ejemplo: Carrito con productos y sidebar */
#cart-page > div:not(#cart-header) {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
}

/* Responsive: 1 columna en móvil */
@media (max-width: 768px) {
    #cart-page > div:not(#cart-header) {
        grid-template-columns: 1fr;
    }
}
```

**Propiedades utilizadas:**
- `display: grid` - Habilita grid
- `grid-template-columns` - Definición de columnas
- `grid-template-rows` - Definición de filas
- `repeat()` - Repetición de patrones
- `auto-fit/auto-fill` - Adaptación automática
- `minmax()` - Tamaños mínimo y máximo
- `gap` - Espaciado entre items
- `grid-column/grid-row` - Posicionamiento
- `align-items/justify-items` - Alineación

---

### 4. Efectos Visuales

```css
/* Transiciones suaves */
button, input, a {
    transition: all 0.2s ease;
}

/* Hover effects */
button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

/* Focus effects en inputs */
input:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

/* Validación visual */
input:valid {
    border-color: #4ade80;
}

input:invalid {
    border-color: #f87171;
}
```

---

### 5. Responsive Design

```css
/* Breakpoint tablets y móviles grandes */
@media (max-width: 768px) {
    .register-form .form-row-inline {
        grid-template-columns: 1fr;
    }
}

/* Breakpoint móviles pequeños */
@media (max-width: 640px) {
    body {
        font-size: 14px;
    }
    
    #hero {
        padding: 24px 12px;
    }
}
```

---

## Páginas del Sitio

### Página Principal (index.html)

**Ruta:** `/index.html`

**Secciones:**
- **Header:** Logo y navegación
- **Hero:** Banner principal con propuesta de valor
- **Beneficios:** Grid de 3 elementos (Envío rápido, Garantía, Soporte)
- **Catálogo:** Tabla de productos destacados
- **Footer:** Información de contacto

**Conceptos CSS:**
- Grid para beneficios (auto-fit)
- Tabla con estilos profesionales
- Buttons con transiciones

---

### Página de Login (pages/login.html)

**Ruta:** `/pages/login.html`

**Elementos:**
- **Formulario centrado:** Usando Flexbox
- **Inputs:** Con validación visual
- **Botón:** Con hover effects
- **Enlaces:** A registro y recuperación

**Conceptos CSS:**
- Flexbox para centrado perfecto
- Focus effects en inputs
- Validación con border-color
- Transform en botón

---

### Página de Registro (pages/register.html)

**Ruta:** `/pages/register.html`

**Características:**
- **Formulario Grid:** 2 columnas en escritorio, 1 en móvil
- **Campos de entrada:** Organizados profesionalmente
- **Checkboxes:** Con Flexbox
- **Validación:** Visual en tiempo real

**Conceptos CSS:**
- Grid responsivo (auto-fit, minmax)
- Media queries
- Checkboxes con Flexbox
- Transiciones

---

### Página de Carrito (pages/cart.html)

**Ruta:** `/pages/cart.html`

**Características:**
- **Layout Grid:** Productos + sidebar
- **Sidebar Sticky:** Permanece visible al scroll
- **Productos Grid:** Imagen | Contenido | Cantidad
- **Ubicación:** Selector de entrega
- **Resumen:** Totales y opciones de pago

**Conceptos CSS:**
- Grid avanzado multi-columna
- Position sticky
- Flexbox para controles
- Responsive 2col → 1col

---

## Instalación y Configuración

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Editor de código (VS Code recomendado)
- Git (opcional, para control de versiones)

### Pasos de Instalación

#### 1. Clonar el repositorio
```bash
git clone https://github.com/dgbarragan-lang/TechWera-Shop_Css.git
cd TechWera-Shop_Css
```

#### 2. Abrir en editor
```bash
code .
```

#### 3. Iniciar servidor local

**Opción A: Live Server en VS Code**
1. Instala la extensión "Live Server"
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

**Opción B: Python**
```bash
python -m http.server 8000
# Luego abre: http://localhost:8000
```

**Opción C: Node.js (http-server)**
```bash
npm install -g http-server
http-server
```

#### 4. Acceder al sitio
```
http://localhost:8000
http://localhost:5500  (Live Server)
```

---

## Cómo Usar

### Navegación del Sitio

1. **Página Principal:** Acceso directo en la URL raíz
2. **Iniciar Sesión:** Botón en header → `/pages/login.html`
3. **Registrarse:** Enlace en login o botón en header → `/pages/register.html`
4. **Carrito:** Botón en header → `/pages/cart.html`

### Testear Funcionalidades

#### Probar Responsividad
```
1. Abre DevTools: F12
2. Haz click en "Device toolbar" (Ctrl+Shift+M)
3. Selecciona dispositivos: iPhone, iPad, Desktop
4. Verifica que layouts se adapten correctamente
```

#### Probar Efectos Interactivos
```
1. Pasar mouse sobre botones (hover effects)
2. Hacer click en inputs (focus effects)
3. Escribir en inputs (validación visual)
4. Scroll en página de carrito (sidebar sticky)
```

#### Probar Breakpoints
```
Modifica el ancho de ventana a:
- 1200px (escritorio normal)
- 768px (tablet)
- 640px (móvil pequeño)
```

---

## Archivos CSS

### css/general.css
**Tamaño:** ~180 líneas  
**Propósito:** Estilos base aplicados a todas las páginas

**Incluye:**
- Reset de estilos (margin, padding)
- Variables de color
- Tipografía base
- Estilos de formularios
- Estilos de tablas
- Clases utility (`.flex-center`, `.flex-between`, etc.)
- Paleta de colores del tema

**Alcance:** Global (todas las páginas)

---

### css/index.css
**Tamaño:** ~160 líneas  
**Propósito:** Estilos de la página principal

**Incluye:**
- Hero section con gradientes
- Grid de beneficios
- Tabla de productos
- Botones principales
- Estilos de badges

**Alcance:** index.html

---

### css/login.css
**Tamaño:** ~140 líneas  
**Propósito:** Estilos de la página de login

**Incluye:**
- Flexbox de centrado
- Formulario auth
- Inputs con validación
- Botón de login
- Efectos visuales

**Alcance:** pages/login.html

---

### css/register.css
**Tamaño:** ~180 líneas  
**Propósito:** Estilos de la página de registro

**Incluye:**
- Grid responsivo
- Formulario multi-campo
- Checkboxes
- Inputs mejorados
- Media queries

**Alcance:** pages/register.html

---

### css/cart.css
**Tamaño:** ~230 líneas  
**Propósito:** Estilos de la página de carrito

**Incluye:**
- Grid del carrito
- Productos layout
- Sidebar sticky
- Ubicación selector
- Cantidad control
- Resumen de compra

**Alcance:** pages/cart.html

---

## Responsive Design

### Breakpoints Definidos

| Dispositivo | Ancho | Media Query |
|------------|-------|------------|
| Escritorio | ≥769px | Default |
| Tablet | 641-768px | `@media (max-width: 768px)` |
| Móvil | ≤640px | `@media (max-width: 640px)` |

### Adaptaciones Responsivas

#### En index.html
```
Escritorio: 3 beneficios en fila
Tablet: 2 beneficios en fila
Móvil: 1 beneficio por fila
```

#### En register.html
```
Escritorio: 2 inputs por fila (Grid)
Tablet: 1-2 inputs por fila (adaptable)
Móvil: 1 input por fila
```

#### En cart.html
```
Escritorio: Productos izquierda + Sidebar derecha
Tablet: Productos arriba + Sidebar abajo
Móvil: Productos arriba + Sidebar abajo
```

---

## Requisitos de Navegador

| Navegador | Versión | Soporte |
|-----------|---------|---------|
| Chrome | ≥90 | Full |
| Firefox | ≥88 | Full |
| Safari | ≥14 | Full |
| Edge | ≥90 | Full |
| Opera | ≥76 | Full |
| IE 11 | - | No soportado |

### Características Requeridas
- CSS Grid
- Flexbox
- CSS Transitions
- CSS Transforms
- CSS Variables
- Media Queries

---
## Estadísticas del Proyecto

```

        ESTADÍSTICAS FINALES         

Archivos HTML:                   4  
Archivos CSS:                    5  
Líneas de HTML:                400  
Líneas de CSS:                 890  
Líneas totales:               1290  
                                    
Componentes visuales:         50+   
Clases CSS:                   30+   
IDs CSS:                      20+   
Media Queries:                 3+   
                                    
Box Model:                  ✅ ✅  
Flexbox:                    ✅ ✅  
Grid:                       ✅ ✅  
Responsive:                 ✅ ✅  
Transiciones:               ✅ ✅  

```

---

## Objetivos Académicos

Este proyecto fue desarrollado para cumplir con los siguientes objetivos:

**Aplicar conceptos de maquetación web**
- Box Model completo
- Flexbox para alineación
- Grid para layouts

**Crear sitio responsivo**
- Múltiples breakpoints
- Mobile-first design
- Adaptación a cualquier dispositivo

**Implementar efectos visuales**
- Transiciones suaves
- Hover effects
- Focus effects
- Validación visual

**Organizar código profesionalmente**
- Archivos separados por página
- Estilos base reutilizable
- Código documentado
- Estructura clara

**Crear documentación completa**
- README con instrucciones
- Comentarios en CSS
- Guías visuales
- Ejemplos de código

---

## Recursos de Aprendizaje

### Box Model
- [MDN: Box Model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)
- [CSS Box Model Tutorial](https://www.w3schools.com/css/css_boxmodel.asp)

### Flexbox
- [MDN: Flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox)
- [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

### Grid
- [MDN: CSS Grid](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids)
- [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

### Responsive Design
- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Media Queries](https://www.w3schools.com/css/css_rwd_mediaqueries.asp)

---

## Contribuciones

Este es un proyecto académico. Las contribuciones están limitadas a:
- Reportar bugs
- Sugerir mejoras
- Mejorar documentación

---

## Licencia

Este proyecto está bajo licencia MIT. Puedes usar, modificar y distribuir el código libremente.

---

## Autor

**Proyecto:** TechWear Shop  
**Desarrollado por:** Daniel Barragan  
**Repositorio:** [GitHub - TechWera-Shop_Css](https://github.com/dgbarragan-lang/TechWera-Shop_Css)  
**Fecha de Creación:** 2026  
**Estado:** ✅ Completado

---

##  Contacto y Soporte

- Email: [dgbarragan@espe.edu.ec]
- GitHub: [@dgbarragan-lang](https://github.com/dgbarragan-lang)
- LinkedIn: [Daniel Barragan]

---

## Mapa del Proyecto

```
INICIO (index.html)
│
├─→ Login (pages/login.html)
│   └─→ Registro (pages/register.html)
│
├─→ Carrito (pages/cart.html)
│   └─→ Checkout (próxima fase)
│
└─→ Documentación
    ├─→ README.md
```

---

## Checklist de Funcionalidad

- Página principal con catálogo
- Sistema de login
- Sistema de registro
- Carrito de compras
- Diseño responsivo
- Efectos visuales
- Box Model aplicado
- Flexbox implementado
- Grid implementado
- Documentación completa

---

## Conclusión

TechWear Shop es un proyecto completo que demuestra el dominio de conceptos fundamentales de maquetación web moderna. La combinación de **Box Model**, **Flexbox** y **Grid** permite crear layouts profesionales, adaptables y visualmente atractivos.

**El proyecto está listo para:**
- Uso en clase
- Referencia de mejores prácticas
- Base para proyectos más complejos
- Portfolio profesional

---

**Última actualización:** 14 de Junio de 2026  
**Versión:** 1.0  
**Estado:** Completado y Documentado

---

<div align="center">

### ¡Gracias por usar TechWear Shop!

Creado para la educación web

[⬆ Volver arriba](#-techwear-shop---proyecto-web-maquetación-css)

</div>
