import { useNavigate } from "react-router-dom";
import BaseModal from "./BaseModal";
import Button from "../Button/Button";
import { AlertCircle, Lock, LogIn, Home } from 'lucide-react';

const MessageModal = ({ isOpen, onClose, code }) => {
  const navigate = useNavigate();

  const presets = {
    expired: {
      message: "Sua sessão expirou, faça login novamente",
      action: "login",
      buttonLabel: "IR PARA LOGIN",
      icon: AlertCircle,
      iconColor: "#f39c12"
    },
    forbidden: {
      message: "Você precisa logar para acessar isso",
      action: "login",
      buttonLabel: "FAZER LOGIN",
      icon: Lock,
      iconColor: "#e74c3c"
    },
    default: {
      message: "Algo deu errado!",
      action: " ",
      buttonLabel: "ENTENDI",
      icon: AlertCircle,
      iconColor: "#ff6b6b"
    },
  };

  const config = presets[code] || presets.default;

  const handleClose = () => {
    onClose();
    if (config.action) {
      setTimeout(() => {
        navigate(`/${config.action}`);
      }, 1);
    }
  };

  const IconComponent = config.icon;

  if (!code) {
    return null;
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      contentLabel="Mensagem"
      height="auto"
      showCloseButton={false}
    >
      <div className="center-block message-modal">
        <div style={{
          backgroundColor: `${config.iconColor}15`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}>
          <IconComponent size={50} color={config.iconColor} strokeWidth={1.5} />
        </div>
        
        <h2 className="message-modal-title" style={{
          textAlign: "center",
          lineHeight: "1.4",
          maxWidth: "400px"
        }}>
          {config.message}
        </h2>

        <div className="button-shadown" style={{ marginTop: "10px", marginBottom: "20px" }}>
          <Button height={45} width={200} label={config.buttonLabel} onClick={handleClose} />
        </div>
      </div>
    </BaseModal>
  );
};

export default MessageModal;