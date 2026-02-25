// CONFIGURAR: Reemplazar con los datos reales de HubSpot
// 1. Entrar a HubSpot > Settings > Integrations > Private Apps
// 2. Crear Private App con permisos de "Contacts"
// 3. Copiar el Access Token

const HUBSPOT_PORTAL_ID = 'TU_PORTAL_ID';     // <-- cambiar
const HUBSPOT_FORM_ID = 'TU_FORM_ID';         // <-- cambiar

interface DatosContacto {
  nombre: string;
  email: string;
  telefono: string;
  idiomaOrigen: string;
  idiomaDestino: string;
  mensaje: string;
  origen: string; // de donde vino el usuario (Google, Facebook, etc)
}

// Enviar datos del formulario a HubSpot
export async function enviarAHubSpot(datos: DatosContacto): Promise<boolean> {
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;

  const cuerpo = {
    fields: [
      { name: 'firstname', value: datos.nombre },
      { name: 'email', value: datos.email },
      { name: 'phone', value: datos.telefono },
      { name: 'idioma_origen', value: datos.idiomaOrigen },
      { name: 'idioma_destino', value: datos.idiomaDestino },
      { name: 'message', value: datos.mensaje },
    ],
    context: {
      pageUri: window.location.href,
      pageName: document.title,
    },
  };

  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });

    return respuesta.ok;
  } catch (error) {
    console.error('Error enviando a HubSpot:', error);
    return false;
  }
}

// Detectar de donde viene el visitante (para el CRM)
export function detectarOrigen(): string {
  const referrer = document.referrer || '';
  if (referrer.includes('google')) return 'Google';
  if (referrer.includes('facebook')) return 'Facebook';
  if (referrer.includes('instagram')) return 'Instagram';
  if (referrer.includes('linkedin')) return 'LinkedIn';
  if (referrer.includes('twitter') || referrer.includes('x.com')) return 'Twitter/X';
  if (referrer === '') return 'Directo';
  return 'Otro';
}
