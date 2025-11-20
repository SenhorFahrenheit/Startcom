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

// Utility function to format Brazilian currency (BRL)
// Examples:
// "1247.3" -> "R$ 1.247,30"
// "0" -> "R$ 0,00"
export const formatCurrency = (value) => {
  if (value == null || value === "") return "R$ 0,00";

  const number = typeof value === "number" ? value : parseFloat(value.replace(",", "."));

  if (isNaN(number)) return "R$ 0,00";

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

// Utility function to format percentage values in Brazilian format
// Example: 83.25 -> "83,25%"
export const formatPercent = (value) => {
  if (value == null || value === "") return "0%";

  const number = typeof value === "number" ? value : parseFloat(value);

  if (isNaN(number)) return "0%";

  return `${number.toFixed(2).replace(".", ",")}%`;
};

// Utility function to format dates from "YYYY-MM-DD" to "DD/MM/YYYY"
// Example: "2025-11-01" -> "01/11/2025"
export const formatDateBR = (value) => {
  if (!value || typeof value !== "string") return "";

  const cleaned = value.split("T")[0];

  const [year, month, day] = cleaned.split("-");
  if (!year || !month || !day) return "";

  return `${day}/${month}/${year}`;
};

export const formatMonthLabel = (value) => {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return formatDateBR(value);
  }

  const englishToBr = {
    january: "Janeiro",
    february: "Fevereiro",
    march: "Março",
    april: "Abril",
    may: "Maio",
    june: "Junho",
    july: "Julho",
    august: "Agosto",
    september: "Setembro",
    october: "Outubro",
    november: "Novembro",
    december: "Dezembro",
  };

  const lower = value.toLowerCase();

  if (englishToBr[lower]) {
    return englishToBr[lower];
  }

  return value;
};
