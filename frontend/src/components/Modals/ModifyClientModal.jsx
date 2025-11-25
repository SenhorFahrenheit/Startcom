import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

import BaseModal from "./BaseModal";
import Button from "../Button/Button";
import InputDashboard from "../InputDashboard/InputDashboard";
import InfoToolTip from "../InfoTooltip/InfoTooltip"
import { formatPhone } from "../../utils/format";

const ModifyClientModal = ({ isOpen, onClose, onSuccess, clientData }) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");
  const [telefone, setTelefone] = useState("");

  const [initialData, setInitialData] = useState(null);

  const handleTelefoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setTelefone(formatted);
  };

  useEffect(() => {
    if (clientData && isOpen) {
      const formattedPhone = formatPhone(clientData.phoneNumber || "");

      setNome(clientData.clientName || "");
      setEmail(clientData.email || "");
      setTelefone(formattedPhone);
      setCidade(clientData.city || "");

      setInitialData({
        nome: clientData.clientName || "",
        email: clientData.email || "",
        telefone: formattedPhone,
        cidade: clientData.city || "",
      });
    }
  }, [clientData, isOpen]);

  const isDirty =
    initialData &&
    (
      nome !== initialData.nome ||
      email !== initialData.email ||
      telefone !== initialData.telefone ||
      cidade !== initialData.cidade
    );


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

      const response = await api.put(
        `/Company/clients/${clientData.clientId}`,
        body
      );

      toast.success("Cliente atualizado com sucesso!", {
        position: "top-right",
        containerId: "toast-root",
      });

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
      } else if (status === 404) {
        toast.error("Cliente não encontrado.", {
          position: "top-right",
          containerId: "toast-root",
        });
      } else if (status === 500) {
        toast.error("Erro interno no servidor. Tente novamente depois.", {
          position: "top-right",
          containerId: "toast-root",
        });
      } else {
        toast.error("Falha ao atualizar o cliente.", {
          position: "top-right",
          containerId: "toast-root",
        });
      }
    } finally {
      setTimeout(() => setButtonLoading(false), 1500);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} contentLabel="Cadastrar Novo Cliente" width="430px" height={"auto"} showCloseButton={true}>
      <h2 className="dashboard-modal-title">Modificar Cliente</h2>

      <form className="form-dashboard" onSubmit={modifyClient}>
        <div className="align-dashboard-form">
          <div className="input-dashboard-block">
            <label htmlFor="nome">Nome</label>
            <InputDashboard
              name="nome"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <InfoToolTip text="Nome completo do cliente. Ajuda a identificar quem é a pessoa. Ex.: Maria da Silva"/>
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="email">Email</label>
            <InputDashboard
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InfoToolTip text="Email para contato e envio de mensagens. Ex.: maria.silva@gmail.com"/>
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="telefone">Telefone</label>
            <InputDashboard type="tel" maxLength={15} name="telefone" id="telefone" value={telefone} onChange={handleTelefoneChange} />
            <InfoToolTip text="Telefone ou celular do cliente. Use o número principal. Ex.: (11) 91234-5678"/>
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="cidade">Cidade</label>
            <InputDashboard
              type="text"
              name="cidade"
              id="cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
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
          <Button
            height={45}
            width={200}
            loading={buttonLoading}
            type="submit"
            label="Salvar Cliente"
            disabled={!isDirty}
          />
        </div>
      </form>
    </BaseModal>
  );
};

export default ModifyClientModal;
