import { toast } from "react-toastify";

import BaseModal from "./BaseModal";
import Button from "../Button/Button";
import InputDashboard from "../InputDashboard/InputDashboard";

const NewSaleModal = ({ isOpen, onClose }) => {
  const newSale = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    let hasError = false;

    if (!data.cliente.trim()) {
      toast.error("O campo Cliente não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (!data.valor.trim()) {
      toast.error("O campo Valor não pode estar vazio!", {
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
      contentLabel="Cadastrar Nova Venda"
      width="500px"
      height="310px"
      showCloseButton={false}
    >
      <h2 className="dashboard-modal-title">Registrar Nova Venda</h2>

      <form className="form-dashboard" onSubmit={newSale}>
        <div className="align-dashboard-form">
          <div className="input-dashboard-block">
            <label htmlFor="cliente">Cliente </label>
            <InputDashboard name="cliente" id="cliente" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="valor">Valor </label>
            <InputDashboard type="number" name="valor" id="valor" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="status">Status </label>
            <select name="status" id="status" defaultValue="Concluída" className="InputDashboard">
              <option>Concluída</option>
              <option>Pendente</option>
              <option>Cancelada</option>
            </select>
          </div>
        </div>
        <div className="button-shadown">
          <Button height={45} width={200} type="submit" label="Salvar Venda" />
        </div>
      </form>
    </BaseModal>
  );
};

export default NewSaleModal;
