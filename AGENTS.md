# AGENTS.md — Plataforma de facturación electrónica

Este archivo lo leen Codex y Antigravity al iniciar cada sesión. Sigue estas reglas en todo el proyecto.

## 1. Qué estamos construyendo

Plataforma web de **facturación electrónica para Colombia**, con **un único plan**: **$345.900 COP al año** (facturas electrónicas ilimitadas y anulaciones incluidas).

Flujo del producto en 3 pasos:
1. Crear servicios.
2. Crear clientes, o facturar a "consumidor final".
3. Generar la factura.

Formatos de salida: **POS electrónico** (tirilla) y **múltiples diseños PDF**.

Partes del sistema: (a) landing de una sola página con animaciones, (b) registro e inicio de sesión, (c) panel con servicios, clientes y facturas, (d) cobro del plan anual con pasarela de pagos, (e) emisión electrónica vía proveedor tecnológico autorizado por la DIAN.

## 2. Stack (no cambiar sin preguntar)

- **PHP 8.x puro, sin frameworks** (nada de Laravel, Symfony, etc.).
- **HTML5 + CSS + JavaScript vanilla.** Animaciones con CSS, `IntersectionObserver` y, si hace falta, GSAP.
- **MySQL/MariaDB** con **PDO**.
- **Composer** solo para librerías puntuales y justificadas (por ejemplo PDF, correo). Pregunta antes de agregar una dependencia.
- Servidor de desarrollo: `php -S localhost:8000 -t public`.

## 3. Estructura de carpetas

```
public/            # única carpeta expuesta al navegador
  index.php        # front controller (enruta todas las peticiones)
  assets/          # css, js, img, fonts
app/
  Core/            # Router, Database (PDO), Session, Csrf, Validator, View
  Controllers/
  Models/
  Services/        # lógica de negocio (facturas, pagos, suscripción)
  Views/           # plantillas PHP/HTML
config/            # lectura de variables de entorno
database/          # archivos .sql de migración, numerados (001_, 002_ ...)
storage/           # logs y PDFs generados (fuera de public/)
tests/
.env.example       # plantilla de variables; el .env real NUNCA se sube
```

Todo lo que no sea `public/` debe quedar fuera del alcance del navegador.

## 4. Convenciones de código

- Identificadores (variables, funciones, clases, tablas, columnas) en **inglés**. Textos de interfaz y comentarios en **español**.
- `declare(strict_types=1);` en todos los archivos PHP. Estilo PSR-12. Autoload PSR-4 si se usa Composer.
- Funciones cortas y con una sola responsabilidad. Sin lógica de negocio dentro de las vistas.
- Dinero: guardar en **pesos como entero** (o `DECIMAL`), nunca `float`. Mostrar con formato colombiano: `$345.900`.
- Fechas en UTC en la base de datos; mostrar en `America/Bogota`.

## 5. Seguridad (obligatorio)

El sistema maneja cuentas, datos de clientes y dinero. Estas reglas no se negocian:

- **Siempre consultas preparadas** con PDO. Nunca concatenar variables en SQL.
- Contraseñas con `password_hash()` / `password_verify()`. Nunca en texto plano ni con MD5/SHA1.
- **Token CSRF** en todos los formularios y peticiones que cambian datos.
- Escapar toda salida en HTML con `htmlspecialchars($v, ENT_QUOTES, 'UTF-8')`.
- Sesiones: `session_regenerate_id(true)` al iniciar sesión; cookies con `HttpOnly`, `Secure` y `SameSite=Lax`.
- Validar **siempre en el servidor** (el JavaScript solo ayuda a la usabilidad).
- **Aislamiento entre cuentas:** cada consulta de servicios, clientes y facturas se filtra por el dueño (`account_id`). Un usuario jamás debe ver o modificar datos de otro.
- Limitar intentos de inicio de sesión (rate limit) y no revelar si el correo existe.
- Secretos (llaves de la pasarela, base de datos) solo en `.env`, fuera de `public/` y **ignorado por Git**. Nunca en el código ni en commits.
- Subidas de archivos: validar tipo y tamaño, renombrar y guardar fuera de `public/`.
- Los logs no deben contener contraseñas, tokens ni datos de tarjetas.
- **Nunca** recibir ni guardar datos de tarjeta: el pago ocurre en el checkout alojado de la pasarela.

## 6. Pasarela de pagos

