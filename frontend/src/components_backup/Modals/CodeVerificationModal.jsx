import { useState } from "react";
import CodeInput from "../CodeInput/CodeInput";
import { toast } from "react-toastify";
import BaseModal from "./BaseModal";
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
const CodeVerificationModal = ({ isOpen, onClose, email, flowType = "signup", onSuccess }) => {
  // Local state to store the code input
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
        containerId: "toast-root",
      });
      return;
    }

    try {
      // Mock API call to verify the code
      const response = await verifyCodeMock({ code: fullCode, email, flowType });

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

      // Reset code input and execute onSuccess callback
      setCode("");
      onSuccess?.();
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
      isOpen={isOpen} // Control modal visibility
      onClose={onClose} // Close callback
      contentLabel="Verificar Código" // Accessibility label
      width="320px"
      height="500px"
    >
      <h2 className="auth-modal-title">
        {flowType === "signup" ? "Confirmação de Cadastro" : "Recuperação de Senha"}
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
        <Button type="submit" label={"VALIDAR"} />
      </form>
    </BaseModal>
  );
};

export default CodeVerificationModal;
