'use strict';

const registrationForm = document.querySelector('[data-registration-form]');
if (registrationForm) {
    const submitButton = registrationForm.querySelector('[data-registration-submit]');
    const feedback = registrationForm.querySelector('[data-form-feedback]');

    function selectedPersonType() {
        return registrationForm.querySelector('input[name="person_type"]:checked')?.value ?? '';
    }

    function updateRegistrationForm() {
        const selectedType = selectedPersonType();
        registrationForm.querySelectorAll('[data-person-fields]').forEach((section) => {
            const active = section.dataset.personFields === selectedType;
            section.hidden = !active;
            section.querySelectorAll('input').forEach((input) => {
                if (input.type === 'checkbox' || input.dataset.noResolution) return;
                input.disabled = !active;
            });
        });

        registrationForm.querySelectorAll('[data-no-resolution]').forEach((checkbox) => {
            const credentialFields = registrationForm.querySelector(`[data-credentials="${checkbox.dataset.noResolution}"]`);
            const active = checkbox.dataset.noResolution === selectedType && checkbox.checked;
            credentialFields.hidden = !active;
            credentialFields.querySelectorAll('input').forEach((input) => {
                input.disabled = !active;
                input.required = active;
            });
        });

        submitButton.disabled = !selectedType;
        feedback.textContent = selectedType ? 'Completa los datos y adjunta los documentos solicitados.' : 'Selecciona el tipo de persona para continuar.';
    }

    registrationForm.addEventListener('change', updateRegistrationForm);
    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!registrationForm.reportValidity()) return;
        feedback.textContent = 'El formulario está preparado. El envío y almacenamiento seguro se activarán al conectar el servidor.';
    });

    updateRegistrationForm();
}
