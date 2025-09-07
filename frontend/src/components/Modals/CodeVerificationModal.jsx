import { useState } from "react";
import CodeInput from "../CodeInput/CodeInput";
import { toast } from "react-toastify";
import Button from "../Button/Button";
import BaseModal from "./BaseModal";

const CodeVerificationModal = ({ isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState("");

  const verifyCode = (e) => {
    e.preventDefault();

    if (code.length < 6) {
      toast.error("Digite o código completo!", { position: "top-center", theme: "light", containerId: "toast-root" });
      return;
    }

    // Backend works here.
/*
    try {
        const response = await axios.post("/api/verify-code", {
        email,
        code: joinedCode
        });

        if (response.data.success) {
            toast.success("Código correto!", { position: "top-center", containerId: "toast-root" });
            onSuccess();
        } else {
        toast.error("Código incorreto!", { position: "top-center", containerId: "toast-root" });
        }
    } catch {
        toast.error("Erro ao verificar código!", { position: "top-center", containerId: "toast-root" });
    }
*/
    toast.success("Código verificado com sucesso!", { position: "top-center", containerId: "toast-root"});
    onSuccess();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} contentLabel="Verificar Código" width="320px" height="500px">
      <h2 className="auth-modal-title">Redefinição de Senha</h2>
      <p className="auth-description">Digite o código que enviamos para o seu e-mail.</p>

      <form onSubmit={verifyCode} className="center-block">
        <label className="input-label">Código</label>
        <CodeInput length={6} value={code} onChange={setCode} onComplete={verifyCode} />
        <Button type="submit" label={"VALIDAR"} />
      </form>
    </BaseModal>
  );
};

export default CodeVerificationModal;
