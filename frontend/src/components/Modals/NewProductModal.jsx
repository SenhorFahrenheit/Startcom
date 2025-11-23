import { toast } from "react-toastify";

import BaseModal from "./BaseModal";
import Button from "../Button/Button";
import InputDashboard from "../InputDashboard/InputDashboard";
import SelectDropdown from "../SelectDropdown/SelectDropdown";

import api from "../../services/api";
import { useState } from "react";

const NewProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [buttonLoading, setButtonloading] = useState(false)
  const [category, setCategory] = useState("Roupas");

  const normalizePrice = (value) => {
    if (!value) return value;

    return value
      .replace(/^R\$\s*/i, "")
      .replace(/\s+/g, "")
      .replace(",", ".")
      .trim();
  };


  const newProduct = async (e) => {
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

    if (!data.description.trim()) {
      toast.error("O campo Descrição não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (!data.quantity || data.quantity === "0") {
      toast.error("O campo Quantidade não pode estar vazio!", {
        position: "top-right",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (!data.min || data.min === "0") {
      toast.error("O campo Mínimo não pode estar vazio!", {
        position: "top-right",
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

    if (!data.costPrice.trim()) {
      toast.error("O campo Custo de Preço não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (hasError) return;

    const body = {
      product: {
        name: data.name,
        description: data.description,
        price: normalizePrice(data.price),
        costPrice: normalizePrice(data.costPrice),
        quantity: data.quantity,
        minQuantity: data.min,
        category: category
      }
    };

    try {
      setButtonloading(true)
      const response = await api.post("/Company/inventory/create", body);
      toast.success("Produto registrado com sucesso!", { position: "top-right", containerId: "toast-root" });
      onClose();
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
        const status = error.response?.status;

        if (status === 409) {
          toast.error("Já existe um produto com esse nome.", {
            position: "top-right",
            containerId: "toast-root",
          });
        } else if(status === 422) {
          toast.error("A quantidade ou o preço informado é inválido.", {
            position: "top-right",
            containerId: "toast-root",
          });
        } else if (status === 500) {
          toast.error("Erro interno no servidor. Tenta de novo mais tarde.", {
            position: "top-right",
            containerId: "toast-root",
          });
        } else {
          toast.error("Algo deu errado. Tente novamente.", {
            position: "top-right",
            containerId: "toast-root",
          });
        }
      } finally {
        setTimeout(() => setButtonloading(false), 1500)
      }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel="Cadastrar Nova Venda"
      width="500px"
      height="550px"
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
            <label htmlFor="description">Descrição </label>
            <InputDashboard name="description" id="description"/>
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="category">Categoria</label>
            <SelectDropdown
              label="Categoria"
              name="category"
              placeholder="Selecione uma categoria"
              items={[
                { value: "Roupas", label: "Roupas" },
                { value: "Calçados", label: "Calçados" },
                { value: "Acessórios", label: "Acessórios" },
                { value: "Eletrônicos", label: "Eletrônicos" },
                { value: "Informática", label: "Informática" },
                { value: "Alimentos", label: "Alimentos" },
                { value: "Bebidas", label: "Bebidas" },
                { value: "Móveis", label: "Móveis" },
                { value: "Decoração", label: "Decoração" },
                { value: "Livros", label: "Livros" },
                { value: "Brinquedos", label: "Brinquedos" },
                { value: "Esportes", label: "Esportes" },
                { value: "Beleza", label: "Beleza" },
                { value: "Saúde", label: "Saúde" },
                { value: "Papelaria", label: "Papelaria" },
                { value: "Ferramentas", label: "Ferramentas" },
                { value: "Autopeças", label: "Autopeças" },
                { value: "Pet Shop", label: "Pet Shop" },
                { value: "Limpeza", label: "Limpeza" },
                { value: "Outros", label: "Outros" },
              ]}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="quantity">Quantidade </label>
            <InputDashboard type="number" name="quantity" id="quantity" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="min">Quantidade Mínima </label>
            <InputDashboard type="number" name="min" id="min" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="price">Preço de Venda</label>
            <InputDashboard name="price" id="price" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="costPrice">Preço de Custo</label>
            <InputDashboard name="costPrice" id="costPrice" />
          </div>
        </div>
        <div className="button-shadown">
          <Button height={45} width={200} loading={buttonLoading} type="submit" label="Salvar Produto" />
        </div>
      </form>
    </BaseModal>
  );
};

export default NewProductModal;
