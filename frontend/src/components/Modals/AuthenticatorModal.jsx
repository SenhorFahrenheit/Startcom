import BaseModal from "./BaseModal";
import { toast } from "react-toastify";
import axios from "axios";
import Button from "../Button/Button";

/**
 * AuthenticatorModal component
 * Props:
 * - isOpen: boolean, whether the modal is visible
 * - onClose: function, callback to close the modal
 * - email: string, email address where the verification code was sent
 */
const AuthenticatorModal = ({ isOpen, onClose, email }) => {
  const handleSendEmail = async (email) => {
    try {
      const response = await axios.post("/User/verify-email/request", { email });
      
      // Show error if verification fails
      if (!response.data?.success) {
        toast.error("Algo falhou, mas não foi você. Tente de novo.", {
          position: "top-right",
          containerId: "toast-root",
        });
        return;
      }

      // Show success message if verification succeeds
      toast.success("Email de verificação enviado com sucesso!", {
        position: "top-right",
        containerId: "toast-root",
      });
    } catch (error) {
        toast.error("Ocorreu um erro interno.", {
        position: "top-right",
        containerId: "toast-root",
      });

      console.error(error)
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
    />
    </BaseModal>
  );
};

export default AuthenticatorModal;
