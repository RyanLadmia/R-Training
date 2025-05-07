/**
 * Formate une date au format JJ/MM/AAAA hh:mm:ss
 * @param {Date} date La date à formater
 * @returns {string} La date formatée
 */
export function formatDateTime(date) {
    if (!date) return null;
    
    const d = new Date(date);
    
    // Vérifier si la date est valide
    if (isNaN(d.getTime())) return null;

    // Ajouter un zéro devant les nombres < 10
    const pad = (num) => String(num).padStart(2, '0');

    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1); // Les mois commencent à 0
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Formate une date au format JJ/MM/AAAA
 * @param {Date} date La date à formater
 * @returns {string} La date formatée
 */
export function formatDate(date) {
    if (!date) return null;
    
    const d = new Date(date);
    
    // Vérifier si la date est valide
    if (isNaN(d.getTime())) return null;

    // Ajouter un zéro devant les nombres < 10
    const pad = (num) => String(num).padStart(2, '0');

    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1); // Les mois commencent à 0
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
}

/**
 * Convertit une chaîne de date au format JJ/MM/AAAA en objet Date
 * @param {string} dateStr La date au format JJ/MM/AAAA
 * @returns {Date} L'objet Date correspondant
 */
export function parseDate(dateStr) {
    if (!dateStr) return null;

    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Convertit une chaîne de date et heure au format JJ/MM/AAAA hh:mm:ss en objet Date
 * @param {string} dateTimeStr La date au format JJ/MM/AAAA hh:mm:ss
 * @returns {Date} L'objet Date correspondant
 */
export function parseDateTime(dateTimeStr) {
    if (!dateTimeStr) return null;

    const [datePart, timePart] = dateTimeStr.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
} 