/**
 * Reduce las fotografias de public/imagenes a tamanos de entrega web.
 * Reescribe el .jpg optimizado y genera un .webp hermano.
 *
 *   node scripts/optimizar-imagenes.mjs
 *
 * Es idempotente: volver a correrlo sobre imagenes ya optimizadas
 * no las degrada de forma apreciable, pero no hace falta.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const BASE = path.resolve('public/imagenes');

// carpeta -> ancho maximo de entrega
const ANCHOS = {
  hero: 2400,
  cta: 2400,
  servicios: 1400,
  nosotros: 1400,
};

let antes = 0;
let despues = 0;

for (const [carpeta, ancho] of Object.entries(ANCHOS)) {
  const dir = path.join(BASE, carpeta);
  if (!fs.existsSync(dir)) continue;

  for (const archivo of fs.readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f))) {
    const ruta = path.join(dir, archivo);
    const original = fs.readFileSync(ruta);
    antes += original.length;

    const base = sharp(original).resize({ width: ancho, withoutEnlargement: true });

    const jpeg = await base.clone().jpeg({ quality: 82, mozjpeg: true, progressive: true }).toBuffer();
    const webp = await base.clone().webp({ quality: 80, effort: 5 }).toBuffer();

    fs.writeFileSync(ruta, jpeg);
    fs.writeFileSync(ruta.replace(/\.jpe?g$/i, '.webp'), webp);
    despues += jpeg.length + webp.length;

    console.log(
      `${carpeta}/${archivo}  ${(original.length / 1024).toFixed(0)} KB -> ` +
        `jpeg ${(jpeg.length / 1024).toFixed(0)} KB / webp ${(webp.length / 1024).toFixed(0)} KB`,
    );
  }
}

console.log(
  `\nTotal ${(antes / 1024 / 1024).toFixed(2)} MB -> ${(despues / 1024 / 1024).toFixed(2)} MB ` +
    `(incluye ambos formatos)`,
);
