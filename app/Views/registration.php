<?php
declare(strict_types=1);
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/png" href="/assets/img/simbolo.png">
    <title>Registro · Factualy</title>
    <script>
        try {
            if (localStorage.getItem('factualy-theme') === 'light') {
                document.documentElement.classList.add('theme-light');
            }
        } catch (error) {}
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/landing.css?v=32">
    <link rel="stylesheet" href="/assets/css/registration.css?v=6">
    <script src="/assets/js/landing.js?v=12" defer></script>
    <script src="/assets/js/registration.js?v=1" defer></script>
</head>
<body class="registration-page">
<header class="site-header"><div class="container header-inner"><a class="brand" href="/" aria-label="Volver al inicio"><img class="brand-logo brand-logo-dark" src="/assets/img/logoc.png" alt="Factualy"><img class="brand-logo brand-logo-light" src="/assets/img/logo.png" alt="Factualy"></a><div class="header-actions"><button class="theme-toggle" type="button" data-theme-toggle aria-label="Cambiar a modo claro" title="Cambiar a modo claro"><svg class="theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path></svg><svg class="theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"></path></svg></button><a class="registration-back" href="/">Volver al inicio</a></div></div></header>
<main class="registration-main">
    <div class="registration-container">
        <div class="registration-heading"><p class="eyebrow">Empecemos con tus datos</p><h1>Prepara tu registro</h1><p>Selecciona el tipo de persona y adjunta la información necesaria para configurar tu facturación.</p></div>
        <form class="registration-form" data-registration-form>
            <fieldset class="person-choice"><legend>¿Eres persona natural o jurídica?</legend><label class="choice-card"><input type="radio" name="person_type" value="natural" required><span><strong>Persona natural</strong><small>Facturas a tu nombre</small></span></label><label class="choice-card"><input type="radio" name="person_type" value="legal" required><span><strong>Persona jurídica</strong><small>Facturas a nombre de una empresa</small></span></label></fieldset>
            <section class="person-fields" data-person-fields="natural" hidden>
                <h2>Datos de persona natural</h2>
                <div class="form-grid"><label class="field"><span>Teléfono</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" value="" required></label><label class="field"><span>Dirección</span><input name="address" type="text" autocomplete="street-address" value="" required></label><label class="field"><span>Correo electrónico</span><input name="email" type="email" autocomplete="email" placeholder="nombre@correo.com" required></label></div>
                <div class="upload-grid"><label class="upload-field"><span>Resolución electrónica vigente <small>Opcional si no la tienes</small></span><input type="file" name="electronic_resolution_natural" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"><small>PDF, JPG o PNG · máximo 10 MB</small></label><label class="upload-field"><span>Cédula · lado frontal</span><input type="file" name="identity_front_natural" accept=".jpg,.jpeg,.png,image/jpeg,image/png" required><small>JPG o PNG · máximo 5 MB</small></label><label class="upload-field"><span>Cédula · lado posterior</span><input type="file" name="identity_back_natural" accept=".jpg,.jpeg,.png,image/jpeg,image/png" required><small>JPG o PNG · máximo 5 MB</small></label></div>
                <label class="check-row"><input type="checkbox" name="no_resolution_natural" data-no-resolution="natural"><span>No tengo resolución electrónica vigente</span></label>
                <div class="credentials-fields" data-credentials="natural" hidden><p>Si no tienes resolución, indica tus datos DIAN para la gestión de facturación.</p><div class="form-grid"><label class="field"><span>Usuario DIAN</span><input type="text" name="dian_username_natural" autocomplete="username"></label><label class="field"><span>Contraseña DIAN</span><input type="password" name="dian_password_natural" autocomplete="off"></label></div></div>
            </section>
            <section class="person-fields" data-person-fields="legal" hidden>
                <h2>Datos de persona jurídica</h2>
                <div class="form-grid"><label class="field"><span>Teléfono de contacto</span><input name="legal_phone" type="tel" autocomplete="tel" inputmode="tel" value="" required></label><label class="field"><span>Dirección</span><input name="legal_address" type="text" autocomplete="street-address" value="" required></label></div>
                <div class="upload-grid"><label class="upload-field"><span>RUT</span><input type="file" name="rut" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required><small>PDF, JPG o PNG · máximo 10 MB</small></label><label class="upload-field"><span>Cámara de Comercio <small>Expedida hace menos de 30 días</small></span><input type="file" name="chamber_certificate" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required><small>PDF, JPG o PNG · máximo 10 MB</small></label><label class="upload-field"><span>Resolución electrónica vigente <small>Opcional si no la tienes</small></span><input type="file" name="electronic_resolution_legal" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"><small>PDF, JPG o PNG · máximo 10 MB</small></label><label class="upload-field"><span>Cédula del representante · lado frontal</span><input type="file" name="identity_front_legal" accept=".jpg,.jpeg,.png,image/jpeg,image/png" required><small>JPG o PNG · máximo 5 MB</small></label><label class="upload-field"><span>Cédula del representante · lado posterior</span><input type="file" name="identity_back_legal" accept=".jpg,.jpeg,.png,image/jpeg,image/png" required><small>JPG o PNG · máximo 5 MB</small></label></div>
                <label class="check-row"><input type="checkbox" name="no_resolution_legal" data-no-resolution="legal"><span>No tengo resolución electrónica vigente</span></label>
                <div class="credentials-fields" data-credentials="legal" hidden><p>Si no tienes resolución, indica tus datos DIAN para la gestión de facturación.</p><div class="form-grid"><label class="field"><span>Usuario DIAN</span><input type="text" name="dian_username_legal" autocomplete="username"></label><label class="field"><span>Contraseña DIAN</span><input type="password" name="dian_password_legal" autocomplete="off"></label></div></div>
            </section>
            <button class="button registration-submit" type="submit" disabled data-registration-submit>Continuar</button>
            <p class="form-feedback" data-form-feedback role="status" aria-live="polite">Selecciona el tipo de persona para continuar.</p>
        </form>
    </div>
</main>
<footer class="site-footer"><div class="container footer-bottom"><span>© 2026 FACTUALY. Todos los derechos reservados.</span><a href="https://wa.me/573043659999" target="_blank" rel="noopener noreferrer">WhatsApp · 3043659999</a></div></footer>
</body>
</html>
