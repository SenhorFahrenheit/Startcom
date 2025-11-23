import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { validateCNPJ, validateCPF, validatePhone, getPasswordStrength } from "../utils/validations";
import { formatCNPJ, formatCPF, formatPhone } from "../utils/format";
import { registerAPI } from "../services/api";

export const useRegisterForm = (onSuccess) => {
  const { register, handleSubmit, control, watch } = useForm();
  const [buttonLoading, setButtonLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setButtonLoading(true)
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
      if (error.response && error.response.status === 409) {
        toast.error("Já existe uma conta com esse CPF/CNPJ ou email.", {
          containerId: "toast-root",
        });
        return;
      }

      toast.error("Não foi possível concluir o cadastro. Tente novamente.", {
        containerId: "toast-root",
      });
    } finally {
      setButtonLoading(false)
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
    buttonLoading,
  };
};