import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

import BaseModal from "./BaseModal";
import Button from "../Button/Button";
import InputDashboard from "../InputDashboard/InputDashboard";
import InfoToolTip from "../InfoTooltip/InfoTooltip"
import { formatPhone } from "../../utils/format";

const ModifyClientModal = ({ isOpen, onClose, onSuccess, clientId }) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [telefone, setTelefone] = useState("");

  const handleTelefoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setTelefone(formatted);
  };

  const modifyClient = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    let hasError = false;

    if (!data.nome.trim()) {
      toast.error("O campo Nome não pode estar vazio!", { position: "top-right", theme: "light", containerId: "toast-root" });
      hasError = true;
    }
    if (!data.email.trim()) {
      toast.error("O campo Email não pode estar vazio!", { position: "top-right", theme: "light", containerId: "toast-root" });
      hasError = true;
    }
    if (!data.telefone.trim()) {
      toast.error("O campo telefone não pode estar vazio!", { position: "top-right", theme: "light", containerId: "toast-root" });
      hasError = true;
    }
    if (!data.cidade.trim()) {
      toast.error("O campo cidade não pode estar vazio!", { position: "top-right", theme: "light", containerId: "toast-root" });
      hasError = true;
    }

    if (hasError) return;

    const body = {
      name: data.nome,
      email: data.email,
      phone: data.telefone.replace(/\D/g, ""),
      city: data.cidade,
      category: (data.tipo || "Regular").toLowerCase()
    };

    try {
      setButtonLoading(true);
      const response = await api.post("/Company/clients/create", body);

      toast.success("Cliente registrado com sucesso!", { position: "top-right", containerId: "toast-root" });

      onClose();

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
        const status = error.response?.status;

        if (status === 409) {
          toast.error("Já existe um cliente com esse nome ou email.", {
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
        setTimeout(() => setButtonLoading(false), 1500)
      }
    };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} contentLabel="Cadastrar Novo Cliente" width={"auto"} height={"auto"} showCloseButton={true}>
      <h2 className="dashboard-modal-title">Modificar Cliente</h2>

      <form className="form-dashboard" onSubmit={modifyClient}>
        <div className="align-dashboard-form">
          <div className="input-dashboard-block">
            <label htmlFor="nome">Nome</label>
            <InputDashboard name="nome" id="nome" />
            <InfoToolTip text="Nome completo do cliente. Ajuda a identificar quem é a pessoa. Ex.: Maria da Silva"/>
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="email">Email</label>
            <InputDashboard type="email" name="email" id="email" />
            <InfoToolTip text="Email para contato e envio de mensagens. Ex.: maria.silva@gmail.com"/>
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="telefone">Telefone</label>
            <InputDashboard type="tel" maxLength={15} name="telefone" id="telefone" value={telefone} onChange={handleTelefoneChange} />
            <InfoToolTip text="Telefone ou celular do cliente. Use o número principal. Ex.: (11) 91234-5678"/>
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="cidade">Cidade</label>
            <InputDashboard type="text" name="cidade" id="cidade" />
            <InfoToolTip text="Cidade onde o cliente mora. Ex.: São Paulo"/>
          </div>

          {/*<div className="input-dashboard-block">
            <label htmlFor="tipo">Tipo</label>
            <select name="tipo" id="tipo" defaultValue="Regular" className="InputDashboard">
              <option>Regular</option>
              <option>VIP</option>
              <option>Premium</option>
            </select>
          </div>*/}
        </div>

        <div className="button-shadown">
          <Button height={45} width={200} loading={buttonLoading} type="submit" label="Salvar Cliente" />
        </div>
      </form>
    </BaseModal>
  );
};

export default ModifyClientModal;
