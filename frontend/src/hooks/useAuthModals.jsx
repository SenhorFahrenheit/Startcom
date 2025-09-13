import { useState } from "react";

/**
 * Hook to control authentication modals
 * 
 * activeModal can have the following values:
 * - "authenticator"
 * - "forgot"
 * - "code"
 * - "password"
 * - null (no modal is open)
 */
export function useAuthModals() {
  const [activeModal, setActiveModal] = useState(null);

  const openAuthenticator = () => setActiveModal("authenticator");
  const openForgot = () => setActiveModal("forgot");
  const openCode = () => setActiveModal("code");
  const openPassword = () => setActiveModal("password");

  const closeModal = () => setActiveModal(null);

  return {
    activeModal,
    openAuthenticator,
    openForgot,
    openCode,
    openPassword,
    closeModal,
  };
}
