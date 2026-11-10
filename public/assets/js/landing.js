'use strict';

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealCards = document.querySelectorAll('.reveal-card');
const invoice = document.querySelector('[data-invoice-animation]');
const monthlyPrice = document.querySelector('[data-monthly-price]');

function showImmediately() {
    revealCards.forEach((card) => card.classList.add('is-visible'));
    if (invoice) invoice.classList.add('is-built');
}

function formatPesos(value) {
    return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value);
}

function countMonthlyPrice() {
    if (!monthlyPrice || monthlyPrice.dataset.counted === 'true') return;
    monthlyPrice.dataset.counted = 'true';
    const target = Number.parseInt(monthlyPrice.dataset.target ?? '28825', 10);
    const startedAt = performance.now();

    function update(now) {
        const progress = Math.min((now - startedAt) / 1200, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        monthlyPrice.textContent = `Menos de $${formatPesos(Math.round(target * easedProgress))} al mes · [IVA incluido / no incluido]`;
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

if (motionPreference.matches || !('IntersectionObserver' in window)) {
    showImmediately();
} else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add(entry.target === invoice ? 'is-built' : 'is-visible');
            if (entry.target === monthlyPrice) countMonthlyPrice();
            currentObserver.unobserve(entry.target);
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -35px 0px' });

    revealCards.forEach((card) => observer.observe(card));
    if (invoice) observer.observe(invoice);
    if (monthlyPrice) observer.observe(monthlyPrice);
}

motionPreference.addEventListener?.('change', (event) => {
    if (event.matches) showImmediately();
});

const formatShowcase = document.querySelector('.format-showcase');
const formatSamples = formatShowcase?.querySelectorAll('.mini-doc, .receipt');
const pointerMotion = window.matchMedia('(hover: hover) and (pointer: fine)');

if (formatShowcase && formatSamples?.length && pointerMotion.matches && !motionPreference.matches) {
    let framePending = false;
    let pointerX = 0;
    let pointerY = 0;

    formatShowcase.addEventListener('pointermove', (event) => {
        const bounds = formatShowcase.getBoundingClientRect();
        pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
        pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
        if (framePending) return;
        framePending = true;
        requestAnimationFrame(() => {
            formatSamples.forEach((sample, index) => {
                const depth = (index + 1) * 8;
                sample.style.setProperty('--pointer-x', `${pointerX * depth}px`);
                sample.style.setProperty('--pointer-y', `${pointerY * depth}px`);
            });
            framePending = false;
        });
    });

    formatShowcase.addEventListener('pointerleave', () => {
        formatSamples.forEach((sample) => {
            sample.style.removeProperty('--pointer-x');
            sample.style.removeProperty('--pointer-y');
        });
    });
}
const showcaseCards = document.querySelectorAll('.format-showcase .mini-doc, .format-showcase .receipt');
if (showcaseCards.length === 3 && !motionPreference.matches) {
    let activeCard = 0;
    showcaseCards[activeCard].classList.add('spotlight');
    window.setInterval(() => {
        showcaseCards.forEach((card) => card.classList.remove('spotlight'));
        activeCard = (activeCard + 1) % showcaseCards.length;
        showcaseCards[activeCard].classList.add('spotlight');
    }, 1700);
}

const stepsCarousel = document.querySelector('[data-steps-carousel]');
if (stepsCarousel) {
    const slides = [...stepsCarousel.querySelectorAll('[data-step-slide]')];
    const track = stepsCarousel.querySelector('[data-steps-track]');
    const dots = [...stepsCarousel.querySelectorAll('[data-step-to]')];
    const counter = stepsCarousel.querySelector('[data-steps-counter]');
    let currentStep = 0;
    let autoAdvanceTimer;

    function startAutoAdvance() {
        window.clearInterval(autoAdvanceTimer);
        if (!motionPreference.matches) {
            autoAdvanceTimer = window.setInterval(() => showStep(currentStep + 1), 5000);
        }
    }

    function showStep(index) {
        currentStep = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentStep * 100}%)`;
        slides.forEach((slide, slideIndex) => {
            const active = slideIndex === currentStep;
            slide.setAttribute('aria-hidden', String(!active));
            slide.classList.toggle('is-active', active);
            slide.inert = !active;
        });
        dots.forEach((dot, dotIndex) => {
            if (dotIndex === currentStep) dot.setAttribute('aria-current', 'step');
            else dot.removeAttribute('aria-current');
        });
        if (counter) counter.textContent = `${String(currentStep + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }

    stepsCarousel.querySelector('[data-step-prev]').addEventListener('click', () => { showStep(currentStep - 1); startAutoAdvance(); });
    stepsCarousel.querySelector('[data-step-next]').addEventListener('click', () => { showStep(currentStep + 1); startAutoAdvance(); });
    dots.forEach((dot) => dot.addEventListener('click', () => { showStep(Number(dot.dataset.stepTo)); startAutoAdvance(); }));
    stepsCarousel.addEventListener('pointerenter', () => window.clearInterval(autoAdvanceTimer));
    stepsCarousel.addEventListener('pointerleave', startAutoAdvance);
    stepsCarousel.addEventListener('focusin', () => window.clearInterval(autoAdvanceTimer));
    stepsCarousel.addEventListener('focusout', (event) => { if (!stepsCarousel.contains(event.relatedTarget)) startAutoAdvance(); });
    motionPreference.addEventListener('change', (event) => { if (event.matches) window.clearInterval(autoAdvanceTimer); else startAutoAdvance(); });
    stepsCarousel.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') showStep(currentStep - 1);
        if (event.key === 'ArrowRight') showStep(currentStep + 1);
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') startAutoAdvance();
    });
    showStep(0);
    startAutoAdvance();
}
