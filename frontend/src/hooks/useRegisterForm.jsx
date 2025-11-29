import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { validateCNPJ, validateCPF, validatePhone, getPasswordStrength } from "../utils/validations";
import { formatCNPJ, formatCPF, formatPhone } from "../utils/format";
import { registerAPI } from "../services/api";

// Hook to manage user registration form
export const useRegisterForm = (onSuccess) => {
  // React Hook Form instance
  const { register, handleSubmit, control, watch } = useForm();

  // Loading state for submit button
  const [buttonLoading, setButtonLoading] = useState(false);

  // Handles form submission
  const onSubmit = async (data) => {
    try {
      setButtonLoading(true);

      // Call registration API
      const response = await registerAPI(data);

      if (!response) {
        throw new Error("Invalid registration response.");
      }

      toast.success("Cadastro realizado!", { containerId: "toast-root" });

      if (onSuccess) {
        onSuccess(data.email);
      }

    } catch (error) {
      // Handle duplicate account error
      if (error.response && error.response.status === 409) {
        toast.error("Já existe uma conta com esse CPF/CNPJ ou email.", {
          containerId: "toast-root",
        });
        return;
      }

      // Generic error
      toast.error("Não foi possível concluir o cadastro. Tente novamente.", {
        containerId: "toast-root",
      });
    } finally {
      setButtonLoading(false);
    }
  };

  // Handles validation errors
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