/**
 * Limpia un RUT de puntos, guiones y espacios.
 * @param {string} rut - El RUT a limpiar.
 * @returns {string} El RUT limpio.
 */
function cleanRut(rut) {
  if (typeof rut !== 'string') {
    rut = String(rut);
  }
  return rut.replace(/[^0-9kK]/g, '').toUpperCase();
}

/**
 * Calcula el dígito verificador dado un RUT sin el dígito.
 * @param {string|number} rutWithoutDv - El RUT sin dígito verificador.
 * @returns {string} El dígito verificador (0-9, K).
 */
function getCheckDigit(rutWithoutDv) {
  let rut = cleanRut(String(rutWithoutDv));
  let sum = 0;
  let multiplier = 2;

  // Recorrer el RUT de atrás hacia adelante
  for (let i = rut.length - 1; i >= 0; i--) {
    sum += parseInt(rut.charAt(i), 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);

  if (remainder === 11) {
    return '0';
  } else if (remainder === 10) {
    return 'K';
  }
  return String(remainder);
}

/**
 * Valida si un RUT es correcto matemáticamente.
 * @param {string} rut - El RUT a validar.
 * @returns {boolean} True si el RUT es válido, False en caso contrario.
 */
function validateRut(rut) {
  if (typeof rut !== 'string') {
    rut = String(rut);
  }
  
  const cleaned = cleanRut(rut);
  
  if (cleaned.length < 2) {
    return false;
  }
  
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  
  return getCheckDigit(body) === dv;
}

/**
 * Formatea un RUT con puntos y guión.
 * @param {string} rut - El RUT a formatear.
 * @returns {string} El RUT formateado (ej. 12.345.678-9).
 */
function formatRut(rut) {
  const cleaned = cleanRut(rut);
  
  if (cleaned.length === 0) {
    return '';
  }
  
  if (cleaned.length <= 1) {
    return cleaned;
  }
  
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  
  // Agregar puntos al cuerpo del rut
  let formattedBody = '';
  for (let i = body.length - 1, j = 1; i >= 0; i--, j++) {
    formattedBody = body.charAt(i) + formattedBody;
    if (j % 3 === 0 && i !== 0) {
      formattedBody = '.' + formattedBody;
    }
  }
  
  return `${formattedBody}-${dv}`;
}

// Exponer a la ventana en el navegador
if (typeof window !== 'undefined') {
  window.hRut = {
    cleanRut,
    getCheckDigit,
    validateRut,
    formatRut
  };
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cleanRut,
    getCheckDigit,
    validateRut,
    formatRut
  };
}
