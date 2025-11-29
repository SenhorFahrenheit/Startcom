import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

import BaseModal from "./BaseModal";
import Button from "../Button/Button";
import InputDashboard from "../InputDashboard/InputDashboard";
import InfoToolTip from "../InfoTooltip/InfoTooltip";
import { formatPhone } from "../../utils/format";

/**
 * NewClientModal component
 * Modal responsible for creating a new client.
 */
const NewClientModal = ({ isOpen, onClose, onSuccess }) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [phone, setPhone] = useState("");

  /**
   * Format phone input value
   */
  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  /**
   * Create new client request
   */
  const newClient = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    let hasError = false;

    // Basic form validation
    if (!data.name.trim()) {
      toast.error("O campo Nome não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (!data.email.trim()) {
      toast.error("O campo Email não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (!data.phone.trim()) {
      toast.error("O campo Telefone não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (!data.city.trim()) {
      toast.error("O campo Cidade não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (hasError) return;

    const body = {
      name: data.name,
      email: data.email,
      phone: data.phone.replace(/\D/g, ""),
      city: data.city,
      category: (data.tipo || "Regular").toLowerCase(),
    };

    try {
      setButtonLoading(true);

      const response = await api.post("/Company/clients/create", body);

      toast.success("Cliente registrado com sucesso!", {
        position: "top-right",
        containerId: "toast-root",
      });

      onClose();
      if (onSuccess) onSuccess(response.data);

    } catch (error) {
      const status = error.response?.status;

      if (status === 409) {
        toast.error("Já existe um cliente com esse name ou email.", {
          position: "top-right",
          containerId: "toast-root",
        });
      } else if (status === 500) {
        toast.error("Erro interno no servidor. Tente novamente depois.", {
          position: "top-right",
          containerId: "toast-root",
        });
      } else {
        toast.error("Falha ao registrar o cliente.", {
          position: "top-right",
          containerId: "toast-root",
        });
      }
    } finally {
      setTimeout(() => setButtonLoading(false), 1500);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel="Cadastrar Novo Cliente"
      width="auto"
      height="auto"
      showCloseButton
    >
      <h2 className="dashboard-modal-title">Registrar Novo Cliente</h2>

      <form className="form-dashboard" onSubmit={newClient}>
        <div className="align-dashboard-form">

          <div className="input-dashboard-block">
            <label htmlFor="name">Nome</label>
            <InputDashboard name="name" id="name" />
            <InfoToolTip text="Nome completo do cliente. Ajuda a identificar quem é a pessoa. Ex.: Maria da Silva" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="email">Email</label>
            <InputDashboard type="email" name="email" id="email" />
            <InfoToolTip text="Email para contato e envio de mensagens. Ex.: maria.silva@gmail.com" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="phone">Telefone</label>
            <InputDashboard
              type="tel"
              maxLength={15}
              name="phone"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
            />
            <InfoToolTip text="Telefone ou celular do cliente. Use o número principal. Ex.: (11) 91234-5678" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="city">Cidade</label>
            <InputDashboard type="text" name="city" id="city" />
            <InfoToolTip text="Cidade onde o cliente mora. Ex.: São Paulo" />
          </div>

        </div>

        <div className="button-shadown">
          <Button
            height={45}
            width={200}
            loading={buttonLoading}
            type="submit"
            label="Salvar Cliente"
          />
        </div>
      </form>
    </BaseModal>
  );
};

export default NewClientModal;