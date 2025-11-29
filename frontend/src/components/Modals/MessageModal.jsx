import { useNavigate } from "react-router-dom"
import { AlertCircle, LogIn } from "lucide-react"

import BaseModal from "./BaseModal"
import Button from "../Button/Button"

/**
 * MessageModal component
 * Displays contextual messages based on error/status codes
 * and optionally redirects the user.
 */
const MessageModal = ({
  isOpen,
  onClose,
  code,
}) => {
  const navigate = useNavigate()

  /**
   * Preset configurations based on message code
   */
  const presets = {
    expired: {
      message:
        "Sua sessão expirou, faça login novamente",
      action: "login",
      buttonLabel: "IR PARA LOGIN",
      icon: AlertCircle,
      iconColor: "#f39c12",
    },
    forbidden: {
      message:
        "Você precisa logar para acessar isso",
      action: "login",
      buttonLabel: "FAZER LOGIN",
      icon: LogIn,
      iconColor: "#017688",
    },
    default: {
      message: "Algo deu errado!",
      action: "",
      buttonLabel: "ENTENDI",
      icon: AlertCircle,
      iconColor: "#ff6b6b",
    },
  }

  // Selects preset based on provided code
  const config = presets[code] || presets.default

  /**
   * Handles modal close and optional redirection
   */
  const handleClose = () => {
    onClose()

    if (config.action) {
      // Small timeout ensures modal closes before navigation
      setTimeout(() => {
        navigate(`/${config.action}`)
      }, 1)
    }
  }

  const IconComponent = config.icon

  // Prevents rendering when there's no code
  if (!code) return null

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      contentLabel="Mensagem"
      height="auto"
      showCloseButton={false}
    >
      <div className="center-block message-modal">
        {/* Icon container */}
        <div
          style={{
            backgroundColor: `${config.iconColor}15`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <IconComponent
            size={50}
            color={config.iconColor}
            strokeWidth={1.5}
          />
        </div>

        {/* Message */}
        <h2
          className="message-modal-title"
          style={{
            textAlign: "center",
            lineHeight: "1.4",
            maxWidth: "400px",
          }}
        >
          {config.message}
        </h2>

        {/* Action button */}
        <div
          className="button-shadown"
          style={{
            marginTop: "10px",
            marginBottom: "20px",
          }}
        >
          <Button
            height={45}
            width={200}
            label={config.buttonLabel}
            onClick={handleClose}
          />
        </div>
      </div>
    </BaseModal>
  )
}

export default MessageModal