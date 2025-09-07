import { useState, useEffect } from "react"
import { toast } from "react-toastify"

// Components
import BaseModal from "./BaseModal"
import Input from "../Input/Input"
import Button from "../Button/Button"

// Icons
import { IoAlertCircle } from 'react-icons/io5';

const ChangePasswordModal = ({isOpen, onClose}) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setConfirmPassword("");
    }
    }, [isOpen]);

    const setNewPassword = (e) => {
      e.preventDefault();
      let hasError = false;

      // Simulation -> The password needs to come from the backend.
      const currentPassword = "senha123";

      if (!password.trim()) {
        toast.error("O campo de senha não pode estar vazio!", { position: "top-center", theme: "light", containerId: "toast-root" });
        hasError = true;
      }

      if (!confirmPassword.trim()) {
        toast.error("O campo de confirmar senha não pode estar vazio!", { position: "top-center", theme: "light", containerId: "toast-root" });
        hasError = true;
      }

      if (hasError) return;

      if (password === currentPassword) {
        setError("A nova senha precisa ser diferente da senha atual.");
        return;
      }

      if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        return;
      }

      if (password === confirmPassword) {
        toast.success("Senha alterada com sucesso!", { position: "top-center", containerId: "toast-root" });
        // Add logic of change password here
        onClose()
      }
    }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} contentLabel="Redefinir Senha" width="320px" height="500px">
      <h2 className="auth-modal-title">Redefinição de senha</h2>
      <form onSubmit={setNewPassword} className="center-block">

        {error && (
          <div className="different-password">
            <IoAlertCircle size={24} />
            {error}
          </div>
        )}

        <label className="input-label password-changer" htmlFor="password">Senha</label>
        <Input id="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} type="password"/>

        <label className="input-label password-changer" htmlFor="confirmPassword">Confirmar Senha</label>
        <Input id="confirmPassword" placeholder="Confirmar sua senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password"/>
        
        <Button type="submit" label={"REDEFINIR"}/>
      </form>
    </BaseModal>
  )
}

export default ChangePasswordModal