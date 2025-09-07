import { useState } from "react";
import { toast } from "react-toastify";

import BaseModal from "./BaseModal";
import Input from "../Input/Input";
import Button from "../Button/Button";

const ForgotPasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("O campo de e-mail não pode estar vazio!", {
        position: "top-center",
        theme: "light",
        containerId: "toast-root"
      });
      return;
    }

    // Requisition to backend here
    console.log("Email to backend:", email);

    toast.success("Se este e-mail existir, você receberá um número de recuperação.", {
      position: "top-center",
      containerId: "toast-root"
    });

    setEmail("");
    onSuccess(email);
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} contentLabel="Recuperar Senha" width="320px" height="500px">
      <h2 className="auth-modal-title">Redefinição de senha</h2>
      <p className="auth-description">Informe um e-mail e enviaremos um código para recuperação de sua senha.</p>

      <label className="input-label" htmlFor="email">E-mail</label>
      <form onSubmit={sendEmail} className="center-block">
        <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email"/>
        <Button type="submit" label={"ENVIAR"}/>
      </form>
    </BaseModal>
  );
};

export default ForgotPasswordModal;
