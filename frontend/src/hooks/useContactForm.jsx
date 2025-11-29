import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../services/api";

// Custom hook for contact form submission
export const useContactForm = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  // React Hook Form instance
  const { register, handleSubmit, reset } = useForm();

  // Handles form submission
  const onSubmit = async (data) => {
    try {
      setButtonLoading(true);
      const response = await api.post("/User/contact", data);
      // Success toast on successful request
      if (response.data.status === "success") {
        toast.success("Mensagem enviada! Aguarde nosso retorno.", {
          containerId: "toast-root",
        });
      }
      reset(); // Reset form fields
    } catch (error) {
      // Error toast on request failure
      toast.error("Erro ao enviar mensagem: " + error.message, {
        containerId: "toast-root",
      });
    } finally {
      setButtonLoading(false);
    }
  };

  // Handles validation errors
  const onError = (errors) => {
    Object.values(errors).forEach((err) =>
      toast.error(err.message, { 
        theme: "light",
        containerId: "toast-root" })
    );
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    onError,
    buttonLoading,
  };
};