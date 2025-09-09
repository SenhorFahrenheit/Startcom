// Utility function to format CPF numbers (Brazilian individual taxpayer registry)
// Example: "12345678901" -> "123.456.789-01"
export const formatCPF = (value) => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, "");
  
  // Apply formatting according to the length of the input
  if (cleaned.length <= 3) {
    return cleaned; // Only first digits
  } else if (cleaned.length <= 6) {
    return cleaned.replace(/(\d{3})(\d+)/, "$1.$2"); // 123.456
  } else if (cleaned.length <= 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3"); // 123.456.789
  } else {
    return cleaned.replace(
      /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
      "$1.$2.$3-$4"
    ); // 123.456.789-01
  }
};

// Utility function to format CNPJ numbers (Brazilian company registry)
// Example: "12345678000195" -> "12.345.678/0001-95"
export const formatCNPJ = (value) => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, "");
  
  // Apply formatting according to the length of the input
  if (cleaned.length <= 2) {
    return cleaned; // Only first digits
  } else if (cleaned.length <= 5) {
    return cleaned.replace(/(\d{2})(\d+)/, "$1.$2"); // 12.345
  } else if (cleaned.length <= 8) {
    return cleaned.replace(/(\d{2})(\d{3})(\d+)/, "$1.$2.$3"); // 12.345.678
  } else if (cleaned.length <= 12) {
    return cleaned.replace(
      /(\d{2})(\d{3})(\d{3})(\d+)/,
      "$1.$2.$3/$4"
    ); // 12.345.678/0001
  } else {
    return cleaned.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/,
      "$1.$2.$3/$4-$5"
    ); // 12.345.678/0001-95
  }
};

// Utility function to format Brazilian phone numbers
// Examples:
// "11987654321" -> "(11) 98765-4321"
// "1134567890"  -> "(11) 3456-7890"
export const formatPhone = (value) => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, "");
  
  // Apply formatting based on length
  if (cleaned.length <= 2) {
    return cleaned.length > 0 ? `(${cleaned}` : cleaned; // (11
  } else if (cleaned.length <= 7) {
    return cleaned.replace(/(\d{2})(\d+)/, "($1) $2"); // (11) 3456
  } else if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3"); // (11) 3456-7890
  } else {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"); // (11) 98765-4321
  }
};
