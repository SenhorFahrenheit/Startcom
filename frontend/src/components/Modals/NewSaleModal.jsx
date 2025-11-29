import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";
import BaseModal from "./BaseModal";
import Button from "../Button/Button";
import InputDashboard from "../InputDashboard/InputDashboard";
import SelectDropdown from "../SelectDropdown/SelectDropdown";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import { formatCurrency } from "../../utils/format";

const NewSaleModal = ({ isOpen, onClose, onSuccess }) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [clientInput, setClientInput] = useState("");

  const priceRef = useRef();

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchClients();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
    const response = await api.get("/Company/inventory/full");

    const list = response.data?.products || [];
    setProducts(list);

    if (list.length === 0) {
      toast.error("Você não possui produtos cadastrados para realizar uma venda.", {
        position: "top-right",
        containerId: "toast-root",
      });

      onClose(); 
      return;
    }

    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast.error("Erro ao carregar produtos!", {
        position: "top-right",
        containerId: "toast-root",
      });
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get("/Company/clients/names");

      if (response.data?.clients) {
        setClients(response.data.clients);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  const handleClientInput = (e) => {
    const value = e.target.value;
    setClientInput(value);

    if (!value.trim()) {
      setFilteredClients([]);
      return;
    }

    const filtered = clients.filter((name) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredClients(filtered);
  };

  const selectClient = (name) => {
    setClientInput(name);
    setFilteredClients([]);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (clients.length > 0) {
      setFilteredClients(clients);
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleProductChange = (e) => {
    const selectedId = e.target.value;
    const selectedProduct = products.find((p) => p._id === selectedId);

    priceRef.current.value = selectedProduct
      ? formatCurrency(selectedProduct.price)
      : "";
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

    const selectedProduct = products.find((p) => p._id === data.product);

    const payload = {
      clientName: data.client,
      items: [
        {
          productName: selectedProduct.name,
          quantity: Number(data.quantity),
          price: selectedProduct.price,
        },
      ],
    };

    try {
      setButtonLoading(true);
      await api.post("/Company/sales/create_sale", payload);

      toast.success("Venda registrada com sucesso!", {
        position: "top-right",
        containerId: "toast-root",
      });

      onClose();
      onSuccess?.();
    } catch (error) {
        const status = error.response?.status;
        const backendMsg = error.response?.data?.message;

        if (status === 422) {
          toast.error("A quantidade informada é inválida.", {
            position: "top-right",
            containerId: "toast-root",
          });
        } else {
          toast.error(backendMsg || "Não foi possível registrar a venda.", {
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
      contentLabel="Cadastrar Nova Venda"
      width="500px"
      height="auto"
      showCloseButton={true}
    >
      <h2 className="dashboard-modal-title">Registrar Nova Venda</h2>

      <form className="form-dashboard" onSubmit={newSale}>
        <div className="align-dashboard-form">
          <div className="input-dashboard-block" style={{ position: "relative" }}>
            <label htmlFor="client">Cliente</label>
            <InputDashboard
              name="client"
              id="client"
              value={clientInput}
              onChange={handleClientInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoComplete="off"
            />
            <InfoTooltip text="Nome do cliente para quem você está vendendo o produto. Ex.: Carlos"/>

            {showSuggestions && filteredClients.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "45px",
                  left: "90px",
                  right: 0,
                  background: "white",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  zIndex: 10,
                  maxHeight: "160px",
                  width: "330px",
                  overflowY: "auto",
                  listStyle: "none",
                  padding: "5px 0",
                  margin: 0,
                  fontFamily: "var(--font-base)",
                }}
              >
                {filteredClients.map((name, index) => (
                  <li
                    key={index}
                    onClick={() => selectClient(name)}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="product">Produto</label>
            <SelectDropdown
              label="Produto"
              name="product"
              placeholder="Selecione um produto"
              items={products.map((p) => ({
                value: p._id,
                label: p.name,
                price: p.price,
              }))}
              onChange={(e) => {
                const product = products.find((p) => p._id === e.target.value);

                if (product) {
                  priceRef.current.value = formatCurrency(product.price);
                }
              }}
            />
            <InfoTooltip text="Produto que está sendo vendido. Ex.: Camiseta Azul"/>
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="quantity">Quantidade</label>
            <InputDashboard name="quantity" id="quantity" />
            <InfoTooltip text="Quantidade do produto que está sendo vendida. Ex.: 2"/>
          </div>

          <div className="input-dashboard-block">
            <label htmlFor="price">Valor</label>
            <InputDashboard
              style="readOnly-Input"
              readOnly
              name="price"
              id="price"
              ref={priceRef}
            />
            <InfoTooltip text="Preço de venda do produto selecionado."/>
          </div>
        </div>

        <div className="button-shadown">
          <Button height={45} width={200} loading={buttonLoading} type="submit" label="Salvar Venda" />
        </div>
      </form>
    </BaseModal>
  );
};

export default NewSaleModal;
