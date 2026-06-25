document.addEventListener('DOMContentLoaded', () => {
    // Buscar todos los inputs que podrían ser un RUT (por name o id)
    const rutInputs = document.querySelectorAll('input[name*="rut" i], input[id*="rut" i]');

    rutInputs.forEach(input => {
        // Formatear el RUT en cada pulsación (autocompletado de puntos y guion)
        input.addEventListener('input', (e) => {
            if (e.target.value === '') {
                input.classList.remove('is-invalid', 'is-valid');
                return;
            }
            
            if (window.hRut) {
                // Guardar la posición del cursor antes del cambio
                let cursorPosition = e.target.selectionStart;
                let oldLength = e.target.value.length;
                
                // Restringir a 9 dígitos (RUT chileno estándar)
                let cleanedValue = window.hRut.cleanRut(e.target.value);
                if (cleanedValue.length > 9) {
                    cleanedValue = cleanedValue.substring(0, 9);
                }

                // Dar formato automático de puntos y guión
                let formatted = window.hRut.formatRut(cleanedValue);
                e.target.value = formatted;
                
                // Intentar mantener el cursor en la posición correcta (opcional pero mejora UX)
                if (cursorPosition !== null && formatted.length > oldLength) {
                    e.target.setSelectionRange(cursorPosition + (formatted.length - oldLength), cursorPosition + (formatted.length - oldLength));
                }

                // Opcional: mostrar validación exitosa apenas esté correcto
                if (window.hRut.validateRut(formatted)) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                } else {
                    input.classList.remove('is-valid');
                    // Retiramos is-invalid mientras escribe para no molestar, el blur se encargará de marcar el error final
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

        // Validar antes de enviar el formulario padre (si existe)
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
