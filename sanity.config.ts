import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { articulo } from './src/sanity/schemas/articulo';

export default defineConfig({
  name: 'esit',
  title: 'ESIT Traducciones',
  projectId: 'rh87j8bk',
  dataset: 'production',
  plugins: [
    structureTool(),
    visionTool(),
  ],
  schema: {
    types: [articulo],
  },
});
