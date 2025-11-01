import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import BaseModal from "./BaseModal";
import Button from "../Button/Button";
import InputDashboard from "../InputDashboard/InputDashboard";

import { formatPhone } from "../../utils/format";

const NewClientModal = ({ isOpen, onClose, onSuccess }) => {
  const [telefone, setTelefone] = useState("");

  const handleTelefoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setTelefone(formatted);
  };

  const newClient = async (e) => {
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
      companyId: "69020f494fc4f7796349b235",
      name: data.nome,
      email: data.email,
      phone: data.telefone.replace(/\D/g, ""),
      city: data.cidade,
      category: data.tipo.toLowerCase()
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/Company/clients/create", body);

      toast.success("Cliente registrado com sucesso!", { position: "top-right", containerId: "toast-root" });

      onClose();

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      toast.error(`Erro: ${error.response?.data?.message || error.message}`, {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} contentLabel="Cadastrar Novo Cliente" width="420px" height="390px" showCloseButton={true}>
      <h2 className="dashboard-modal-title">Registrar Novo Cliente</h2>

      <form className="form-dashboard" onSubmit={newClient}>
        <div className="align-dashboard-form">
          <div className="input-dashboard-block">
            <label htmlFor="nome">Nome</label>
            <InputDashboard name="nome" id="nome" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="email">Email</label>
            <InputDashboard type="email" name="email" id="email" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="telefone">Telefone</label>
            <InputDashboard type="tel" maxLength={14} name="telefone" id="telefone" value={telefone} onChange={handleTelefoneChange} />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="cidade">Cidade</label>
            <InputDashboard type="text" name="cidade" id="cidade" />
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
          <Button height={45} width={200} type="submit" label="Salvar Cliente" />
        </div>
      </form>
    </BaseModal>
  );
};

export default NewClientModal;
