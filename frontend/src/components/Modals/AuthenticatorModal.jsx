import { useState } from "react";
import BaseModal from "./BaseModal";
import CodeInput from "../CodeInput/CodeInput";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import verifyCodeMock from "../../services/verifyCode";

/**
 * AuthenticatorModal component
 *
 * A modal for account authentication using a verification code (e.g., 2FA or signup verification).
 *
 * Props:
 * - isOpen: boolean, whether the modal is visible
 * - onClose: function, callback to close the modal
 * - email: string, email address where the verification code was sent
 */
const AuthenticatorModal = ({ isOpen, onClose, email }) => {
  // State to store the code entered by the user
  const [code, setCode] = useState("");

  /**
   * Verify the entered code
   * @param {string} fullCode - the full code entered
   */
  const verifyCode = async (fullCode) => {
    // Check if the code is complete
    if (fullCode.length < 6) {
      toast.error("Digite o código completo!", {
        position: "top-center",
        theme: "light",
        containerId: "toast-root",
      });
      return;
    }

    try {
      // Mock API call to verify the code
      const response = await verifyCodeMock({ code: fullCode, flowType: "signup", email });

      // Show error if verification fails
      if (!response.success) {
        toast.error(response.message, {
          position: "top-center",
          containerId: "toast-root",
        });
        return;
      }

      // Show success message if verification succeeds
      toast.success(response.message, {
        position: "top-center",
        containerId: "toast-root",
      });

      // Reset code input and close modal
      setCode("");
      onClose();
    } catch {
      // Handle network or unexpected errors
      toast.error("Erro ao verificar código!", {
        position: "top-center",
        containerId: "toast-root",
      });
    }
  };

  // Handle form submit event
  const handleSubmit = (e) => {
    e.preventDefault();
    verifyCode(code); // Call verification with current code
  };

  return (
    <BaseModal
      isOpen={isOpen} // Controls modal visibility
      onClose={onClose} // Close callback
      contentLabel="Autenticar Conta" // Accessibility label
      width="320px" // Modal width
      height="500px" // Modal height
    >
      <h2 className="auth-modal-title">Autenticação</h2>
      <p className="auth-description">
        Insira o código enviado para o e-mail informado para autenticação.
      </p>

      <form onSubmit={handleSubmit} className="center-block">
        <label className="input-label">Código</label>

        {/* CodeInput component for entering verification code */}
        <CodeInput
          length={6} // Number of digits
          value={code} // Controlled value
          onChange={setCode} // Update state on change
          onComplete={verifyCode} // Automatically verify when all digits entered
        />

        {/* Submit button */}
        <Button type="submit" label={"ENVIAR"} />
      </form>
    </BaseModal>
  );
};

export default AuthenticatorModal;
