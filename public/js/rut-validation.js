document.addEventListener('DOMContentLoaded', () => {

    const rutInputs = Array.from(document.querySelectorAll('input[name*="rut" i], input[id*="rut" i]'))
        .filter(input => {
            const name = (input.getAttribute('name') || '').toLowerCase();
            const id = (input.getAttribute('id') || '').toLowerCase();
            return !name.includes('profesional') && !id.includes('profesional');
        });

    rutInputs.forEach(input => {
        // Formatear y validar en carga si ya tiene valor
        if (input.value !== '' && window.hRut) {
            const cleaned = window.hRut.cleanRut(input.value);
            const formatted = window.hRut.formatRut(cleaned);
            input.value = formatted;
            if (window.hRut.validateRut(formatted)) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
            }
        }

        input.addEventListener('input', (e) => {
            if (e.target.value === '') {
                input.classList.remove('is-invalid', 'is-valid');
                return;
            }

            if (window.hRut) {

                let cursorPosition = e.target.selectionStart;
                let oldLength = e.target.value.length;

                let cleanedValue = window.hRut.cleanRut(e.target.value);
                if (cleanedValue.length > 9) {
                    cleanedValue = cleanedValue.substring(0, 9);
                }

                let formatted = window.hRut.formatRut(cleanedValue);
                e.target.value = formatted;

                if (cursorPosition !== null && formatted.length > oldLength) {
                    e.target.setSelectionRange(cursorPosition + (formatted.length - oldLength), cursorPosition + (formatted.length - oldLength));
                }

                if (window.hRut.validateRut(formatted)) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                } else {
                    input.classList.remove('is-valid');

                    input.classList.remove('is-invalid'); 
                }
            }
        });

        input.addEventListener('blur', (e) => {
            if (e.target.value === '') {
                input.classList.remove('is-invalid', 'is-valid');
                return;
            }

            if (window.hRut) {
                const formatted = window.hRut.formatRut(e.target.value);
                e.target.value = formatted;

                if (window.hRut.validateRut(formatted)) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                } else {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                }
            }
        });

        const form = input.closest('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                if (window.hRut && input.value !== '') {
                    if (!window.hRut.validateRut(input.value)) {
                        e.preventDefault();
                        e.stopPropagation();
                        input.classList.remove('is-valid');
                        input.classList.add('is-invalid');
                        input.focus();
                    }
                }
            });
        }
    });
});
