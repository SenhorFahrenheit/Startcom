import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import api from "../../services/api";

import BaseModal from "./BaseModal";
import Button from "../Button/Button";

import InputDashboard from "../InputDashboard/InputDashboard";

const ModifyProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [buttonLoading, setButtonLoading] = useState(false)
  const [products, setProducts] = useState([]);
  const quantityRef = useRef();
  
  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
      const response = await api.post("/Company/inventory/full");

      if (response.data?.status === "success" && response.data?.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast.error("Erro ao carregar produtos!", {
        position: "top-right",
        containerId: "toast-root",
      });
    }
  };

  const handleProductChange = (e) => {
    const selectedId = e.target.value;
    const selectedProduct = products.find((p) => p._id === selectedId);
  
    quantityRef.current.value = selectedProduct
       ? selectedProduct.quantity
       : "";
  };

  const newValueProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (!data.addQuantity?.trim()) {
      toast.error("O campo Adicionar não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }
    
    if (!data.product) {
      toast.error("Selecione um produto!", {
        position: "top-right",
        containerId: "toast-root",
      });
      hasError = true;
    }

    const selectedProduct = products.find(p => p._id === data.product);
    const productName = selectedProduct ? selectedProduct.name : null;

    const payload = {
        name: productName,
        amount: Number(data.addQuantity)
    }

    try {
        setButtonLoading(true)
        await api.post("/Company/inventory/increase_inventory", payload)
             
        toast.success("Quantidade adicionada com sucesso!", {
            position: "top-right",
            containerId: "toast-root",
        });
            
        onClose();
        onSuccess?.();
      } catch (error) {
          const status = error.response?.status;

          if (status === 422) {
            toast.error("A quantidade informada é inválida.", {
              position: "top-right",
              containerId: "toast-root",
            });
          } else {
            toast.error("Erro ao adicionar quantidade ao produto.", {
              position: "top-right",
              containerId: "toast-root",
            });
          }
        } finally {
          setTimeout(() => setButtonLoading(false), 1500)
        }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel="Adicionar Produto"
      width="620px"
      height="350px"
      showCloseButton={true}
    >
      <h2 className="dashboard-modal-title">Adicionar Quantidade de Produto</h2>

      <form className="form-dashboard" onSubmit={newValueProduct}>
        <div className="align-dashboard-form">
          <div className="input-dashboard-block">
            <label htmlFor="product">Produto</label>
            <select
              name="product"
              id="product"
              className="InputDashboard"
              onChange={handleProductChange}
            >
              <option value="">Selecione um produto</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          
          <div className="input-dashboard-block">
            <label htmlFor="QuantityCurrently">Quantidade Atual</label>
            <InputDashboard
              style="readOnly-Input"
              readOnly
              name="QuantityCurrently"
              id="QuantityCurrently"
              ref={quantityRef}
            />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="addQuantity">Adicionar</label>
            <InputDashboard
             id="addQuantity"
             name="addQuantity"
             type="number"
            />
          </div>
        </div>
        <div className="button-shadown">
          <Button height={45} width={200} loading={buttonLoading} type="submit" label="Adicionar Produto" />
        </div>
      </form>
    </BaseModal>
  );
};

export default ModifyProductModal;