- Pasarela aún por decidir entre **Wompi, ePayco o PayU**. Diseña una interfaz `PaymentGateway` (crear cobro, consultar estado, validar webhook) y una implementación por proveedor. Empieza con una implementación **simulada (mock)**.
- Usar siempre el **modo de pruebas (sandbox)** hasta que el usuario indique lo contrario.
- Flujo: botón "Comprar plan anual" → checkout de la pasarela → **webhook** a nuestro servidor → si el pago está aprobado, activar la suscripción por 12 meses.
- El webhook debe **verificar la firma** del proveedor, ser **idempotente** (procesar un mismo evento una sola vez) y consultar el estado real del pago cuando el proveedor lo permita. Nunca confiar solo en la redirección del navegador.
- Tabla de pagos con estados (`pending`, `approved`, `declined`, `error`) y la referencia de la pasarela.

## 7. Facturación electrónica (DIAN)

- La validación ante la DIAN se hace mediante un **proveedor tecnológico autorizado**. **No implementes desde cero** firma XML ni envío a la DIAN salvo que el usuario lo pida expresamente.
- Crea una interfaz `InvoiceProvider` con una implementación **simulada** y deja claros los puntos de integración con `// TODO(provider)`.
- Las **anulaciones** no borran registros: cambian el estado de la factura y guardan fecha, motivo y usuario.
- La numeración de facturas debe ser consecutiva y no reutilizable.
- Si dudas de un requisito legal o tributario, **no lo inventes**: déjalo como `TODO` y avísale al usuario.

## 8. Diseño y animaciones

Referencia visual aprobada: https://claude.ai/artifact/KYk5qn3BF4RNUyLcqM8jdE (maqueta de la landing). Si no puedes abrirla, usa lo siguiente.

- Colores: principal `#1747C9`, acento (checks) `#0E7C66`, texto `#0F1B2D`, texto secundario `#4A5A70`, bordes `#E2E8F0`, fondo suave `#F4F7FB`, blanco `#FFFFFF`.
- Tipografías (Google Fonts): **Space Grotesk** para títulos e **Inter** para texto.
- Estilo: limpio, mucho espacio en blanco, tarjetas redondeadas (radio 16px) y sombras suaves. Variables CSS para colores y espaciados.
- **Mobile first**; todo debe verse bien desde 360 px de ancho.
- Accesibilidad: contraste mínimo 4.5:1, botones y enlaces reales (`<button>`, `<a>`), etiquetas en los campos, objetivos táctiles de al menos 44 px, `alt` en imágenes.
- Animaciones: sutiles y ligeras (aparición al hacer scroll, hover en tarjetas, factura de ejemplo que se arma, precio mensual que cuenta hacia arriba). **Respetar `prefers-reduced-motion`.** No bloquear el renderizado ni cargar librerías pesadas sin necesidad.
- Sin emojis como íconos: usar SVG en línea.
- Textos pendientes entre corchetes (`[TU MARCA]`, `[IVA incluido / no incluido]`, `[CORREO DE CONTACTO]`, `[TELÉFONO]`) se dejan tal cual hasta que el usuario los defina. No inventes cifras ni afirmaciones legales.

## 9. Cómo trabajar con el usuario

- El usuario es estudiante y está aprendiendo PHP: explica brevemente **qué hiciste y por qué**, en español y sin jerga innecesaria.
- Haz **una tarea a la vez**. Antes de un cambio grande, propone un plan corto y espera confirmación.
- Cambios pequeños y **commits pequeños** con mensajes claros.
- No ejecutes comandos destructivos (borrar carpetas, `DROP DATABASE`, `git reset --hard`, `git push --force`) sin permiso explícito.
- No agregues dependencias, servicios ni herramientas nuevas sin preguntar.
- Si un requisito es ambiguo, pregunta antes de suponer.
- No reescribas archivos que no tienen relación con la tarea.

## 10. Comandos útiles

- Servidor local: `php -S localhost:8000 -t public`
- Revisar sintaxis: `php -l archivo.php`
- Migraciones: ejecutar los `.sql` de `database/` en orden numérico.
- Tests (cuando existan): `vendor/bin/phpunit`

## 11. Definición de "terminado"

Una tarea está lista cuando: funciona en el navegador, no hay errores de PHP ni de consola, se probaron los casos de error (datos vacíos, sesión vencida, usuario sin permiso), cumple la sección 5 de seguridad, y el usuario sabe cómo probarla.
