/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        marca: {
          azul: '#0C2340',
          azulClaro: '#1B4D8E',
          azulBrillante: '#2563EB',
          dorado: '#C9A84C',
          gris: '#64748B',
          grisSuave: '#F1F5F9',
        },
        oscuro: {
          fondo: '#0B1121',
          tarjeta: '#131D33',
          borde: '#1E2D4A',
          texto: '#CBD5E1',
          titulo: '#E2E8F0',
        },
      },
      fontFamily: {
        titulo: ['"Sora"', 'sans-serif'],
        cuerpo: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
