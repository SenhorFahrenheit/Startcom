import { useState } from "react";

export function useAuthModals(selectedProductSetter) {
  const [activeModal, setActiveModal] = useState(null);

  const openAuthenticator = () => setActiveModal("authenticator");
  const openForgot = () => setActiveModal("forgot");
  const openCode = () => setActiveModal("code");
  const openPassword = () => setActiveModal("password");

  const openSale = () => setActiveModal("sale");
  const openClient = () => setActiveModal("client");
  const openProduct = () => setActiveModal("inventory");
  const openReport = () => setActiveModal("report");

  const openModifyProduct = () => setActiveModal("modifyInventory");
  const openModifyClient = () => setActiveModal("modifyClient");

  const openDeleteClient = () => setActiveModal("deleteClient");
  const openDeleteInventory = (product) => {
    if (selectedProductSetter) {
      selectedProductSetter(product);
    }
    setActiveModal("deleteProduct");
  };
  const openDeleteAccountModal = () => setActiveModal("deleteAccount");

  const closeModal = () => setActiveModal(null);

  return {
    activeModal,
    openAuthenticator,
    openForgot,
    openCode,
    openPassword,
    openSale,
    openProduct,
    openClient,
    openReport,
    openModifyProduct,
    openModifyClient,
    openDeleteClient,
    openDeleteInventory,
    openDeleteAccountModal,
    closeModal,
  };
}
