import BaseModal from "./BaseModal";
import { toast } from "react-toastify";
import Button from "../Button/Button";
import api from "../../services/api";
import { useState } from "react";

/**
 * AuthenticatorModal component
 * Props:
 * - isOpen: boolean, whether the modal is visible
 * - onClose: function, callback to close the modal
 * - email: string, email address where the verification code was sent
 */
const AuthenticatorModal = ({ isOpen, onClose, email }) => {
  const [buttonLoading, setButtonLoading] = useState(false)

  const handleSendEmail = async (email) => {
    try {
      setButtonLoading(true)
      const response = await api.post("/User/verify-email/request", null, { params: { email }});
      // Show success message if verification succeeds
      toast.success("Email de verificação reenviado com sucesso!", {
        position: "top-right",
        containerId: "toast-root",
      });
    } catch (error) {
        toast.error("Ocorreu um erro interno.", {
        position: "top-right",
        containerId: "toast-root",
      });
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen} // Controls modal visibility
      onClose={onClose} // Close callback
      contentLabel="Autenticar Conta" // Accessibility label
      width="320px" // Modal width
      height="auto" // Modal height
    >
      <h2 className="auth-modal-title">Confirmação de Email</h2>
      <p className="auth-description">
        Confirme a sua conta acessando o link enviado por <strong>email</strong>
      </p>

    <Button
      width={"100%"}
      onClick={() => handleSendEmail(email)}
      label={"Reenviar email de verificação"}
      loading={buttonLoading}
    />
    </BaseModal>
  );
};

export default AuthenticatorModal;
