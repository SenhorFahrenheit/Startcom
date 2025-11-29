import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";
import BaseModal from "./BaseModal";
import Button from "../Button/Button";
import InputDashboard from "../InputDashboard/InputDashboard";
import SelectDropdown from "../SelectDropdown/SelectDropdown";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import { formatCurrency } from "../../utils/format";

/**
 * Modal component used to register a new sale
 */
const NewSaleModal = ({ isOpen, onClose, onSuccess }) => {
  // Controls submit button loading state
  const [buttonLoading, setButtonLoading] = useState(false);

  // Stores products fetched from inventory
  const [products, setProducts] = useState([]);

  // Stores all client names
  const [clients, setClients] = useState([]);

  // Stores filtered clients for autocomplete
  const [filteredClients, setFilteredClients] = useState([]);

  // Controls visibility of client suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Stores current client input value
  const [clientInput, setClientInput] = useState("");

  // Reference to price input field
  const priceRef = useRef();

  /**
   * Fetches products and clients when modal is opened
   */
  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchClients();
    }
  }, [isOpen]);

  /**
   * Fetches all products from inventory
   */
  const fetchProducts = async () => {
    try {
      const response = await api.get("/Company/inventory/full");

      const list = response.data?.products || [];
      setProducts(list);

      // Prevents opening sale modal without available products
      if (list.length === 0) {
        toast.error(
          "Você não possui produtos cadastrados para realizar uma venda.",
          {
            position: "top-right",
            containerId: "toast-root",
          }
        );

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

  /**
   * Fetches client names for autocomplete
   */
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

  /**
   * Handles client input and filters suggestions
   */
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

  /**
   * Sets selected client from suggestions
   */
  const selectClient = (name) => {
    setClientInput(name);
    setFilteredClients([]);
    setShowSuggestions(false);
  };

  /**
   * Displays all client suggestions on focus
   */
  const handleFocus = () => {
    if (clients.length > 0) {
      setFilteredClients(clients);
      setShowSuggestions(true);
    }
  };

  /**
   * Hides suggestions after input blur
   */
  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  /**
   * Updates price field based on selected product
   */
  const handleProductChange = (e) => {
    const selectedId = e.target.value;
    const selectedProduct = products.find((p) => p._id === selectedId);

    priceRef.current.value = selectedProduct
      ? formatCurrency(selectedProduct.price)
      : "";
  };

  /**
   * Handles sale creation submit
   */
  const newSale = async (e) => {
    e.preventDefault();

    // Collects form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    let hasError = false;

    // Basic form validation
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

    // Finds selected product details
    const selectedProduct = products.find((p) => p._id === data.product);

    // Builds payload for backend
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

      // Sends sale creation request
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
        toast.error(
          backendMsg || "Não foi possível registrar a venda.",
          {
            position: "top-right",
            containerId: "toast-root",
          }
        );
      }
    } finally {
      // Prevents instant loading flicker
      setTimeout(() => setButtonLoading(false), 1500);
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

      {/* Sale creation form */}
      <form className="form-dashboard" onSubmit={newSale}>
        <div className="align-dashboard-form">
          {/* Client input with autocomplete */}
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
            <InfoTooltip text="Nome do cliente para quem você está vendendo o produto. Ex.: Carlos" />

            {/* Client suggestions dropdown */}
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
                    onMouseDown={(e) => e.preventDefault()}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Product selector */}
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
                const product = products.find(
                  (p) => p._id === e.target.value
                );

                if (product) {
                  priceRef.current.value = formatCurrency(product.price);
                }
              }}
            />
            <InfoTooltip text="Produto que está sendo vendido. Ex.: Camiseta Azul" />
          </div>

          {/* Quantity input */}
          <div className="input-dashboard-block">
            <label htmlFor="quantity">Quantidade</label>
            <InputDashboard name="quantity" id="quantity" />
            <InfoTooltip text="Quantidade do produto que está sendo vendida. Ex.: 2" />
          </div>

          {/* Read-only price field */}
          <div className="input-dashboard-block">
            <label htmlFor="price">Valor</label>
            <InputDashboard
              style="readOnly-Input"
              readOnly
              name="price"
              id="price"
              ref={priceRef}
            />
            <InfoTooltip text="Preço de venda do produto selecionado." />
          </div>
        </div>

        {/* Submit button */}
        <div className="button-shadown">
          <Button
            height={45}
            width={200}
            loading={buttonLoading}
            type="submit"
            label="Salvar Venda"
          />
        </div>
      </form>
    </BaseModal>
  );
};

export default NewSaleModal;