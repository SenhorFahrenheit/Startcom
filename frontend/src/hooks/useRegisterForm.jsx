import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { validateCNPJ, validateCPF, validatePhone } from "../utils/validations";
import { formatCNPJ, formatCPF, formatPhone } from "../utils/format";

export const useRegisterForm = (onSuccess) => {
  const { register, handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    console.log("Register:", data);
    toast.success("Cadastro realizado!", { containerId: "toast-root" });
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
