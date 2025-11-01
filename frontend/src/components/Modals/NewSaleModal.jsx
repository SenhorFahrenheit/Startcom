import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import BaseModal from "./BaseModal";
import Button from "../Button/Button";
import InputDashboard from "../InputDashboard/InputDashboard";
import formatCurrency from "../../utils/format";

const NewSaleModal = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState([]);
  const priceRef = useRef();

  useEffect(() => {
    if (isOpen) {
      const mockProducts = [
        { _id: "69019f25b407b09e0d09d000", name: "Notebook Gamer", price: 4500.99 },
        { _id: "69019f25b407b09e0d09d001", name: "Mouse Logitech", price: 150.9 },
        { _id: "69019f25b407b09e0d09d002", name: "Teclado Mecânico", price: 300 },
      ];
      setProducts(mockProducts);

      // === Future Backend ===
      /*
      async function fetchProducts() {
        try {
          const response = await axios.get("http://127.0.0.1:8000/products");
          setProducts(response.data.products || []);
        } catch (error) {
          console.error("Erro ao buscar produtos:", error);
        }
      }
      fetchProducts();
      */
    }
  }, [isOpen]);

  const handleProductChange = (e) => {
    const selectedId = e.target.value;
    const selectedProduct = products.find((p) => p._id === selectedId);

    if (selectedProduct) {
      priceRef.current.value = formatCurrency(selectedProduct.price.toFixed(2));
    } else {
      priceRef.current.value = "";
    }
  };

  const newSale = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    let hasError = false;

    if (!data.client?.trim()) {
      toast.error("O campo Cliente não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (!data.product) {
      toast.error("Selecione um produto!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (!data.quantity) {
      toast.error("Selecione uma quantidade válida!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (!data.price?.trim()) {
      toast.error("O campo Valor não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root",
      });
      hasError = true;
    }

    if (hasError) return;

    const companyId = "69019f25b407b09e0d09cff5";
    const selectedProduct = products.find((p) => p._id === data.product);


    const payload = {
      companyId,
      clientName: data.client,
      items: [
        {
          productName: selectedProduct.name,
          quantity: Number(data.quantity),
          price: selectedProduct.price,
        },
      ],
    };

    console.log(payload)

    try {
      await axios.post(
        "http://127.0.0.1:8000/Company/sales/create_sale",
        payload
      );

      toast.success("Venda registrada com sucesso!", {
        position: "top-right",
        containerId: "toast-root",
      });

      onClose();
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      toast.error("Erro ao registrar venda!", {
        position: "top-right",
        containerId: "toast-root",
      });
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel="Cadastrar Nova Venda"
      width="500px"
      height="390px"
      showCloseButton={true}
    >
      <h2 className="dashboard-modal-title">Registrar Nova Venda</h2>

      <form className="form-dashboard" onSubmit={newSale}>
        <div className="align-dashboard-form">
          <div className="input-dashboard-block">
            <label htmlFor="client">Cliente</label>
            <InputDashboard name="client" id="client" />
          </div>

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
            <label htmlFor="quantity">Quantidade</label>
            <InputDashboard name="quantity" id="quantity" />
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="price">Valor</label>
            <InputDashboard style="readOnly-Input" readOnly name="price" id="price" ref={priceRef} />
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
