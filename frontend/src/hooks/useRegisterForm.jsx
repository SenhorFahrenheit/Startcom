import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { validateCNPJ, validateCPF, validatePhone, getPasswordStrength } from "../utils/validations";
import { formatCNPJ, formatCPF, formatPhone } from "../utils/format";
import { registerAPI } from "../services/api";

export const useRegisterForm = (onSuccess) => {
  const { register, handleSubmit, control, watch } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await registerAPI(data);

      if (!response) {
        throw new Error("Resposta de cadastro inválida.");
      }

      toast.success("Cadastro realizado!", { containerId: "toast-root" });

      if (onSuccess) {
        onSuccess(data.email);
      }

      // setTimeout(() => {
      //   window.location.reload();
      // }, 5000);
      
    } catch (error) {
      toast.error("Erro ao realizar cadastro", {
        containerId: "toast-root",
      });
      return;
    }
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
    watch,
    onSubmit,
    onError,
    validateCNPJ,
    validateCPF,
    validatePhone,
    getPasswordStrength,
    formatCNPJ,
    formatCPF,
    formatPhone,
  };
};