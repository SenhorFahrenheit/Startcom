import { useState, useEffect } from "react"
import { toast } from "react-toastify"

// Components
import BaseModal from "./BaseModal"
import Input from "../Input/Input"
import Button from "../Button/Button"

// Icons
import { IoAlertCircle } from 'react-icons/io5';

/**
 * ChangePasswordModal component
 *
 * A modal to allow users to change or reset their password.
 *
 * Props:
 * - isOpen: boolean, whether the modal is visible
 * - onClose: function, callback to close the modal
 */
const ChangePasswordModal = ({ isOpen, onClose }) => {
    // Local state for password inputs and error messages
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    // Reset inputs when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setPassword("");
            setConfirmPassword("");
        }
    }, [isOpen]);

    /**
     * Handle form submission to set new password
     * @param {Event} e - Form submit event
     */
    const setNewPassword = (e) => {
        e.preventDefault();
        let hasError = false;

        // Simulation -> Current password would normally come from the backend
        const currentPassword = "senha123";

        // Validation: password and confirmPassword should not be empty
        if (!password.trim()) {
            toast.error("O campo de senha não pode estar vazio!", { position: "top-center", theme: "light", containerId: "toast-root" });
            hasError = true;
        }

        if (!confirmPassword.trim()) {
            toast.error("O campo de confirmar senha não pode estar vazio!", { position: "top-center", theme: "light", containerId: "toast-root" });
            hasError = true;
        }

        if (hasError) return;

        // New password should be different from current password
        if (password === currentPassword) {
            setError("A nova senha precisa ser diferente da senha atual.");
            return;
        }

        // Password and confirmation must match
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        // If everything is correct, show success message
        if (password === confirmPassword) {
            toast.success("Senha alterada com sucesso!", { position: "top-center", containerId: "toast-root" });
            // TODO: Add logic to actually change password in backend
            onClose();
        }
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} contentLabel="Redefinir Senha" width="320px" height="500px">
            <h2 className="auth-modal-title">Redefinição de senha</h2>
            <form onSubmit={setNewPassword} className="center-block">

                {/* Show error message if passwords are invalid */}
                {error && (
                    <div className="different-password">
                        <IoAlertCircle size={24} />
                        {error}
                    </div>
                )}

                {/* Password input */}
                <label className="input-label password-changer" htmlFor="password">Senha</label>
                <Input
                    id="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                />

                {/* Confirm password input */}
                <label className="input-label password-changer" htmlFor="confirmPassword">Confirmar Senha</label>
                <Input
                    id="confirmPassword"
                    placeholder="Confirmar sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                />
                
                {/* Submit button */}
                <Button type="submit" label={"REDEFINIR"} />
            </form>
        </BaseModal>
    )
}

export default ChangePasswordModal;
