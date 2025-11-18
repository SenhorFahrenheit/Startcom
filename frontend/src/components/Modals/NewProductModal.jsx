import { toast } from "react-toastify";

import BaseModal from "./BaseModal";
import Button from "../Button/Button";
import InputDashboard from "../InputDashboard/InputDashboard";

const NewProductModal = ({ isOpen, onClose }) => {
  const newProduct = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    let hasError = false;

    if (!data.name.trim()) {
      toast.error("O campo Nome não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (!data.code.trim()) {
      toast.error("O campo Codigo não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (!data.quantity.trim()) {
      toast.error("O campo Quantidade não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (!data.min.trim()) {
      toast.error("O campo Mínimo não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (!data.price.trim()) {
      toast.error("O campo Preço não pode estar vazio!", {
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
      height="500px"
      showCloseButton={true}
    >
      <h2 className="dashboard-modal-title">Registrar Novo Produto</h2>

      <form className="form-dashboard" onSubmit={newProduct}>
        <div className="align-dashboard-form">
          <div className="input-dashboard-block">
            <label htmlFor="name">Nome </label>
            <InputDashboard name="name" id="name" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="code">Código </label>
            <InputDashboard type="number" name="code" id="code" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="category">Categoria </label>
            <select name="category" id="category" defaultValue="Roupas" className="InputDashboard">
              <option>Roupas</option>
              <option>Calçados</option>
              <option>Acessórios</option>
              <option>Eletrônicos</option>
              <option>Informática</option>
              <option>Alimentos</option>
              <option>Bebidas</option>
              <option>Móveis</option>
              <option>Decoração</option>
              <option>Livros</option>
              <option>Brinquedos</option>
              <option>Esportes</option>
              <option>Beleza</option>
              <option>Saúde</option>
              <option>Papelaria</option>
              <option>Ferramentas</option>
              <option>Autopeças</option>
              <option>Pet Shop</option>
              <option>Limpeza</option>
              <option>Outros</option>
            </select>

          </div>

          <div className="input-dashboard-block">
            <label htmlFor="quantity">Quantidade </label>
            <InputDashboard type="number" name="quantity" id="quantity" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="min">Mínimo </label>
            <InputDashboard type="number" name="min" id="min" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="price">Preço </label>
            <InputDashboard type="number" name="price" id="price" />
          </div>
        </div>
        <div className="button-shadown">
          <Button height={45} width={200} type="submit" label="Salvar Produto" />
        </div>
      </form>
    </BaseModal>
  );
};

export default NewProductModal;
