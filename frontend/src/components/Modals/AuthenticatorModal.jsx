import { useState } from "react";
import BaseModal from "./BaseModal"
import CodeInput from "../CodeInput/CodeInput";
import Button from "../Button/Button";
import { toast } from "react-toastify"

const AuthenticatorModal = ({isOpen, onClose}) => {
    const [code, setCode] = useState("");

    const verifyCode = (e) => {
        e.preventDefault();

        if (code.length < 6) {
        toast.error("Digite o código completo!", { position: "top-center", theme: "light", containerId: "toast-root" });
        return;
        }

        // Backend works here
        toast.success("Cadastro realizado com sucesso!", { position: "top-center", containerId: "toast-root", });
        onClose();
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} contentLabel="Autenticar Conta" width="320px" height="500px">
            <h2 className="auth-modal-title">Autenticação</h2>
            <p className="auth-description">Insira código enviado por e-mail informado para a autenticação.</p>
            
            <form onSubmit={verifyCode} className="center-block">
                <label className="input-label">Código</label>
                <CodeInput length={6} value={code} onChange={setCode} onComplete={verifyCode} />
                <Button type="submit" label={"ENVIAR"} />
            </form>
        </BaseModal>
    )
    }

export default AuthenticatorModal