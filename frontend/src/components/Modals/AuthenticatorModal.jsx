import { useState } from "react";
import BaseModal from "./BaseModal";
import CodeInput from "../CodeInput/CodeInput";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import verifyCodeMock from "../../services/verifyCode";

const AuthenticatorModal = ({ isOpen, onClose, email }) => {
  const [code, setCode] = useState("");

  const verifyCode = async (fullCode) => {
    if (fullCode.length < 6) {
      toast.error("Digite o código completo!", {
        position: "top-center",
        theme: "light",
        containerId: "toast-root",
      });
      return;
    }

    try {
      const response = await verifyCodeMock({ code: fullCode, flowType: "signup", email });

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
      onClose();
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
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel="Autenticar Conta"
      width="320px"
      height="500px"
    >
      <h2 className="auth-modal-title">Autenticação</h2>
      <p className="auth-description">
        Insira o código enviado para o e-mail informado para autenticação.
      </p>

      <form onSubmit={handleSubmit} className="center-block">
        <label className="input-label">Código</label>
        <CodeInput
          length={6}
          value={code}
          onChange={setCode}
          onComplete={verifyCode}
        />
        <Button type="submit" label={"ENVIAR"} />
      </form>
    </BaseModal>
  );
};

export default AuthenticatorModal;
