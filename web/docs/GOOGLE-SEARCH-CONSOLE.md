# Cómo configurar Google Search Console

Sigue estos pasos para registrar tu sitio en Google Search Console y enviar el sitemap.

---

## 1. Entra en Google Search Console

1. Ve a [Google Search Console](https://search.google.com/search-console).
2. Inicia sesión con la cuenta de Google que quieras usar (recomendable: la del negocio).
3. Si es la primera vez, acepta los términos si te los muestran.

---

## 2. Añadir una propiedad (tu sitio)

1. En la página principal, haz clic en **“Añadir propiedad”** (o el menú de propiedades y luego “Añadir propiedad”).
2. Elige **“Prefijo de URL”**.
3. Escribe la URL exacta de tu sitio, por ejemplo:
   - `https://irisnatural.corpsc.com`
   - Sin barra final y con `https://`.
4. Pulsa **“Continuar”**.

---

## 3. Verificar la propiedad

Google te pedirá que demuestres que eres dueño del sitio. Opción más sencilla con este proyecto:

### Opción A: Etiqueta HTML (meta tag)

1. En Search Console, en “Verificar la propiedad”, elige **“Etiqueta HTML”**.
2. Copia solo el **valor** del atributo `content`, algo como:
   ```text
   abc123XYZ456...
   ```
3. En tu proyecto, en el archivo **`.env`** (o `.env.local`), añade:
   ```env
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123XYZ456...
   ```
   (sustituye por el valor que te dio Google).
4. Vuelve a desplegar la web (o reinicia el servidor en local).
5. En Search Console, haz clic en **“Comprobar”**.

Si la variable está bien configurada, el proyecto ya incluye esa meta etiqueta en el `<head>` y la verificación debería aprobarse.

### Opción B: Archivo HTML

1. Elige **“Archivo HTML”** en Search Console.
2. Descarga el archivo que te indica (p. ej. `google123abc.html`).
3. Colócalo en la carpeta **`public/`** de tu proyecto Next.js.
4. Despliega o ejecuta el sitio y en Search Console haz clic en **“Comprobar”**.

### Opción C: DNS (si tienes acceso al dominio)

1. Elige **“Registro DNS”**.
2. Añade el registro TXT que te muestre en el panel de tu proveedor de dominio.
3. Espera a que se propague (minutos u horas) y en Search Console haz clic en **“Comprobar”**.

---

## 4. Enviar el Sitemap

Cuando la propiedad esté **Verificada**:

1. En el menú izquierdo de Search Console, entra en **“Sitemaps”** (o “Mapas del sitio”).
2. En “Añadir un sitemap nuevo” escribe:
   ```text
   sitemap.xml
   ```
   (no pongas la URL completa, solo `sitemap.xml`).
3. Pulsa **“Enviar”**.

El sitemap de este proyecto se genera en:

```text
https://tu-dominio.com/sitemap.xml
```

Google irá rastreando las URLs del sitemap. Los resultados y estadísticas pueden tardar unos días en aparecer.

---

## 5. Revisar índice y errores

- **Cobertura / Páginas**: para ver qué URLs están indexadas o con problemas.
- **Mejoras**: para ver avisos de móvil, Core Web Vitals, etc.
- **Enlaces**: para ver enlaces internos y externos.

---

## Resumen rápido

| Paso | Acción |
|------|--------|
| 1 | Ir a [search.google.com/search-console](https://search.google.com/search-console) |
| 2 | Añadir propiedad con la URL de tu sitio |
| 3 | Verificar con meta tag: añadir `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` en `.env` y desplegar |
| 4 | En “Sitemaps”, enviar `sitemap.xml` |
| 5 | Revisar “Cobertura” y “Mejoras” cuando haya datos |

Si quieres, el siguiente paso puede ser revisar juntos el valor exacto de la meta etiqueta en tu `.env` o la URL que usaste en la propiedad.
