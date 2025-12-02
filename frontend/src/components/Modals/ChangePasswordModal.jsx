import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { getPasswordStrength } from "../../utils/validations";

// Components
import BaseModal from "./BaseModal"
import Input from "../Input/Input"
import Button from "../Button/Button"

import api from "../../services/api";

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
const ChangePasswordModal = ({ isOpen, onClose, token }) => {
    // Local state for password inputs and error messages
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);

    const [passwordStrength, setPasswordStrength] = useState(
        getPasswordStrength("")
    );

    useEffect(() => {
        setPasswordStrength(getPasswordStrength(password));
    }, [password]);

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
    const setNewPassword = async (e) => {
        e.preventDefault();
        let hasError = false;

        // Validation: password and confirmPassword should not be empty
        if (!password.trim()) {
            toast.error("O campo de Senha não pode estar vazio!", { position: "top-right", theme: "light", containerId: "toast-root" });
            hasError = true;
        }

        if (!confirmPassword.trim()) {
            toast.error("O campo de Confirmar Senha não pode estar vazio!", { position: "top-right", theme: "light", containerId: "toast-root" });
            hasError = true;
        }

        if (hasError) return;

        // Password and confirmation must match
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        if (passwordStrength.level === "weak") {
            setError("A senha é muito fraca. Use pelo menos 8 caracteres.");
            return;
        }

        // If everything is correct, proceed to set the new password
        setError("");
        if (password === confirmPassword) {
            try {
                // API call to set the new password
                setButtonLoading(true);
                await api.post("/User/reset-password", {
                    token: token, 
                    new_password: password,
                })

                toast.success("Senha redefinida com sucesso!", { position: "top-right", containerId: "toast-root" });
                setPassword("");
                setConfirmPassword("");
                onClose();
            } catch (error) {
                console.error(error);
                toast.error("Ocorreu um erro ao redefinir a senha. Tente novamente mais tarde.", { position: "top-right", containerId: "toast-root" });
            } finally   {
                setButtonLoading(false);
            }
        }
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} contentLabel="Redefinir Senha" width="320px" height={"auto"}>
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

                <div className="password-strength-wrapper">
                    <div className="password-strength-bar">
                        <div
                        className="password-strength-fill"
                        style={{
                            width: `${passwordStrength.percentage}%`,
                            backgroundColor: passwordStrength.color,
                        }}
                        />
                    </div>
                    <p className="password-strength-label">
                        {passwordStrength.text}
                    </p>
                </div>
                
                {/* Submit button */}
                <Button type="submit" label={"REDEFINIR"} loading={buttonLoading} />
            </form>
        </BaseModal>
    )
}

export default ChangePasswordModal;
