import { useState, useRef } from "react";
// import axios from "axios"
import { toast } from "react-toastify";
import Button from "../Button/Button";
import BaseModal from "./BaseModal";

const CodeVerificationModal = ({ isOpen, onClose, /*email*/ onSuccess }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  // Update the input value and focus on the next one
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allows numbers

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // If the user presses Backspace on an empty input, move focus to the previous input
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Verify all numbers typed by user and groups into a single value
  const verifyCode = async (e) => {
    e.preventDefault();
    const joinedCode = code.join("");

    if (joinedCode.length < 6) {
      toast.error("Digite o código completo!", { position: "top-center", theme: "light", containerId: "toast-root" });
      return;
    }
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

    console.log("Sended code:", joinedCode);
    toast.success("Código verificado com sucesso!", { position: "top-center", containerId: "toast-root" });
    onSuccess() // While there's no backend
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel="Verificar Código"
      width="320px"
      height="500px"
    >
      <h2 className="auth-modal-title">Redefinição de Senha</h2>
      <p className="auth-description">
        Digite o código que enviamos para o seu e-mail.
      </p>

      <form onSubmit={verifyCode} className="center-block">
        <fieldset className="verify-fieldset">
          <legend className="input-label">Código</legend>
          <div className="verify-inputs-code">
            {code.map((num, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={num}
                ref={(el) => (inputsRef.current[idx] = el)}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                aria-label={`Código ${idx + 1}`}
              />
            ))}
          </div>
        </fieldset>

        <Button type="submit" label={"VALIDAR"} />
      </form>
    </BaseModal>
  );
};

export default CodeVerificationModal;
