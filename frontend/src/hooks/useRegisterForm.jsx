import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { validateCNPJ, validateCPF, validatePhone } from "../utils/validations";
import { formatCNPJ, formatCPF, formatPhone } from "../utils/format";
import { registerAPI } from "../services/api";

export const useRegisterForm = (onSuccess) => {
  const { register, handleSubmit, control } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await registerAPI(data);

      if (!response) {
        throw new Error("Resposta de cadastro inválida.");
      }
    } catch (error) {
      toast.error("Erro ao realizar cadastro: " + error.message, {
        containerId: "toast-root",
      });
      return;
    }

    toast.success("Cadastro realizado!", { containerId: "toast-root" });
    onSuccess(data);

    window.location = "/painel";
  };

  const onError = (errors) => {
    Object.values(errors).forEach((err) =>
      toast.error(err.message, { containerId: "toast-root" })
    );
  };

  return {
    register,
    handleSubmit,
    control,
    onSubmit,
    onError,
    validateCNPJ,
    validateCPF,
    validatePhone,
    formatCNPJ,
    formatCPF,
    formatPhone,
  };
};
