# AGENTS.md — Plataforma de facturación electrónica

Este archivo lo leen Codex y Antigravity al iniciar cada sesión. Sigue estas reglas en todo el proyecto.

## 1. Qué estamos construyendo

Plataforma web de **facturación electrónica para Colombia**, con **un único plan**: **$345.900 COP al año** (facturas electrónicas ilimitadas y anulaciones incluidas).

Flujo del producto en 3 pasos:
1. Crear servicios.
2. Crear clientes, o facturar a "consumidor final".
3. Generar la factura.

Formatos de salida: **POS electrónico** (tirilla) y **múltiples diseños PDF**.

Partes del sistema: (a) landing de una sola página con animaciones, (b) formulario de registro con carga de archivos, (c) cobro del plan anual con pasarela de pagos, (d) emisión electrónica vía proveedor tecnológico autorizado por la DIAN, (e) panel de servicios, clientes y facturas (**forma de acceso por definir**).

**La plataforma NO tiene inicio de sesión.** No implementes login, contraseñas de usuarios ni cuentas hasta que el usuario lo indique.

### 1.1 Flujo de compra y registro (vigente)

1. Todos los botones de compra de la landing ("Empezar", "Comprar plan anual") llevan a la página `/registro`.
2. `/registro` es un formulario con los datos del solicitante y la **carga de archivos requeridos**. Los campos y la lista de archivos están por definir (`TODO(campos)`, `TODO(archivos)`). Mantén la lista de archivos en `config/registration_files.php` (clave, etiqueta, obligatorio, tipos permitidos, tamaño máximo) para poder cambiarla sin tocar el resto del código.
3. Al enviar el formulario correctamente: guardar el registro con estado `pending_payment` y una referencia aleatoria, guardar los archivos y **redirigir a la pasarela de pagos**.
4. Resultado del pago (por webhook): `paid`, `payment_failed` o `cancelled`. Si el pago falla, permitir reintentar **sin volver a subir los archivos**.
5. La página de resultado (`/pago/resultado?ref=...`) lee el estado desde la base de datos, nunca de parámetros de la URL.
6. No construyas el panel de servicios, clientes y facturas hasta que el usuario defina cómo se accede a él.

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
  Services/        # lógica de negocio (registro, pagos, facturas)
  Views/           # plantillas PHP/HTML
config/            # variables de entorno y registration_files.php (archivos requeridos)
database/          # archivos .sql de migración, numerados (001_, 002_ ...)
storage/           # logs, PDFs generados y uploads/ con los archivos del registro (fuera de public/)
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
- Como no hay inicio de sesión, no se guardan contraseñas de usuarios. Si algún día se agregan: `password_hash()` / `password_verify()`.
- **Token CSRF** en todos los formularios y peticiones que cambian datos.
- Escapar toda salida en HTML con `htmlspecialchars($v, ENT_QUOTES, 'UTF-8')`.
- Las sesiones PHP solo sirven para el token CSRF y datos temporales del formulario: cookies con `HttpOnly`, `Secure` y `SameSite=Lax`.
- Validar **siempre en el servidor** (el JavaScript solo ayuda a la usabilidad).
- **Aislamiento entre registros:** cada registro se identifica con una referencia aleatoria e impredecible (`random_bytes`), nunca con un ID incremental en la URL. Nadie debe poder ver datos o archivos de otro registro.
- Limitar envíos del formulario por IP y agregar protección anti-bots (campo honeypot; evaluar CAPTCHA).
- Secretos (llaves de la pasarela, base de datos) solo en `.env`, fuera de `public/` y **ignorado por Git**. Nunca en el código ni en commits.
- **Archivos subidos (documentos sensibles):** permitir solo los tipos definidos (por ejemplo PDF, JPG, PNG); validar extensión, **tipo MIME real** (`finfo`) y tamaño máximo; renombrar con un nombre aleatorio; guardar en `storage/uploads/`, **fuera de `public/`**; nunca ejecutarlos ni servirlos directamente. Si hay que descargarlos, solo mediante un script con control de acceso.
- Archivos de registros que nunca se pagaron: dejar un `TODO` para definir cuándo se borran.
- Los datos y archivos del formulario son información personal: incluir casilla de autorización de tratamiento de datos y enlace a la política de privacidad (en Colombia aplica la Ley 1581 de 2012). `TODO(legal)`: confirmar la redacción con un asesor.
- Los logs no deben contener contraseñas, tokens ni datos de tarjetas.
- **Nunca** recibir ni guardar datos de tarjeta: el pago ocurre en el checkout alojado de la pasarela.

## 6. Pasarela de pagos

- Pasarela aún por decidir entre **Wompi, ePayco o PayU**. Diseña una interfaz `PaymentGateway` (crear cobro, consultar estado, validar webhook) y una implementación por proveedor. Empieza con una implementación **simulada (mock)**.
- Usar siempre el **modo de pruebas (sandbox)** hasta que el usuario indique lo contrario.
- Flujo: formulario de registro completo → registro en `pending_payment` → checkout de la pasarela (con la referencia del registro) → **webhook** a nuestro servidor → si el pago está aprobado, marcar el registro como `paid` y fijar la vigencia de 12 meses.
- El webhook debe **verificar la firma** del proveedor, ser **idempotente** (procesar un mismo evento una sola vez) y consultar el estado real del pago cuando el proveedor lo permita. Nunca confiar solo en la redirección del navegador.
- Tabla de pagos con estados (`pending`, `approved`, `declined`, `error`) y la referencia de la pasarela.

## 7. Facturación electrónica (DIAN)

- La validación ante la DIAN se hace mediante un **proveedor tecnológico autorizado**. **No implementes desde cero** firma XML ni envío a la DIAN salvo que el usuario lo pida expresamente.
- Crea una interfaz `InvoiceProvider` con una implementación **simulada** y deja claros los puntos de integración con `// TODO(provider)`.
- Las **anulaciones** no borran registros: cambian el estado de la factura y guardan fecha y motivo.
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

Una tarea está lista cuando: funciona en el navegador, no hay errores de PHP ni de consola, se probaron los casos de error (datos vacíos, archivo inválido o demasiado grande, doble envío del formulario, pago rechazado), cumple la sección 5 de seguridad, y el usuario sabe cómo probarla.
