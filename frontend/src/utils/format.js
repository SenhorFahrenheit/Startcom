export const formatCPF = (value) => {
  const cleaned = value.replace(/\D/g, "");
  
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return cleaned.replace(/(\d{3})(\d+)/, "$1.$2");
  } else if (cleaned.length <= 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  } else {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  }
};

export const formatCNPJ = (value) => {
  const cleaned = value.replace(/\D/g, "");
  
  if (cleaned.length <= 2) {
    return cleaned;
  } else if (cleaned.length <= 5) {
    return cleaned.replace(/(\d{2})(\d+)/, "$1.$2");
  } else if (cleaned.length <= 8) {
    return cleaned.replace(/(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
  } else if (cleaned.length <= 12) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");
  } else {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, "$1.$2.$3/$4-$5");
  }
};

export const formatPhone = (value) => {
  const cleaned = value.replace(/\D/g, "");
  
  if (cleaned.length <= 2) {
    return cleaned.length > 0 ? `(${cleaned}` : cleaned;
  } else if (cleaned.length <= 7) {
    return cleaned.replace(/(\d{2})(\d+)/, "($1) $2");
  } else if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  } else {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
};