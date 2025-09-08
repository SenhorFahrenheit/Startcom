export const validateCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, "");
  
  if (!/^\d{11}$/.test(cleaned)) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  const digits = cleaned.split('').map(Number);
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (digits[9] !== firstDigit) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  
  return digits[10] === secondDigit;
};

export const validateCNPJ = (cnpj) => {
  const cleaned = cnpj.replace(/\D/g, "");
  
  if (!/^\d{14}$/.test(cleaned)) return false;
  if (/^(\d)\1{13}$/.test(cleaned)) return false;
  
  const digits = cleaned.split('').map(Number);
  
  const firstMultipliers = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * firstMultipliers[i];
  }
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (digits[12] !== firstDigit) return false;
  
  const secondMultipliers = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += digits[i] * secondMultipliers[i];
  }
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  
  return digits[13] === secondDigit;
};

export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  return /^\d{10,11}$/.test(cleaned);
};