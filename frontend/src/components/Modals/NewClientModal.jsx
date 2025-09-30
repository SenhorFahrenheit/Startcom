import { useState } from "react";

import { toast } from "react-toastify";

import BaseModal from "./BaseModal";
import Button from "../Button/Button";
import InputDashboard from "../InputDashboard/InputDashboard";

import { formatPhone } from "../../utils/format";

const NewClientModal = ({ isOpen, onClose }) => {

  const [telefone, setTelefone] = useState("");

  const handleTelefoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setTelefone(formatted);
  };


  const newClient = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    let hasError = false;

    if (!data.nome.trim()) {
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

    if (!data.telefone.trim()) {
      toast.error("O campo telefone não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (!data.cidade.trim()) {
      toast.error("O campo cidade não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (hasError) return;

    console.log("Dados validados:", data);
    toast.success("Venda registrada com sucesso!", {
      position: "top-right",
      containerId: "toast-root",
    });

    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel="Cadastrar Novo Cliente"
      width="420px"
      height="440px"
      showCloseButton={true}
    >
      <h2 className="dashboard-modal-title">Registrar Novo Cliente</h2>

      <form className="form-dashboard" onSubmit={newClient}>
        <div className="align-dashboard-form">
          <div className="input-dashboard-block">
            <label htmlFor="nome">Nome </label>
            <InputDashboard name="nome" id="nome" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="email">Email </label>
            <InputDashboard type="email" name="email" id="email" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="telefone">Telefone </label>
            <InputDashboard type="tel" maxLength={14} name="telefone" id="telefone" value={telefone} onChange={handleTelefoneChange} />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="valor">Cidade </label>
            <InputDashboard type="text" name="cidade" id="cidade" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="tipo">Tipo </label>
            <select name="tipo" id="tipo" defaultValue="Regular" className="InputDashboard">
              <option>Regular</option>
              <option>VIP</option>
              <option>Premium</option>
            </select>
          </div>
        </div>
        <div className="button-shadown">
          <Button height={45} width={200} type="submit" label="Salvar Cliente" />
        </div>
      </form>
    </BaseModal>
  );
};

export default NewClientModal;
