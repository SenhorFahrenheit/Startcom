import { LogOut } from 'lucide-react';

import BaseModal from "./BaseModal"
import Button from "../Button/Button"
import { useAuth } from "../../contexts/AuthContext";

const LogoutModal = ({isOpen, onClose, }) => {
  const { logout } = useAuth();
  
  return (
    <BaseModal
      isOpen={isOpen}
      contentLabel="Mensagem"
      height="auto"
      showCloseButton={false}
    >
      <br/>
      <div className="center-block message-modal">
        {/* Icon container */}
        <div
          style={{
            backgroundColor: `#01768815`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <LogOut
            size={50}
            color="var(--primary-color)"
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
          Você realmente deseja sair da conta?
        </h2>

        {/* Action button */}
        <div style={{display: "flex", justifyContent: "center", gap: "20px"}}>
          <div
            className="button-shadown"
            style={{
              marginTop: "10px",
            }}
          >
            <Button
              height={45}
              width={160}
              label="Fechar"
              onClick={onClose}
            />
          </div>

          <div
            className="button-shadown"
            style={{
              marginTop: "10px",
            }}
          >
            <Button
              height={45}
              width={160}
              label="Sair"
              onClick={logout}
            />
          </div>
        </div>
      </div>
    </BaseModal>
  )
}

export default LogoutModal