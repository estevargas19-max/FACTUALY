# Cómo empezar (Codex y Antigravity)

## Preparación (una sola vez)

1. Crea una carpeta para el proyecto (por ejemplo `facturacion-app`) y ábrela en Codex o Antigravity.
2. Copia `AGENTS.md` en la **raíz** de esa carpeta. Ambas herramientas lo leen automáticamente.
3. Inicia Git: `git init` y crea un `.gitignore` con `.env`, `vendor/` y `storage/`.
4. Haz el primer commit antes de pedirle nada al agente.

## Prompt 1 — Estructura base y landing

```
Lee AGENTS.md y respeta todas sus reglas.

Tarea: crear la estructura base del proyecto y la landing de una sola página.

1. Crea las carpetas y archivos de la sección 3 de AGENTS.md (con un router mínimo en public/index.php y un .env.example).
2. Construye la landing en PHP + HTML + CSS con estas secciones, en este orden:
   - Barra superior: logo "[TU MARCA]" y botón "Empezar".
   - Hero: título "Factura en tres pasos, sin límites.", subtítulo "Un único plan con facturas ilimitadas y anulaciones incluidas. Crea tus servicios, agrega a tu cliente y genera tu factura.", botones "Comprar plan anual" y "Ver cómo funciona", el precio $345.900 / año, y una tarjeta de factura de ejemplo.
   - "Así de simple funciona": 3 tarjetas (Paso 1 Crea tus servicios, Paso 2 Agrega tu cliente, Paso 3 Genera tu factura).
   - "El formato que tu negocio necesita": miniaturas de varios PDF y de una tirilla POS electrónico.
   - "Un solo plan, todo incluido": tarjeta con $345.900 / año, "Menos de $29.000 al mes · [IVA incluido / no incluido]" y la lista: facturas ilimitadas, anulaciones incluidas, formato POS electrónico, múltiples formatos PDF.
   - Preguntas frecuentes (4 tarjetas), llamado final a comprar y pie de página con datos entre corchetes.
3. Usa la paleta y tipografías de la sección 8 de AGENTS.md. Mobile first.
4. Todavía NO agregues animaciones, base de datos ni login.

Antes de escribir código, muéstrame el plan de archivos en pocas líneas. Cuando termines, dime cómo ejecutarlo y probarlo.
```

## Prompt 2 — Animaciones

```
Agrega animaciones a la landing siguiendo la sección 8 de AGENTS.md:
aparición de las tarjetas al hacer scroll, hover en tarjetas, la factura de ejemplo del hero que se arma sola, y el precio mensual que cuenta hacia arriba. Usa CSS e IntersectionObserver (sin librerías si no son necesarias) y respeta prefers-reduced-motion.
```

## Siguientes prompts (uno por vez, probando cada uno)

3. **Base de datos y login:** tablas `accounts` y `users`, registro, inicio y cierre de sesión con las reglas de seguridad de la sección 5 (CSRF, password_hash, sesiones seguras, límite de intentos).
4. **Servicios (paso 1):** crear, listar, editar y desactivar servicios, siempre filtrados por `account_id`.
5. **Clientes (paso 2):** crear clientes y la opción "consumidor final".
6. **Facturas (paso 3):** crear factura con ítems y totales, estados, anulación con motivo, numeración consecutiva, usando `InvoiceProvider` simulado.
7. **Formatos de salida:** PDF en varios diseños y vista POS electrónico (tirilla).
8. **Pagos:** interfaz `PaymentGateway`, implementación simulada, webhook con verificación de firma e idempotencia, activación de la suscripción por 12 meses. Después, el proveedor real en sandbox.
9. **Integración DIAN:** reemplazar el `InvoiceProvider` simulado por el proveedor tecnológico elegido.

## Consejos

- Revisa cada resultado en el navegador antes de pasar al siguiente prompt y haz un commit.
- Si usas ambas herramientas en el mismo proyecto, trabaja con una a la vez para evitar cambios cruzados en los mismos archivos.
- Pagos, login y permisos son lo más delicado: revísalos con calma (puedes pedirle al agente que explique el código línea por línea).
