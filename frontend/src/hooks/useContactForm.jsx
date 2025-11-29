import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

// Custom hook for contact form submission
export const useContactForm = () => {
  // React Hook Form instance
  const { register, handleSubmit } = useForm();

  // Handles form submission
  const onSubmit = async (data) => {
    try {
      // Sends form data to API
      await axios.post("rota/aleatoria/", data);

      // Success toast
      toast.success("Mensagem enviada! Aguarde nosso retorno.", {
        containerId: "toast-root",
      });
    } catch (error) {
      // Error toast on request failure
      toast.error("Erro ao enviar mensagem: " + error.message, {
        containerId: "toast-root",
      });
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
    onSubmit,
    onError,
  };
};