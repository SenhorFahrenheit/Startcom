import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { validateCNPJ, validateCPF, validatePhone } from "../utils/validations";
import { formatCNPJ, formatCPF, formatPhone } from "../utils/format";

export const useSettingForm = (onSuccess) => {
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      nameBusiness: "Minha Empresa",
      CNPJorCPF: "04.027.724/0001-80",
      email: "contato@minhaempresa.com",
      telefone: "(11) 98765-4321",
      address: "Rua Exemplo, 123, São Paulo - SP",
    },
  });

  const onSubmit = (data) => {
    console.log("Configuração:", data);
    toast.success("Configurações alteradas!", { containerId: "toast-root" });
    if (onSuccess) onSuccess(data);
  };

  const onError = (errors) => {
    Object.values(errors).forEach((err) =>
      toast.error(err.message, { containerId: "toast-root" })
    );
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    onError,
    reset,
    control,
    validateCNPJ,
    validateCPF,
    validatePhone,
    formatCNPJ,
    formatCPF,
    formatPhone,
  };
};
