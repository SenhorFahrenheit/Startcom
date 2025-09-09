// Validate CPF (Brazilian individual taxpayer registry)
// The CPF is 11 digits long and has 2 check digits calculated using a specific algorithm.
export const validateCPF = (cpf) => {
  // Remove all non-digit characters
  const cleaned = cpf.replace(/\D/g, "");
  
  // Must be exactly 11 digits
  if (!/^\d{11}$/.test(cleaned)) return false;
  
  // Reject CPFs with all identical digits (e.g. "11111111111")
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  const digits = cleaned.split('').map(Number);
  
  // --- Validate first check digit ---
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (digits[9] !== firstDigit) return false;
  
  // --- Validate second check digit ---
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  
  return digits[10] === secondDigit;
};

// Validate CNPJ (Brazilian company registry)
// The CNPJ is 14 digits long and also has 2 check digits with a different calculation.
export const validateCNPJ = (cnpj) => {
  // Remove all non-digit characters
  const cleaned = cnpj.replace(/\D/g, "");
  
  // Must be exactly 14 digits
  if (!/^\d{14}$/.test(cleaned)) return false;
  
  // Reject CNPJs with all identical digits (e.g. "00000000000000")
  if (/^(\d)\1{13}$/.test(cleaned)) return false;
  
  const digits = cleaned.split('').map(Number);
  
  // --- Validate first check digit ---
  const firstMultipliers = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * firstMultipliers[i];
  }
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (digits[12] !== firstDigit) return false;
  
  // --- Validate second check digit ---
  const secondMultipliers = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += digits[i] * secondMultipliers[i];
  }
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  
  return digits[13] === secondDigit;
};

// Validate Brazilian phone numbers
// Accepts 10 digits (landline) or 11 digits (mobile with 9-digit format)
export const validatePhone = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  
  // Valid if it has 10 or 11 digits
  return /^\d{10,11}$/.test(cleaned);
};
