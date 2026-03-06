import { defineField, defineType } from 'sanity';

export const articulo = defineType({
  name: 'articulo',
  title: 'Artículo',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required().error('El título es obligatorio'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'titulo',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('El slug es obligatorio'),
    }),
    defineField({
      name: 'idioma',
      title: 'Idioma',
      type: 'string',
      options: {
        list: [
          { title: 'Español', value: 'es' },
          { title: 'English', value: 'en' },
          { title: 'Français', value: 'fr' },
        ],
        layout: 'radio',
      },
      initialValue: 'es',
      validation: (rule) => rule.required().error('Seleccione un idioma'),
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'resumen',
      title: 'Resumen',
      type: 'text',
      rows: 3,
      description: 'Breve descripción que aparece en la tarjeta del blog',
      validation: (rule) => rule.required().max(300).error('Máximo 300 caracteres'),
    }),
    defineField({
      name: 'contenido',
      title: 'Contenido',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Título H2', value: 'h2' },
            { title: 'Título H3', value: 'h3' },
            { title: 'Título H4', value: 'h4' },
            { title: 'Cita', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Negrita', value: 'strong' },
              { title: 'Cursiva', value: 'em' },
              { title: 'Subrayado', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Enlace',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (rule) =>
                      rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texto alternativo',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Traducción', value: 'Traducción' },
          { title: 'Interpretación', value: 'Interpretación' },
          { title: 'Noticias', value: 'Noticias' },
          { title: 'Consejos', value: 'Consejos' },
          { title: 'Tecnología', value: 'Tecnología' },
        ],
      },
    }),
    defineField({
      name: 'autor',
      title: 'Autor',
      type: 'string',
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Fecha (reciente primero)',
      name: 'fechaDesc',
      by: [{ field: 'fecha', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'idioma',
      media: 'imagen',
    },
    prepare({ title, subtitle, media }) {
      const idiomas: Record<string, string> = { es: '🇪🇸', en: '🇬🇧', fr: '🇫🇷' };
      return {
        title,
        subtitle: `${idiomas[subtitle] || ''} ${subtitle?.toUpperCase() || ''}`,
        media,
      };
    },
  },
});
