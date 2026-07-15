# Landing de boda

Landing estática, responsive y accesible creada únicamente con HTML5, CSS3 y JavaScript vanilla. El formulario está preparado para Netlify Forms y no necesita backend ni proceso de compilación.

## Abrir la web en local

1. Abre la carpeta `boda-landing`.
2. Haz doble clic en `index.html`.
3. La página se abrirá en tu navegador predeterminado.

También puedes usar un servidor local sencillo si ya dispones de uno, pero no es necesario para revisar la web. Netlify Forms no guarda envíos cuando la página se abre localmente mediante `index.html`; el procesamiento del formulario solo funciona después de desplegarla en Netlify.

## Añadir las fotografías

Coloca en `assets/images/` archivos WebP con estos nombres exactos:

- `hero-boda.webp`: fotografía horizontal principal del hero.
- `pareja-1.webp`: fotografía vertical usada en la presentación y la galería.
- `pareja-2.webp`: segunda fotografía de la galería.
- `pareja-3.webp`: tercera fotografía de la galería.
- `fondo-bosque.webp`: textura o fotografía de bosque para las secciones oscuras.

La web muestra fondos de respaldo si todavía no están disponibles. Conviene optimizar cada imagen antes de publicarla; como orientación, intenta que el hero pese menos de 400 KB y el resto menos de 250 KB.

## Personalizar el contenido

Busca `CAMBIAR:` en `index.html`, `gracias.html` y `styles.css`. Ahí se señalan los datos editables:

- `[NOMBRE] & [NOMBRE]`: nombres de la pareja.
- `[FECHA DE LA BODA]`: fecha en el hero y en la sección informativa.
- `[HORA]`: hora de la celebración.
- `[NOMBRE DEL LUGAR]`: finca, iglesia o espacio de celebración.
- `[DIRECCIÓN]`: dirección completa.
- `[AÑO]`: año mostrado en el pie de página.
- `href="#"` del enlace “Ver ubicación”: sustituir por la URL definitiva de Google Maps.
- Textos de presentación, instrucciones y metadatos (`title`, descripción y Open Graph).
- Nota legal provisional de privacidad: debe sustituirse por la información legal definitiva. No se incluyen datos legales inventados.

Si se añade un favicon, guárdalo en `assets/icons/favicon.svg` y descomenta la referencia preparada en el `<head>` de `index.html`.

## Subir a GitHub

Desde una terminal abierta en la raíz de `boda-landing`, ejecuta:

```bash
git init
git add .
git commit -m "feat: landing inicial de la boda"
git branch -M main
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

Sustituye `URL_DEL_REPOSITORIO` por la dirección del repositorio vacío que hayas creado en GitHub.

## Publicar en Netlify desde GitHub

1. Inicia sesión en Netlify.
2. Selecciona **Add new project**.
3. Elige la opción para importar un proyecto existente desde GitHub.
4. Autoriza y selecciona el repositorio de esta landing.
5. Deja vacío el comando de compilación: el proyecto no necesita build.
6. Usa la raíz del proyecto como directorio de publicación (`.` o vacío, según la interfaz).
7. Publica el proyecto.

## Verificar Netlify Forms

Después del primer despliegue:

1. Entra en la URL pública de la web.
2. Envía una confirmación de prueba.
3. Abre el proyecto en Netlify.
4. Entra en **Forms**.
5. Comprueba que aparece el formulario `confirmacion-boda`.
6. Abre el formulario y verifica que figura el envío de prueba con todos los campos.

El formulario está escrito directamente en `index.html`, incluye `data-netlify="true"`, el campo oculto `form-name` y el honeypot `bot-field` requeridos por Netlify.

## Descargar los registros

En Netlify, abre el proyecto, entra en **Forms**, selecciona `confirmacion-boda` y usa la opción de exportar o descargar los envíos como CSV. La posición o el nombre exacto de esa opción puede variar ligeramente en la interfaz de Netlify.

Antes de compartir registros, revisa que se tratan de forma segura: contienen datos personales y posibles datos sobre necesidades alimentarias.

## Usar un dominio propio

Cuando quieras sustituir el dominio `.netlify.app`:

1. Abre el proyecto en Netlify.
2. Entra en la configuración de dominios (**Domain management**).
3. Selecciona la opción para añadir un dominio propio.
4. Escribe el dominio y sigue las instrucciones de DNS de Netlify.
5. Espera a que se verifiquen los registros y el certificado HTTPS.

No hace falta modificar el código de la landing salvo que quieras añadir la URL pública definitiva a los metadatos Open Graph.
