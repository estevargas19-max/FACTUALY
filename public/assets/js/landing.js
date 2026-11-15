/**
 * FACTUALY - Interactividad y animaciones de la landing page
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Selector persistente entre la landing y el formulario de registro.
    const themeToggle = document.querySelector('[data-theme-toggle]');
    const rootElement = document.documentElement;

    try {
        if (window.localStorage.getItem('factualy-theme') === 'light') {
            rootElement.classList.add('theme-light');
        }
    } catch (error) {
        // La página conserva el tema oscuro si el navegador bloquea el almacenamiento.
    }

    function updateThemeToggle() {
        const isLight = rootElement.classList.contains('theme-light');
        if (!themeToggle) return;
        const action = isLight ? 'oscuro' : 'claro';
        themeToggle.setAttribute('aria-label', `Cambiar a modo ${action}`);
        themeToggle.setAttribute('title', `Cambiar a modo ${action}`);
        themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    }

    updateThemeToggle();
    themeToggle?.addEventListener('click', () => {
        const isLight = rootElement.classList.toggle('theme-light');
        try {
            window.localStorage.setItem('factualy-theme', isLight ? 'light' : 'dark');
        } catch (error) {
            // El tema elegido se mantiene mientras la página siga abierta.
        }
        updateThemeToggle();
    });

    const menuToggle = document.querySelector('[data-menu-toggle]');
    const primaryNavigation = document.querySelector('#primary-navigation');

    function closeMobileNavigation() {
        if (!menuToggle || !primaryNavigation) return;
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
        menuToggle.setAttribute('title', 'Abrir menú de navegación');
        primaryNavigation.classList.remove('is-open');
    }

    if (menuToggle && primaryNavigation) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
            menuToggle.setAttribute('title', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
            primaryNavigation.classList.toggle('is-open', isOpen);
        });

        primaryNavigation.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMobileNavigation);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMobileNavigation();
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.site-header')) closeMobileNavigation();
        });
    }

    // -------------------------------------------------------------------------
    // 1. Alternancia automática entre la vista móvil y la tirilla POS.
    const stage = document.querySelector('.showcase-stage');
    if (stage && !motionPreference.matches) {
        let activeCard = 'phone';
        window.setInterval(() => {
            activeCard = activeCard === 'phone' ? 'receipt' : 'phone';
            const transitionClass = activeCard === 'receipt' ? 'is-swapping-to-receipt' : 'is-swapping-to-phone';
            stage.classList.remove('is-swapping-to-receipt', 'is-swapping-to-phone');
            void stage.offsetWidth;
            stage.setAttribute('data-active', activeCard);
            stage.classList.add(transitionClass);
            window.setTimeout(() => stage.classList.remove(transitionClass), 1050);
        }, 4800);
    }
    // 2. Tabs de formatos en Bento Grid (Múltiples diseños PDF)
    // -------------------------------------------------------------------------
    const tabBtns = document.querySelectorAll('.format-segmented-tabs .tab-btn');
    const docPreviews = document.querySelectorAll('.mini-doc-preview');

    if (tabBtns.length > 0) {
        tabBtns.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                tabBtns.forEach((b) => b.classList.remove('is-active'));
                btn.classList.add('is-active');

                // Si hay mini docs correspondientes, resaltarlos
                if (docPreviews.length > 0) {
                    docPreviews.forEach((doc, docIdx) => {
                        if (docIdx === idx || (idx === 3 && docIdx === 0)) {
                            doc.style.transform = 'scale(1.04)';
                            doc.style.boxShadow = '0 8px 24px rgba(0, 113, 227, 0.15)';
                        } else {
                            doc.style.transform = 'scale(1)';
                            doc.style.boxShadow = '';
                        }
                    });
                }
            });
        });
    }

    // -------------------------------------------------------------------------
    // 3. Acordeones FAQ: Actualización de iconos +/-
    // -------------------------------------------------------------------------
    const faqDetails = document.querySelectorAll('.faq-item');
    faqDetails.forEach((details) => {
        const icon = details.querySelector('.faq-icon');
        if (icon) {
            details.addEventListener('toggle', () => {
                icon.textContent = details.open ? '−' : '+';
            });
        }
    });
});
