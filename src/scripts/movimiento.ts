/**
 * Capa de movimiento e interaccion del sitio.
 *
 * Un solo rAF gobierna todo lo que depende del scroll: no hay listeners
 * de scroll compitiendo ni lecturas de layout repetidas por componente.
 * Cada elemento que necesita saber "por donde va" recibe una variable CSS
 * y decide en CSS que hacer con ella.
 *
 * Respeta prefers-reduced-motion: sin Lenis, sin parallax, todo visible.
 */
import Lenis from 'lenis';

const raiz = document.documentElement;
const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   1. SCROLL SUAVE
   ============================================================ */
let lenis: Lenis | null = null;

if (!menosMovimiento) {
  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.9,
    smoothWheel: true,
    // El scroll tactil nativo del movil se siente mejor que el emulado
    syncTouch: false,
  });

  const bucle = (tiempo: number) => {
    lenis!.raf(tiempo);
    requestAnimationFrame(bucle);
  };
  requestAnimationFrame(bucle);
} else {
  raiz.classList.add('sin-lenis');
}

/* Anclas internas: las gobierna Lenis para que el recorrido sea continuo */
document.addEventListener('click', (evento) => {
  const enlace = (evento.target as HTMLElement)?.closest?.<HTMLAnchorElement>('a[href*="#"]');
  if (!enlace) return;

  const url = new URL(enlace.href, window.location.href);
  // Solo anclas de la pagina actual
  if (url.pathname !== window.location.pathname || !url.hash) return;

  const destino = document.querySelector(url.hash);
  if (!destino) return;

  evento.preventDefault();
  const margen = -(document.querySelector<HTMLElement>('.barra')?.offsetHeight ?? 0) - 16;

  if (lenis) {
    lenis.scrollTo(destino as HTMLElement, { offset: margen, duration: 1.1 });
  } else {
    const y = (destino as HTMLElement).getBoundingClientRect().top + window.scrollY + margen;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  history.pushState(null, '', url.hash);
});

/* ============================================================
   2. REVELADO PROGRESIVO
   Los hijos de un grupo entran escalonados, no en bloque.
   ============================================================ */
document.querySelectorAll<HTMLElement>('[data-revelar-grupo]').forEach((grupo) => {
  Array.from(grupo.children).forEach((hijo, i) => {
    const el = hijo as HTMLElement;
    if (!el.hasAttribute('data-revelar')) el.setAttribute('data-revelar', '');
    el.style.setProperty('--rev-i', String(i));
  });
});

const observador = new IntersectionObserver(
  (entradas) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      entrada.target.classList.add('revelado');
      observador.unobserve(entrada.target);
    }
  },
  { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
);

document.querySelectorAll('[data-revelar]').forEach((el) => observador.observe(el));

/* ============================================================
   3. UN SOLO BUCLE PARA TODO LO LIGADO AL SCROLL
   ============================================================ */
const barra = document.querySelector<HTMLElement>('.barra');
const progreso = document.querySelector<HTMLElement>('.progreso');
const conParallax = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
const conProgreso = Array.from(document.querySelectorAll<HTMLElement>('[data-progreso]'));

let alto = window.innerHeight;
let pendiente = false;

const medir = () => {
  alto = window.innerHeight;
};

const pintar = () => {
  pendiente = false;
  const y = window.scrollY;

  /* Barra: solida en cuanto se despega del tope */
  barra?.setAttribute('data-desplazada', y > 8 ? 'si' : 'no');

  /* Progreso de lectura */
  if (progreso) {
    const recorrible = document.documentElement.scrollHeight - alto;
    progreso.style.setProperty('--avance', recorrible > 0 ? String(Math.min(y / recorrible, 1)) : '0');
  }

  /* Parallax: la imagen se queda atras respecto al texto */
  for (const el of conParallax) {
    const factor = parseFloat(el.dataset.parallax || '0.2');
    const caja = el.getBoundingClientRect();
    if (caja.bottom < -200 || caja.top > alto + 200) continue;
    el.style.setProperty('--desplazo', `${(caja.top * -factor).toFixed(2)}px`);
  }

  /* --vista: 0 cuando el elemento entra por abajo, 1 cuando sale por arriba.
     Lo consumen los SVG y las capas atmosfericas desde CSS. */
  for (const el of conProgreso) {
    const caja = el.getBoundingClientRect();
    const total = caja.height + alto;
    const avance = (alto - caja.top) / total;
    el.style.setProperty('--vista', Math.min(Math.max(avance, 0), 1).toFixed(4));
  }
};

const pedirPintado = () => {
  if (pendiente) return;
  pendiente = true;
  requestAnimationFrame(pintar);
};

if (lenis) {
  lenis.on('scroll', pedirPintado);
} else {
  window.addEventListener('scroll', pedirPintado, { passive: true });
}
window.addEventListener('resize', () => {
  medir();
  pedirPintado();
});
pintar();

/* ============================================================
   4. INTERACCIONES DE LA BARRA
   Delegacion en document: un solo listener, sobrevive a cambios de DOM.
   ============================================================ */
document.addEventListener('click', (evento) => {
  const objetivo = evento.target as HTMLElement;

  /* Menu movil */
  if (objetivo.closest('#btn-menu')) {
    const menu = document.getElementById('menu-movil');
    const boton = document.getElementById('btn-menu');
    if (!menu || !boton) return;
    const abierto = boton.getAttribute('aria-expanded') === 'true';
    boton.setAttribute('aria-expanded', String(!abierto));
    menu.hidden = abierto;
    // Bloquear el scroll de fondo mientras el menu esta abierto
    if (lenis) (abierto ? lenis.start() : lenis.stop());
    raiz.classList.toggle('menu-abierto', !abierto);
    return;
  }

  /* Submenu de servicios en movil */
  if (objetivo.closest('#btn-servicios-movil')) {
    const submenu = document.getElementById('submenu-servicios-movil');
    const boton = document.getElementById('btn-servicios-movil');
    if (!submenu || !boton) return;
    const abierto = boton.getAttribute('aria-expanded') === 'true';
    boton.setAttribute('aria-expanded', String(!abierto));
    submenu.hidden = abierto;
    return;
  }

  /* Tema claro / oscuro */
  if (objetivo.closest('#btn-tema')) {
    const oscuro = raiz.classList.toggle('dark');
    localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro');
    return;
  }
});

/* Escape cierra el menu movil */
document.addEventListener('keydown', (evento) => {
  if (evento.key !== 'Escape') return;
  const boton = document.getElementById('btn-menu');
  if (boton?.getAttribute('aria-expanded') !== 'true') return;
  boton.click();
  boton.focus();
});
