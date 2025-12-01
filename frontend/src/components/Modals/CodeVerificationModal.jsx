import { useState } from "react";
import CodeInput from "../CodeInput/CodeInput";
import { toast } from "react-toastify";
import BaseModal from "./BaseModal";
import api from "../../services/api";
import verifyCodeMock from "../../services/verifyCode";
import Button from "../Button/Button";

/**
 * CodeVerificationModal component
 *
 * A modal for verifying a code sent to the user's email.
 * Can be used for signup confirmation or password recovery.
 *
 * Props:
 * - isOpen: boolean, whether the modal is visible
 * - onClose: function, callback to close the modal
 * - email: string, email address where the code was sent
 * - flowType: string, "signup" or "recovery" (default: "signup")
 * - onSuccess: function, callback executed after successful verification
 */
const CodeVerificationModal = ({ isOpen, onClose, email, onSuccess }) => {
  // Local state to store the code input
  const [code, setCode] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  /**
   * Verify the entered code
   * @param {string} fullCode - the full code entered
   */
  const verifyCode = async (fullCode) => {
    // Check if the code is complete
    if (fullCode.length < 6) {
      toast.error("Digite o código completo!", {
        position: "top-right",
        containerId: "toast-root",
      });
      return;
    }

    try {
      // API call to verify the code
      const response = await api.post("/User/auth/verify-reset-code", {
        email,
        code: fullCode,
      });

      // Show success message if verification succeeds
      toast.success("Código verificado com sucesso!", {
        position: "top-right",
        containerId: "toast-root",
      });

      // Reset code input and execute onSuccess callback
      setCode("");
      onSuccess(response.data.resetToken);
    } catch {
      // Handle network or unexpected errors
      toast.error("Erro ao verificar código!", {
        position: "top-right",
        containerId: "toast-root",
      });
    } finally {
      setButtonLoading(false);
    }
  };

  // Handle form submit event
  const handleSubmit = (e) => {
    e.preventDefault();
    verifyCode(code); // Call verification with current code
  };

  return (
    <BaseModal
      isOpen={isOpen} // Control modal visibility
      onClose={onClose} // Close callback
      contentLabel="Verificar Código" // Accessibility label
      width="320px"
      height="500px"
    >
      <h2 className="auth-modal-title">
        Recuperação de Senha
      </h2>
      <p className="auth-description">
        Digite o código que enviamos para o seu e-mail.
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
        <Button type="submit" label={"VALIDAR"} loading={buttonLoading}/>
      </form>
    </BaseModal>
  );
};

export default CodeVerificationModal;
