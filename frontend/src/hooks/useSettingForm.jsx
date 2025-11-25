import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { validateCNPJ, validateCPF, validatePhone } from "../utils/validations";
import { formatCNPJ, formatCPF, formatPhone } from "../utils/format";

export const useSettingForm = (onSuccess) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      nameBusiness: "",
      CNPJorCPF: "",
      email: "",
      telefone: "",
      address: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateMyCompanyAPI(data);

      toast.success("Configurações atualizadas!", { containerId: "toast-root" });

      if (onSuccess) onSuccess(data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar dados", { containerId: "toast-root" });
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
    reset,
    control,
    setValue,
    watch,
    validateCNPJ,
    validateCPF,
    validatePhone,
    formatCNPJ,
    formatCPF,
    formatPhone,
  };
};
