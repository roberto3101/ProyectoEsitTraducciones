# Accesos del sitio web — ESIT Traducciones

Documento de entrega para las responsables de ESIT.
Explica **a qué servicios hay que tener acceso, para qué sirve cada uno y cómo se entra**.

> **Aquí no hay contraseñas, y es a propósito.**
> Ninguno de estos servicios funciona con una contraseña compartida: cada persona entra
> con su propia cuenta de correo, previa invitación. Así nadie depende de nadie y quitar
> un acceso no obliga a cambiar las claves de los demás.

---

## Resumen

| Servicio | Para qué sirve | Cómo se entra |
|---|---|---|
| [Sanity](#1-sanity--blog) | Escribir y publicar artículos del blog | Invitación + cuenta de Google |
| [HubSpot](#2-hubspot--contactos) | Recibir los formularios como contactos | Cuenta propia de ESIT |
| [Google Analytics](#3-google-analytics--visitas) | Cuánta gente entra y de dónde viene | Invitación + cuenta de Google |
| [Microsoft Clarity](#4-microsoft-clarity--dónde-hacen-clic) | Ver dónde hacen clic los visitantes | Cuenta propia de ESIT |

Todos tienen plan gratuito suficiente para el uso previsto.

---

## 1. Sanity — Blog

**Qué es.** El panel donde se escriben los artículos del blog. Lo que se publica ahí
aparece solo en la web, sin necesidad de programador.

**Dónde se entra:** https://esittraducciones.com/admin

### Cómo obtener acceso

1. El desarrollador envía una invitación al correo de cada persona
2. Llega un email de Sanity con un enlace
3. Al abrirlo se pulsa **Continue with Google** y se usa el correo de siempre
4. Listo — desde ese momento se entra por `/admin` sin contraseña adicional

### Roles

| Rol | Qué permite |
|---|---|
| **Administrator** | Escribir, publicar e invitar a otras personas |
| **Editor** | Escribir y publicar |
| **Viewer** | Solo leer — **no permite publicar** |

Para redactar el blog hace falta **Editor** como mínimo.

> El plan gratuito incluye 20 accesos. Invitar a alguien no tiene coste.

---

## 2. HubSpot — Contactos

**Qué es.** Donde caen los formularios de contacto de la web. Cada consulta se convierte
en una ficha con el nombre, el correo, el servicio que pide, los idiomas y de dónde
llegó esa persona (Google, Facebook, directo…).

**Dónde se entra:** https://app.hubspot.com

### Cómo obtener acceso
La cuenta se crea a nombre de ESIT, con un correo de la empresa. Desde
*Settings → Users & Teams* se invita al resto del equipo.

---

## 3. Google Analytics — Visitas

**Qué es.** Cuánta gente visita el sitio, desde qué país, con qué dispositivo, qué páginas
mira y cuántas terminan escribiendo por WhatsApp o por el formulario.

**Dónde se entra:** https://analytics.google.com

### Cómo obtener acceso
Igual que Sanity: invitación al correo y se entra con la cuenta de Google propia.
El administrador actual lo hace desde *Administrar → Gestión de acceso a la propiedad*.

---

## 4. Microsoft Clarity — Dónde hacen clic

**Qué es.** Responde a la pregunta *"¿en qué partes de la página hace clic la gente?"*.
Muestra mapas de calor, hasta dónde bajan en cada página, y permite ver grabaciones
de visitas reales.

**Dónde se entra:** https://clarity.microsoft.com

### Por qué hace falta si ya está Analytics
Analytics dice **cuántos** clics hubo. Clarity dice **en qué punto exacto de la pantalla**.
Y a diferencia de HubSpot, que solo ve a quien ya dejó sus datos, Clarity ve a todos
los visitantes — incluidos los que se fueron sin escribir.

### Cómo obtener acceso
La cuenta se crea con un correo de ESIT. Se entra con Google o con Microsoft, sin
contraseña nueva. Después se invita al equipo desde *Settings → Team*.

---

## Recomendación sobre la titularidad

Conviene que estas cuentas estén a nombre de **un correo de la empresa**
(por ejemplo `marketing@esittraducciones.com`) y no del correo personal de nadie,
ni del desarrollador.

El motivo es práctico: quien crea la cuenta es su dueño. Si mañana cambia el
proveedor o la persona encargada, con un correo de empresa el traspaso es inmediato;
con un correo personal hay que perseguir a alguien para recuperar el acceso al
historial de visitas o a la base de contactos.

---

## En caso de perder el acceso

Ningún acceso se pierde de forma irreversible: al entrar con Google o Microsoft,
recuperar la cuenta de correo devuelve automáticamente el acceso a todos los servicios.
Si aun así queda alguien fuera, cualquier persona con rol de administrador puede
volver a invitarla en menos de un minuto.
