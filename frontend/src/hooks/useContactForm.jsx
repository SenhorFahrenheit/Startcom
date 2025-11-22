import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

export const useContactForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post("rota/aleatoria/", data);

      toast.success("Mensagem enviada! Aguarde nosso retorno.", {
        containerId: "toast-root",
      });
    } catch (error) {
      toast.error("Erro ao enviar mensagem: " + error.message, {
        containerId: "toast-root",
      });
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
    onSubmit,
    onError,
  };
};
