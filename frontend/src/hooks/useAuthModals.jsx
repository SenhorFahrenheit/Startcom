import { useState } from "react";

// Hook to manage authentication and dashboard modals
export function useAuthModals(selectedProductSetter) {
  // Stores the currently active modal key
  const [activeModal, setActiveModal] = useState(null);

  const openLogout = () => setActiveModal("logout");

  // Authentication-related modals
  const openAuthenticator = () => setActiveModal("authenticator");
  const openForgot = () => setActiveModal("forgot");
  const openCode = () => setActiveModal("code");
  const openPassword = () => setActiveModal("password");

  // Sales and management modals
  const openSale = () => setActiveModal("sale");
  const openClient = () => setActiveModal("client");
  const openProduct = () => setActiveModal("inventory");
  const openReport = () => setActiveModal("report");

  // Edit modals
  const openModifyProduct = () => setActiveModal("modifyInventory");
  const openModifyClient = () => setActiveModal("modifyClient");

  // Delete confirmation modals
  const openDeleteClient = () => setActiveModal("deleteClient");

  // Opens delete product modal and sets selected product
  const openDeleteInventory = (product) => {
    if (selectedProductSetter) {
      selectedProductSetter(product);
    }
    setActiveModal("deleteProduct");
  };

  // Account deletion modal
  const openDeleteAccountModal = () => setActiveModal("deleteAccount");
  const openDeleteWarnModal = () => setActiveModal("deleteWarn");

  // Closes the active modal
  const closeModal = () => setActiveModal(null);

  return {
    activeModal,
    openLogout,
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
    openDeleteWarnModal,
    closeModal,
  };
}