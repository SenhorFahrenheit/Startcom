import { useState } from "react"
import { toast } from "react-toastify"
import api from "../../services/api"

import BaseModal from "./BaseModal"
import Button from "../Button/Button"
import { useNavigate } from "react-router-dom";

/**
 * DeleteWarnModal component
 * Handles user account deletion with confirmation email.
 */
const DeleteWarnModal = ({
  isOpen,
  onClose,
}) => {

    const navigate = useNavigate();
  
    return (
        <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        contentLabel="Excluir Conta"
        width="420px"
        height="auto"
        showCloseButton={false}
        >
        <h2 className="dashboard-modal-title">
            Excluir Conta
        </h2>

        <p className="delete-account-description">
            O e-mail para solicitação de exclusão da conta foi enviado com sucesso.
            Para sua segurança, será necessário confirmar a exclusão através do link
            recebido no e-mail antes que a conta seja removida definitivamente.
        </p>

        <div className="modal-buttons-row">
            <div className="button-shadown">
            <Button
                height={45}
                width={200}
                label="Ir para página inicial"
                onClick={() => {
                    onClose();
                    navigate("/");
                }}
                type="button"
            />
            </div>
        </div>
        </BaseModal>
    )
}

export default DeleteWarnModal