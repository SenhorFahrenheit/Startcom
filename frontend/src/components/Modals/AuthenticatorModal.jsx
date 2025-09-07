
import BaseModal from "./BaseModal"
import { toast } from "react-toastify"

const AuthenticatorModal = ({isOpen, onClose}) => {
  return (
    
    <BaseModal isOpen={isOpen} onClose={onClose} contentLabel="Autenticar Conta" width="320px" height="500px">
        <h2 className="auth-modal-title">Autenticação</h2>
        <p className="auth-description">Informe um e-mail e enviaremos um código para recuperação de sua senha.</p>

    </BaseModal>
  )
}

export default AuthenticatorModal