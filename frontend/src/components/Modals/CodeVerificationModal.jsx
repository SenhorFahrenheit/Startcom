import { useState } from "react";
import CodeInput from "../CodeInput/CodeInput";
import { toast } from "react-toastify";
import BaseModal from "./BaseModal";
import verifyCodeMock from "../../services/verifyCode";
import Button from "../Button/Button";

const CodeVerificationModal = ({ isOpen, onClose, email, flowType = "signup", onSuccess }) => {
  const [code, setCode] = useState("");

  const verifyCode = async (fullCode) => {
    if (fullCode.length < 6) {
      toast.error("Digite o código completo!", {
        position: "top-center",
        containerId: "toast-root",
      });
      return;
    }

    try {
      const response = await verifyCodeMock({ code: fullCode, email, flowType });

      if (!response.success) {
        toast.error(response.message, {
          position: "top-center",
          containerId: "toast-root",
        });
        return;
      }

      toast.success(response.message, {
        position: "top-center",
        containerId: "toast-root",
      });

      setCode("");
      onSuccess?.();
    } catch {
      toast.error("Erro ao verificar código!", {
        position: "top-center",
        containerId: "toast-root",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyCode(code);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} contentLabel="Verificar Código" width="320px" height="500px">
      <h2 className="auth-modal-title">{flowType === "signup" ? "Confirmação de Cadastro" : "Recuperação de Senha"}</h2>
      <p className="auth-description">
        Digite o código que enviamos para o seu e-mail.
      </p>

      <form onSubmit={handleSubmit} className="center-block">
        <label className="input-label">Código</label>
        <CodeInput
          length={6}
          value={code}
          onChange={setCode}
          onComplete={verifyCode}
        />
        <Button type="submit" label={"VALIDAR"} />
      </form>
    </BaseModal>
  );
};

export default CodeVerificationModal;
