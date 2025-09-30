import { toast } from "react-toastify";

import BaseModal from "./BaseModal";
import Button from "../Button/Button";

const NewReportModal = ({ isOpen, onClose }) => {
  const newReport = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    console.log("Dados validados:", data);
    toast.success("Relatório gerado com sucesso!", {
      position: "top-right",
      containerId: "toast-root",
    });

    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel="Criar Novo Relatório"
      width="620px"
      height="270px"
      showCloseButton={true}
    >
      <h2 className="dashboard-modal-title">Gerar Novo Relatório</h2>

      <form className="form-dashboard" onSubmit={newReport}>
        <div className="align-dashboard-form">
          <div className="input-dashboard-block">
            <label htmlFor="type">Tipo </label>
            <select name="type" id="type" defaultValue="Vendas" className="InputDashboard">
              <option>Vendas</option>
              <option>Clientes</option>
              <option>Estoque</option>
            </select>
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="status">Período </label>
            <select name="status" id="status" defaultValue="Concluída" className="InputDashboard">
              <option>Última semana</option>
              <option>Último mês</option>
              <option>Último ano</option>
            </select>
          </div>
        </div>
        <div className="button-shadown">
          <Button height={45} width={200} type="submit" label="Gerar Relatório" />
        </div>
      </form>
    </BaseModal>
  );
};

export default NewReportModal;
