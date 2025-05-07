// Convertir un numéro de téléphone en format international
function toInternationalPhoneNumber(number) {
    if (!/^\d{10}$/.test(number)) {
      throw new Error('Le numéro local doit contenir exactement 10 chiffres');
    }
  
    if (!number.startsWith('06') && !number.startsWith('07')) {
      throw new Error('Le numéro local doit commencer par 06 ou 07');
    }
  
    const intl = '+33' + number.slice(1);
    
    if (intl.length > 12) {
      throw new Error('Le numéro international dépasse 12 caractères');
    }
  
    return intl;
  }



  // Convertir un numéro de téléphone en format local (FR)
  function toLocalPhoneNumber(number) {
    if (number.startsWith('+33')) {
      const localNumber = '0' + number.slice(3);
  
      if (!/^(06|07)\d{8}$/.test(localNumber)) {
        throw new Error('Le numéro local doit commencer par 06 ou 07 et contenir 10 chiffres');
      }
  
      return localNumber;
    }
  
    if (/^(06|07)\d{8}$/.test(number)) {
      return number;
    }
  
    throw new Error('Numéro invalide : il doit être au format local (06/07...) ou international (+33...)');
  }


  export { toInternationalPhoneNumber, toLocalPhoneNumber };


  // Exemple d'utilisation
  /*
  import { toInternationalPhoneNumber, toLocalPhoneNumber } from '@/utils/phoneNumber.js';

const local = '0612345678';
const intl = toInternationalPhoneNumber(local);
console.log(intl); // +33612345678

const backToLocal = toLocalPhoneNumber(intl);
console.log(backToLocal); // 0612345678
*/
  