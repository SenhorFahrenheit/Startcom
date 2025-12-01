import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import BaseModal from "./BaseModal";
import Input from "../Input/Input";
import Button from "../Button/Button";

/**
 * ForgotPasswordModal component
 *
 * A modal for requesting password recovery via email.
 *
 * Props:
 * - isOpen: boolean, whether the modal is visible
 * - onClose: function, callback to close the modal
 * - onSuccess: function, callback executed after successful email submission
 */
const ForgotPasswordModal = ({ isOpen, onClose, onSuccess }) => {
  // State to store the email input
  const [email, setEmail] = useState("");

  // Reset email when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
    }
  }, [isOpen]);

  /**
   * Handle form submission to send recovery email
   * @param {Event} e - Form submit event
   */
  const sendEmail = (e) => {
    e.preventDefault();

    // Validation: email should not be empty
    if (!email.trim()) {
      toast.error("O campo de e-mail não pode estar vazio!", {
        position: "top-right",
        theme: "light",
        containerId: "toast-root"
      });
      return;
    }

    // TODO: Send request to backend
    console.log("Email to backend:", email);

    // Show success message
    toast.success("Se este e-mail existir, você receberá um número de recuperação.", {
      position: "top-right",
      containerId: "toast-root"
    });

    // Reset email and execute onSuccess callback
    setEmail("");
    onSuccess(email);
  }

  return (
    <BaseModal
      isOpen={isOpen} // Controls modal visibility
      onClose={onClose} // Close callback
      contentLabel="Recuperar Senha" // Accessibility label
      width="320px"
      height="500px"
    >
      <h2 className="auth-modal-title">Redefinição de senha</h2>
      <p className="auth-description">
        Informe um e-mail e enviaremos um código para recuperação de sua senha.
      </p>

      <form onSubmit={sendEmail} className="center-block">
        {/* Email input */}
        <label className="input-label" htmlFor="email">E-mail</label>
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        
        {/* Submit button */}
        <Button type="submit" label={"ENVIAR"} />
      </form>
    </BaseModal>
  );
};

export default ForgotPasswordModal;
